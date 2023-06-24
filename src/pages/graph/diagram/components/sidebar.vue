<template>
    <div class="diagram-sidebar" :style="{height: height - 33 + 'px'}">
        <div class="sidebar-container">
            <a-collapse :bordered="false" :default-active-key="['basic-node', 'lct']">
                <a-collapse-item v-for="group in showDiagramGroups" :header="group.name" :key="group.key">
                    <div v-for="node in group.nodes" class="node-item" @mousedown="dragInNode(node.name)">
                        <a-tooltip :content="node.tip">
                            <component :is="node.icon" class="svg-node"/>
                        </a-tooltip>
                    </div>
                </a-collapse-item>
            </a-collapse>
        </div>
        <div class="sidebar-more">
            <a-trigger position="top" trigger="click">
                <a-button type="text" long>+更多图形...</a-button>
                <template #content>
                    <a-checkbox-group v-model="nodeKeysWrap" class="more-trigger">
                        <a-doption v-for="group in diagramGroups">
                            <a-checkbox :value="group.key">{{ group.name }}</a-checkbox>
                        </a-doption>
                    </a-checkbox-group>
                </template>
            </a-trigger>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import icons from '../icon';
import {DiagramGroup} from "../node/data/DiagramNode";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import {contains} from "@/utils/ArrayUtil";

export default defineComponent({
    name: 'DiagramSidebar',
    emits: ['drag-in-node', 'update:node-keys'],
    props: {
        diagramGroups: {
            type: Object as PropType<Array<DiagramGroup>>,
            required: false,
            default: new Array<DiagramGroup>()
        },
        nodeKeys: {
            type: Object as PropType<Array<string>>,
            required: false,
            default: ['basic-node', 'graph-node', 'polygon-node', 'lct']
        }
    },
    data: () => ({
        nodeKeysWrap: ['basic-node', 'graph-node', 'polygon-node', 'lct'],
        moreDropdown: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['height']),
        showDiagramGroups() {
            return this.diagramGroups?.filter(e => contains(this.nodeKeysWrap, e.key));
        }
    },
    watch: {
        nodeKeysWrap(newValue) {
            this.$emit('update:node-keys', newValue)
        },
        nodeKeys(newValue) {
            this.nodeKeysWrap = newValue;
        }
    },
    methods: {
        contains,
        dragInNode(type: any) {
            this.$emit('drag-in-node', type)
        }
    },
    components: icons,
    created() {
        this.nodeKeysWrap = this.nodeKeys || [];
    },
})
</script>

<style lang="less">
.diagram-sidebar {
    user-select: none;
    position: absolute;
    width: 205px;
    border-right: 1px solid var(--color-neutral-3);

    .sidebar-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 32px;
        overflow: auto;
    }

    .sidebar-more {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 32px;
    }

    .arco-collapse-item-content {
        padding: 0;
    }

    .node-item {
        width: 35px;
        height: 35px;
        margin-left: 3px;
        margin-right: 2px;
        display: inline-block;

        &:hover {
            cursor: grab;
            filter: brightness(90%);
        }

        &:active {
            cursor: grabbing;
            border: none;
        }
    }

    .svg-node {
        left: 1px;
        top: 1px;
        width: 32px;
        height: 30px;
        display: block;
        position: relative;
        overflow: hidden;

        &:focus {
            border: none;
        }
    }

    .image-node,
    .icon-node {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin: 10px;
        cursor: pointer;
    }

}

.more-trigger {
    background-color: var(--color-fill-1);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 7px 0;
}
</style>