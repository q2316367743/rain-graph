<template>
    <div class="diagram-sidebar">
        <a-collapse :bordered="false" :default-active-key="['basic-node', 'special-node', 'lct-node']">
            <a-collapse-item header="基础图形" key="basic-node">
                <div v-for="node in basicNodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <component :is="node.icon" class="svg-node"/>
                </div>
            </a-collapse-item>
            <a-collapse-item header="特殊节点" key="special-node">
                <div v-for="node in specialNodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <component :is="node.icon" class="svg-node"/>
                </div>
            </a-collapse-item>
            <a-collapse-item header="流程图节点" key="lct-node">
                <div v-for="node in lctNodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <component :is="node.icon" class="svg-node"/>
                </div>
            </a-collapse-item>
            <a-collapse-item header="方向节点" key="arrow-node">
                <div v-for="node in arrowNodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <component :is="node.icon" class="svg-node"/>
                </div>
            </a-collapse-item>
            <a-collapse-item header="图片" key="image-node">
                <div class="image-node image-setting" @mousedown="dragInNode('image-setting')">
                </div>
                <div class="image-node image-user" @mousedown="dragInNode('image-user')">
                </div>
                <div class="image-node image-cloud" @mousedown="dragInNode('image-cloud')">
                </div>
            </a-collapse-item>
            <a-collapse-item header="ICON" key="icon-node">
                <div class="icon-node icon-message" @mousedown="dragInNode('icon-message')"></div>
            </a-collapse-item>
        </a-collapse>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import icons from '../icon';
import {arrowNodes, basicNodes, specialNodes, lctNodes} from '../node';

export default defineComponent({
    name: 'DiagramSidebar',
    emits: ['drag-in-node'],
    data: () => ({
        basicNodes, specialNodes, arrowNodes, lctNodes
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