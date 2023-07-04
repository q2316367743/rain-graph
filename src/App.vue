<template>
    <div class="app">
        <a-spin :loading="loading" :tip="loadingText" class="rain-loading">
            <a-layout>
                <a-layout-sider collapsed style="z-index: 50">
                    <a-menu style="width: 200px;height: 100%;" breakpoint="xl" v-model:selected-keys="selectedKeys">
                        <a-menu-item key="/dashboard" @click="toDashboard">
                            <template #icon>
                                <icon-computer/>
                            </template>
                            仪表盘
                        </a-menu-item>
                        <a-menu-item key="/home" @click="toHome">
                            <template #icon>
                                <icon-list/>
                            </template>
                            列表
                        </a-menu-item>
                        <a-sub-menu key="graph">
                            <template #icon>
                                <icon-plus/>
                            </template>
                            <template #title>新建</template>
                            <a-menu-item :key="`/graph/${GraphTypeEnum.MIND_MAP}/0`"
                                         @click="jumpTo(GraphTypeEnum.MIND_MAP)"
                                         v-if="showViews.includes(GraphTypeEnum.MIND_MAP)">
                                {{ Config.title[GraphTypeEnum.MIND_MAP].title }}
                            </a-menu-item>
                            <a-menu-item :key="`/graph/${GraphTypeEnum.DIAGRAM}/0`"
                                         @click="jumpTo(GraphTypeEnum.DIAGRAM)"
                                         v-if="showViews.includes(GraphTypeEnum.DIAGRAM)">
                                {{ Config.title[GraphTypeEnum.DIAGRAM].title }}
                            </a-menu-item>
                            <a-menu-item :key="`/graph/${GraphTypeEnum.WHITE_BOARD}/0`"
                                         @click="jumpTo(GraphTypeEnum.WHITE_BOARD)"
                                         v-if="showViews.includes(GraphTypeEnum.WHITE_BOARD)">
                                {{ Config.title[GraphTypeEnum.WHITE_BOARD].title }}
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu key="apps">
                            <template #icon>
                                <icon-apps/>
                            </template>
                            <template #title>小程序</template>
                            <a-menu-item :key="'/apps/' + GraphTypeEnum.DRAUU"
                                         @click="jumpToFunc('/apps/' + GraphTypeEnum.DRAUU)">
                                画板
                            </a-menu-item>
                            <a-menu-item :key="'/apps/' + GraphTypeEnum.ECHARTS"
                                         @click="jumpToFunc('/apps/' + GraphTypeEnum.ECHARTS)">
                                可视化图表
                            </a-menu-item>
                            <a-menu-item :key="'/apps/' + GraphTypeEnum.QR_CODE"
                                         @click="jumpToFunc('/apps/' + GraphTypeEnum.QR_CODE)">
                                二维码
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu key="image">
                            <template #icon>
                                <icon-image/>
                            </template>
                            <template #title>图片编辑</template>
                            <a-menu-item :key="'/image/' + GraphTypeEnum.FABRIC" disabled
                                         @click="jumpToFunc('/image/' + GraphTypeEnum.FABRIC)">
                                设计编辑器
                            </a-menu-item>
                            <a-menu-item :key="'/image/' + GraphTypeEnum.CROPPER"
                                         @click="jumpToFunc('/image/' + GraphTypeEnum.CROPPER)">
                                图片裁剪
                            </a-menu-item>
                            <a-menu-item :key="'/image/' + GraphTypeEnum.COMPRESSOR"
                                         @click="jumpToFunc('/image/' + GraphTypeEnum.COMPRESSOR)">
                                图片压缩
                            </a-menu-item>
                            <a-menu-item :key="'/image/' + GraphTypeEnum.PSD"
                                         @click="jumpToFunc('/image/' + GraphTypeEnum.PSD)">
                                PSD查看器
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu key="setting">
                            <template #icon>
                                <icon-settings/>
                            </template>
                            <template #title>设置</template>
                            <a-menu-item key="/setting/base" @click="jumpToFunc('/setting/base')">
                                基础设置
                            </a-menu-item>
                            <a-menu-item key="/setting/backup" @click="jumpToFunc('/setting/backup')" disabled>
                                备份设置
                            </a-menu-item>
                            <a-menu-item key="/setting/simple-mind-map" @click="jumpToFunc('/setting/simple-mind-elixir-map')">
                                完整流程图
                            </a-menu-item>
                            <a-menu-item key="/setting/diagram" @click="jumpToFunc('/setting/logic-flow')">
                                流程图
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu key="4">
                            <template #icon>
                                <icon-more/>
                            </template>
                            <template #title>更多</template>
                            <a-menu-item key="/more/recommend" @click="jumpToFunc('/more/recommend')">
                                <template #icon>
                                    <icon-thumb-up/>
                                </template>
                                推荐
                            </a-menu-item>
                            <a-menu-item key="/more/vip" @click="jumpToFunc('/more/vip')">
                                <template #icon>
                                    <icon-star/>
                                </template>
                                高级版
                            </a-menu-item>
                            <a-menu-item key="/more/about" @click="jumpToFunc('/more/about')">
                                <template #icon>
                                    <icon-exclamation-circle/>
                                </template>
                                关于
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-spin>
        <sub-input v-model:visible="subInputVisible" v-model:keyword="subInputKeyword"/>
    </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {defineAsyncComponent, defineComponent} from "vue";

