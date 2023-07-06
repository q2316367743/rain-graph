<template>
    <a-form :model="setting" class="setting-base" layout="vertical">
        <a-form-item label="默认视图">
            <a-select v-model="setting.defaultView" style="width: 250px;">
                <a-option :value="GraphTypeEnum.MIND_MAP">思维导图</a-option>
                <a-option :value="GraphTypeEnum.DIAGRAM">流程图</a-option>
                <a-option :value="GraphTypeEnum.WHITE_BOARD">白板</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="显示的视图">
            <a-checkbox-group v-model="setting.showViews">
                <a-checkbox :value="GraphTypeEnum.MIND_MAP">思维导图</a-checkbox>
                <a-checkbox :value="GraphTypeEnum.DIAGRAM">流程图</a-checkbox>
                <a-checkbox :value="GraphTypeEnum.WHITE_BOARD">白板</a-checkbox>
            </a-checkbox-group>
        </a-form-item>
        <a-form-item label="画板模板是否可以作为流程图节点">
            <a-switch v-model="setting.drauuAppendToDiagram"/>
        </a-form-item>
        <a-form-item label="默认思维导图引擎">
            <a-radio-group v-model="setting.mindMapType">
                <a-radio :value="MindMapSubType.MIND_ELIXIR">mind-elixir（简易）</a-radio>
                <a-radio :value="MindMapSubType.SIMPLE_MIND_MAP">simple-mind-map（完整）</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="默认白板引擎">
            <a-radio-group v-model="setting.whiteBoardType">
                <a-radio :value="WhiteBoardSubType.TINY_WHITEBOARD">tiny-whiteboard</a-radio>
                <a-radio :value="WhiteBoardSubType.FABRIC">fabric（实验性的）</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="save()">保存</a-button>
            <template #help>记得保存哦</template>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import {defineComponent, toRaw} from "vue";
import {getDefaultSetting, useSettingStore} from '@/store/setting/SettingStore';
import {mapState} from "pinia";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from '@/enumeration/GraphTypeEnum';
import {MindMapSubType, WhiteBoardSubType} from "@/enumeration/GraphSubTypeEnum";

export default defineComponent({
    name: 'setting-base',
    data: () => ({
        GraphTypeEnum,
        MindMapSubType,
        WhiteBoardSubType,
        setting: getDefaultSetting(),
    }),
    computed: {
        ...mapState(useSettingStore, ['base'])
    },
    created() {
        this.setting = Object.assign({}, this.base);
    },
    methods: {
        save() {
            useSettingStore()
                .saveBase(toRaw(this.setting))
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e))
        }
    }
});
</script>
<style scoped></style>
