<template>
    <a-modal v-model:visible="dialog" title="可视化编辑器" fullscreen popup-container=".echarts" :render-to-body="false"
        title-align="start" unmount-on-close>
        <template #title>
            <a-radio-group type="button" v-model="activeKey">
                <a-radio value="setting">设置</a-radio>
                <a-radio value="data">数据</a-radio>
            </a-radio-group>
        </template>
        <!-- 表格 -->
        <hot-table :width="containerWidth" :height="containerHeight" :settings="hotSettings"
            v-show="activeKey === 'data'" ref="hotTable"/>
        <!-- 设置 -->
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
            <a-form-item label="是否平滑">
                <a-switch v-model="setting.smooth" :disabled="!setting.type.startsWith('line')" />
                <template #help>只有折线图有效</template>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button type="text" status="success" @click="open">
                导入
            </a-button>
            <a-button @click="dialog = false">取消</a-button>
            <a-button type="primary" @click="render">渲染</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { HotTable } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.css';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/languages/zh-CN';
import { cloneDeep } from 'lodash-es';
import { read, utils } from 'xlsx'

registerAllModules();
import { registerCellType, NumericCellType } from 'handsontable/cellTypes';
import { registerPlugin, UndoRedo } from 'handsontable/plugins';
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import { getDefaultData, getDefaultDataSetting } from "../../data/Constant";
registerCellType(NumericCellType);
registerPlugin(UndoRedo);

import { renderByLine } from './renderByLine';
import { useFileSystemAccess } from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";

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
        setting: getDefaultDataSetting(),
        fileSystem: useFileSystemAccess({
            dataType: 'ArrayBuffer',
            types: [{
                description: 'Excel',
                accept: {
                    'application/vnd.ms-excel': ['.xls', '.xlsx'],
                },
            }]
        })
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
            }
        },
        dialog(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    methods: {
        render() {
            let hotTable = this.$refs['hotTable'] as any;
            this.$emit(
                'render',
                renderByLine(this.setting, hotTable.hotInstance.getData())
            );
            this.dialog = false;
        },
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let content = this.fileSystem.data as ArrayBuffer;
                try {
                    let res = read(content, { type: 'buffer' });
                    let sheetName = res.Sheets[res.SheetNames[0]]
                    let table = utils.sheet_to_json(sheetName, { header: 'A', raw: true, defval: ' ' });
                    this.hotSettings.data = table.map((e: any) => Object.values(e));
                    let hotTable = this.$refs['hotTable'] as any;
                    hotTable.hotInstance.loadData(this.hotSettings.data)
                } catch (e) {
                    MessageUtil.error("文件解析失败", e);
                }
            }).catch(e => {
                if (e.name === 'AbortError') {
                    return;
                }
                MessageUtil.error("打开失败", e)
            });
        }
    }
});
</script>
<style scoped></style>