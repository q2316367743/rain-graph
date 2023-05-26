<template>
    <div class="atrament">
        <canvas id="atrament-view" width="500" height="500"></canvas>
        <div class="setting">
            <a-button type="text" @click="visible = true">
                <template #icon>
                    <icon-settings />
                </template>
            </a-button>
        </div>
        <a-drawer :width="400" :visible="visible" unmount-on-close title="设置" @cancel="saveOption">
            <a-form :model="instance.option" layout="vertical">
                <a-form-item label="线条粗细">
                    <a-input-number v-model="instance.option.weight" :min="0" />
                </a-form-item>
                <a-form-item label="颜色">
                    <input type="color" v-model="instance.option.color" />
                </a-form-item>
                <a-form-item label="模式">
                    <a-select v-model="instance.option.mode">
                        <a-option value="draw">笔</a-option>
                        <a-option value="erase">擦除</a-option>
                        <a-option value="fill">填充</a-option>
                        <a-option value="disabled">禁用</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="调整平滑">
                    <a-input-number v-model="instance.option.smoothing" :min="0" :step="0.01" />
                    <template #help>
                        较高的值使绘图看起来更好，较低的值使绘图感觉更灵敏。0.85默认设置为。
                    </template>
                </a-form-item>
                <a-form-item label="切换自适应描边">
                    <a-switch v-model="instance.option.adaptiveStroke"></a-switch>
                    <template #help>
                        即根据绘图速度改变线宽以获得更自然的效果。true默认情况下。
                    </template>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import { Atrament } from 'atrament';
import { useWindowSize } from "@vueuse/core";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { useSaveEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import { useAtramentStore } from "@/store/AtramentStore";
import { toRaw } from "vue";
import Instance from "./Instance";
import Option from "./Option";
import AtramentRecord from "./AtramentRecord";

let sketchpad = undefined as any | undefined;



export default defineComponent({
    name: '',
    data: () => ({
        id: '0',
        visible: false,
        _rev: undefined as any | undefined,
        size: useWindowSize(),
        instance: {
            option: {
                weight: 20,
                color: '#ff8080',
                mode: 'draw',
                smoothing: 0.85,
                adaptiveStroke: true
            },
            strokes: []
        } as Instance
    }),
    created() {
        useSaveEvent.reset();
        useSaveEvent.on(() => {
            this.save(true);
        });
    },
    beforeUnmount() {
        useSaveEvent.reset();
    },
    mounted() {
        this.id = this.$route.params.id as string;
        if (this.id !== '0') {
            let recordWrap = utools.db.get(`/${GraphTypeEnum.ATRAMENT}/${this.id}`);
            if (recordWrap) {
                // 存在
                this.instance = recordWrap.value;
                this._rev = recordWrap._rev;
            }
        }
        if (this.id === '0') {
            useGlobalStore().setTitle("新手绘图");
        }
        const canvas = document.querySelector('#atrament-view');
        sketchpad = new Atrament(canvas, {
            width: this.size.width - 14,
            height: this.size.height - 33 - 14,
            color: 'orange',
        });

        this.setOption(this.instance.option);

        if (this.instance.strokes.length > 0) {
            this.init(sketchpad, this.instance.strokes);
        }

        // 配置
        sketchpad.recordStrokes = true;

        // 事件
        sketchpad.addEventListener('strokerecorded', (value: { stroke: any }) => {
            this.instance.strokes.push({
                ...this.instance.option,
                stroke: value.stroke
            });
        });
    },
    methods: {
        save(show: boolean) {
            useAtramentStore().add(this.id).then(_id => {
                this.id = _id;
                let res = utools.db.put({
                    _id: `/${GraphTypeEnum.ATRAMENT}/${this.id}`,
                    _rev: this._rev,
                    value: toRaw(this.instance)
                });
                if (res.error) {
                    MessageUtil.error(res.message || "保存失败");
                    return;
                }
                this._rev = res.rev;
                if (show) {
                    MessageUtil.success('保存成功');
                }
            });
        },
        setOption(option: Option) {
            if (sketchpad) {
                sketchpad.weight = option.weight;
                sketchpad.color = option.color;
                sketchpad.mode = option.mode;
                sketchpad.smoothing = option.smoothing;
                sketchpad.adaptiveStroke = option.adaptiveStroke;
            }
        },
        saveOption() {
            this.save(false);
            this.setOption(this.instance.option);
            this.visible = false;
        },
        init(atrament: any, records: AtramentRecord[]) {
            atrament.recordPaused = false;
            for (let record of records) {
                let stroke = record.stroke;
                const points = stroke.points.slice();
                const firstPoint = points.shift();

                this.setOption(record);

                //画图
                atrament.beginStroke(firstPoint.x, firstPoint.y);
                let prevPoint = firstPoint;
                while (points.length > 0) {
                    const point = points.shift().point;
                    atrament.draw(point.x, point.y, prevPoint.x, prevPoint.y);
                    prevPoint = point;
                }
                atrament.endStroke(prevPoint.x, prevPoint.y);

            }
            atrament.recordPaused = true;
        }
    }
});

</script>
<style lang="less">
.atrament {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 7px;

    .setting {
        position: absolute;
        top: 10px;
        right: 26px;
    }
}
</style>