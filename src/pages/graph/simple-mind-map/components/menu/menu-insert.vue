<template>
    <a-dropdown>
        <a-button :disabled="readonly">插入</a-button>
        <template #content>
            <a-doption :disabled="true">
                <template #icon><icon-image /></template>
                图片
            </a-doption>
            <a-doption :disabled="!hasNode" @click="dialog.icon = true">
                <template #icon><icon-heart /></template>
                图标
            </a-doption>
            <a-doption :disabled="!hasNode" @click="dialog.hyperLink = true">
                <template #icon><icon-link /></template>
                超链接
            </a-doption>
            <a-doption :disabled="!hasNode" @click="dialog.note = true">
                <template #icon><icon-edit /></template>
                备注
            </a-doption>
            <a-doption :disabled="!hasNode" @click="dialog.tag = true">
                <template #icon><icon-tag /></template>
                标签
            </a-doption>
            <a-doption :disabled="true">
                <template #icon><icon-apps /></template>
                概要
            </a-doption>
            <a-doption :disabled="!hasNode" @click="createAssociativeLine">
                <template #icon><icon-arrow-right /></template>
                关联线
            </a-doption>
        </template>
    </a-dropdown>
    <node-icon v-model:visible="dialog.icon" :simple-mind-map-wrap="simpleMindMapWrap" />
    <node-hyper-link v-model:visible="dialog.hyperLink" :simple-mind-map-wrap="simpleMindMapWrap" />
    <node-note v-model:visible="dialog.note" :simple-mind-map-wrap="simpleMindMapWrap" />
    <node-tag v-model:visible="dialog.tag" :simple-mind-map-wrap="simpleMindMapWrap" />
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../../SimpleMindMapWrap";

// 引入节点组件
import NodeIcon from '../node/icon.vue';
import NodeHyperLink from '../node/hyper-link.vue';
import NodeNote from '../node/note.vue';
import NodeTag from '../node/tag.vue';

export default defineComponent({
    name: 'menu-insert',
    components: { NodeIcon, NodeHyperLink, NodeNote, NodeTag },
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
        },
        readonly: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: () => ({
        dialog: {
            icon: false,
            hyperLink: false,
            note: false,
            tag: false
        }
    }),
    methods: {
        createAssociativeLine() {
            this.simpleMindMapWrap.createAssociativeLine();
        }
    }
});
</script>
<style scoped></style>