<template>
    <div class="atrament">
        <canvas id="atrament-view" width="500" height="500"></canvas>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import { Atrament } from 'atrament';
import { useWindowSize } from "@vueuse/core";
import { useRouter } from "vue-router";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { useSaveEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import { useAtramentStore } from "@/store/AtramentStore";

interface Instance {

    /**
     * 线条粗细
     */
    weight: number;

    /**
     * 颜色
     */
    color: string;

    /**
     * 在模式之间切换：
     */
    mode: 'erase' | 'fill' | 'draw' | 'disabled';

    /**
     * 调整平滑 - 较高的值使绘图看起来更好，较低的值使绘图感觉更灵敏。0.85默认设置为。
     */
    smoothing: number;

    /**
     * 切换自适应描边，即根据绘图速度改变线宽以获得更自然的效果。true默认情况下。
     */
    adaptiveStroke: boolean;

    /**
     * 记录
     */
    strokes: any[]
}

const size = useWindowSize();

let id = useRouter().currentRoute.value.params.id as string;
let _rev = undefined as string | undefined;
let instance = {
    weight: 20,
    color: '#ff485e',
    mode: 'fill',
    smoothing: 0.85,
    adaptiveStroke: true,
    strokes: []
} as Instance

if (id !== '0') {
    let recordWrap = utools.db.get(`/${GraphTypeEnum.ATRAMENT}/${id}`);
    if (recordWrap) {
        // 存在
        instance = recordWrap.value;
        _rev = recordWrap._rev;
    }
}

onMounted(() => {
    if (id === '0') {
        useGlobalStore().setTitle("新手绘图");
    }
    const canvas = document.querySelector('#atrament-view');
    const sketchpad = new Atrament(canvas, {
        width: size.width.value - 14,
        height: size.height.value - 33 - 14,
        color: 'orange',
    });

    if (instance.strokes.length > 0) {
        init(sketchpad, instance.strokes);
    }

    // 配置
    sketchpad.recordStrokes = true;

    // 事件
    sketchpad.addEventListener('strokerecorded', (value: { stroke: any }) => {
        instance.strokes.push(value.stroke);
    });

});

function setOption() {

}

function init(atrament: any, strokes: any[]) {
    atrament.recordPaused = false;
    console.log(atrament.draw)
    for (let stroke of strokes) {
        const points = stroke.points.slice();
        const firstPoint = points.shift();

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



onBeforeUnmount(() => {
    useSaveEvent.reset();
});

useSaveEvent.reset();
useSaveEvent.on(() => {
    useAtramentStore().add(id).then(_id => {
        id = _id;
        let res = utools.db.put({
            _id: `/${GraphTypeEnum.ATRAMENT}/${id}`,
            _rev,
            value: instance
        });
        if (res.error) {
            MessageUtil.error(res.message || "保存失败");
            return;
        }
        _rev = res.rev;
        MessageUtil.success('保存成功');
    });
});

</script>
<style lang="less">
.atrament {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 7px;
}
</style>