import {statistics, useMapEvent, useSaveEvent, useSideEvent, useUndoEvent} from "@/global/BeanFactory";
import Config from '@/global/Config'

import {useVipStore} from "./store/VipStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useSettingStore} from "@/store/setting/SettingStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import {useDiagramSettingStore} from "./store/setting/DiagramSettingStore";
import {useSimpleMindMapSettingStore} from "./store/setting/SimpleMindMapSetting";

import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from '@/enumeration/GraphTypeEnum';
import {useBackupSettingStore} from "./store/setting/BackupSettingStore";
import versionManage from "@/components/version-manage";
import {useMindMapStore} from "./store/graph/MindMapStore";
import {DiagramSubType} from "@/enumeration/GraphSubTypeEnum";


export default defineComponent({
    name: 'app',
    components: {
        SubInput: defineAsyncComponent(() => import("@/components/sub-input/index.vue"))
    },
    data: () => ({
        ExportTypeEnum,
        GraphTypeEnum,
        Config,
        selectedKeys: ['/home'],
        subInputVisible: false,
        subInputKeyword: ''
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'title', 'type', 'typeWrap', 'env', 'loading', 'loadingText']),
        ...mapState(useSettingStore, ['showViews', 'mindMapType', 'whiteBoardType']),
    },
    watch: {
        '$route': {
            handler(newValue) {
                const path = newValue.path as string;
                const name = newValue.name as string;
                this.selectedKeys = [path];
                let operate = name;
                let additional = undefined;
                if (path.startsWith("/graph")) {
                    if (name) {
                        const items = name.split("|");
                        if (items.length >1) {
                            operate = items[0];
                            additional = items[1];
                        }
                    }
                }
                statistics.access(operate, additional);
            }
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
        // 初始化后进行版本检查
        Promise.all([
            useVipStore().init(),
            // 初始化图信息
            useMindMapStore().init(),
            useDiagramStore().init(),
            useWhiteBoardStore().init(),
            // 初始化设置
            useSettingStore().init(),
            useBackupSettingStore().init(),
            useDiagramSettingStore().init(),
            useSimpleMindMapSettingStore().init(),
        ]).then(() => versionManage());
        // 插件进入事件
        utools.onPluginEnter(action => {
            if (action.code.startsWith('/graph')) {
                useGlobalStore().setTitle('');
                useGlobalStore().setType(action.code as GraphTypeEnum);
            }
            let query = {} as Record<string, string>;
            if (action.type === 'files') {
                let file = action.payload[0];
                query['path'] = file.path;
                query['name'] = file.name;
            }
            this.$router.push({
                path: action.code,
                query
            });
        });
        // 子输入框
        let subInput = false;
        let interval = setInterval(() => {
            subInput = utools.setSubInput(action => {
                // @ts-ignore
                let text = action.text;
                if (this.subInputVisible) {
                } else if (text !== '') {
                    this.subInputVisible = true;
                }
                this.subInputKeyword = text;
            }, '请输入名称', false);
            if (subInput) {
                clearInterval(interval);
            }
        }, 100);
        // 快捷键注册
        window.addEventListener("keydown", function (e) {
            //可以判断是不是mac，如果是mac,ctrl变为花键
            // @ts-ignore
            if (navigator.userAgentData.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    useSaveEvent.emit();
                } else if (e.key === 'z') {
                    useUndoEvent.emit();
                } else if (e.key === 'b') {
                    useSideEvent.emit();
                } else if (e.key === 'm') {
                    useMapEvent.emit();
                }
            }

        }, false);
    },
    methods: {
        jumpTo(type: GraphTypeEnum) {
            useGlobalStore().setTitle('');
            useGlobalStore().setType(type);
            if (type === GraphTypeEnum.MIND_MAP) {
                this.$router.push(`/graph/${this.mindMapType}/0`);
                return;
            }else if (type === GraphTypeEnum.WHITE_BOARD) {
                this.$router.push(`/graph/${this.whiteBoardType}/0`);
                return;
            }else if (type === GraphTypeEnum.DIAGRAM) {
                this.$router.push(`/graph/${DiagramSubType.LOGIC_FLOW}/0`);
                return;
            }
            this.$router.push(`/graph/${type}/0`);
        },
        async openTo(type: GraphTypeEnum) {
            let paths = utools.showOpenDialog({
                title: '选择图文件',
                defaultPath: utools.getPath('documents'),
                buttonLabel: '打开',
                filters: [{
                    name: 'application/json',
                    extensions: ['json']
                }],
                properties: ['openFile']
            });
            if (!paths || paths.length === 0) {
                return;
            }
            useGlobalStore().setTitle('从文件打开');
            useGlobalStore().setType(type);
            // 跳转
            await this.$router.push({
                path: `/graph/${type}/-1`,
                query: {
                    path: paths[0]
                }
            });
        },
        toDashboard() {
            this.$router.push('/dashboard')
        },
        // 路径
        toHome() {
            let path = this.$route.path as string;
            let name = this.$route.name as string;
            this.$router.push({
                path: '/home',
                query: {
                    name: path.startsWith('/graph') ? name : undefined
                }
            })
        },
        jumpToFunc(path: string) {
            useGlobalStore().setTitle(' ');
            useGlobalStore().setType(undefined);
            this.$router.push(path);
        },
    }
});
</script>
<style lang="less"></style>
