<template>
    <div class="diagram-menu">
        <a-button-group type="text">
            <!-- 文件 -->
            <menu-file :lf="lf" :config="config" @save="$emit('save')" />
            <!-- 编辑 -->
            <menu-edit :lf="lf" />
            <a-dropdown>
                <a-button>查看</a-button>
                <template #content>
                    <a-doption @click="$emit('update-readonly')">
                        <template #icon><icon-check :style="{ visibility: readonly ? 'visible' : 'hidden' }" /></template>
                        只读
                    </a-doption>
                    <a-doption @click="panel = !panel">
                        <template #icon><icon-check :style="{ visibility: panel ? 'visible' : 'hidden' }" /></template>
                        面板
                    </a-doption>
                    <a-doption @click="showMiniMap">
                        <template #icon><icon-check
                                :style="{ visibility: display.miniMap ? 'visible' : 'hidden' }" /></template>
                        小地图
                    </a-doption>
                </template>
            </a-dropdown>
            <!-- 视图 -->
            <menu-view :lf="lf"/>
            <!-- 导出 -->
            <menu-export :lf="lf" :config="config"/>
            <!-- 更多 -->
            <menu-more :lf="lf"/>
            <!-- 模板 -->
            <menu-template :lf="lf" />
        </a-button-group>
        <div type="text">
            <!-- 锁定 -->
            <a-button type="text" @click="$emit('update-readonly')" :status="readonly ? 'warning' : 'normal'">
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
            <!-- 面板 -->
            <a-button type="text" @click="panel = !panel" :status="panel ? 'success' : 'normal'">
                <template #icon>
                    <icon-layout />
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFullscreen } from "@vueuse/core";
import { useGlobalStore } from "@/store/GlobalStore";
import { useMapEvent } from "@/global/BeanFactory";

// 组件
import MenuFile from "./menu-file.vue";
import MenuEdit from "./menu-edit.vue";
import MenuMore from "./menu-more.vue";
import MenuView from "./menu-view.vue";
import MenuTemplate from "./menu-template.vue";
import MenuExport from "./menu-export.vue";

export default defineComponent({
    name: 'diagram-menu',
    components: { MenuTemplate, MenuFile, MenuEdit, MenuMore, MenuView, MenuExport },
    emits: ['update:panel-show', 'new', 'open', 'save', 'show-mini-map', 'update-readonly'],
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
        config: {
            type: Object,
            required: false,
            default: {}
        },
        collapsed: Boolean,
        panelShow: Boolean,
        readonly: Boolean
    },
    data: () => ({
        fullscreen: useFullscreen(),
        panel: true,
        // 显示设置
        display: {
            miniMap: false
        },
    }),
    computed: {
        ...mapState(useGlobalStore, ['size']),
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
        panel(newValue) {
            this.$emit('update:panel-show', newValue)
        },
    },
    created() {
        useMapEvent.on(() => this.showMiniMap());
        this.display.miniMap = this.lf.extension.miniMap.isShow;
    },
    methods: {
        showMiniMap() {
            try {
                if (this.lf.extension.miniMap.isShow) {
                    this.lf.extension.miniMap.hide();
                } else {
                    this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
                }
                this.display.miniMap = this.lf.extension.miniMap.isShow;
            } catch (_) {
            }
        },
    }
});
</script>
<style scoped lang="less">
.diagram-menu {
    display: flex;
    justify-content: space-between;

}
</style>