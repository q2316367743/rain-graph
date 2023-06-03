<template>
    <div class="simple-mind-map">
        <div class="header">
            <a-button-group type="text">
                <simple-mind-map-menu-file @save="save" @save-as="saveAs" />
                <!-- 编辑 -->
                <simple-mind-map-menu-edit :index="index" :len="len" :has-node="hasNode" @add-node="addBothNode"
                    @add-child-node="addChildNode" @remove-node="removeNode" @back="back" @forward="forward" />
                <!-- 插入 -->
                <simple-mind-map-menu-insert :has-node="hasNode" @add-link="addLink" />
                <!-- 导出 -->
                <simple-mind-map-menu-export @export="exportFile" />
                <!-- 更多 -->
                <simple-mind-map-menu-more :index="index" :len="len" :has-node="hasNode" :render-tree="renderTree"
                    @switch-theme="setTheme" @switch-layout="setLayout" @set-node="setNode" />
            </a-button-group>
            <a-button type="text" @click="collapsed = !collapsed">样式</a-button>
        </div>
        <a-layout class="container">
            <a-layout-content>
                <div id="simple-mind-map"></div>
            </a-layout-content>
            <a-layout-sider :collapsed="collapsed" :width="200" :collapsed-width="0">Sider</a-layout-sider>
        </a-layout>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SimpleMindMapWrap from "./SimpleMindMapWrap";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

// 组件
import SimpleMindMapMenuMore from './components/menu-more.vue';
import SimpleMindMapMenuFile from './components/menu-file.vue';
import SimpleMindMapMenuEdit from './components/menu-edit.vue';
import SimpleMindMapMenuInsert from './components/menu-insert.vue';
import SimpleMindMapMenuExport from './components/menu-export.vue';

import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useSimpleMindMapStore } from "@/store/graph/SimpleMindMapStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { getRecord } from "@/utils/utools/DbUtil";

let simpleMindMapWrap = {} as SimpleMindMapWrap;

export default defineComponent({
    name: '',
    components: { SimpleMindMapMenuMore, SimpleMindMapMenuFile, SimpleMindMapMenuEdit, SimpleMindMapMenuInsert, SimpleMindMapMenuExport },
    data: () => ({
        renderTree: undefined as any | undefined,
        index: 0,
        len: 0,
        hasNode: false,
        name: '',
        // 本身数据,
        collapsed: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'title', 'isDark'])
    },
    watch: {
        height() {
            simpleMindMapWrap.setSize(this.width, this.height);
        },
        width() {
            simpleMindMapWrap.setSize(this.width, this.height);
        },
        collapsed() {
            simpleMindMapWrap.setSize(this.width, this.height);
        }
    },
    created() {
        let id = this.$route.params.id as string;
        let record = useSimpleMindMapStore().info(id);
        this.name = record.name;
        useSaveEvent.on(() => this.save());
        useUndoEvent.on(() => this.back());
    },
    mounted() {
        let id = this.$route.params.id as string;
        let path = this.$route.query.path as string;
        getRecord(GraphTypeEnum.SIMPLE_MIND_MAP, id, path).then(value => {
            simpleMindMapWrap = new SimpleMindMapWrap(
                "#simple-mind-map",
                value.config,
                value.record);
            simpleMindMapWrap.init(value.id, value._rev);
            this.initAfter();
        }).catch(e => {
            MessageUtil.error("初始化数据出错", e);
            simpleMindMapWrap = new SimpleMindMapWrap(
                "#simple-mind-map",
                {});
            simpleMindMapWrap.init("0");
            this.initAfter();
        })
    },
    methods: {
        initAfter() {
            // 事件
            simpleMindMapWrap.onDataChange(renderTree => this.renderTree = renderTree);
            simpleMindMapWrap.onBackForward((index, len) => {
                this.index = index;
                this.len = len;
            });
            simpleMindMapWrap.onNodeActive((hasNode) => {
                this.hasNode = hasNode;
            });
            // 设置主题
            if (this.isDark) {
                this.setTheme('dark');
            } else {
                this.setTheme('default')
            }
        },

        save() {
            simpleMindMapWrap.save()
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        },
        saveAs() {
            simpleMindMapWrap.saveAs(this.title)
        },
        exportFile(type: ExportTypeEnum) {
            // json特殊处理
            if (type === 'json') {
                simpleMindMapWrap.saveAs(this.title);
            } else {
                simpleMindMapWrap.export(type, true, this.title, true)
            }
        },

        setTheme(theme: string) {
            simpleMindMapWrap.setTheme(theme);
        },
        setLayout(layout: string) {
            simpleMindMapWrap.setLayout(layout);
        },
        setNode(node: any) {
            simpleMindMapWrap.setNode(node);
            node.active();
        },
        addChildNode() {
            simpleMindMapWrap.addChildNode();
        },
        addBothNode() {
            simpleMindMapWrap.addBothNode();
        },
        removeNode() {
            simpleMindMapWrap.removeNode();
        },
        back() {
            simpleMindMapWrap.back();
        },
        forward() {
            simpleMindMapWrap.forward();
        },
        addLink(name: string, href: string) {
            simpleMindMapWrap.addLink(name, href);
        }
    }
});
</script>
<style lang="less">
.simple-mind-map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 32px;
        border-bottom: 1px solid var(--color-neutral-3);
        display: flex;
        justify-content: space-between;
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;

        .option {
            position: absolute;
            top: 96px;
            padding: 7px;
            display: flex;
            transition: 0.2s;

            &.show {
                right: 0px;
            }

            &.hidden {
                right: -95px;
            }

            .container {
                width: 88px;

                .arco-btn {
                    width: 88px;
                }
            }
        }

        .action {
            position: absolute;
            padding: 7px;
            transition: 0.2s;

            &.show {
                top: 5px;
            }

            &.hidden {
                top: -60px;
            }

            .op {
                .arco-btn {
                    height: 32px;
                }
            }

            .container {
                height: 50px;
            }
        }

        .node {
            position: absolute;
            bottom: 14px;
            left: 14px;
        }

        .simple-mind-map-extra {
            .container {
                text-align: center;
                background-color: var(--color-bg-2);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        }

        .arco-layout-content {
            overflow: hidden;
        }
    }
}

#simple-mind-map {
    width: 100%;
    height: 100%;
}

#simple-mind-map * {
    margin: 0;
    padding: 0;
}
</style>