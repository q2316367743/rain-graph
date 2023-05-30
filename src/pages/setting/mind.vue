<template>
    <a-form :model="mindSetting" class="setting-mind" layout="vertical">
        <a-form-item label="默认引擎">
            <a-radio-group v-model="mindSetting.engine" style="width: 250px;" type="button">
                <a-radio :value="MindEngineEnum.MIND_ELIXIR">mind-elixir</a-radio>
                <a-radio :value="MindEngineEnum.SIMPLE_MIND_MAP">simple-mind-map</a-radio>
            </a-radio-group>
            <template #help>
                <span
                    v-if="mindSetting.engine === MindEngineEnum.MIND_ELIXIR">此引擎轻量小巧，拥有基础功能，可以导出html文件，操作便捷，但是节点只支持文本内容。</span>
                <span
                    v-else-if="mindSetting.engine === MindEngineEnum.SIMPLE_MIND_MAP">
                    此引擎功能完善，节点支持图片，超链接等功能，支持mind-elixir全部功能，但是无法导出html，可以导出其他功能，支持读取xmind文件
                </span>
            </template>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="save">保存</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import MindEngineEnum from "@/enumeration/MindEngineEnum";
import { getDefaultMindSetting, useSettingStore } from "@/store/SettingStore";
import MessageUtil from "@/utils/MessageUtil";
import { mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'setting-mind',
    data: () => ({
        MindEngineEnum,
        mindSetting: getDefaultMindSetting()
    }),
    computed: {
        ...mapState(useSettingStore, ['mind'])
    },
    created() {
        this.mindSetting = this.mind;
    },
    methods: {
        save() {
            useSettingStore().saveMind(this.mindSetting)
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        }
    }
});
</script>
<style scoped></style>