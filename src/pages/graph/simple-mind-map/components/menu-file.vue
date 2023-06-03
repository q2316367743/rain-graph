<template>
    <a-dropdown>
        <a-button>文件</a-button>
        <template #content>
            <a-doption @click="toHome">返回列表</a-doption>
            <a-doption disabled>新建</a-doption>
            <a-doption disabled>打开</a-doption>
            <a-doption @click="$emit('save')">保存</a-doption>
            <a-doption @click="$emit('save-as')">另存为</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'menu-file',
    emits: ['save', 'save-as'],
    data: () => ({

    }),
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.SIMPLE_MIND_MAP
                }
            })
        },
    }
});
</script>
<style scoped></style>