<template>
    <a-dropdown>
        <a-button>编辑</a-button>
        <template #content>
            <a-doption @click="lf.undo()">后退</a-doption>
            <a-doption @click="lf.redo()">前进</a-doption>
            <a-doption @click="selectAll">全选</a-doption>
            <a-doption @click="unSelectAll">全不选</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'menu-edit',
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
        selectAll() {
            let nodes = this.lf.getGraphRawData().nodes as any[];
            let first = true;
            for (let node of nodes) {
                if (node.id) {
                    this.lf.selectElementById(node.id, !first);
                    first = false;
                }
            }
        },
        unSelectAll() {
            this.lf.clearSelectElements();
        },
    }
});
</script>
<style scoped lang="less">
</style>