<template>
    <a-dropdown>
        <a-button>更多</a-button>
        <template #content>
            <a-doption disabled>主题</a-doption>
            <a-doption @click="keyboardShortcut = true;">快捷键</a-doption>
        </template>
        <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
            <a-descriptions align="right" title="节点操作" :column="1">
                <a-descriptions-item label="保存">Ctrl + s</a-descriptions-item>
                <a-descriptions-item label="复制">Ctrl + c</a-descriptions-item>
                <a-descriptions-item label="粘贴">Ctrl + v</a-descriptions-item>
                <a-descriptions-item label="回退">Ctrl + Z</a-descriptions-item>
                <a-descriptions-item label="删除">backspace</a-descriptions-item>
                <a-descriptions-item label="侧边栏">Ctrl + b</a-descriptions-item>
                <a-descriptions-item label="小地图">Ctrl + m</a-descriptions-item>
                <a-descriptions-item label="选中">按住Ctrl + 鼠标左键拖动</a-descriptions-item>
                <a-descriptions-item label="放大/缩小">按住Ctrl + 滚轮</a-descriptions-item>
            </a-descriptions>
        </a-drawer>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'menu-more',
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
    },
    data: () => ({
        keyboardShortcut: false,
    }),
});
</script>
<style scoped lang="less"></style>