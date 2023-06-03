<template>
    <a-dropdown trigger="click">
        <a-button>编辑</a-button>
        <template #content>
            <a-doption :disabled="index === 0" @click="$emit('back')">后退</a-doption>
            <a-doption :disabled="index === len - 1" @click="$emit('forward')">前进</a-doption>
            <a-doption :disabled="!hasNode" @click="$emit('add-node')">插入同级节点</a-doption>
            <a-doption :disabled="!hasNode" @click="$emit('add-child-node')">插入子节点</a-doption>
            <a-doption :disabled="!hasNode" @click="$emit('remove-node')">删除节点</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'menu-edit',
    emits: ['add-child-node', 'add-node', 'remove-node', 'back', 'forward'],
    props: {
        index: {
            type: Number,
            required: false,
            default: 0
        },
        len: {
            type: Number,
            required: false,
            default: 0
        },
        hasNode: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: () => ({

    }),
});
</script>
<style scoped></style>