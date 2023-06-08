<template>
    <div class="simple-mind-map">
        <!-- 顶部工具栏 -->
        <div class="header">
            <a-button-group type="text">
                <simple-mind-map-menu-file v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 编辑 -->
                <simple-mind-map-menu-edit v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" :index="index" :len="len"
                    :has-node="hasNode" />
                <!-- 插入 -->
                <simple-mind-map-menu-insert v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" :has-node="hasNode" />
                <!-- 更多 -->
                <simple-mind-map-menu-more v-if="render" :simple-mind-map-wrap="simpleMindMapWrap" :index="index" :len="len"
                    :has-node="hasNode" @switch-theme="setTheme" @switch-layout="setLayout" />
            </a-button-group>
            <div>
                <!-- 小地图 -->
                <a-button type="text" @click="miniMap = !miniMap" :status="miniMap ? 'success' : 'normal'">
                    <template #icon>
                        <icon-location />
                    </template>
                </a-button>
                <!-- 只读 -->
                <a-button type="text" disabled>
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
                <a-button type="text" disabled @click="collapsed = !collapsed" :status="collapsed ? 'normal' : 'success'">
                    <template #icon>
                        <icon-layout />
                    </template>
                </a-button>
            </div>
        </div>
        <!-- 内容 -->
        <a-layout class="container">
            <a-layout-content>
                <!-- 容器 -->
                <div id="simple-mind-map"></div>
                <!-- 大纲 -->
                <simple-mind-map-toc v-if="render && display === 'toc'" :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 思维导图/大纲切换 -->
                <a-radio-group v-model="display" type="button" class="simple-mind-map-display">
                    <a-radio value="mind"><icon-mind-mapping /></a-radio>
                    <a-radio value="toc"><icon-unordered-list /></a-radio>
                </a-radio-group>
                <!-- 数量统计 -->
                <simple-mind-map-count v-if="render" v-show="display === 'mind'"
                    :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 工具栏 -->
                <simple-mind-map-toolbar v-if="render" v-show="display === 'mind'" :has-node="hasNode"
                    :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 缩放 -->
                <simple-mind-map-scale v-if="render" v-show="display === 'mind'"
                    :simple-mind-map-wrap="simpleMindMapWrap" />
                <!-- 小地图 -->
                <simple-mind-map-mini-map v-if="render" v-show="display === 'mind' && miniMap"
                    :simple-mind-map-wrap="simpleMindMapWrap" />
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
import SimpleMindMapContextMenu from './components/context-menu.vue';
import SimpleMindMapCount from './components/count.vue';
import SimpleMindMapToolbar from './components/toolbar.vue';
import SimpleMindMapScale from './components/scale.vue';
import SimpleMindMapMiniMap from './components/mini-map.vue';
import SimpleMindMapToc from './components/toc.vue';

import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useSimpleMindMapStore } from "@/store/graph/SimpleMindMapStore";
import { getRecord } from "@/utils/utools/DbUtil";
import { markRaw } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useSimpleMindMapSettingStore } from "@/store/SimpleMindMapSetting";


export default defineComponent({
    name: '',
    components: {
        SimpleMindMapMenuMore, SimpleMindMapMenuFile, SimpleMindMapMenuEdit, SimpleMindMapMenuInsert, SimpleMindMapToc,
        SimpleMindMapContextMenu, SimpleMindMapCount, SimpleMindMapToolbar, SimpleMindMapScale, SimpleMindMapMiniMap
    },
    data: () => ({
        index: 0,
        len: 0,
        hasNode: false,
        name: '',
        // 本身数据,
        collapsed: true,
        render: false,
        simpleMindMapWrap: markRaw(new SimpleMindMapWrap("", {})),
        fullscreen: useFullscreen(),
        miniMap: false,
        display: 'mind' as 'mind' | 'toc'
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'title', 'isDark']),
        ...mapState(useSimpleMindMapSettingStore, {
            displaySource: 'display'
        })
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
        },
        display(newValue: 'mind' | 'toc') {
        }
    },
    created() {
        let id = this.$route.params.id as string;
        let record = useSimpleMindMapStore().info(id);
        this.name = record.name;
        this.display = this.displaySource;
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
        setTheme(theme: string) {
            this.simpleMindMapWrap.setTheme(theme);
        },
        setLayout(layout: string) {
            this.simpleMindMapWrap.setLayout(layout);
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
        overflow: hidden;


        .simple-mind-map-display {
            position: absolute;
            top: 7px;
            left: 14px;
            z-index: 30002;
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