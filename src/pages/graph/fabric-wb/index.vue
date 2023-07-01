<template>
    <div class="fabric-wb">
        <canvas ref="fabric-wb-container" class="container"/>
        <fabric-wb-operate v-model="activeKey"/>
        <fabric-wb-menu-file />
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import FabricWbWrap from "@/pages/graph/fabric-wb/FabricWbWrap";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";

import FabricWbOperate from './components/operate.vue';
import FabricWbMenuFile from './components/menu-file.vue'


export default defineComponent({
    name: 'fabric-wb',
    components: {FabricWbMenuFile, FabricWbOperate},
    data: () => ({
        instance: null as FabricWbWrap | null,
        activeKey: 'selection'
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width'])
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
        }
    },
    mounted() {
        const container = this.$refs['fabric-wb-container'] as HTMLCanvasElement;
        this.instance = markRaw(new FabricWbWrap(container, this.width, this.height));
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
