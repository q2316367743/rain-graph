<template>
    <a-dropdown trigger="click" @select="(e) => $emit('export', e)">
        <a-button>
            导出
        </a-button>
        <template #content>
            <a-doption :value="ExportTypeEnum.JSON">JSON</a-doption>
            <a-doption :value="ExportTypeEnum.SVG">SVG</a-doption>
            <a-doption :value="ExportTypeEnum.PNG">PNG</a-doption>
            <a-doption :value="ExportTypeEnum.PDF">PDF</a-doption>
            <a-doption :value="ExportTypeEnum.MD">Markdown</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'menu-export',
    emits: ['export'],
    data: () => ({
        ExportTypeEnum,

    }),
});
</script>
<style scoped></style>