<template>
    <div class="diagram-sidebar">
        <a-collapse :bordered="false" :default-active-key="['basic-node', 'graph-node', 'lct']">
            <a-collapse-item v-for="group in diagramGroups" :header="group.name" :key="group.key">
                <div v-for="node in group.nodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <component :is="node.icon" class="svg-node"/>
                </div>
            </a-collapse-item>
        </a-collapse>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import icons from '../icon';
import {DiagramGroup} from "../node/data/DiagramNode";

export default defineComponent({
    name: 'DiagramSidebar',
    emits: ['drag-in-node'],
    props: {
        diagramGroups: {
            type: Object as PropType<Array<DiagramGroup>>,
            required: false,
            default: new Array<DiagramGroup>()
        },
    },
    data: () => ({
    }),
    methods: {
        dragInNode(type: any) {
            this.$emit('drag-in-node', type)
        }
    },
    components: icons
})
</script>

<style lang="less">
.diagram-sidebar {
    user-select: none;
    width: 200px;

    .arco-collapse-item-content {
        padding: 0;
    }

    .node-item {
        width: 35px;
        height: 35px;
        margin-left: 3px;
        margin-right: 2px;
        display: inline-block;
    }

    .svg-node {
        left: 1px;
        top: 1px;
        width: 32px;
        height: 30px;
        display: block;
        position: relative;
        overflow: hidden;
    }

    .image-node,
    .icon-node {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin: 10px;
        cursor: pointer;
    }

    .image-setting {
        background: url('/image/setting.png');
        background-size: cover;
    }

    .image-user {
        width: 40px;
        background: url('/image/user.png');
        background-size: cover;
    }

    .image-cloud {
        width: 40px;
        background: url('/image/cloud.png');
        background-size: cover;
    }

    .icon-message {
        height: 20px;
        background: url('/image/message.png');
        background-size: cover;
    }
}
</style>