<template>
    <div class="diagram-menu">
        <a-button-group type="text">
            <a-dropdown>
                <a-button>文件</a-button>
                <template #content>
                    <a-doption @click="toHome">返回文件列表</a-doption>
                    <a-doption @click="$emit('new')" disabled>新建</a-doption>
                    <a-doption @click="$emit('open')" disabled>打开</a-doption>
                    <a-doption @click="$emit('save')">保存</a-doption>
                    <a-doption @click="saveAs">另存为</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button disabled>编辑</a-button>
                <template #content>
                    <a-doption @click="lf.undo()">后退</a-doption>
                    <a-doption @click="lf.redo()">前进</a-doption>
                    <a-doption>剪切</a-doption>
                    <a-doption>复制</a-doption>
                    <a-doption>复制为图像</a-doption>
                    <a-doption>粘贴</a-doption>
                    <a-doption>删除</a-doption>
                    <a-doption>复制并粘贴</a-doption>
                    <a-doption>全选</a-doption>
                    <a-doption>全不选</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>导出</a-button>
                <template #content>
                    <a-doption @click="onExport(ExportTypeEnum.JSON)">JSON</a-doption>
                    <a-doption @click="onExport(ExportTypeEnum.XML)">XML</a-doption>
                    <a-doption @click="onExport(ExportTypeEnum.PNG)">PNG</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>更多</a-button>
                <template #content>
                    <a-doption>设置</a-doption>
                    <a-doption @click="keyboardShortcut = true;">快捷键</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
        <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
            <a-descriptions align="right" title="节点操作" :column="1">
                <a-descriptions-item label="保存">Ctrl + s</a-descriptions-item>
                <a-descriptions-item label="回退">Ctrl + Z</a-descriptions-item>
                <a-descriptions-item label="侧边栏">Ctrl + b</a-descriptions-item>
                <a-descriptions-item label="小地图">Ctrl + m</a-descriptions-item>
                <a-descriptions-item label="选中">按住Ctrl + 鼠标左键拖动</a-descriptions-item>
                <a-descriptions-item label="放大/缩小">按住Ctrl + 滚轮</a-descriptions-item>
            </a-descriptions>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { defineComponent, toRaw } from "vue";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";

export default defineComponent({
    name: 'diagram-menu',
    emits: ['new', 'open', 'save', 'save-as', 'export'],
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
        }
    },
    data: () => ({
        ExportTypeEnum,
        keyboardShortcut: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['title']),
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.DIAGRAM
                }
            })
        },
        onExport(type: ExportTypeEnum) {
            if (type === ExportTypeEnum.PNG) {
                this.lf.extension.snapshot.lf.getSnapshot(this.title + '.png');
            } else if (type === ExportTypeEnum.XML) {
                const data = this.lf.getGraphData() as string;
                BrowserUtil.download(data, this.title + '.xml', 'text/xml');
            }
        },
        saveAs() {
            BrowserUtil.download(JSON.stringify({
                config: toRaw(this.config),
                record: this.lf.getGraphRawData()
            }), this.title + '.json', 'text/json');
        },
    }
});
</script>
<style scoped></style>