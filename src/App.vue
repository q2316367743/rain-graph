<template>
    <div class="app">
        <a-layout>
            <a-layout-sider :collapsed="collapsed">
                <a-menu style="width: 200px;height: 100%;" show-collapse-button breakpoint="xl"
                    v-model:selected-keys="selectedKeys" @collapse="(isColl) => collapsed = isColl">
                    <a-menu-item key="/home" @click="toHome">
                        <template #icon><icon-list /></template>
                        列表
                    </a-menu-item>
                    <a-sub-menu key="1">
                        <template #icon><icon-plus /></template>
                        <template #title>新建</template>
                        <a-menu-item :key="`/$gragh/${GraphTypeEnum.MIND}/0`" @click="jumpTo(GraphTypeEnum.MIND)">
                            {{ Config.title[GraphTypeEnum.MIND].title }}
                        </a-menu-item>
                        <a-menu-item :key="`/$gragh/${GraphTypeEnum.SIMPLE_MIND_MAP}/0`"
                            @click="jumpTo(GraphTypeEnum.SIMPLE_MIND_MAP)">
                            {{ Config.title[GraphTypeEnum.SIMPLE_MIND_MAP].title }}
                        </a-menu-item>
                        <a-menu-item :key="`/$gragh/${GraphTypeEnum.DIAGRAM}/0`" @click="jumpTo(GraphTypeEnum.DIAGRAM)">
                            {{ Config.title[GraphTypeEnum.DIAGRAM].title }}
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item key="/echarts" @click="jumpToEcharts">
                        <template #icon>
                            <icon-dashboard />
                        </template>
                        可视化图表
                    </a-menu-item>
                    <a-menu-item key="/setting" @click="jumpToSetting">
                        <template #icon>
                            <icon-settings />
                        </template>
                        设置
                    </a-menu-item>
                    <a-menu-item key="/recommend" @click="jumpToRecommend">
                        <template #icon><icon-thumb-up /></template>
                        推荐
                    </a-menu-item>
                    <a-menu-item key="/about" @click="jumpToAbout">
                        <template #icon>
                            <icon-exclamation-circle />
                        </template>
                        关于
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout-content><router-view /></a-layout-content>
        </a-layout>
    </div>
</template>
<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";

import { useMapEvent, useSaveEvent, useSideEvent, useUndoEvent } from "@/global/BeanFactory";
import Config from '@/global/Config'

import { useGlobalStore } from "@/store/GlobalStore";
import { useMindStore } from "@/store/MindStore";
import { useDiagramStore } from "@/store/DiagramStore";
import { useSettingStore } from "@/store/SettingStore";
import { useSimpleMindMapStore } from "@/store/SimpleMindMapStore";

import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from '@/enumeration/GraphTypeEnum';


export default defineComponent({
    name: '',
    data: () => ({
        ExportTypeEnum,
        GraphTypeEnum,
        Config,
        collapsed: false,
        selectedKeys: ['/home']
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'title', 'type', 'typeWrap', 'env']),
        editDisabled() {
            return !this.$route.path.startsWith('/graph')
        },
        exportItems(): ExportTypeEnum[] {
            return this.typeWrap ? (Config.export[this.typeWrap] || []) : [];
        },
        editItems(): Array<boolean> {
            return this.typeWrap ? (Config.edit[this.typeWrap] || [false, false]) : [false, false];
        }
    },
    watch: {
        '$route.path': {
            handler(newValue) {
                this.selectedKeys = [newValue];
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
        // 初始化图信息
        useMindStore().init();
        useSimpleMindMapStore().init();
        useDiagramStore().init();
        useSettingStore().init();
        utools.onPluginEnter(action => {
            if (action.code !== 'application') {
                useGlobalStore().setTitle('');
                useGlobalStore().setType(action.code as GraphTypeEnum);
                this.$router.push(`/graph/${action.code}/0`);
            } else {
                this.$router.push('/home');
            }
        });

        window.addEventListener("keydown", function (e) {
            //可以判断是不是mac，如果是mac,ctrl变为花键
            //event.preventDefault() 方法阻止元素发生默认的行为。
            if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
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
            this.$router.push(`/graph/${type}/0`);
        },
        async openTo(type: GraphTypeEnum) {
            let paths = await utools.showOpenDialog({
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
            this.$router.push({
                path: `/graph/${type}/-1`,
                query: {
                    path: paths[0]
                }
            });
        },
        // 路径
        toHome() {
            let path = this.$route.path as string;
            let name = this.$route.name as string;
            this.$router.push({
                path: '/home',
                query: {
                    name: path.startsWith('/gragh') ? name : undefined
                }
            })
        },
        jumpToSetting() {
            useGlobalStore().setTitle(' ');
            useGlobalStore().setType(undefined);
            this.$router.push('/setting');
        },
        jumpToEcharts() {
            useGlobalStore().setTitle(' ');
            useGlobalStore().setType(undefined);
            this.$router.push('/echarts');
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
        switchDark() {
            useGlobalStore().switchDarkColors();
        }
    }
});
</script>
<style lang="less"></style>