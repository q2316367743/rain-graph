<template>
    <div class="simple-mind-map-toc">
        <a-scrollbar style="height:100%;overflow: auto;">
            <div class="toc-tree">
                <div class="title">
                    <a-input v-model="title.data.text" @click="textClick(title)" @change="titleEdit" :disabled="readonly"/>
                </div>
                <a-tree :data="renderTrees" block-node :field-names="fieldNames" show-line ref="simpleMindMapTocTree">
                    <template #title="nodeData">
                        <div class="toc-tree-node" v-if="nodeData.data" @click="textClick(nodeData)">
                            <div class="text" ref="tocEdit" :contenteditable="!readonly" @input="textEdit($event, nodeData)">
                                {{ nodeData.data.text }}
                            </div>
                        </div>
                    </template>
                    <template #extra="nodeData">
                        <a-dropdown>
                            <a-button type="text" disabled>
                                <template #icon>
                                    <icon-more />
                                </template>
                            </a-button>
                            <template #content>
                                <a-doption @click="addNode(nodeData)">新增同级节点</a-doption>
                                <a-doption @click="addChildNode(nodeData)">新增子节点</a-doption>
                                <a-doption @click="removeNode(nodeData)">删除节点</a-doption>
                            </template>
                        </a-dropdown>
                    </template>
                </a-tree>
            </div>
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
        },
        readonly: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: () => ({
        tagColorList,
        fieldNames: {
            key: 'data.text',
            title: 'data.uid',
        },
        title: {
            data: { text: '' }
        } as MindMapNode,
        renderTrees: new Array<MindMapNode>(),
    }),
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let data = this.simpleMindMapWrap.getRenderTree();
            this.title = {
                data: data.data,
                children: [],
                _node: data._node
            }
            this.renderTrees = data.children || [];
            this.expandAll();
        },
        expandAll() {
            this.$nextTick(() => {
                this.$nextTick(() => {
                    let simpleMindMapTocTree = this.$refs['simpleMindMapTocTree'] as TreeInstance;
                    simpleMindMapTocTree.expandAll(true);
                });
            });
        },
        textClick(nodeData: MindMapNode) {
            if (nodeData._node) {
                this.simpleMindMapWrap.renderer.moveNodeToCenter(nodeData._node);
                nodeData._node.active();
            }
        },
        titleEdit() {
            this.textClick(this.title);
            this.title._node.setText(this.title.data.text);
        },
        textEdit(e: Event, nodeData: MindMapNode) {
            let tocEdit = e.target as HTMLDivElement;
            this.textClick(nodeData);
            if (nodeData._node) {
                nodeData._node.setText(tocEdit.innerText);
            }
            // 编辑节点不刷新数据
        },
        addNode(nodeData: MindMapNode) {
            this.textClick(nodeData);
            this.simpleMindMapWrap.execCommand('INSERT_NODE');
            this.init();
        },
        addChildNode(nodeData: MindMapNode) {
            this.textClick(nodeData);
            this.simpleMindMapWrap.execCommand('INSERT_CHILD_NODE');
            this.init();
        },
        removeNode(nodeData: MindMapNode) {
            this.textClick(nodeData);
            this.simpleMindMapWrap.execCommand('REMOVE_NODE');
            this.init();

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