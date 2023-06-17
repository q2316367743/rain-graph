<template>
    <a-dropdown>
        <a-button>模板</a-button>
        <template #content>
            <a-doption @click="saveToTemplate">保存为模板</a-doption>
            <a-doption @click="visible = true;">管理模板</a-doption>
        </template>
        <template-manage v-model:visible="visible" :type="GraphTypeEnum.DIAGRAM" @render="render" />
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MessageUtil from "@/utils/MessageUtil";

import TemplateManage from '@/components/template-manage/index.vue';
import { saveTemplate } from "@/utils/utools/DbUtil";

export default defineComponent({
    name: 'menu-template',
    components: { TemplateManage },
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
        config: {
            type: Object,
            required: false,
            default: {}
        },
    },
    data: () => ({
        GraphTypeEnum,
        visible: false,
    }),
    methods: {
        saveToTemplate() {
            saveTemplate(GraphTypeEnum.DIAGRAM, {
                config: toRaw(this.config),
                record: this.lf.getGraphRawData(),
                editConfig: this.lf.getEditConfig()
            })
                .then(() => MessageUtil.success("保存模板成功"))
                .catch(e => {
                    if (e === 'cancel') {
                        return;
                    }
                    MessageUtil.error("保存模板失败", e);
                });
        },
        render(id: string) {
            utools.db.promises.get(`/${GraphTypeEnum.DIAGRAM}/${id}`)
                .then(valueWrap => {
                    if (!valueWrap) {
                        MessageUtil.error("模板不存在，请刷新后重试");
                        return;
                    }
                    const json = valueWrap.value;
                    let config = json['config'];
                    let data = json['record'];
                    let editConfig = json['editConfig'] || {};
                    this.lf.updateEditConfig({
                        ...config,
                        ...editConfig
                    });
                    this.lf.renderRawData(data);
                })
                .catch(e => MessageUtil.error("模板渲染失败", e));
        }
    }
});
</script>
<style scoped lang="less"></style>