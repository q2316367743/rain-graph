<template>
    <div class="echarts">
        <div class="header">
            <a-button-group type="text">
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
                <a-dropdown>
                    <a-button>编辑</a-button>
                    <template #content>
                        <a-doption @click="openJsonDialog">JSON</a-doption>
                        <a-doption @click="openExcelDialog">可视化</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>操作</a-button>
                    <template #content>
                        <a-doption @click="drawEcharts">刷新</a-doption>
                        <a-doption disable>设置</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>导出</a-button>
                    <template #content>
                        <a-doption @click="exportForJson">JSON</a-doption>
                        <a-doption @click="exportForPng">PNG</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </div>
        <div class="container">
            <div id="echarts-view" :style="{ height, width }"></div>
        </div>
        <a-modal v-model:visible="json.dialog" title="JSON编辑器" ok-text="渲染" fullscreen popup-container=".echarts"
            :render-to-body="false" @ok="renderJson">
            <codemirror v-model="json.record" autofocus auto-destroy :extensions="extensions"
                style="width: 100%;height: 100%;" />
        </a-modal>
        <draw-echarts-excel v-model:visible="excel.dialog" @render="renderExcel" />
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { init, EChartsType } from 'echarts';
import { mapState } from "pinia";
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { useGlobalStore } from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import { getExample, exportForJson, exportForPng } from "./algorithm";
import EchartsTypeEnum from "./enumeration/EchartsTypeEnum";

import DrawEchartsExcel from "./components/ExcelEditor.vue";

export default defineComponent({
    name: 'echarts',
    components: { Codemirror, DrawEchartsExcel },
    data: () => ({
        type: 'line' as EchartsTypeEnum,
        config: {
            title: '听雨图编辑器',
            subtitle: '使用echarts实现听雨图编辑器',
        },
        option: {},
        myChart: markRaw({}) as EChartsType,
        extensions: markRaw([json()]) as any[],
        json: {
            dialog: false,
            record: ''
        },
        excel: {
            dialog: false,
            record: []
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'size']),
        viewHeight() {
            return (this.height - 33 - 28) + 'px';
        },
        viewWidth() {
            return (this.width - 28) + 'px';
        }
    },
    watch: {
        size: {
            handler() {
                this.resize();
            },
            deep: true
        }
    },
    mounted() {
        const echartsView = document.getElementById('echarts-view') as HTMLElement;
        this.myChart = markRaw(init(echartsView));
        this.drawInitEcharts('line');
    },
    beforeUnmount() {
        this.myChart.clear();
    },
    methods: {
        drawInitEcharts(type: EchartsTypeEnum) {
            this.option = getExample(type);
            this.drawEcharts();
        },
        drawEcharts() {
            this.myChart.clear();
            this.myChart.setOption(this.option)
        },
        resize() {
            this.myChart.resize();
        },
        openJsonDialog() {
            this.json = {
                dialog: true,
                record: JSON.stringify(this.option, null, 4)
            };
        },
        openExcelDialog() {
            this.excel = {
                dialog: true,
                record: []
            }
        },
        renderJson() {
            try {
                let option = JSON.parse(this.json.record);
                this.option = option;
                this.drawEcharts();
            } catch (e) {
                MessageUtil.error("渲染异常", e);
            } finally {
                this.json.dialog = false;
            }
        },
        renderExcel(option: any) {
            this.option = option;
            this.drawEcharts();
        },
        exportForJson() {
            exportForJson(this.option);
        },
        exportForPng() {
            exportForPng(this.myChart as EChartsType);
        }
    }
});
</script>
<style lang="less">
.echarts {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: relative;
        height: 32px;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}

#echarts-view {
    position: absolute;
    top: 14px;
    left: 14px;
    height: v-bind(viewHeight);
    width: v-bind(viewWidth);
}
</style>