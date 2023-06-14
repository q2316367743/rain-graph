<template>
    <a-modal v-model:visible="dialog" title="可视化编辑器" ok-text="渲染" fullscreen popup-container=".echarts"
        :render-to-body="false" title-align="start" unmount-on-close @ok="render">
        <template #title>
            <a-radio-group type="button" v-model="activeKey">
                <a-radio value="setting">设置</a-radio>
                <a-radio value="data">数据</a-radio>
            </a-radio-group>
        </template>
        <!-- 表格 -->
        <hot-table :width="containerWidth" :height="containerHeight" :settings="hotSettings"
            v-show="activeKey === 'data'" />
        <!-- 更多信心 -->
        <a-form :model="setting" layout="horizontal" auto-label-width v-show="activeKey === 'setting'">
            <a-form-item label="类型">
                <a-radio-group v-model="setting.type">
                    <a-radio value="line">基础折线图</a-radio>
                    <a-radio value="bar">基础柱状图</a-radio>
                </a-radio-group>
            </a-form-item>
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
import {  getDefaultData, getDefaultDataSetting } from "../../data/Constant";
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
        activeKey: 'setting',
        setting: getDefaultDataSetting()
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
                this.activeKey = 'setting';
                this.hotSettings = getDefaultData();
                this.setting = getDefaultDataSetting();
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
                renderByLine(this.setting, (this.hotSettings.data || [[]]) as any[][])
            );
        }
    }
});
</script>
<style scoped></style>