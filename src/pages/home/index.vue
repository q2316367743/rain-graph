<template>
    <div class="home">
        <div class="header">
            <div>
                <a-radio-group v-model="activeKey" type="button">
                    <a-radio :value="GraphTypeEnum.MIND" v-if="showViews.includes(GraphTypeEnum.MIND)">{{
                        Config.title[GraphTypeEnum.MIND].title }}</a-radio>
                    <a-radio :value="GraphTypeEnum.SIMPLE_MIND_MAP"
                        v-if="showViews.includes(GraphTypeEnum.SIMPLE_MIND_MAP)">{{
                            Config.title[GraphTypeEnum.SIMPLE_MIND_MAP].title
                        }}</a-radio>
                    <a-radio :value="GraphTypeEnum.DIAGRAM" v-if="showViews.includes(GraphTypeEnum.DIAGRAM)">{{
                        Config.title[GraphTypeEnum.DIAGRAM].title }}</a-radio>
                    <a-radio :value="GraphTypeEnum.WHITE_BOARD" v-if="showViews.includes(GraphTypeEnum.WHITE_BOARD)">{{
                        Config.title[GraphTypeEnum.WHITE_BOARD].title
                    }}</a-radio>
                </a-radio-group>
                <a-input-search style="width: 150px;margin-left: 14px;" placeholder="请输入项目名" allow-clear v-model="keyword"
                    @search="search"></a-input-search>
            </div>
            <a-switch :default-checked="!isDark" type="round" style="margin: 4px;width: 58px;" @change="switchDarkColors">
                <template #checked>白天</template>
                <template #unchecked>黑夜</template>
            </a-switch>
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
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { useWindowSize } from "@vueuse/core";
import Config from "@/global/Config";
import { useMapEvent, useSaveEvent, useSideEvent, useUndoEvent } from "@/global/BeanFactory";
import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { useSettingStore } from "@/store/setting/SettingStore";
import { useMindStore } from "@/store/graph/MindStore";
import { useDiagramStore } from "@/store/graph/DiagramStore";
import { useWhiteBoardStore } from "@/store/graph/WhiteBoardStore";
import { useSimpleMindMapStore } from "@/store/graph/SimpleMindMapStore";

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
        ...mapState(useGlobalStore, ['isDark']),
        ...mapState(useSettingStore, ['defaultView', 'showViews']),
        ...mapState(useMindStore, ['minds']),
        ...mapState(useDiagramStore, ['diagrams']),
        ...mapState(useWhiteBoardStore, ['whiteBoards']),
        ...mapState(useSimpleMindMapStore, ['simpleMindMaps']),
        virtualListProps() {
            return {
                height: this.size.height - 33 - 14 - 7
            }
        },
        items() {
            if (this.activeKey === GraphTypeEnum.MIND) {
                return this.minds;
            } else if (this.activeKey === GraphTypeEnum.SIMPLE_MIND_MAP) {
                return this.simpleMindMaps;
            } else if (this.activeKey === GraphTypeEnum.DIAGRAM) {
                return this.diagrams;
            } else if (this.activeKey === GraphTypeEnum.WHITE_BOARD) {
                return this.whiteBoards;
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
        useUndoEvent.reset();
        useSideEvent.reset();
        useMapEvent.reset();
        this.search();
    },
    methods: {
        ...mapActions(useGlobalStore, ['switchDarkColors']),
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
            } else if (this.activeKey === GraphTypeEnum.WHITE_BOARD) {
                useWhiteBoardStore().update(item);
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
            } else if (this.activeKey === GraphTypeEnum.WHITE_BOARD) {
                useWhiteBoardStore().remove(item);
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
        justify-content: space-between;
        overflow: hidden;
    }

    .content {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 7px;
    }
}</style>