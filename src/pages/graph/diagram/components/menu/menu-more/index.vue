<template>
    <a-dropdown>
        <a-button>更多</a-button>
        <template #content>
            <a-doption disabled>主题</a-doption>
            <a-doption @click="editSetting = true" :disabled="isNotVip">编辑设置</a-doption>
            <a-doption @click="keyboard = true;">快捷键</a-doption>
        </template>
        <menu-more-keyboard v-model:visible="keyboard" />
        <menu-more-edit-setting v-model:visible="editSetting" :lf="lf" />
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import MenuMoreKeyboard from './keyboard.vue'
import MenuMoreEditSetting from './edit-setting.vue'
import { mapState } from "pinia";
import { useVipStore } from "@/store/VipStore";

export default defineComponent({
    name: 'menu-more',
    components: { MenuMoreKeyboard, MenuMoreEditSetting },
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
    },
    data: () => ({
        keyboard: false,
        editSetting: false
    }),
    computed: {
        ...mapState(useVipStore, ['isNotVip'])
    }
});
</script>
<style scoped lang="less"></style>