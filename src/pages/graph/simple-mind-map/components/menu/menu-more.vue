<template>
    <a-dropdown trigger="click">
        <a-button>
            更多
        </a-button>
        <template #content>
            <a-doption @click="exportDialog = true">导出</a-doption>
            <a-doption @click="openTheme">主题</a-doption>
            <a-doption @click="layoutDrawer = true">布局</a-doption>
            <a-doption @click="tocDrawer = true">大纲</a-doption>
            <a-doption @click="keyboardShortcut = true;">快捷键</a-doption>
        </template>
    </a-dropdown>
    <!-- ------ 主题 ------ -->
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
    <!-- 布局 -->
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
    <!-- 大纲 -->
    <a-drawer title="大纲" v-model:visible="tocDrawer" mask-closable :footer="false" width="372px" unmount-on-close>
        <a-tree :data="[renderTree || {}]" block-node>
            <template #title="nodeData">{{ nodeData.data.text }}</template>
        </a-tree>
    </a-drawer>
    <!-- 导出 -->
    <more-export v-model:visible="exportDialog" :simple-mind-map-wrap="simpleMindMapWrap" />
    <!-- 快捷键 -->
    <more-help v-model:visible="keyboardShortcut" />
</template>
<script lang="ts">
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";
import { PropType, defineComponent } from "vue";
import { themeByLightList, themeByDarkList, layoutList } from "../../data/constants";
import SimpleMindMapWrap from "../../SimpleMindMapWrap";

// 更多
import MoreExport from './more/more-export.vue'
import MoreHelp from './more/more-help.vue'

export default defineComponent({
    name: '',
    components: { MoreExport, MoreHelp },
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
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
        ExportTypeEnum, themeByLightList, themeByDarkList, layoutList,
        show: false,
        keyboardShortcut: false,
        themeDrawer: false,
        themeType: 'light',
        layoutDrawer: false,
        tocDrawer: false,
        exportDialog: false,
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