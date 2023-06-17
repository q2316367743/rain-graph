<template>
    <a-dropdown>
        <a-button>编辑</a-button>
        <template #content>
            <a-doption @click="openJsonDialog">JSON</a-doption>
            <a-doption @click="openExcelDialog">可视化</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'echarts-menu-edit',
    emits: ['json', 'excel'],
    data: () => ({

    }),
    methods: {
        openJsonDialog() {
            this.$emit('json');
        },
        openExcelDialog() {
            this.$emit('excel');
        }
    }
});
</script>
<style scoped></style>