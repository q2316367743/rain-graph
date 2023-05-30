<template>
    <a-form :model="setting" class="setting-base">
        <a-form-item label="默认视图">
            <a-select v-model="setting.defaultView" style="width: 250px;">
                <a-option :value="GraphTypeEnum.MIND">简易思维导图</a-option>
                <a-option :value="GraphTypeEnum.SIMPLE_MIND_MAP">完整思维导图</a-option>
                <a-option :value="GraphTypeEnum.DIAGRAM">流程图</a-option>
            </a-select>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { getDefaultSetting, useSettingStore } from '@/store/SettingStore';
import { mapState } from "pinia";
import { toRaw } from "vue";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from '@/enumeration/GraphTypeEnum';

export default defineComponent({
    name: 'setting-base',
    data: () => ({
        GraphTypeEnum,
        setting: getDefaultSetting(),
    }),
    computed: {
        ...mapState(useSettingStore, ['base'])
    },
    created() {
        this.setting = this.base;
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