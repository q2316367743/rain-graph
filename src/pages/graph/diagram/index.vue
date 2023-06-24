<template>
    <div class="diagram">
        <!-- 顶部菜单栏 -->
        <diagram-menu class="header" v-if="render" v-model:panel-show="panelShow" :lf="lf" :collapsed="collapsed"
                      :readonly="readonly" :option="option" @save="save" @update-readonly="setReadonly"
                      @update-option="updateOption"/>
        <div class="container">
            <a-layout>
                <!-- 侧边工具栏 -->
                <a-layout-sider hide-trigger collapsible :collapsed="collapsed || readonly" :collapsed-width="0"
                                :width="206">
                    <diagram-sidebar v-if="render" :diagram-groups="diagramNodes" v-model:node-keys="option.nodeKeys"
                                     @drag-in-node="dragInNode"/>
                </a-layout-sider>
                <a-layout>
                    <!-- 内容 -->
                    <div class="content" id="diagram-view"></div>
                    <!-- 左上角工具栏、属性栏 -->
                    <div class="toolbar">
                        <diagram-toolbar v-if="render" :lf="lf" :active-edges="activeEdges" :readonly="readonly"/>
                    </div>
                    <div class="collapsed">
                        <!-- 折叠按钮 -->
                        <a-button @click="collapsed = !collapsed" type="primary" v-if="!readonly">
                            <template #icon>
                                <icon-menu-unfold v-if="collapsed"/>
                                <icon-menu-fold v-else/>
                            </template>
                        </a-button>
                    </div>
                    <!-- 右侧属性面板 -->
                    <diagram-panel class="panel" v-if="activeNodes.length > 0 || activeEdges.length > 0"
                                   v-show="panelShow && !readonly" :onlyEdge="activeNodes.length === 0"
                                   :elementsStyle="properties"
                                   @set-style="setStyle" @@set-level="setZIndex"/>
                </a-layout>
            </a-layout>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, toRaw} from "vue";
import {mapState} from "pinia";
import {BpmnElement, BpmnXmlAdapter, Menu, MiniMap, SelectionSelect, Snapshot,} from '@logicflow/extension';
import LogicFlow from "@logicflow/core";

import "@logicflow/extension/lib/style/index.css";
import "@logicflow/core/dist/style/index.css";

import DiagramToolbar from './components/toolbar.vue';
import DiagramSidebar from './components/sidebar.vue';
import DiagramPanel from './components/panel.vue';
import DiagramMenu from './components/menu/index.vue';
import {registerCustomElement} from './node';

import {useGlobalStore} from "@/store/GlobalStore";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MessageUtil from "@/utils/MessageUtil";
import {useSaveEvent, useSideEvent, useUndoEvent} from "@/global/BeanFactory";
import {getRecord} from "@/utils/utools/DbUtil";
import {originalConfig, silentConfig} from './constants';

// 主题
import {DefaultTheme} from "./theme";
import {useDiagramSettingStore} from "@/store/setting/DiagramSettingStore";
import {DiagramGroup} from "@/pages/graph/diagram/node/data/DiagramNode";

