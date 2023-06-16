<template>
    <div class="diagram-sidebar">
        <a-collapse :bordered="false" :default-active-key="['1', '2', '3']">
            <a-collapse-item header="基础图形" key="1">
                <div v-for="node in BasicNodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <component :is="node.icon" class="svg-node" />
                </div>
            </a-collapse-item>
            <a-collapse-item header="图片" key="2">
                <div class="image-node image-setting" @mousedown="dragInNode('image-setting')">
                </div>
                <div class="image-node image-user" @mousedown="dragInNode('image-user')">
                </div>
                <div class="image-node image-cloud" @mousedown="dragInNode('image-cloud')">
                </div>
            </a-collapse-item>
            <a-collapse-item header="ICON" key="3">
                <div class="icon-node icon-message" @mousedown="dragInNode('icon-message')"></div>
            </a-collapse-item>
        </a-collapse>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import IconCircle from '../icon/Circle.vue'
import IconRect from '../icon/Rect.vue'
import IconRectRadius from '../icon/RectRadius.vue'
import IconActor from '../icon/Actor.vue'
import IconCylinde from '../icon/Cylinde.vue'
import IconDiamond from '../icon/Diamond.vue'
import IconEllipse from '../icon/Ellipse.vue'
import IconParallelogram from '../icon/Parallelogram.vue'
import IconText from '../icon/Text.vue'
import IconTriangle from '../icon/Triangle.vue'
import IconLeftArrow from '../icon/LeftArrow.vue'
import IconRightArrow from '../icon/RightArrow.vue'
import IconHorizontalArrow from '../icon/HorizontalArrow.vue'
import IconUpArrow from '../icon/UpArrow.vue'
import IconDownArrow from '../icon/DownArrow.vue'
import IconVerticalArrow from '../icon/VerticalArrow.vue'
import IconPentagon from '../icon/Pentagon.vue'
import IconHexagon from '../icon/Hexagon.vue'
import IconSeptagon from '../icon/Septagon.vue'
import IconHeptagon from '../icon/Heptagon.vue'
import IconTrapezoid from '../icon/Trapezoid.vue'
import IconCross from '../icon/Cross.vue'
import IconMinus from '../icon/Minus.vue'
import IconTimes from '../icon/Times.vue'
import IconDivide from '../icon/Divide.vue'

import { BasicNodes } from '../node';

export default defineComponent({
    name: 'DiagramSidebar',
    emits: ['dragInNode'],
    data: () => ({
        BasicNodes
    }),
    methods: {
        dragInNode(type: any) {
            this.$emit('dragInNode', type)
        }
    },
    components: {
        IconCircle,
        IconRect,
        IconRectRadius,
        IconActor,
        IconCylinde,
        IconDiamond,
        IconEllipse,
        IconParallelogram,
        IconText,
        IconTriangle,
        IconRightArrow,
        IconLeftArrow,
        IconHorizontalArrow,
        IconUpArrow,
        IconDownArrow,
        IconVerticalArrow,
        IconPentagon,
        IconHexagon,
        IconSeptagon,
        IconHeptagon,
        IconTrapezoid,
        IconCross,
        IconMinus,
        IconTimes,
        IconDivide
    }
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