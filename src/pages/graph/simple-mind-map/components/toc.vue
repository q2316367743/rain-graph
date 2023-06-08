<template>
    <div class="simple-mind-map-toc">
        <a-scrollbar style="height:100%;overflow: auto;">
            <a-tree :data="renderTrees" block-node class="toc-tree" :field-names="fieldNames" show-line
                ref="simpleMindMapTocTree">
                <template #title="nodeData">
                    <div class="toc-tree-node" v-if="nodeData.data">
                        <div class="text" ref="tocEdit" contenteditable="true" @input="textEdit($event, nodeData)">
                            {{ nodeData.data.text }}
                        </div>
                    </div>
                </template>
                <template #extra="nodeData">
                    <a-dropdown>
                        <a-button type="text">
                            <template #icon>
                                <icon-more />
                            </template>
                        </a-button>
                        <template #content>
                            <a-doption :disabled="nodeData.data.uid === 1">新增同级节点</a-doption>
                            <a-doption @click="addChildNode(nodeData)">新增子节点</a-doption>
                            <a-doption>删除节点</a-doption>
                        </template>
                    </a-dropdown>
                </template>
            </a-tree>
        </a-scrollbar>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";
import { tagColorList } from '../data/constants';
import { TreeInstance } from '@arco-design/web-vue'
import { MindMapNode } from "../domain/MindMapNode";

export default defineComponent({
    name: 'simple-mind-map-toc',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({
        tagColorList,
        fieldNames: {
            key: 'data.text',
            title: 'data.uid',
        },
        renderTrees: new Array<MindMapNode>(),
    }),
    mounted() {
        this.renderTrees = [this.simpleMindMapWrap.getData()];
        this.expandAll();
    },
    methods: {
        expandAll() {
            this.$nextTick(() => {
                this.$nextTick(() => {
                    let simpleMindMapTocTree = this.$refs['simpleMindMapTocTree'] as TreeInstance;
                    simpleMindMapTocTree.expandAll(true);
                });
            });
        },
        textEdit(e: Event, nodeData: MindMapNode) {
            let tocEdit = e.target as HTMLDivElement;
            nodeData.data.text = tocEdit.innerText;
        },
        addChildNode(nodeData: MindMapNode) {
            const children = nodeData.children || []
            children.push({
                data: {
                    text: '子节点',
                    expand: false
                },
                children: []
            })
            nodeData.children = children
            this.renderTrees = [...this.renderTrees];
            this.simpleMindMapWrap.setData(this.renderTrees[0]);
            this.expandAll();
        }
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
    z-index: 3001;

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

        .text {
            color: var(--color-text-1) !important;
            cursor: text;
            outline: none;
            border: none;
        }
    }
}
</style>