<template>
    <a-modal v-model:visible="show" :footer="false" title-align="start" :width="500">
        <template #title>
            <a-input-search v-model="input" style="width: 300px" allow-clear/>
        </template>
        <a-list>
            <a-list-item v-for="item in showItems">
                <a-link @click="jumpTo(item.item)">{{item.item.name}}</a-link>
                <template #actions>
                    <a-tag>{{ nameCovert(item.item.type) }}</a-tag>
                </template>
            </a-list-item>
        </a-list>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {useSimpleMindMapStore} from "@/store/graph/SimpleMindMapStore";
import {useMindStore} from "@/store/graph/MindStore";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import GraphRecord from "@/entity/GraphRecord";
import Fuse from 'fuse.js';
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {useGlobalStore} from "@/store/GlobalStore";

interface GraphRecordWrap extends GraphRecord {

    type: GraphTypeEnum;

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
        ...mapState(useSimpleMindMapStore, ['simpleMindMaps']),
        ...mapState(useMindStore, ['minds']),
        ...mapState(useDiagramStore, ['diagrams']),
        ...mapState(useWhiteBoardStore, ['whiteBoards']),
        items(): Array<GraphRecordWrap> {
            return [...this.simpleMindMaps.map(e => ({
                ...e,
                type: GraphTypeEnum.SIMPLE_MIND_MAP
            })), ...this.minds.map(e => ({
                ...e,
                type: GraphTypeEnum.MIND
            })), ...this.diagrams.map(e => ({
                ...e,
                type: GraphTypeEnum.DIAGRAM
            })), ...this.whiteBoards.map(e => ({
                ...e,
                type: GraphTypeEnum.WHITE_BOARD
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
            useGlobalStore().setType(item.type);
            this.$router.push("/dashboard")
                .then(() => {
                    this.$router.push(`/graph/${item.type}/${item.id}`);
                    this.show = false;
                })
        },
        nameCovert(type: GraphTypeEnum) {
            if (type === GraphTypeEnum.SIMPLE_MIND_MAP) {
                return "完整思维导图";
            }else if (type === GraphTypeEnum.WHITE_BOARD) {
                return "白板";
            }else if (type === GraphTypeEnum.DIAGRAM) {
                return "流程图";
            }else if (type === GraphTypeEnum.MIND) {
                return "简易思维导图";
            }
        }
    }
});
</script>
<style scoped>

</style>
