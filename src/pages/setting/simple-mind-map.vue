<template>
    <a-form :model="setting" class="setting-base" layout="vertical">
        <a-form-item label="默认显示">
            <a-radio-group v-model="setting.display" style="width: 250px;">
                <a-radio value="mind">思维导图</a-radio>
                <a-radio value="toc">大纲</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="save">保存</a-button>
            <template #help>记得保存哦</template>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { getDefaultSimpleMindMapSetting, useSimpleMindMapSettingStore } from '@/store/setting/SimpleMindMapSetting';
import { mapState } from "pinia";
import { toRaw } from "vue";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'setting-base',
    data: () => ({
        setting: getDefaultSimpleMindMapSetting(),
    }),
    computed: {
        ...mapState(useSimpleMindMapSettingStore, ['simpleMindMapSetting'])
    },
    created() {
        this.setting = Object.assign({}, this.simpleMindMapSetting);
    },
    methods: {
        save() {
            useSimpleMindMapSettingStore()
                .saveBase(toRaw(this.setting))
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e))
        }
    }
});
</script>
<style scoped></style>