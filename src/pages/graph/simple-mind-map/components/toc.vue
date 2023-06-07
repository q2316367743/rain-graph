<template>
    <div class="simple-mind-map-toc">
        <a-scrollbar style="height:100%;overflow: auto;">
            <a-tree :data="renderTrees" block-node class="toc-tree" :selectable="false" :field-names="fieldNames" show-line
                ref="simpleMindMapTocTree">
                <template #title="nodeData">
                    <div class="toc-tree-node" v-if="nodeData.data">
                        <div class="text" ref="tocEdit" contenteditable="true" @click="textClient(nodeData._node)"
                            @input="textEdit($event, nodeData._node)">
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
                            <a-doption @click="addNode(nodeData._node)"
                                :disabled="nodeData.data.uid === 1">新增同级节点</a-doption>
                            <a-doption @click="addChildNode(nodeData._node)">新增子节点</a-doption>
                            <a-doption @click="removeNode(nodeData._node)">删除节点</a-doption>
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
        renderTrees: new Array<any>(),
    }),
    mounted() {
        this.simpleMindMapWrap.on('data_change', () => {
            this.renderTrees = [this.simpleMindMapWrap.renderer.renderTree];
            this.$nextTick(() => {
                let simpleMindMapTocTree = this.$refs['simpleMindMapTocTree'] as TreeInstance;
                simpleMindMapTocTree.expandAll(true);
            })
        });
    },
    methods: {
        textClient(_node: any) {
            this.simpleMindMapWrap.renderer.moveNodeToCenter(_node);
            _node.active();
        },
        textEdit(e: Event, _node: any) {
            let tocEdit = e.target as HTMLDivElement;
            _node.setText(tocEdit.innerText);
        },
        addNode(_node: any) {
            this.textClient(_node);
            this.simpleMindMapWrap.execCommand('INSERT_NODE', false);
        },
        addChildNode(_node: any) {
            this.textClient(_node);
            this.simpleMindMapWrap.execCommand('INSERT_CHILD_NODE', false);
        },
        removeNode(_node: any) {
            this.textClient(_node);
            this.simpleMindMapWrap.execCommand('REMOVE_NODE');
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