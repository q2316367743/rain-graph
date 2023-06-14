<template>
    <a-dropdown>
        <a-button>操作</a-button>
        <template #content>
            <a-doption @click="$emit('refresh')">刷新</a-doption>
            <a-doption @click="$emit('setting')">设置</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'echarts-menu-operation',
    emits: ['refresh', 'setting'],
    data: () => ({
    
    }),
});
</script>
<style scoped>

</style>