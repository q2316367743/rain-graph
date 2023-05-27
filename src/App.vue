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
                        <a-doption @click="$router.push('/mind/0')">思维导图</a-doption>
                        <a-doption @click="$router.push('/atrament/0')">手绘图</a-doption>
                        <a-doption @click="$router.push('/bpmn/0')">BPMN</a-doption>
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
                        <a-doption @click="undo">撤销</a-doption>
                        <a-doption @click="clear">
                            <span style="color: rgb(var(--red-6))">清空</span></a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown @select="exportImage">
                    <a-button :disabled="editDisabled">
                        <template #icon>
                            <icon-caret-down />
                        </template>
                        导出
                    </a-button>
                    <template #content>
                        <a-doption :value="ExportTypeEnum.PNG">PNG</a-doption>
                        <a-doption :value="ExportTypeEnum.SVG">SVG</a-doption>
                        <a-doption :value="ExportTypeEnum.HTML">HTML</a-doption>
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
import { useGlobalStore } from "./store/GlobalStore";
import { useMindStore } from "./store/MindStore";
import { useAtramentStore } from "./store/AtramentStore";
import { useBpmnStore } from "./store/BpmnStore";
import ExportTypeEnum from "./enumeration/ExportTypeEnum";

export default defineComponent({
    name: '',
    data: () => ({
        ExportTypeEnum
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark']),
        ...mapState(useGlobalStore, ['title']),
        editDisabled() {
            return this.$route.path === '/home'
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