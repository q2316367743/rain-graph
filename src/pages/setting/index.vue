<template>
    <div class="setting">
        <div class="header">
            <a-tabs v-model="activeKey" hide-content type="rounded">
                <a-tab-pane title="全局设置" key="global"></a-tab-pane>
                <a-tab-pane title="思维导图" key="mind"></a-tab-pane>
                <a-tab-pane title="手绘图" key="atrament"></a-tab-pane>
                <a-tab-pane title="BPMN" key="bpmn"></a-tab-pane>
                <a-tab-pane title="流程图" key="diagram"></a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'setting',
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
}
</style>