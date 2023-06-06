<template>
    <!-- 快捷键 -->
    <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
        <a-descriptions align="right" title="节点操作" :column="1">
            <a-descriptions-item label="插入下级节点">Tab</a-descriptions-item>
            <a-descriptions-item label="插入同级节点">Enter</a-descriptions-item>
            <a-descriptions-item label="上移节点">Ctrl + ↑</a-descriptions-item>
            <a-descriptions-item label="下移节点">Ctrl + ↓</a-descriptions-item>
            <a-descriptions-item label="保存">Ctrl + S</a-descriptions-item>
            <a-descriptions-item label="展开/收起节点">/</a-descriptions-item>
            <a-descriptions-item label="删除节点">Delete | Backspace</a-descriptions-item>
            <a-descriptions-item label="复制节点">Ctrl + C</a-descriptions-item>
            <a-descriptions-item label="剪切节点">Ctrl + X</a-descriptions-item>
            <a-descriptions-item label="粘贴节点">Ctrl + V</a-descriptions-item>
            <a-descriptions-item label="编辑节点">F2</a-descriptions-item>
            <a-descriptions-item label="文本换行">Shift + Enter</a-descriptions-item>
            <a-descriptions-item label="回退">Ctrl + Z</a-descriptions-item>
            <a-descriptions-item label="前进">Ctrl + Y</a-descriptions-item>
            <a-descriptions-item label="全选">Ctrl + A</a-descriptions-item>
            <a-descriptions-item label="多选">右键 / Ctrl + 左键</a-descriptions-item>
            <a-descriptions-item label="一键整理布局">Ctrl + L</a-descriptions-item>
        </a-descriptions>
        <a-descriptions align="right" title="画布操作" :column="1">
            <a-descriptions-item label="放大">Ctrl + +</a-descriptions-item>
            <a-descriptions-item label="缩小">Ctrl + -</a-descriptions-item>
            <a-descriptions-item label="恢复默认">Ctrl + Enter</a-descriptions-item>
        </a-descriptions>
    </a-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'simple-mind-map-more-help',
    props: {
        visible: Boolean
    },
    data: () => ({
        keyboardShortcut: false
    }),
    watch: {
        visible(newValue) {
            this.keyboardShortcut = newValue;
        },
        dialogVisible(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
});
</script>
<style scoped>

</style>