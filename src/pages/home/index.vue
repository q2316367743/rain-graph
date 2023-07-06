<template>
    <div class="home">
        <div class="header">
            <div>
                <a-radio-group v-model="activeKey" type="button">
                    <a-radio :value="GraphTypeEnum.MIND_MAP" v-if="showViews.includes(GraphTypeEnum.MIND_MAP)">
                        {{ Config.title[GraphTypeEnum.MIND_MAP].title }}
                    </a-radio>
                    <a-radio :value="GraphTypeEnum.DIAGRAM" v-if="showViews.includes(GraphTypeEnum.DIAGRAM)">
                        {{ Config.title[GraphTypeEnum.DIAGRAM].title }}
                    </a-radio>
                    <a-radio :value="GraphTypeEnum.WHITE_BOARD" v-if="showViews.includes(GraphTypeEnum.WHITE_BOARD)">
                        {{ Config.title[GraphTypeEnum.WHITE_BOARD].title }}
                    </a-radio>
                </a-radio-group>
                <a-input style="width: 150px;margin-left: 14px;" placeholder="请输入项目名" allow-clear
                         v-model="keyword"></a-input>
            </div>
            <a-switch :default-checked="!isDark" type="round" style="margin: 4px;width: 58px;"
                      @change="switchDarkColors()">
                <template #checked>白天</template>
                <template #unchecked>黑夜</template>
            </a-switch>
        </div>
        <div class="content">
            <a-list :virtual-list-props="virtualListProps" :data="mindMapResults"
                    v-show="activeKey === GraphTypeEnum.MIND_MAP">
                <template #item="{ item, index }">
                    <home-item :active-key="activeKey" :item="item.item" :index="index" @jump-to="jumpTo"
                               @update-by="updateBy" @remove="remove"/>
                </template>
            </a-list>
            <a-list :virtual-list-props="virtualListProps" :data="diagramResults"
                    v-show="activeKey === GraphTypeEnum.DIAGRAM">
                <template #item="{ item, index }">
                    <home-item :active-key="activeKey" :item="item.item" :index="index" @jump-to="jumpTo"
                               @update-by="updateBy" @remove="remove"/>
                </template>
            </a-list>
            <a-list :virtual-list-props="virtualListProps" :data="whiteBoardResults"
                    v-show="activeKey === GraphTypeEnum.WHITE_BOARD">
                <template #item="{ item, index }">
                    <home-item :active-key="activeKey" :item="item.item" :index="index" @jump-to="jumpTo"
                               @update-by="updateBy" @remove="remove"/>
                </template>
            </a-list>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Config from "@/global/Config";
import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {useGlobalStore} from "@/store/GlobalStore";
import {useSettingStore} from "@/store/setting/SettingStore";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import {useMindMapStore} from "@/store/graph/MindMapStore";
import HomeItem from "@/pages/home/item.vue";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useFuse} from "@vueuse/integrations/useFuse";

const activeKey = ref<GraphTypeEnum>(GraphTypeEnum.MIND_MAP);
const keyword = ref<string>('');
// 对象属性
const showViews = useSettingStore().showViews;
const isDark = useGlobalStore().isDark;
const size = ref(useGlobalStore().size);
const router = useRouter();
// 列表
const mindMaps = ref(useMindMapStore().mindMaps);
const diagrams = ref(useDiagramStore().diagrams);
const whiteBoards = ref(useWhiteBoardStore().whiteBoards);
// 计算属性
const virtualListProps = computed(() => {
    return {
        height: size.value.height - 33 - 14 - 7
    }
});

// 参数
const name = router.currentRoute.value.query.name as GraphTypeEnum;
if (name) {
    activeKey.value = name;
}

const {results: mindMapResults} = useFuse(keyword, mindMaps, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name',
            weight: 1
        }]
    }
});
const {results: diagramResults} = useFuse(keyword, diagrams, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name',
            weight: 1
        }]
    }
});
const {results: whiteBoardResults} = useFuse(keyword, whiteBoards, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name',
            weight: 1
        }]
    }
});


function jumpTo(item: GraphRecord) {
    useGlobalStore().setTitle(item.name);
    useGlobalStore().setType(activeKey.value);
    router.push(`/graph/${item.type}/${item.id}`);
}

function updateBy(item: GraphRecord) {
    if (activeKey.value === GraphTypeEnum.MIND_MAP) {
        useMindMapStore().update(item);
    } else if (activeKey.value === GraphTypeEnum.DIAGRAM) {
        useDiagramStore().update(item);
    } else if (activeKey.value === GraphTypeEnum.WHITE_BOARD) {
        useWhiteBoardStore().update(item);
    }
}

function remove(item: GraphRecord) {
    if (activeKey.value === GraphTypeEnum.MIND_MAP) {
        useMindMapStore().remove(item);
    } else if (activeKey.value === GraphTypeEnum.DIAGRAM) {
        useDiagramStore().remove(item);
    } else if (activeKey.value === GraphTypeEnum.WHITE_BOARD) {
        useWhiteBoardStore().remove(item);
    }
}

function switchDarkColors() {
    useGlobalStore().switchDarkColors();
}
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
