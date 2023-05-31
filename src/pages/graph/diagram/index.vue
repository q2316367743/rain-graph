<template>
    <div class="diagram">
        <diagram-menu class="header" :lf="lf" @save="save" />
        <div class="container">
            <a-layout>
                <a-layout-sider hide-trigger collapsible :collapsed="collapsed" :collapsed-width="0" :width="200">
                    <diagram-sidebar v-if="render" @drag-in-node="dragInNode" />
                </a-layout-sider>
                <a-layout>
                    <div class="content" id="diagram-view"></div>
                    <div class="toolbar">
                        <diagram-toolbar v-if="render" :lf="lf" :active-edges="activeEdges" />
                    </div>
                    <div class="collapsed">
                        <a-button @click="collapsed = !collapsed" type="primary">
                            <template #icon>
                                <icon-menu-unfold v-if="collapsed" />
                                <icon-menu-fold v-else />
                            </template>
                        </a-button>
                        <a-button @click="showMiniMap" style="margin-left: 7px;" type="primary">
                            <template #icon>
                                <icon-location />
                            </template>
                        </a-button>
                    </div>
                    <!-- 右侧属性面板 -->
                    <diagram-panel class="panel" v-if="activeNodes.length > 0 || activeEdges.length > 0"
                        :onlyEdge="activeNodes.length === 0" :elementsStyle="properties" @setStyle="setStyle"
                        @setZIndex="setZIndex" />
                </a-layout>
            </a-layout>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { mapState } from "pinia";
import {
    BpmnElement,
    BpmnXmlAdapter,
    Snapshot,
    Menu,
    SelectionSelect,
    MiniMap,
} from '@logicflow/extension';
import LogicFlow from "@logicflow/core";

import "@logicflow/extension/lib/style/index.css";
import "@logicflow/core/dist/style/index.css";

import DiagramToolbar from './components/toolbar.vue';
import DiagramSidebar from './components/sidebar.vue';
import DiagramPanel from './components/panel.vue';
import DiagramMenu from './components/menu.vue';
import { registerCustomElement } from './node';

import { useGlobalStore } from "@/store/GlobalStore";
import { useDiagramStore } from "@/store/DiagramStore";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'diagram',
    components: { DiagramToolbar, DiagramSidebar, DiagramPanel, DiagramMenu },
    data: () => ({
        id: '0',
        _rev: undefined as string | undefined,
        config: {
            grid: {
                size: 10,
                type: 'dot',
            },
            keyboard: {
                enabled: true,
            },
            snapline: true,
            background: {
                backgroundImage: 'var(--color-bg-1)'
            }
        },
        render: false,
        lf: {} as LogicFlow,
        loading: false,
        collapsed: false,
        activeNodes: [] as any[],
        activeEdges: [] as any[],
        properties: {}
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'title']),
        _id() {
            return `/${GraphTypeEnum.DIAGRAM}/${this.id}`;
        },
        miniMapLeft() {
            return this.size.width - 156 - 10 - (this.collapsed ? 0 : 200);
        },
        miniMapTop() {
            return this.size.height - 242 - 10 - 33;
        }
    },
    watch: {
        size: {
            handler() {
                this.lf.extension.miniMap.hide();
                this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
            },
            deep: true
        },
        collapsed() {
            if (this.lf.extension.miniMap.isShow) {
                this.lf.extension.miniMap.hide();
                this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
            }
        }
    },
    mounted() {
        this.render = false
        // 获取取数
        this.id = this.$route.params.id as string;
        if (this.id === '-1') {
            // 文件打开
            let path = this.$route.query.path as string;
            window.preload.openFileToString(path).then(value => {
                let data = undefined as any | undefined;
                try {
                    let val = JSON.parse(value);
                    this.config = val.config;
                    data = val.record;
                } catch (e) {
                    MessageUtil.error("文件打开失败", e)
                } finally {
                    this.init(data);
                }
            }).catch(e => MessageUtil.error("文件打开失败", e));
        } if (this.id !== '0') {
            this.loading = true;
            utools.db.promises.get(this._id)
                .then(res => {
                    let data = undefined as any | undefined;
                    if (res) {
                        this._rev = res._rev;
                        let value = res.value;
                        this.config = value.config;
                        data = value.record;
                    }
                    this.init(data);
                    this.render = true;
                })
                .catch(e => {
                    MessageUtil.error("获取数据失败", e);
                    this.id = '0';
                    this.init();
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.init();
        }
    },
    methods: {
        init(data?: any) {
            let lf = new LogicFlow({
                ...this.config,
                container: document.querySelector('#diagram-view') as HTMLElement,
                plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, SelectionSelect, MiniMap, Menu]
            });
            registerCustomElement(lf);
            lf.setDefaultEdgeType('pro-polyline');
            lf.renderRawData(data);
            this.render = true;
            this.lf = lf;
            this.lf.on('selection:selected,node:click,blank:click,edge:click', () => {
                this.$nextTick(() => {
                    const { nodes, edges } = this.lf.getSelectElements()
                    this.activeNodes = nodes
                    this.activeEdges = edges
                    this.getProperty();
                })
            })
        },
        showMiniMap() {
            try {
                if (this.lf.extension.miniMap.isShow) {
                    this.lf.extension.miniMap.hide();
                } else {
                    this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
                }
            } catch (_) {
            }
        },
        save() {
            useDiagramStore().add(this.id)
                .then(id => {
                    this.id = id;
                    // 保存记录
                    utools.db.promises.put({
                        _id: this._id,
                        _rev: this._rev,
                        value: {
                            config: toRaw(this.config),
                            record: this.lf.getGraphRawData()
                        }
                    }).then(res => {
                        if (res.error) {
                            MessageUtil.error(res.message || "保存失败");
                            return;
                        }
                        this._rev = res.rev;
                        MessageUtil.success("保存成功");
                    }).catch(e => MessageUtil.error("保存失败", e));
                }).catch(e => MessageUtil.error("保存失败", e));
        },
        dragInNode(type: string) {
            this.lf.dnd.startDrag({
                type
            })
        },
        getProperty() {
            this.properties = {};
            let properties = {}
            const { nodes, edges } = this.lf.getSelectElements()
            nodes.forEach(node => {
                properties = { ...properties, ...node.properties }
            })
            edges.forEach(edge => {
                properties = { ...properties, ...edge.properties }
            })
            this.properties = properties
            return properties
        },
        setStyle(item: any) {
            this.activeNodes.forEach(({ id }) => {
                this.lf.setProperties(id, item)
            })
            this.activeEdges.forEach(({ id }) => {
                this.lf.setProperties(id, item)
            })
            this.getProperty()
        },
        setZIndex(type: any) {
            this.activeNodes.forEach(({ id }) => {
                this.lf.setElementZIndex(id, type)
            })
            this.activeEdges.forEach(({ id }) => {
                this.lf.setElementZIndex(id, type)
            })
        },
    }
});
</script>
<style lang="less">
.diagram {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 32px;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;

        .content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }

    .arco-layout {
        position: relative;
        overflow: hidden;
    }

    .toolbar {
        position: absolute;
        top: 0;
        left: 10px;
    }

    .collapsed {
        position: absolute;
        left: 10px;
        bottom: 10px;
    }

    .panel {
        position: absolute;
        top: 14px;
        right: 14px;
        bottom: 14px;
        padding: 7px;
        background-color: var(--color-bg-1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: auto;
    }
}
</style>