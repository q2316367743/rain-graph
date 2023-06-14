<template>
    <a-dropdown>
        <a-button>例子</a-button>
        <template #content>
            <a-dgroup title="折线图">
                <a-doption @click="drawInitEcharts('line')">基础折线图</a-doption>
                <a-doption @click="drawInitEcharts('line-smooth')">平滑折线图</a-doption>
                <a-doption @click="drawInitEcharts('line-area')">面积图</a-doption>
                <a-doption @click="drawInitEcharts('line-stock')">折线图堆叠</a-doption>
                <a-doption @click="drawInitEcharts('line-style')">自定义样式</a-doption>
            </a-dgroup>
            <a-dgroup title="柱状图">
                <a-doption @click="drawInitEcharts('bar')">基础柱状图</a-doption>
            </a-dgroup>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'echarts-menu-example',
    emits: ['draw-init-echarts'],
    data: () => ({

    }),
    methods: {
        drawInitEcharts(type: string) {
            this.$emit('draw-init-echarts', type)
        }
    }
});
</script>
<style scoped></style>