<template>
    <a-dropdown>
        <a-button>插入</a-button>
        <template #content>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-image /></template>
                图片
            </a-doption>
            <a-doption :disabled="!hasNode" @click="dialog.icon = true">
                <template #icon><icon-robot /></template>
                图标
            </a-doption>
            <a-doption :disabled="!hasNode" @click="dialog.hyperLink = true">
                <template #icon><icon-link /></template>
                超链接
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-edit /></template>
                备注
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-tag /></template>
                标签
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-apps /></template>
                概要
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-oblique-line /></template>
                关联线
            </a-doption>
        </template>
    </a-dropdown>
    <!-- 图标 -->
    <node-icon v-model:visible="dialog.icon" :simple-mind-map-wrap="simpleMindMapWrap" />
    <node-hyper-link v-model:visible="dialog.hyperLink" :simple-mind-map-wrap="simpleMindMapWrap" />
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";

// 引入节点组件
import NodeIcon from './node/icon.vue';
import NodeHyperLink from './node/hyper-link.vue';

export default defineComponent({
    name: 'menu-insert',
    components: { NodeIcon, NodeHyperLink },
    props: {
        hasNode: {
            type: Boolean,
            required: false,
            default: false
        },
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({
        dialog: {
            icon: false,
            hyperLink: false
        }
    }),
    methods: {
    }
});
</script>
<style scoped></style>