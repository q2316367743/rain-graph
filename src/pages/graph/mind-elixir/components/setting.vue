<template>
    <a-drawer title="设置" v-model:visible="settingDrawer" mask-closable width="300px" cancel-text="取消" ok-text="保存"
        @ok="save">
        <a-form :model="instance" class="smm-menu-more-setting" layout="horizontal" auto-label-width>
            <a-form-item label="拖拽">
                <a-switch v-model="instance.draggable" />
            </a-form-item>
            <a-form-item label="右键菜单">
                <a-switch v-model="instance.contextMenu" />
            </a-form-item>
            <a-form-item label="工具栏">
                <a-switch v-model="instance.toolBar" />
            </a-form-item>
            <a-form-item label="节点菜单">
                <a-switch v-model="instance.nodeMenu" />
            </a-form-item>
            <a-form-item label="快捷键">
                <a-switch v-model="instance.keypress" />
            </a-form-item>
            <a-form-item label="语言">
                <a-select v-model="instance.locale">
                    <a-option value="zh_CN">简体中文</a-option>
                    <a-option value="zh_TW">繁体中文</a-option>
                    <a-option value="en">英文</a-option>
                    <a-option value="ja">日本</a-option>
                    <a-option value="pt">pt</a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="超出隐藏">
                <a-switch v-model="instance.overflowHidden" />
            </a-form-item>
            <a-form-item label="主链接样式">
                <a-select v-model="instance.mainLinkStyle">
                    <a-option :value="1">1</a-option>
                    <a-option :value="2">2</a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="垂直宽度">
                <a-input-number v-model="instance.mainNodeVerticalGap" :min="1" />
            </a-form-item>
            <a-form-item label="水平高度">
                <a-input-number v-model="instance.mainNodeHorizontalGap" :min="1" />
            </a-form-item>
            <a-form-item label="允许后退">
                <a-switch v-model="instance.allowUndo" />
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import { PropType } from "vue";
import { defineComponent } from "vue";
import { MindOption, getDefaultOption } from "../domain/MindOption";

export default defineComponent({
    name: 'mind-elixir-setting',
    emits: ["update:visible", "save"],
    props: {
        visible: Boolean,
        option: Object as PropType<MindOption>
    },
    watch: {
        visible(newValue) {
            this.settingDrawer = newValue;
            if (newValue) {
                this.instance = Object.assign(getDefaultOption(), this.option);
            }
        },
        settingDrawer(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    data: () => ({
        settingDrawer: false,
        instance: getDefaultOption()
    }),
    methods: {
        save() {
            this.$emit('save', this.instance);
        }
    }
});
</script>
<style scoped></style>