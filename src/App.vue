<template>
    <div class="app">
        <!-- 头部 -->
        <div class="app-header">
            <a-button-group type="text">
                <a-button @click="toHome">
                    <template #icon>
                        <icon-home />
                    </template>
                </a-button>
                <a-dropdown position="bl">
                    <a-button :disabled="!editDisabled">新增</a-button>
                    <template #content>
                        <a-doption @click="jumpTo(GraphTypeEnum.MIND)">{{ Config.title[GraphTypeEnum.MIND].title
                        }}</a-doption>
                        <a-doption @click="jumpTo(GraphTypeEnum.ATRAMENT)">{{ Config.title[GraphTypeEnum.ATRAMENT].title
                        }}</a-doption>
                        <a-doption @click="jumpTo(GraphTypeEnum.BPMN)">{{ Config.title[GraphTypeEnum.BPMN].title
                        }}</a-doption>
                        <a-doption @click="jumpTo(GraphTypeEnum.DIAGRAM)">{{ Config.title[GraphTypeEnum.DIAGRAM].title
                        }}</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown position="bl">
                    <a-button :disabled="!editDisabled">打开</a-button>
                    <template #content>
                        <a-doption @click="openTo(GraphTypeEnum.MIND)">{{ Config.title[GraphTypeEnum.MIND].title
                        }}</a-doption>
                        <a-doption @click="openTo(GraphTypeEnum.ATRAMENT)">{{ Config.title[GraphTypeEnum.ATRAMENT].title
                        }}</a-doption>
                        <a-doption @click="openTo(GraphTypeEnum.BPMN)">{{ Config.title[GraphTypeEnum.BPMN].title
                        }}</a-doption>
                        <a-doption @click="openTo(GraphTypeEnum.DIAGRAM)">{{ Config.title[GraphTypeEnum.DIAGRAM].title
                        }}</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button :disabled="editDisabled">编辑</a-button>
                    <template #content>
                        <a-doption @click="save">保存</a-doption>
                        <a-doption @click="saveAs">另存为</a-doption>
                        <a-doption @click="undo" :disabled="!editItems[0]">撤销</a-doption>
                        <a-doption @click="clear" :disabled="!editItems[1]">
                            <span style="color: rgb(var(--red-6))">清空</span>
                        </a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown @select="exportImage">
                    <a-button :disabled="editDisabled || exportItems.length === 0">导出</a-button>
                    <template #content>
                        <a-doption v-for="item in exportItems" :value="item">{{ item.toUpperCase() }}</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>帮助</a-button>
                    <template #content>
                        <a-doption @click="switchDark">切换主题</a-doption>
                        <a-doption @click="jumpToSetting">设置</a-doption>
                        <a-doption @click="jumpToRecommend">推荐</a-doption>
                        <a-doption @click="jumpToAbout">关于</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
            <div class="title">
                <a-tag v-if="type" :color="type.color"> {{ type.title }}</a-tag>
                <a-tag v-if="title.trim() !== ''" color="arcoblue" style="margin-left: 7px;">{{ title }}</a-tag>
            </div>
        </div>
        <div class="app-container">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useSaveEvent, useClearEvent, useExportEvent, useUndoEvent, useSaveAsEvent } from "./global/BeanFactory";
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
        GraphTypeEnum,
        Config
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'title', 'type']),
        editDisabled() {
            return !this.$route.path.startsWith('/graph')
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
        utools.onPluginEnter(action => {
            if (action.code !== 'application') {
                useGlobalStore().setTitle('');
                useGlobalStore().setType(action.code as GraphTypeEnum);
                this.$router.push(`/graph/${action.code}/0`);
            } else {
                this.$router.push('/home');
            }
        })
    },
    methods: {
        jumpTo(type: GraphTypeEnum) {
            useGlobalStore().setTitle('');
            useGlobalStore().setType(type);
            this.$router.push(`/graph/${type}/0`);
        },
        openTo(type: GraphTypeEnum) {
            let paths = utools.showOpenDialog({
                title: '选择图文件',
                defaultPath: utools.getPath('documents'),
                buttonLabel: '打开',
                filters: [{
                    name: '图文件',
                    extensions: ['json', 'xml']
                }, {
                    name: '全部文件',
                    extensions: ['*']
                }],
                properties: ['openFile']
            });
            if (!paths || paths.length === 0) {
                return;
            }
            useGlobalStore().setTitle('从文件打开');
            useGlobalStore().setType(type);
            // 跳转
            this.$router.push({
                path: `/graph/${type}/-1`,
                query: {
                    path: paths[0]
                }
            });
        },
        // 路径
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: this.$route.name as string
                }
            })
        },
        jumpToSetting() {
            useGlobalStore().setTitle(' ');
            useGlobalStore().setType(undefined);
            this.$router.push('/setting');
        },
        jumpToAbout() {
            useGlobalStore().setTitle(' ');
            useGlobalStore().setType(undefined);
            this.$router.push('/about');
        },
        jumpToRecommend() {
            useGlobalStore().setTitle(' ');
            useGlobalStore().setType(undefined);
            this.$router.push('/recommend');
        },
        // ------ 功能组件 ------
        save() {
            useSaveEvent.emit();
        },
        saveAs() {
            useSaveAsEvent.emit();
        },
        clear() {
            useClearEvent.emit();
        },
        undo() {
            useUndoEvent.emit();
        },
        exportImage(type: any) {
            useExportEvent.emit(type);
        },
        switchDark() {
            useGlobalStore().switchDarkColors();
        }
    }
});
</script>
<style lang="less"></style>