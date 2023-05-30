<template>
    <div class="setting">
        <div class="header">
            <a-tabs v-model:active-key="activeKey" hide-content type="rounded">
                <a-tab-pane title="全局设置" key="global"></a-tab-pane>
                <a-tab-pane title="简易思维导图" key="mind"></a-tab-pane>
                <a-tab-pane title="完整思维导图" key="simple-mind-map"></a-tab-pane>
                <a-tab-pane title="流程图" key="diagram"></a-tab-pane>
            </a-tabs>
        </div>
        <div class="content">
            <setting-base v-if="activeKey === 'global'" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import SettingBase from './base.vue';

export default defineComponent({
    name: 'setting',
    components: { SettingBase },
    data: () => ({
        activeKey: 'global'
    }),
});
</script>
<style scoped lang="less">
.setting {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        text-align: center;
        height: 40px;

        .arco-tabs {
            width: 460px;
            margin: 4px auto;
        }
    }

    .content {
        position: absolute;
        top: 40px;
        left: 14px;
        right: 14px;
        bottom: 14px;
        overflow: auto;
    }
}
</style>