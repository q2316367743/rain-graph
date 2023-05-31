<template>
    <div class="simple-mind-map-action">
        <a-button-group type="text" size="mini" class="container">
            <a-button :disabled="index === 0" @click="$emit('back')">
                <div class="icon">
                    <icon-undo />
                </div>
                <div class="name">后退</div>
            </a-button>
            <a-button :disabled="index === len - 1" @click="$emit('forward')">
                <div class="icon">
                    <icon-redo />
                </div>
                <div class="name">前进</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="$emit('add-node')">
                <div class="icon">
                    <icon-unordered-list />
                </div>
                <div class="name">插入同级节点</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="$emit('add-child-node')">
                <div class="icon">
                    <icon-mind-mapping />
                </div>
                <div class="name">插入子节点</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="$emit('remove-node')">
                <div class="icon">
                    <icon-delete />
                </div>
                <div class="name">删除节点</div>
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'simple-mind-map-action',
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
    emits: ['add-child-node', 'add-node', 'remove-node', 'back', 'forward'],
    data: () => ({
    }),
    methods: {
    }
});
</script>
<style scoped lang="less">
.simple-mind-map-action {
    .arco-btn {
        flex-direction: column;
        height: 50px;
    }

    .op {
        text-align: center;
        align-items: center;
    }
}
</style>