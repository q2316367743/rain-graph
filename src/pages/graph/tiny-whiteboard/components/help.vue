<template>
    <a-descriptions align="right" :column="1">
        <a-descriptions-item label="移动画布">按住空格键</a-descriptions-item>
        <a-descriptions-item label="全部选中">Ctrl + a</a-descriptions-item>
        <a-descriptions-item label="删除">Del或Backspace</a-descriptions-item>
        <a-descriptions-item label="复制">Ctrl + c</a-descriptions-item>
        <a-descriptions-item label="粘贴">Ctrl + v</a-descriptions-item>
        <a-descriptions-item label="放大">Ctrl + +</a-descriptions-item>
        <a-descriptions-item label="缩小">Ctrl + -</a-descriptions-item>
        <a-descriptions-item label="重置缩放">Ctrl + 0</a-descriptions-item>
        <a-descriptions-item label="缩放以适应所有元素">Shift + 1</a-descriptions-item>
        <a-descriptions-item label="撤销">Ctrl + z</a-descriptions-item>
        <a-descriptions-item label="重置">Ctrl + y</a-descriptions-item>
        <a-descriptions-item label="显示隐藏网格">Ctrl + Ctrl + z</a-descriptions-item>
    </a-descriptions>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'white-board-help',
    data: () => ({

    }),
});
</script>
<style scoped></style>