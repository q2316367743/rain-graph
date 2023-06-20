<template>
    <a-dropdown>
        <a-button>更多</a-button>
        <template #content>
            <a-doption @click="backgroundDrawer = true">画布设置</a-doption>
        </template>
        <more-background v-model:visible="backgroundDrawer" :instance="instance"/>
    </a-dropdown>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import FabricWrap from "@/pages/image/fabric/FabricWrap";

import MoreBackground from "./more-background.vue";

export default defineComponent({
    name: 'menu-more',
    components: {MoreBackground},
    props: {
        instance: {
            type: FabricWrap,
            required: false,
            default: new FabricWrap()
        },
    },
    data: () => ({
        backgroundDrawer: false,
    })
});
</script>
<style scoped>

</style>