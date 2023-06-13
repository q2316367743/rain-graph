<template>
    <a-modal v-model:visible="dialog" title="可视化编辑器" ok-text="渲染" fullscreen popup-container=".echarts"
        :render-to-body="false" title-align="start" unmount-on-close @ok="render">
        <template #title>
            <a-radio-group type="button" v-model="activeKey">
                <a-radio value="base">基础信息</a-radio>
                <a-radio value="data">数据</a-radio>
                <a-radio value="setting">设置</a-radio>
            </a-radio-group>
        </template>
        <!-- 基础信息 -->
        <a-form :model="base" layout="vertical" v-show="activeKey === 'base'">
            <a-form-item label="标题">
                <a-input v-model="base.title" style="width: 300px;" />
            </a-form-item>
            <a-form-item label="副标题">
                <a-input v-model="base.subtitle" style="width: 450px;" />
            </a-form-item>
            <a-form-item label="类型">
                <a-select v-model="base.type" style="width: 200px;">
                    <a-option value="line">基础折线图</a-option>
                    <a-option value="bar">基础柱状图</a-option>
                </a-select>
            </a-form-item>
        </a-form>
        <!-- 表格 -->
        <hot-table :width="containerWidth" :height="containerHeight" :settings="hotSettings"
            v-show="activeKey === 'data'" />
        <!-- 更多信心 -->
        <a-form :model="setting" layout="horizontal" auto-label-width v-show="activeKey === 'setting'">
            <a-form-item label="数值显示">
                <a-switch v-model="setting.labelShow" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { HotTable } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.css';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/languages/zh-CN';


registerAllModules();
import { registerCellType, NumericCellType } from 'handsontable/cellTypes';
import { registerPlugin, UndoRedo } from 'handsontable/plugins';
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import { getDefaultBase, getDefaultData, getDefaultSetting } from "./Constant";
registerCellType(NumericCellType);
registerPlugin(UndoRedo);

import { renderByLine } from './renderByLine';

export default defineComponent({
    name: 'draw-echarts-excel',
    components: { HotTable },
    emits: ['update:visible', 'render'],
    props: {
        visible: Boolean
    },
    data: () => ({
        dialog: false,
        hotSettings: getDefaultData(),
        activeKey: 'base',
        base: getDefaultBase(),
        setting: getDefaultSetting()
    }),
    computed: {
        ...mapState(useGlobalStore, ['width', 'height']),
        containerHeight() {
            return this.height - 48 - 65 - 24 * 2;
        },
        containerWidth() {
            this.width - 24 * 2
        }
    },
    watch: {
        visible(newValue) {
            this.dialog = newValue;
            if (newValue) {
                this.activeKey = 'base';
                this.hotSettings = getDefaultData();
                this.base = getDefaultBase();
                this.setting = getDefaultSetting();
            }
        },
        dialog(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    methods: {
        render() {
            this.$emit(
                'render',
                renderByLine(this.base, this.setting, (this.hotSettings.data || [[]]) as any[][])
            );
        }
    }
});
</script>
<style scoped></style>