<template>
    <a-dropdown>
        <a-button>导出</a-button>
        <template #content>
            <a-doption @click="onExport(ExportTypeEnum.JSON)">JSON</a-doption>
            <a-doption @click="onExport(ExportTypeEnum.XML)">XML</a-doption>
            <a-doption @click="onExport(ExportTypeEnum.PNG)">PNG</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { mapState } from "pinia";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { download } from "@/utils/BrowserUtil";
import { useGlobalStore } from "@/store/GlobalStore";

// 组件

export default defineComponent({
    name: 'menu-export',
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
    },
    data: () => ({
        ExportTypeEnum
    }),
    computed: {
        ...mapState(useGlobalStore, ['title']),
    },
    methods: {
        onExport(type: ExportTypeEnum) {
            if (type === ExportTypeEnum.JSON) {
                download(JSON.stringify({
                    config: toRaw(this.config),
                    record: this.lf.getGraphRawData()
                }), this.title + '.json', 'text/json');
            } else if (type === ExportTypeEnum.PNG) {
                this.lf.extension.snapshot.lf.getSnapshot(this.title + '.png');
            } else if (type === ExportTypeEnum.XML) {
                const data = this.lf.getGraphData() as string;
                download(data, this.title + '.xml', 'text/xml');
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