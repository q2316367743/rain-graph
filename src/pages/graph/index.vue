<template>
    <div class="graph">
        <router-view />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'graph',
    data: () => ({

    }),
});
</script>
<style scoped>
.graph {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>