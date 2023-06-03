<template>
    <a-dropdown trigger="click">
        <a-button>
            更多
        </a-button>
        <template #content>
            <a-doption disabled>画布</a-doption>
            <a-doption @click="openTheme">主题</a-doption>
            <a-doption @click="layoutDrawer = true">布局</a-doption>
            <a-doption @click="tocDrawer = true">大纲</a-doption>
            <a-doption @click="keyboardShortcut = true;">快捷键</a-doption>
        </template>
    </a-dropdown>
    <!-- ------ 设置相关 ------ -->

    <a-drawer v-model:visible="themeDrawer" mask-closable :footer="false" width="372px" class="simple-mind-map-theme">
        <template #title>
            <span>主题</span>
            <a-radio-group v-model="themeType" type="button" style="margin-left: 14px;">
                <a-radio value="light">白天</a-radio>
                <a-radio value="dark">黑夜</a-radio>
            </a-radio-group>
        </template>
        <a-list :bordered="false">
            <a-list-item v-for="theme of themeList">
                <a-image :src="`./simple-mind-map/theme/${theme.value}.jpg`" fit="cover" :title="theme.name" width="300px"
                    :preview="false" style="cursor: pointer;" @click="switchTheme(theme.value)" />
            </a-list-item>
        </a-list>
    </a-drawer>
    <a-drawer title="布局" v-model:visible="layoutDrawer" mask-closable :footer="false" width="372px"
        class="simple-mind-map-layout">
        <a-list :bordered="false">
            <a-list-item v-for="layout of layoutList">
                <a-image :src="`./simple-mind-map/layout/${layout.value}.jpg`" fit="cover" :title="layout.name"
                    width="300px" :alt="layout.name" :preview="false" style="cursor: pointer;"
                    @click="switchLayout(layout.value)" />
            </a-list-item>
        </a-list>
    </a-drawer>
    <a-drawer title="大纲" v-model:visible="tocDrawer" mask-closable :footer="false" width="372px" unmount-on-close>
        <a-tree :data="[renderTree || {}]" block-node>
            <template #title="nodeData">{{ nodeData.data.text }}</template>
        </a-tree>
    </a-drawer>
    <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
        <a-descriptions align="right" title="节点操作" :column="1">
            <a-descriptions-item label="插入下级节点">Tab</a-descriptions-item>
            <a-descriptions-item label="插入同级节点">Enter</a-descriptions-item>
            <a-descriptions-item label="上移节点">Ctrl + ↑</a-descriptions-item>
            <a-descriptions-item label="下移节点">Ctrl + ↓</a-descriptions-item>
            <a-descriptions-item label="保存">Ctrl + S</a-descriptions-item>
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
</template>
<script lang="ts">
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { themeByLightList, themeByDarkList, layoutList } from "../data/constants";

export default defineComponent({
    name: '',
    props: {
        renderTree: Object,
        index: {
            type: Number,
            required: false,
            default: 0
        },
        len: {
            type: Number,
            required: false,
            default: 0
        },
        hasNode: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ['switch-theme', 'switch-layout', 'set-node'],
    data: () => ({
        ExportTypeEnum,

        // ------ 设置相关 ------

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
    computed: {
        ...mapState(useGlobalStore, ['width', 'isDark']),
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

        // ------ 设置相关 ------
        openTheme() {
            this.themeType = this.isDark ? 'dark' : 'light';
            this.themeDrawer = true;
        },
        switchTheme(theme: string) {
            this.$emit('switch-theme', theme);
            this.themeDrawer = false;
        },
        switchLayout(layout: string) {
            this.$emit('switch-layout', layout);
            this.layoutDrawer = false;
        },
        setNode(node: any) {
            console.log(node)
            this.$emit('set-node', node);
        }
    }
});
</script>
<style scoped></style>