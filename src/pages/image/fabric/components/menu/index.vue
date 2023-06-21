<template>
    <div class="fabric-menu">
        <a-button-group type="text">
            <menu-file :instance="instance"/>
            <menu-more :instance="instance"/>
        </a-button-group>
        <a-button-group type="text">
            <a-button :status="side ? 'normal' : 'success'" @click="side =!side">
                <template #icon>
                    <icon-layout/>
                </template>
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import FabricWrap from "@/pages/image/fabric/FabricWrap";

import MenuFile from './menu-file.vue';
import MenuMore from './menu-more/index.vue';

export default defineComponent({
    name: 'fabric-menu',
    emits: ['update:collapsed'],
    components: {MenuFile, MenuMore},
    props: {
        instance: {
            type: Object,
            required: false,
            default: new FabricWrap()
        },
        collapsed: Boolean
    },
    data: () => ({
        side: false
    }),
    watch: {
        collapsed(newValue) {
            this.side = newValue;
        },
        side(newValue) {
            this.$emit('update:collapsed', newValue);
        }
    }
});
</script>
<style lang="less" scoped>
.fabric-menu {
    display: flex;
    justify-content: space-between;
}
</style>