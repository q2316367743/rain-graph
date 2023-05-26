<template>
    <div class="home">
        <div class="header">
            <a-radio-group v-model="activeKey" type="button">
                <a-radio value="1">思维导图</a-radio>
                <a-radio value="2">流程图</a-radio>
            </a-radio-group>
        </div>
        <div class="content">
            <a-list :virtual-list-props="virtualListProps" :data="items">
                <template #item="{ item, index }">
                    <a-list-item :key="index">
                        <a-link @click="jumpTo(GraphTypeEnum.MIND, item)">{{ item.name }}</a-link>
                        <template #actions>
                            <a-button-group type="text">
                                <a-button>
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                </a-button>
                                <a-popconfirm content="确定删除此图？删除后无法恢复" ok-text="删除" :ok-button-props="{ status: 'danger' }">
                                    <a-button status="danger">
                                        <template #icon>
                                            <icon-delete />
                                        </template>
                                    </a-button>
                                </a-popconfirm>
                            </a-button-group>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </div>
</template>
<script lang="ts">
import { useMindStore } from "@/store/MindStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useWindowSize } from "@vueuse/core";
import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";

export default defineComponent({
    name: 'home',
    data: () => ({
        GraphTypeEnum,
        activeKey: '1',
        size: useWindowSize()
    }),
    computed: {
        ...mapState(useMindStore, ['minds']),
        virtualListProps() {
            return {
                height: this.size.height - 33 - 32 - 14 - 7
            }
        },
        items() {
            if (this.activeKey === '1') {
                return this.minds;
            }
            return [];
        }
    },
    created() {
        useGlobalStore().setTitle('');
    },
    methods: {
        jumpTo(type: GraphTypeEnum, item: GraphRecord) {
            useGlobalStore().setTitle(item.name);
            this.$router.push(`/${type}/${item.id}`);
        }
    }
});
</script>
<style lang="less">
.home {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        height: 32px;
        text-align: center;
    }

    .content {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 7px;
    }
}
</style>