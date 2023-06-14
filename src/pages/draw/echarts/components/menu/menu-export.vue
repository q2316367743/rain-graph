<template>
    <a-dropdown>
        <a-button>导出</a-button>
        <template #content>
            <a-doption @click="exportForJson">JSON</a-doption>
            <a-doption @click="exportForPng">PNG</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'echarts-menu-export',
    emits: ['json', 'png'],
    data: () => ({

    }),
    methods: {
        exportForJson() {
            this.$emit('json');
        },
        exportForPng() {
            this.$emit('png');
        }
    }
});
</script>
<style scoped></style>