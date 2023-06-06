<template>
    <!-- 选择器 -->
    <div class="simple-mind-map-toolbar" :style="{ left: drawTypeLeft }">
        <a-button-group type="text" class="draw-type">
            <a-tooltip content="图标" position="bottom">
                <a-button value="freedraw" :disabled="!hasNode" @click="dialog.icon = true">
                    <template #icon><icon-robot /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="超链接" position="bottom">
                <a-button value="text" :disabled="!hasNode" @click="dialog.hyperLink = true">
                    <template #icon><icon-link /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="备注" position="bottom">
                <a-button value="image" :disabled="!hasNode" @click="dialog.note = true">
                    <template #icon><icon-edit /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="标签" position="bottom">
                <a-button value="freedraw" :disabled="!hasNode" @click="dialog.tag = true">
                    <template #icon><icon-tag /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="概要" position="bottom">
                <a-button value="text" :disabled="!hasNode">
                    <template #icon><icon-apps /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="关联线" position="bottom">
                <a-button value="image" :disabled="!hasNode">
                    <template #icon><icon-oblique-line /></template>
                </a-button>
            </a-tooltip>
        </a-button-group>
        <node-icon v-model:visible="dialog.icon" :simple-mind-map-wrap="simpleMindMapWrap" />
        <node-hyper-link v-model:visible="dialog.hyperLink" :simple-mind-map-wrap="simpleMindMapWrap" />
        <node-note v-model:visible="dialog.note" :simple-mind-map-wrap="simpleMindMapWrap" />
        <node-tag v-model:visible="dialog.tag" :simple-mind-map-wrap="simpleMindMapWrap" />
    </div>
</template>
<script lang="ts">
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";

// 引入节点组件
import NodeIcon from './node/icon.vue';
import NodeHyperLink from './node/hyper-link.vue';
import NodeNote from './node/note.vue';
import NodeTag from './node/tag.vue';

export default defineComponent({
    name: 'simple-mind-map-toolbar',
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
    },
    data: () => ({
        dialog: {
            icon: false,
            hyperLink: false,
            note: false,
            tag: false
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'width', 'isDark']),
        drawTypeLeft() {
            return ((this.width - 192) / 2) + 'px';
        },
    }
});
</script>
<style scoped lang="less">
.simple-mind-map-toolbar {
    position: absolute;
    top: 7px;
    background-color: var(--color-bg-1);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    transition: 0.2ms all;
    border: 1px solid var(--color-neutral-3);
}
</style>