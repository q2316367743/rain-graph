<template>
    <div class="setting">
        <router-view />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
    name: 'setting',
    data: () => ({
    }),
});
</script>
<style scoped lang="less">
.setting {
    position: absolute;
    top: 14px;
    left: 14px;
    right: 14px;
    bottom: 14px;
    overflow: auto;
}
</style>