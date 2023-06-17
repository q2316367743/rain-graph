<template>
    <div class="echarts">
        <!-- 顶部菜单栏 -->
        <div class="header">
            <a-button-group type="text">
                <menu-example @draw-init-echarts="drawInitEcharts" />
                <menu-edit @json="openJsonDialog" @excel="openExcelDialog" />
                <menu-operation @refresh="drawEcharts" @setting="openSettingDrawer" />
                <menu-export @json="exportForJson" @png="exportForPng" />
            </a-button-group>
        </div>
        <!-- 显示容器 -->
        <div class="container">
            <div id="echarts-view" :style="{ height, width }"></div>
        </div>
        <!-- 对话框 -->
        <draw-json-editor v-model:visible="dialog.json" @render="render" />
        <draw-echarts-editor v-model:visible="dialog.excel" @render="render" />
        <draw-setting v-model:visible="dialog.setting" v-model:base-setting="baseSetting" @render="renderSetting" />
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { init, EChartsType } from 'echarts';
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import { getExample, exportForJson, exportForPng, renderBaseSetting } from "./algorithm";
import { getDefaultBaseSetting } from "./data/Constant";
import EchartsTypeEnum from "./enumeration/EchartsTypeEnum";

import MenuExample from "./components/menu/menu-example.vue";
import MenuEdit from "./components/menu/menu-edit.vue";
import MenuOperation from "./components/menu/menu-operation.vue";
import MenuExport from "./components/menu/menu-export.vue";

import DrawEchartsEditor from "./components/excel-editor/index.vue";
import DrawJsonEditor from "./components/json-editor/index.vue";
import DrawSetting from "./components/setting/index.vue";

export default defineComponent({
    name: 'echarts',
    components: {
        MenuExample, MenuEdit, MenuOperation, MenuExport,
        DrawJsonEditor, DrawEchartsEditor, DrawSetting
    },
    data: () => ({
        type: 'line' as EchartsTypeEnum,
        config: {
            title: '听雨图编辑器',
            subtitle: '使用echarts实现听雨图编辑器',
        },
        option: {},
        myChart: markRaw({}) as EChartsType,
        baseSetting: getDefaultBaseSetting(),
        dialog: {
            json: false,
            excel: false,
            setting: false
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'size']),
        viewHeight() {
            return (this.height - 33 - 28) + 'px';
        },
        viewWidth() {
            return (this.width - 28 - 48) + 'px';
        },
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
            this.dialog.json = true;
        },
        openExcelDialog() {
            this.dialog.excel = true;
        },
        openSettingDrawer() {
            this.dialog.setting = true;
        },
        render(option: any) {
            this.option = option;
            renderBaseSetting(this.baseSetting, this.option)
            this.drawEcharts();
        },
        renderSetting() {
            renderBaseSetting(this.baseSetting, this.option)
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
        display: flex;
        justify-content: space-between;
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