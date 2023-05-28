<template>
    <div class="home">
        <div class="header">
            <a-radio-group v-model="activeKey" type="button">
                <a-radio :value="GraphTypeEnum.MIND">思维导图</a-radio>
                <a-radio :value="GraphTypeEnum.ATRAMENT">手绘图</a-radio>
                <a-radio :value="GraphTypeEnum.BPMN">BPMN</a-radio>
                <a-radio :value="GraphTypeEnum.DIAGRAM">简图</a-radio>
            </a-radio-group>
        </div>
        <div class="content">
            <a-list :virtual-list-props="virtualListProps" :data="items">
                <template #item="{ item, index }">
                    <a-list-item :key="index">
                        <a-link @click="jumpTo(item)">{{ item.name }}</a-link>
                        <template #actions>
                            <a-button-group type="text">
                                <a-button>
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                </a-button>
                                <a-popconfirm content="确定删除此图？删除后无法恢复" ok-text="删除" :ok-button-props="{ status: 'danger' }"
                                    @ok="remove(item)">
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
import { useAtramentStore } from "@/store/AtramentStore";
import { useBpmnStore } from "@/store/BpmnStore";
import { useClearEvent, useExportEvent, useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useDiagramStore } from "@/store/DiagramStore";

export default defineComponent({
    name: 'home',
    data: () => ({
        GraphTypeEnum,
        activeKey: GraphTypeEnum.MIND as GraphTypeEnum,
        size: useWindowSize()
    }),
    computed: {
        ...mapState(useMindStore, ['minds']),
        ...mapState(useAtramentStore, ['atraments']),
        ...mapState(useBpmnStore, ['bpmns']),
        ...mapState(useDiagramStore, ['diagrams']),
        virtualListProps() {
            return {
                height: this.size.height - 33 - 32 - 14 - 7
            }
        },
        items() {
            if (this.activeKey === GraphTypeEnum.MIND) {
                return this.minds;
            } else if (this.activeKey === GraphTypeEnum.ATRAMENT) {
                return this.atraments;
            } else if (this.activeKey === GraphTypeEnum.BPMN) {
                return this.bpmns;
            } else if (this.activeKey === GraphTypeEnum.DIAGRAM) {
                return this.diagrams;
            }
            return [];
        }
    },
    created() {
        useGlobalStore().setTitle(' ');
        useGlobalStore().setType(undefined);
        let name = this.$route.query.name as GraphTypeEnum;
        if (name) {
            this.activeKey = name;
        }
        // 清空事件
        useSaveEvent.reset();
        useUndoEvent.reset();
        useClearEvent.reset();
        useExportEvent.reset();
    },
    methods: {
        jumpTo(item: GraphRecord) {
            useGlobalStore().setTitle(item.name);
            this.$router.push(`/${this.activeKey}/${item.id}`);
            useGlobalStore().setType(this.activeKey);
        },
        remove(item: GraphRecord) {
            if (this.activeKey === GraphTypeEnum.MIND) {
                useMindStore().remove(item);
            } else if (this.activeKey === GraphTypeEnum.ATRAMENT) {
                useAtramentStore().remove(item);
            } else if (this.activeKey === GraphTypeEnum.BPMN) {
                useBpmnStore().remove(item);
            } else if (this.activeKey === GraphTypeEnum.DIAGRAM) {
                useDiagramStore().remove(item);
            }
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