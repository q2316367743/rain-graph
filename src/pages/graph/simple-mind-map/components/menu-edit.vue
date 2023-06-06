<template>
    <a-dropdown trigger="click">
        <a-button>编辑</a-button>
        <template #content>
            <a-doption :disabled="index === 0" @click="back">后退</a-doption>
            <a-doption :disabled="index === len - 1" @click="forward">前进</a-doption>
            <a-doption :disabled="!hasNode" @click="addBothNode">插入同级节点</a-doption>
            <a-doption :disabled="!hasNode" @click="addChildNode">插入子节点</a-doption>
            <a-doption :disabled="!hasNode" @click="removeNode">删除节点</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";
import { useUndoEvent } from "@/global/BeanFactory";

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
        },
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({

    }),
    created() {
        useUndoEvent.on(() => this.back());
    },
    methods: {
        addChildNode() {
            this.simpleMindMapWrap.addChildNode();
        },
        addBothNode() {
            this.simpleMindMapWrap.addBothNode();
        },
        removeNode() {
            this.simpleMindMapWrap.removeNode();
        },
        back() {
            this.simpleMindMapWrap.back();
        },
        forward() {
            this.simpleMindMapWrap.forward();
        },
    }
});
</script>
<style scoped></style>