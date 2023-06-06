<template>
    <div class="simple-mind-map">
        <div class="header">
            <a-button-group type="text">
                <simple-mind-map-menu-file v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 编辑 -->
                <simple-mind-map-menu-edit v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" :index="index" :len="len"
                    :has-node="hasNode" />
                <!-- 插入 -->
                <simple-mind-map-menu-insert v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" :has-node="hasNode" />
                <!-- 导出 -->
                <simple-mind-map-menu-export @export="exportFile" />
                <!-- 更多 -->
                <simple-mind-map-menu-more :index="index" :len="len" :has-node="hasNode" :render-tree="renderTree"
                    @switch-theme="setTheme" @switch-layout="setLayout" @set-node="setNode" />
            </a-button-group>
            <div>
                <!-- 小地图 -->
                <a-button type="text" @click="miniMap = !miniMap" :status="miniMap ? 'success' : 'normal'">
                    <template #icon>
                        <icon-location />
                    </template>
                </a-button>
                <!-- 只读 -->
                <a-button type="text">
                    <template #icon>
                        <icon-lock />
                    </template>
                </a-button>
                <!-- 全屏 -->
                <a-button type="text" @click="fullscreen.toggle()" :status="fullscreen.isFullscreen ? 'success' : 'normal'">
                    <template #icon>
                        <icon-fullscreen-exit v-if="fullscreen.isFullscreen" />
                        <icon-fullscreen v-else />
                    </template>
                </a-button>
                <!-- 布局 -->
                <a-button type="text" @click="collapsed = !collapsed" :status="collapsed ? 'normal' : 'success'">
                    <template #icon>
                        <icon-layout />
                    </template>
                </a-button>
            </div>
        </div>
        <a-layout class="container">
            <a-layout-content>
                <!-- 容器 -->
                <div id="simple-mind-map"></div>
                <!-- 数量统计 -->
                <simple-mind-map-count v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 工具栏 -->
                <simple-mind-map-toolbar v-if="render" :has-node="hasNode" :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 缩放 -->
                <simple-mind-map-scale v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 小地图 -->
                <simple-mind-map-mini-map v-if="render" v-show="miniMap" :simple-mind-map-wrap="simpleMindMapWrap" />
            </a-layout-content>
            <a-layout-sider :collapsed="collapsed" :width="200" :collapsed-width="0">Sider</a-layout-sider>
        </a-layout>
        <simple-mind-map-context-menu :mind-map="simpleMindMapWrap" v-if="render" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SimpleMindMapWrap from "./SimpleMindMapWrap";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

// 组件
import SimpleMindMapMenuMore from './components/menu/menu-more.vue';
import SimpleMindMapMenuFile from './components/menu/menu-file.vue';
import SimpleMindMapMenuEdit from './components/menu/menu-edit.vue';
import SimpleMindMapMenuInsert from './components/menu/menu-insert.vue';
import SimpleMindMapMenuExport from './components/menu/menu-export.vue';
import SimpleMindMapContextMenu from './components/context-menu.vue';
import SimpleMindMapCount from './components/count.vue';
import SimpleMindMapToolbar from './components/toolbar.vue';
import SimpleMindMapScale from './components/scale.vue';
import SimpleMindMapMiniMap from './components/mini-map.vue';

import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useSimpleMindMapStore } from "@/store/graph/SimpleMindMapStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { getRecord } from "@/utils/utools/DbUtil";
import { markRaw } from "vue";
import { useFullscreen } from "@vueuse/core";


export default defineComponent({
    name: '',
    components: {
        SimpleMindMapMenuMore, SimpleMindMapMenuFile, SimpleMindMapMenuEdit, SimpleMindMapMenuInsert, SimpleMindMapMenuExport,
        SimpleMindMapContextMenu, SimpleMindMapCount, SimpleMindMapToolbar, SimpleMindMapScale, SimpleMindMapMiniMap
    },
    data: () => ({
        renderTree: undefined as any | undefined,
        index: 0,
        len: 0,
        hasNode: false,
        name: '',
        // 本身数据,
        collapsed: true,
        render: false,
        simpleMindMapWrap: markRaw(new SimpleMindMapWrap("", {})),
        fullscreen: useFullscreen(),
        miniMap: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'title', 'isDark'])
    },
    watch: {
        height() {
            this.simpleMindMapWrap.setSize(this.width, this.height);
        },
        width() {
            this.simpleMindMapWrap.setSize(this.width, this.height);
        },
        collapsed() {
            this.simpleMindMapWrap.setSize(this.width, this.height);
        }
    },
    created() {
        let id = this.$route.params.id as string;
        let record = useSimpleMindMapStore().info(id);
        this.name = record.name;
    },
    mounted() {
        let id = this.$route.params.id as string;
        let path = this.$route.query.path as string;
        getRecord(GraphTypeEnum.SIMPLE_MIND_MAP, id, path).then(value => {
            this.simpleMindMapWrap = markRaw(new SimpleMindMapWrap(
                "#simple-mind-map",
                value.config,
                value.record));
            this.simpleMindMapWrap.init(value.id, value._rev);
            this.initAfter();
        }).catch(e => {
            MessageUtil.error("初始化数据出错", e);
            this.simpleMindMapWrap = markRaw(new SimpleMindMapWrap(
                "#simple-mind-map",
                {}));
            this.simpleMindMapWrap.init("0");
            this.initAfter();
        })
    },
    methods: {
        initAfter() {
            this.render = true;
            // 事件
            this.simpleMindMapWrap.onDataChange(renderTree => this.renderTree = renderTree);
            this.simpleMindMapWrap.onBackForward((index, len) => {
                this.index = index;
                this.len = len;
            });
            this.simpleMindMapWrap.onNodeActive((hasNode) => {
                this.hasNode = hasNode;
            });
            // 设置主题
            if (this.isDark) {
                this.setTheme('dark');
            } else {
                this.setTheme('default')
            }
        },
        exportFile(type: ExportTypeEnum) {
            // json特殊处理
            if (type === 'json') {
                this.simpleMindMapWrap.saveAs(this.title);
            } else {
                this.simpleMindMapWrap.export(type, true, this.title, true)
            }
        },

        setTheme(theme: string) {
            this.simpleMindMapWrap.setTheme(theme);
        },
        setLayout(layout: string) {
            this.simpleMindMapWrap.setLayout(layout);
        },
        setNode(node: any) {
            this.simpleMindMapWrap.setNode(node);
            node.active();
        },
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