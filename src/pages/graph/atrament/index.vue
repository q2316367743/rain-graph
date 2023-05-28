<template>
    <div class="atrament">
        <canvas id="atrament-view" width="500" height="500"></canvas>
        <div class="setting">
            <a-button-group type="text">
                <a-trigger position="bottom" trigger="click" show-arrow :popup-offset="5">
                    <a-button :style="{ color: instance.option.color }">
                        <template #icon>
                            <icon-oblique-line />
                        </template>
                    </a-button>
                    <template #content>
                        <div class="atrament-panel">
                            <a-slider :default-value="20" v-model="instance.option.weight" :style="{ width: '200px' }" />
                        </div>
                    </template>
                </a-trigger>
                <!-- 颜色 -->
                <a-trigger position="bottom" trigger="click" show-arrow :popup-offset="5">
                    <a-button :style="{ color: instance.option.color }">
                        <template #icon>
                            <icon-bg-colors />
                        </template>
                    </a-button>
                    <template #content>
                        <div class="atrament-panel">
                            <input type="color" v-model="instance.option.color" />
                        </div>
                    </template>
                </a-trigger>
                <!-- 模式 -->
                <a-radio-group type="button" v-model="instance.option.mode" style="margin: 0 7px;">
                    <a-radio value="draw">
                        <icon-edit />
                    </a-radio>
                    <a-radio value="erase">
                        <icon-eraser />
                    </a-radio>
                    <a-radio value="fill">
                        <icon-brush />
                    </a-radio>
                    <a-radio value="disabled">
                        <icon-stop />
                    </a-radio>
                </a-radio-group>
                <a-trigger position="bottom" trigger="click" show-arrow :popup-offset="5">
                    <a-button :style="{ color: instance.option.color }">
                        <template #icon>
                            <icon-highlight />
                        </template>
                    </a-button>
                    <template #content>
                        <div class="atrament-panel">
                            <a-slider :default-value="0.85" :step="0.1" :min="0" :max="2"
                                v-model="instance.option.smoothing" :style="{ width: '200px' }" />
                        </div>
                    </template>
                </a-trigger>
                <a-tooltip content="自适应描边">
                    <a-switch type="round" style="margin:0 7px;" v-model="instance.option.adaptiveStroke" />
                </a-tooltip>
                <a-tooltip content="清空画布">
                    <a-button status="danger" @click="clear">
                        <template #icon>
                            <icon-delete />
                        </template>
                    </a-button>
                </a-tooltip>
            </a-button-group>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import { Atrament } from 'atrament';
import { useWindowSize } from "@vueuse/core";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useClearEvent, useSaveEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import { useAtramentStore } from "@/store/AtramentStore";
import { toRaw } from "vue";
import Instance from "./domain/Instance";
import Option from "./domain/Option";
import AtramentRecord from "./domain/AtramentRecord";

let sketchpad = undefined as any | undefined;



export default defineComponent({
    name: '',
    data: () => ({
        id: '0',
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
    watch: {
        'instance.option': {
            handler() {
                this.setOption(this.instance.option);
            },
            deep: true
        }
    },
    created() {
        useSaveEvent.on(() => {
            this.save(true);
        });
        useClearEvent.on(() => {
            this.clear();
        });
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
            if (this.id !== '0') {
                // 自动保存
                this.save();
            }
        });
    },
    methods: {
        save(show: boolean = false) {
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
            this.setOption(this.instance.option);
            if (this.id !== '0') {
                this.save();
            }
        },
        init(atrament: any, records: AtramentRecord[]) {
            atrament.clear(); // 清楚画布上的所有物品。
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
        },
        clear() {
            this.instance.strokes = [];
            if (sketchpad) {
                sketchpad.clear();
            }
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
        left: 10px;
    }
}

.atrament-panel {
    padding: 14px;
    background-color: var(--color-bg-1);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>