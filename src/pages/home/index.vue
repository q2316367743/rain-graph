<template>
    <div class="home">
        <div class="header">
            <a-input-search style="width: 250px;" placeholder="请输入项目名" allow-clear v-model="keyword"
                @search="search"></a-input-search>
            <a-radio-group v-model="activeKey" type="button" style="margin-left: 14px;">
                <a-radio :value="GraphTypeEnum.MIND">{{ Config.title[GraphTypeEnum.MIND].title }}</a-radio>
                <a-radio :value="GraphTypeEnum.SIMPLE_MIND_MAP">{{ Config.title[GraphTypeEnum.SIMPLE_MIND_MAP].title
                }}</a-radio>
                <a-radio :value="GraphTypeEnum.DIAGRAM">{{ Config.title[GraphTypeEnum.DIAGRAM].title }}</a-radio>
            </a-radio-group>
        </div>
        <div class="content">
            <a-list :virtual-list-props="virtualListProps" :data="showItems">
                <template #item="{ item, index }">
                    <a-list-item :key="index">
                        <a-link @click="jumpTo(item)">{{ item.name }}</a-link>
                        <template #actions>
                            <a-button-group type="text">
                                <a-button @click="updateBy(item)">
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
import { useClearEvent, useExportEvent, useSaveAsEvent, useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useDiagramStore } from "@/store/DiagramStore";
import Config from "@/global/Config";
import { useSimpleMindMapStore } from "@/store/SimpleMindMapStore";
import { useSettingStore } from "@/store/SettingStore";

export default defineComponent({
    name: 'home',
    data: () => ({
        GraphTypeEnum,
        Config,
        activeKey: GraphTypeEnum.MIND as GraphTypeEnum,
        size: useWindowSize(),
        showItems: new Array<GraphRecord>(),
        keyword: ''
    }),
    computed: {
        ...mapState(useMindStore, ['minds']),
        ...mapState(useSimpleMindMapStore, ['simpleMindMaps']),
        ...mapState(useDiagramStore, ['diagrams']),
        ...mapState(useSettingStore, ['defaultView']),
        virtualListProps() {
            return {
                height: this.size.height - 33 - 32 - 14 - 7
            }
        },
        items() {
            if (this.activeKey === GraphTypeEnum.MIND) {
                return this.minds;
            } else if (this.activeKey === GraphTypeEnum.SIMPLE_MIND_MAP) {
                return this.simpleMindMaps;
            } else if (this.activeKey === GraphTypeEnum.DIAGRAM) {
                return this.diagrams;
            }
            return [];
        }
    },
    watch: {
        items() {
            this.search();
        }
    },
    created() {
        useGlobalStore().setTitle(' ');
        useGlobalStore().setType(undefined);
        let name = this.$route.query.name as GraphTypeEnum;
        if (name) {
            this.activeKey = name;
        } else {
            this.activeKey = this.defaultView;
        }
        // 清空事件
        useSaveEvent.reset();
        useSaveAsEvent.reset();
        useUndoEvent.reset();
        useClearEvent.reset();
        useExportEvent.reset();
        this.search();
    },
    methods: {
        search() {
            this.showItems = this.items.filter(e => e.name.indexOf(this.keyword) > -1)
        },
        jumpTo(item: GraphRecord) {
            useGlobalStore().setTitle(item.name);
            useGlobalStore().setType(this.activeKey);
            this.$router.push(`/graph/${this.activeKey}/${item.id}`);
        },
        updateBy(item: GraphRecord) {
            if (this.activeKey === GraphTypeEnum.MIND) {
                useMindStore().update(item);
            } else if (this.activeKey === GraphTypeEnum.SIMPLE_MIND_MAP) {
                useSimpleMindMapStore().update(item);
            } else if (this.activeKey === GraphTypeEnum.DIAGRAM) {
                useDiagramStore().update(item);
            }
            this.search();
        },
        remove(item: GraphRecord) {
            if (this.activeKey === GraphTypeEnum.MIND) {
                useMindStore().remove(item);
            } else if (this.activeKey === GraphTypeEnum.SIMPLE_MIND_MAP) {
                useSimpleMindMapStore().remove(item);
            } else if (this.activeKey === GraphTypeEnum.DIAGRAM) {
                useDiagramStore().remove(item);
            }
            this.search();
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
        display: flex;
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