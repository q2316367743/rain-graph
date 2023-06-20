<template>
    <div class="fabric">
        <fabric-menu class="header" v-if="render" :instance="instance" v-model:collapsed="collapsed"/>
        <div class="container">
            <a-layout>
                <a-layout-sider :collapsed="collapsed" :width="collapsedWidth" :collapsed-width="0">
                    <fabric-side v-if="render" :instance="instance" :collapsed-width="collapsedWidth"/>
                </a-layout-sider>
                <a-layout-content class="fabric-canvas-wrap">
                    <canvas ref="fabric-canvas"></canvas>
                </a-layout-content>
            </a-layout>
        </div>
        <fabric-context-menu v-if="render" :instance="instance"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import FabricWrap from "@/pages/image/fabric/FabricWrap";

// 组件
import FabricSide from './components/side.vue';
import FabricMenu from './components/menu/index.vue';
import FabricContextMenu from './components/context-menu/index.vue';

export default defineComponent({
    name: 'fabric',
    components: {FabricMenu, FabricSide, FabricContextMenu},
    data: () => ({
        option: {},
        collapsed: false,
        instance: new FabricWrap(),
        render: false,
        collapsedWidth: 280
    }),
    computed: {
        ...mapState(useGlobalStore, ['width', "height", "isDark"]),
        canvasWidth() {
            return this.width - (this.collapsed ? 0 : this.collapsedWidth) - 50
        }
    },
    mounted() {
        this.instance = new FabricWrap(
            this.isDark,
            this.$refs["fabric-canvas"] as HTMLCanvasElement,
            this.option
        );
        this.render = true;
    },
    beforeUnmount() {
        this.instance.destroy();
    }
});
</script>
<style lang="less">
.fabric {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 33px;
        left: 2px;
        right: 0;
        bottom: 0;

        .fabric-canvas-wrap {
            display: flex;
            justify-content: center;
            background-color: var(--color-neutral-3);
        }
    }
}
</style>