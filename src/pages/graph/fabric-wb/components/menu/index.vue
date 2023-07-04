<template>
    <div class="fabric-wb-menu-file">
        <a-button-group type="text">
            <a-tooltip content="返回文件列表">
                <a-button @click="toHome()">
                    <template #icon>
                        <icon-left />
                    </template>
                </a-button>
            </a-tooltip>
            <a-dropdown position="bl">
                <a-button>
                    <template #icon>
                        <icon-menu/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption>保存</a-doption>
                    <a-doption>打开</a-doption>
                    <a-doption>另存为</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export default defineComponent({
    name: 'fabric-wb-menu',
    data: () => ({}),
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
