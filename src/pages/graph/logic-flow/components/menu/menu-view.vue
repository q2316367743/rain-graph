<template>
    <a-dropdown>
        <a-button>视图</a-button>
        <template #content>
            <a-doption @click="reset">重置大小</a-doption>
            <a-doption @click="plus">放大</a-doption>
            <a-doption @click="reduce">缩小</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

// 组件

export default defineComponent({
    name: 'menu-view',
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
    },
    data: () => ({
    }),
    methods: {
        reset() {
            this.lf.resetZoom();
        },
        plus() {
            this.lf.zoom(true);
        },
        reduce() {
            this.lf.zoom(false);
        },
    }
});
</script>
<style scoped lang="less">
</style>