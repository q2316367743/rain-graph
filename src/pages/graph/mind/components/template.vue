<template>
    <a-drawer v-model:visible="modal" title="模板管理" fullscreen :footer="false" :width="300">
        <a-list :bordered="false">
            <a-list-item v-for="template in templates">
                <a-list-item-meta>
                    <template #title>
                        <a-link @click="render(template.id)">{{ template.name }}</a-link>
                    </template>
                    <template #description>
                        {{ toDateString(template.createTime) }}
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <a-popconfirm content="确认删除此模板？删除后无法恢复" @ok="removeTemplate(template.id)">
                        <a-button type="text" status="danger">删除</a-button>
                    </a-popconfirm>
                </template>
            </a-list-item>
        </a-list>
    </a-drawer>
</template>
<script lang="ts">
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MessageUtil from "@/utils/MessageUtil";
import { StoreRecordIndex, listTemplate, removeTemplate } from "@/utils/utools/DbUtil";
import { defineComponent } from "vue";
import { toDateString } from "xe-utils";

export default defineComponent({
    name: 'mind-elixir-template',
    emits: ['update:visible', 'render'],
    props: {
        visible: Boolean
    },
    data: () => ({
        modal: false,
        templates: new Array<StoreRecordIndex>()
    }),
    watch: {
        visible(newValue) {
            this.modal = newValue;
            if (newValue) {
                this.templates = new Array<StoreRecordIndex>()
                listTemplate(GraphTypeEnum.MIND).then(templates => {
                    this.templates = templates;
                });
            }
        },
        modal(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    methods: {
        toDateString,
        removeTemplate(id: string) {
            removeTemplate(GraphTypeEnum.MIND, id)
                .then(() => {
                    this.templates = new Array<StoreRecordIndex>()
                    listTemplate(GraphTypeEnum.MIND).then(templates => {
                        this.templates = templates;
                    });
                    MessageUtil.success("删除成功");
                })
                .catch(e => MessageUtil.error("删除失败", e));
        },
        render(id: string) {
            this.$emit('render', id);
            this.modal = false;
        }
    }
});
</script>
<style scoped></style>