<template>
    <div class="app">
        <!-- 头部 -->
        <div class="app-header">
            <a-button-group type="text" style="margin-left: 7px;">
                <a-button @click="toHome">全部图</a-button>
                <a-dropdown position="bl">
                    <a-button :disabled="!editDisabled">
                        <template #icon>
                            <icon-caret-down />
                        </template>
                        新增
                    </a-button>
                    <template #content>
                        <a-doption @click="jumpTo(GraphTypeEnum.MIND)">思维导图</a-doption>
                        <a-doption @click="jumpTo(GraphTypeEnum.ATRAMENT)">手绘图</a-doption>
                        <a-doption @click="jumpTo(GraphTypeEnum.BPMN)">BPMN</a-doption>
                        <a-doption @click="jumpTo(GraphTypeEnum.DIAGRAM)">简图</a-doption>
                        <a-doption @click="$router.push('/flow-chart/0')">流程图</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown position="bl">
                    <a-button :disabled="!editDisabled">
                        <template #icon>
                            <icon-caret-down />
                        </template>
                        打开
                    </a-button>
                    <template #content>
                        <a-doption>思维导图</a-doption>
                        <a-doption>手绘图</a-doption>
                        <a-doption>BPMN</a-doption>
                        <a-doption>简图</a-doption>
                        <a-doption>流程图</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button :disabled="editDisabled">
                        <template #icon>
                            <icon-caret-down />
                        </template>
                        编辑
                    </a-button>
                    <template #content>
                        <a-doption @click="save">保存</a-doption>
                        <a-doption>另存为</a-doption>
                        <a-doption @click="undo" :disabled="!editItems[0]">撤销</a-doption>
                        <a-doption @click="clear" :disabled="!editItems[1]">
                            <span style="color: rgb(var(--red-6))">清空</span>
                        </a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown @select="exportImage">
                    <a-button :disabled="editDisabled || exportItems.length === 0">
                        <template #icon>
                            <icon-caret-down />
                        </template>
                        导出
                    </a-button>
                    <template #content>
                        <a-doption v-for="item in exportItems" :value="item">{{ item.toUpperCase() }}</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>
                        <template #icon>
                            <icon-caret-down />
                        </template>
                        帮助
                    </a-button>
                    <template #content>
                        <a-doption>关于</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
            <div class="title">{{ title }}</div>
        </div>
        <div class="app-container">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useSaveEvent, useClearEvent, useExportEvent, useUndoEvent } from "./global/BeanFactory";
import Config from '@/global/Config'
import { useGlobalStore } from "./store/GlobalStore";
import { useMindStore } from "./store/MindStore";
import { useAtramentStore } from "./store/AtramentStore";
import { useBpmnStore } from "./store/BpmnStore";
import { useDiagramStore } from "./store/DiagramStore";
import ExportTypeEnum from "./enumeration/ExportTypeEnum";
import GraphTypeEnum from '@/enumeration/GraphTypeEnum';


export default defineComponent({
    name: '',
    data: () => ({
        ExportTypeEnum,
        GraphTypeEnum
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark']),
        ...mapState(useGlobalStore, ['title']),
        editDisabled() {
            return this.$route.path === '/home'
        },
        exportItems(): ExportTypeEnum[] {
            let name = this.$route.name as GraphTypeEnum;
            return Config.export[name] || []
        },
        editItems(): Array<boolean> {
            let name = this.$route.name as GraphTypeEnum;
            return Config.edit[name] || [false, false];
        }
    },
    created() {
        if (this.isDark) {
            // 设置为暗黑主题
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            // 恢复亮色主题
            document.body.removeAttribute('arco-theme');
        }
        // 初始化图信息
        useMindStore().init();
        useAtramentStore().init();
        useBpmnStore().init();
        useDiagramStore().init();
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: this.$route.name as string
                }
            })
        },
        jumpTo(type: GraphTypeEnum) {
            useGlobalStore().setTitle('');
            this.$router.push(`/${type}/0`);
        },
        // ------ 功能组件 ------
        save() {
            useSaveEvent.emit();
        },
        clear() {
            useClearEvent.emit();
        },
        undo() {
            useUndoEvent.emit();
        },
        exportImage(type: any) {
            useExportEvent.emit(type);
        }
    }
});
</script>
<style lang="less"></style>