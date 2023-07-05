<template>
    <div class="fabric-wb">
        <canvas ref="fabric-wb-container" class="container"/>
        <fabric-wb-operate v-model="activeKey" @clear="clear()" @append-image="appendImage()"/>
        <fabric-wb-menu/>
        <fabric-wb-context-menu :instance="instance" v-if="instance"/>
    </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {defineComponent, markRaw} from "vue";
import {useFileSystemAccess} from "@vueuse/core";
import FabricWbWrap from "@/pages/graph/fabric-wb/core/FabricWbWrap";

import {useGlobalStore} from "@/store/GlobalStore";

import FabricWbOperate from './components/operate/index.vue';
import FabricWbMenu from './components/menu/index.vue'
import {getDefaultOption} from "@/pages/graph/fabric-wb/core/constants";
import FabricWbContextMenu from "@/pages/graph/fabric-wb/components/context-menu/index.vue";


export default defineComponent({
    name: 'fabric-wb',
    components: {FabricWbContextMenu, FabricWbMenu, FabricWbOperate},
    data: () => ({
        instance: null as FabricWbWrap | null,
        activeKey: 'selection',
        fileSystem: useFileSystemAccess({
            dataType: 'Blob',
            types: [{
                description: '图片',
                accept: {
                    'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                },
            }]
        }),
        option: getDefaultOption()
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', "isDark"])
    },
    watch: {
        width(newValue) {
            if (this.instance) {
                this.instance.setWidth(newValue);
            }
        },
        height(newValue) {
            if (this.instance) {
                this.instance.setHeight(newValue);
            }
        },
        activeKey(newValue) {
            if (!this.instance) {
                return;
            }
            this.instance.setMode(newValue);
        },
        option: {
            handler(newValue) {
                if (this.instance) {
                    this.instance.setOptions(newValue);
                }
            }
        }
    },
    mounted() {
        const container = this.$refs['fabric-wb-container'] as HTMLCanvasElement;
        this.option.stroke = this.isDark ? '#ffffff' : '#000000';
        this.instance = markRaw(new FabricWbWrap(container, this.width, this.height, this.option));
        this.instance.setMode("selection");
    },
    methods: {
        clear() {
            if (!this.instance) {
                return;
            }
            this.instance.clear();
        },
        appendImage() {
            if (!this.instance) {
                return;
            }
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                if (!this.instance) {
                    return;
                }
                const body = this.fileSystem.file as Blob;
                this.instance.getNode().appendImage(window.URL.createObjectURL(body));
            })
        }
    }
});
</script>
<style lang="less">
.fabric-wb {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .canvas-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }


}
</style>
