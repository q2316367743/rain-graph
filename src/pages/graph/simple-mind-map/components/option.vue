<template>
    <div :class="show ? 'show' : 'hidden'">
        <div class="op">
            <a-button type="text" @click="show = !show">
                <template #icon>
                    <icon-settings />
                </template>
            </a-button>
        </div>
        <div class="container">
            <a-button-group type="text" style="flex-direction: column;">
                <a-button>节点样式</a-button>
                <a-button>基础样式</a-button>
                <a-button @click="themeDrawer = true">主题</a-button>
                <a-button @click="layoutDrawer = true">布局</a-button>
                <a-button @click="tocDrawer = true">大纲</a-button>
                <a-button @click="keyboardShortcut = true;">快捷键</a-button>
            </a-button-group>
            <a-drawer title="布局" v-model:visible="layoutDrawer" mask-closable :footer="false" width="372px">
                <a-list :bordered="false">
                    <a-list-item v-for="layout of layoutList">
                        <a-image :src="`/simple-mind-map/layout/${layout.value}.jpg`" fit="cover" width="300px"
                            :title="layout.name" :preview="false" style="cursor: pointer;"
                            @click="switchLayout(layout.value)" />
                    </a-list-item>
                </a-list>
            </a-drawer>
        </div>
        <a-drawer v-model:visible="themeDrawer" mask-closable :footer="false" width="372px">
            <template #title>
                <span>主题</span>
                <a-radio-group v-model="themeType" type="button" style="margin-left: 14px;">
                    <a-radio value="light">白天</a-radio>
                    <a-radio value="dark">黑夜</a-radio>
                </a-radio-group>
            </template>
            <a-list :bordered="false">
                <a-list-item v-for="theme of themeList">
                    <a-image :src="`/simple-mind-map/theme/${theme.value}.jpg`" fit="cover" width="300px"
                        :title="theme.name" :preview="false" style="cursor: pointer;" @click="switchTheme(theme.value)" />
                </a-list-item>
            </a-list>
        </a-drawer>
        <a-drawer title="大纲" v-model:visible="tocDrawer" mask-closable :footer="false" width="372px" unmount-on-close>
            <a-tree :data="[renderTree || {}]" block-node>
                <template #title="nodeData">
                    <a-link @click="setNode(nodeData._node)">{{ nodeData.data.text }}</a-link>
                </template>
            </a-tree>
        </a-drawer>
        <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
            <a-descriptions align="right" title="节点操作" :column="1">
                <a-descriptions-item label="插入下级节点">Tab</a-descriptions-item>
                <a-descriptions-item label="插入同级节点">Enter</a-descriptions-item>
                <a-descriptions-item label="上移节点">Ctrl + ↑</a-descriptions-item>
                <a-descriptions-item label="下移节点">Ctrl + ↓</a-descriptions-item>
                <a-descriptions-item label="插入概要">Ctrl + S</a-descriptions-item>
                <a-descriptions-item label="展开/收起节点">/</a-descriptions-item>
                <a-descriptions-item label="删除节点">Delete | Backspace</a-descriptions-item>
                <a-descriptions-item label="复制节点">Ctrl + C</a-descriptions-item>
                <a-descriptions-item label="剪切节点">Ctrl + X</a-descriptions-item>
                <a-descriptions-item label="粘贴节点">Ctrl + V</a-descriptions-item>
                <a-descriptions-item label="编辑节点">F2</a-descriptions-item>
                <a-descriptions-item label="文本换行">Shift + Enter</a-descriptions-item>
                <a-descriptions-item label="回退">Ctrl + Z</a-descriptions-item>
                <a-descriptions-item label="前进">Ctrl + Y</a-descriptions-item>
                <a-descriptions-item label="全选">Ctrl + A</a-descriptions-item>
                <a-descriptions-item label="多选">右键 / Ctrl + 左键</a-descriptions-item>
                <a-descriptions-item label="一键整理布局">Ctrl + L</a-descriptions-item>
            </a-descriptions>
            <a-descriptions align="right" title="画布操作" :column="1">
                <a-descriptions-item label="放大">Ctrl + +</a-descriptions-item>
                <a-descriptions-item label="缩小">Ctrl + -</a-descriptions-item>
                <a-descriptions-item label="恢复默认">Ctrl + Enter</a-descriptions-item>
            </a-descriptions>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { themeByLightList, themeByDarkList, layoutList } from "../data/contants";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

export default defineComponent({
    name: 'simple-mind-map-option',
    props: {
        renderTree: Object
    },
    emits: ['switch-theme', 'switch-layout', 'set-node'],
    data: () => ({
        themeByLightList, themeByDarkList, layoutList,
        show: false,
        keyboardShortcut: false,
        themeDrawer: false,
        themeType: 'light',
        layoutDrawer: false,
        tocDrawer: false,
        fieldNames: {
            key: 'value',
            title: 'data.text',
        }
    }),
    created() {
        this.themeType = this.isDark ? 'dark' : 'light';
    },
    computed: {
        ...mapState(useGlobalStore, ['isDark']),
        themeList() {
            if (this.themeType === 'light') {
                return themeByLightList;
            } else if (this.themeType === 'dark') {
                return themeByDarkList;
            } else {
                return [];
            }
        }
    },
    methods: {
        switchTheme(theme: string) {
            this.$emit('switch-theme', theme);
            this.themeDrawer = false;
        },
        switchLayout(layout: string) {
            this.$emit('switch-layout', layout);
            this.layoutDrawer = false;
        },
        setNode(node: any) {
            this.$emit('set-node', node);
        }
    }
});
</script>
<style scoped></style>