<template>
    <a-drawer title="编辑设置" v-model:visible="drawer" mask-closable width="300px" ok-text="保存" @ok="save">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="禁止缩放画布">
                <a-switch v-model="instance.stopZoomGraph"/>
            </a-form-item>
            <a-form-item label="禁止鼠标滚动移动画布">
                <a-switch v-model="instance.stopScrollGraph"/>
            </a-form-item>
            <a-form-item label="禁止拖动画布">
                <a-switch v-model="instance.stopMoveGraph"/>
            </a-form-item>
            <a-form-item label="允许调整边">
                <a-switch v-model="instance.adjustEdge"/>
            </a-form-item>
            <a-form-item label="允许调整边起点/终点">
                <a-switch v-model="instance.adjustEdgeStartAndEnd"/>
            </a-form-item>
            <a-form-item label="允许拖动节点">
                <a-switch v-model="instance.adjustNodePosition"/>
            </a-form-item>
            <a-form-item label="隐藏节点所有锚点">
                <a-switch v-model="instance.hideAnchors"/>
            </a-form-item>
            <a-form-item label="显示节点悬浮时的外框">
                <a-switch v-model="instance.hoverOutline"/>
            </a-form-item>
            <a-form-item label="节点选中时显示外边框">
                <a-switch v-model="instance.nodeSelectedOutline"/>
            </a-form-item>
            <a-form-item label="边选择时显示外边框">
                <a-switch v-model="instance.edgeSelectedOutline"/>
            </a-form-item>
            <a-form-item label="允许节点文本可以编辑">
                <a-switch v-model="instance.nodeTextEdit"/>
            </a-form-item>
            <a-form-item label="允许文本编辑">
                <a-switch v-model="instance.textEdit"/>
            </a-form-item>
            <a-form-item label="允许边文本可以编辑">
                <a-switch v-model="instance.edgeTextEdit"/>
            </a-form-item>
            <a-form-item label="允许节点文本可以拖拽">
                <a-switch v-model="instance.nodeTextDraggable"/>
            </a-form-item>
            <a-form-item label="允许边文本可以拖拽">
                <a-switch v-model="instance.edgeTextDraggable"/>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {EditConfigInterface} from "@logicflow/core";

export default defineComponent({
    name: 'menu-more-edit-setting',
    emits: ['update:visible'],
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
        visible: Boolean
    },
    data: () => ({
        drawer: false,
        instance: {
            stopZoomGraph: false,
            stopScrollGraph: false,
            stopMoveGraph: false,
            adjustEdge: true,
            adjustEdgeMiddle: false,
            adjustEdgeStartAndEnd: false,
            adjustNodePosition: true,
            hideAnchors: false,
            hoverOutline: true,
            nodeSelectedOutline: true,
            edgeSelectedOutline: true,
            nodeTextEdit: true,
            edgeTextEdit: true,
            textEdit: true,
            nodeTextDraggable: false,
            edgeTextDraggable: false,
            autoExpand: true
        } as EditConfigInterface
    }),
    watch: {
        visible(newValue) {
            this.drawer = newValue;
            if (newValue) {
                const {editConfigModel} = this.lf.graphModel;
                this.instance = editConfigModel.getConfig();
            }
        },
        drawer(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    methods: {
        save() {
            this.lf.updateEditConfig(this.instance);
        }
    }
});
</script>
<style scoped></style>