export default defineComponent({
    name: 'diagram',
    components: {DiagramToolbar, DiagramSidebar, DiagramPanel, DiagramMenu},
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
        properties: {},
        panelShow: true,
        readonly: false,
        diagramNodes: new Array<DiagramGroup>(),
        option: {
            nodeKeys: ['basic-node', 'graph-node', 'polygon-node', 'lct']
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'title']),
        ...mapState(useDiagramSettingStore, ['diagramSetting']),
        _id() {
            return `/${GraphTypeEnum.DIAGRAM}/${this.id}`;
        },
        width() {
            return this.size.width - (this.collapsed || this.readonly ? 0 : 200);
        },
        height() {
            return this.size.height - 33;
        },
        miniMapLeft() {
            if (this.readonly) {
                return this.size.width - 156 - 10;
            }
            return this.size.width - 156 - 10 - (this.collapsed ? 0 : 200);
        },
        miniMapTop() {
            return this.size.height - 242 - 10 - 33;
        }
    },
    watch: {
        size: {
            handler() {
                if (this.lf.extension.miniMap.isShow) {
                    this.lf.extension.miniMap.hide();
                    this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
                }
                this.lf.resize(this.width, this.height);
            },
            deep: true
        },
        collapsed() {
            if (this.lf.extension.miniMap.isShow) {
                this.lf.extension.miniMap.hide();
                this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
            }
            this.lf.resize(this.width, this.height);
        },
        readonly() {
            if (this.lf.extension.miniMap.isShow) {
                this.lf.extension.miniMap.hide();
                this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
            }
            this.lf.resize(this.width, this.height);
        }
    },
    created() {
        this.config = Object.assign(this.config, this.diagramSetting);
        useSaveEvent.on(() => this.save());
        useUndoEvent.on(() => this.lf.undo());
        useSideEvent.on(() => this.collapsed = !this.collapsed);
    },
    mounted() {
        this.render = false
        // 获取数据
        let id = this.$route.params.id as string;
        let path = this.$route.query.path as string;
        getRecord(GraphTypeEnum.DIAGRAM, id, path).then(data => {
            this.id = data.id;
            this._rev = data._rev;
            this.config = Object.assign(this.config, data.config);
            this.init(data['editConfig'] || {}, data['option'] || {}, data.record);
        }).catch(e => {
            MessageUtil.error("初始化失败", e);
            this.init({}, {});
        })
    },
    methods: {
        init(editConfig: any, option: any, data?: any) {
            let lf = new LogicFlow({
                ...this.config,
                container: document.querySelector('#diagram-view') as HTMLElement,
                plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, SelectionSelect, MiniMap, Menu],
                width: this.width,
                height: this.height,
                ...editConfig
            });
            registerCustomElement(lf)
                .then(diagramNodes => this.diagramNodes = diagramNodes);
            lf.setDefaultEdgeType('pro-polyline');
            lf.renderRawData(data);
            lf.setTheme(DefaultTheme);
            this.render = true;
            this.lf = lf;
            this.lf.on('selection:selected,node:click,blank:click,edge:click', () => {
                this.$nextTick(() => {
                    const {nodes, edges} = this.lf.getSelectElements()
                    this.activeNodes = nodes
                    this.activeEdges = edges
                    this.getProperty();
                })
            });
            this.option = option;
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
                            record: this.lf.getGraphRawData(),
                            editConfig: this.lf.getEditConfig(),
                            option: toRaw(this.option)
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
            const {nodes, edges} = this.lf.getSelectElements()
            nodes.forEach(node => {
                properties = {...properties, ...node.properties}
            })
            edges.forEach(edge => {
                properties = {...properties, ...edge.properties}
            })
            this.properties = properties
        },
        setStyle(item: any) {
            this.activeNodes.forEach(({id}) => {
                this.lf.setProperties(id, item)
            })
            this.activeEdges.forEach(({id}) => {
                this.lf.setProperties(id, item)
            })
            this.getProperty()
        },
        setZIndex(type: any) {
            this.activeNodes.forEach(({id}) => {
                this.lf.setElementZIndex(id, type)
            })
            this.activeEdges.forEach(({id}) => {
                this.lf.setElementZIndex(id, type)
            })
        },
        setReadonly() {
            this.readonly = !this.readonly;
            if (this.readonly) {
                this.lf.updateEditConfig(silentConfig);
            } else {
                this.lf.updateEditConfig(originalConfig);
            }
        },
        updateOption(option: any) {
            this.option = option;
            this.save()
        }
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
        top: 0;
        right: 0;
        bottom: 0;
        padding: 7px;
        background-color: var(--color-bg-1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: auto;
    }
}
</style>