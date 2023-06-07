<template>
    <div class="simple-mind-map-toc">
        <a-scrollbar style="height:100%;overflow: auto;">
            <a-tree :data="[renderTree || {}]" block-node class="toc-tree" :selectable="false" :field-names="fieldNames" show-line>
                <template #title="nodeData">
                    <div class="toc-tree-node" v-if="nodeData.data">
                        <div class="text" contenteditable="true">{{ nodeData.data.text }}</div>
                    </div>
                </template>
                <template #extra="nodeData">
                    <a-button type="text">
                        <template #icon>
                            <icon-more />
                        </template>
                    </a-button>
                </template>
            </a-tree>
        </a-scrollbar>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";
import { tagColorList } from '../data/constants'

export default defineComponent({
    name: 'simple-mind-map-toc',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
        renderTree: Object,
    },
    data: () => ({
        tagColorList,
        fieldNames: {
            key: 'value',
            title: 'data.text',
        }
    }),
    created() {

    },
    methods: {
    }
});
</script>
<style lang="less">
.simple-mind-map-toc {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-bg-1);

    .toc-tree {
        margin: 50px 100px 80px 100px;
    }

    .arco-scrollbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .scrollbar {
            overflow: auto;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

        }
    }
    .arco-tree-node-title-text {
        width: 100%;
    }

    .toc-tree-node {
        cursor: default;
        .text {
            color: var(--color-text-1) !important;
            cursor: text;
            outline: none;
            border: none;
        }
    }
}
</style>