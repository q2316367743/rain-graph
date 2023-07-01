<template>
    <div class="fabric-wb-menu-file">
        <a-dropdown position="bl">
            <a-button type="text">
                <template #icon>
                    <icon-menu />
                </template>
            </a-button>
            <template #content>
                <a-doption @click="toHome()">返回列表</a-doption>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export default defineComponent({
    name: 'fabric-wb-menu-file',
    data: () => ({

    }),
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.WHITE_BOARD
                }
            })
        }
    }
});
</script>
<style scoped lang="less">
.fabric-wb-menu-file {
    position: absolute;
    top: 7px;
    left: 14px;
    background-color: var(--color-neutral-2);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-neutral-3);
}
</style>
