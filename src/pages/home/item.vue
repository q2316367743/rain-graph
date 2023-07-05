<template>
    <a-list-item :key="index">
        <a-list-item-meta>
            <template #title>
                <a-link @click="$emit('jump-to', item)">{{ item.name }}</a-link>
            </template>
            <template #description>
                <a-tag color="arcoblue">{{ Config.subTitle(activeKey, item.type) }}</a-tag>
            </template>
        </a-list-item-meta>
        <template #actions>
            <a-button-group type="text">
                <a-button @click="$emit('update-by', item)">
                    <template #icon>
                        <icon-edit/>
                    </template>
                </a-button>
                <a-popconfirm content="确定删除此图？删除后无法恢复" ok-text="删除"
                              :ok-button-props="{ status: 'danger' }"
                              @ok="$emit('remove', item)">
                    <a-button status="danger">
                        <template #icon>
                            <icon-delete/>
                        </template>
                    </a-button>
                </a-popconfirm>
            </a-button-group>
        </template>
    </a-list-item>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import Config from "@/global/Config";

export default defineComponent({
    name: 'home-item',
    props: {
        index: {
            type: Number,
            required: true
        },
        item: {
            type: Object as PropType<any>,
            required: true
        },
        activeKey: {
            type: String,
            required: true
        }
    },
    emits: ['jump-to', 'update-by', 'remove'],
    data: () => ({
        Config
    })
});
</script>
<style scoped>

</style>
