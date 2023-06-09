<template>
    <a-modal v-model:visible="show" :footer="false" title-align="start" :width="500">
        <template #title>
            <a-input-search v-model="input" style="width: 300px" allow-clear/>
        </template>
        <a-list>
            <a-list-item v-for="item in showItems">
                <a-link @click="jumpTo(item.item)">{{ item.item.name }}</a-link>
                <template #actions>
                    <a-tag>{{ nameCovert(item.item) }}</a-tag>
                </template>
            </a-list-item>
        </a-list>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import GraphRecord from "@/entity/GraphRecord";
import Fuse from 'fuse.js';
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {useGlobalStore} from "@/store/GlobalStore";
import {useMindMapStore} from "@/store/graph/MindMapStore";
import {MindMapSubType} from "@/enumeration/GraphSubTypeEnum";

interface GraphRecordWrap extends GraphRecord {

    graphType: GraphTypeEnum;

}

export default defineComponent({
    name: 'sub-input',
    emits: ['update:visible', 'update:keyword'],
    props: {
        visible: Boolean,
        keyword: String
    },
    data: () => ({
        show: false,
        input: "",
        fuse: undefined as Fuse<GraphRecordWrap> | undefined,
        showItems: new Array<Fuse.FuseResult<GraphRecordWrap>>()
    }),
    computed: {
        ...mapState(useMindMapStore, ['mindMaps']),
        ...mapState(useDiagramStore, ['diagrams']),
        ...mapState(useWhiteBoardStore, ['whiteBoards']),
        items(): Array<GraphRecordWrap> {
            return [...this.mindMaps.map(e => ({
                ...e,
                graphType: GraphTypeEnum.MIND_MAP
            })), ...this.diagrams.map(e => ({
                ...e,
                graphType: GraphTypeEnum.DIAGRAM
            })), ...this.whiteBoards.map(e => ({
                ...e,
                graphType: GraphTypeEnum.WHITE_BOARD
            }))]
        },
    },
    created() {
    },
    watch: {
        visible(newValue) {
            this.show = newValue;
            if (newValue) {
                this.fuse = new Fuse(this.items, {
                    shouldSort: true,
                    threshold: 0.3,
                    includeScore: true,
                    minMatchCharLength: 1,
                    keys: [
                        {name: 'name', weight: 0.6}
                    ]
                })
            }
        },
        show(newValue) {
            this.$emit('update:visible', newValue);
            if (!newValue) {
                // 关闭对话框
                utools.setSubInputValue("");
                this.input = "";
            }
        },
        keyword(newValue) {
            this.input = newValue;
        },
        input(newValue) {
            this.$emit('update:keyword', newValue);
            utools.setSubInputValue(newValue);
            if (this.fuse) {
                this.showItems = this.fuse.search(newValue);
            }
        }
    },
    methods: {
        jumpTo(item: GraphRecordWrap) {
            useGlobalStore().setTitle(item.name);
            useGlobalStore().setType(item.graphType);
            this.$router.push("/dashboard")
                .then(() => {
                    this.$router.push(`/graph/${item.type}/${item.id}`);
                    this.show = false;
                })
        },
        nameCovert(item: GraphRecordWrap) {
            if (item.graphType === GraphTypeEnum.MIND_MAP) {
                if (item.type === MindMapSubType.MIND_ELIXIR) {
                    return "简易思维导图";
                } else if (item.type === MindMapSubType.SIMPLE_MIND_MAP) {
                    return "完整思维导图";
                } else {
                    return "思维导图";
                }
            } else if (item.graphType === GraphTypeEnum.WHITE_BOARD) {
                return "白板";
            } else if (item.graphType === GraphTypeEnum.DIAGRAM) {
                return "流程图";
            }
        }
    }
});
</script>
<style scoped>

</style>
