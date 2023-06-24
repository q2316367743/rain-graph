<template>
    <div class="drauu">
        <div class="container" :style="{ bottom: show ? '40px' : '0px' }">
            <drauu-instance v-for="instance in instances" :key="instance.id" :id="instance.id"
                            :template-id="instance.templateId"
                            v-show="instance.id === id" @open-template="openTemplate" @save-template="saveTemplate"
                            @update-template="updateTemplate"/>
        </div>
        <div class="tabs" :style="{ height: show ? '39px' : '0px' }">
            <a-tabs v-model:active-key="id" type="line" :editable="true" @add="handleAdd" @delete="handleDelete"
                    show-add-button auto-switch hide-content>
                <a-tab-pane v-for="instance in instances" :key="instance.id" :title="instance.name"/>
            </a-tabs>
        </div>
        <div class="toggle" :style="{ bottom: show ? '40px' : '0' }" @click="show = !show">
            <a-button type="text">
                <template #icon>
                    <icon-tags/>
                </template>
            </a-button>
        </div>
        <template-manage :type="GraphTypeEnum.DRAUU" v-model:visible="templateShow" @render="render"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import DrauuInstance from './instance.vue';

import TemplateManage from "@/components/template-manage/index.vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {saveOrUpdateTemplate} from "@/utils/utools/DbUtil";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

interface Instance {

    id: number;

    name: string;

    /**
     * 模板ID
     */
    templateId?: string;

}

export default defineComponent({
    name: 'drauu',
    computed: {
        GraphTypeEnum() {
            return GraphTypeEnum
        }
    },
    components: {DrauuInstance, TemplateManage},
    data: () => ({
        instances: new Array<Instance>(),
        id: 0,
        show: false,
        templateShow: false
    }),
    created() {
        this.compensate();
    },
    methods: {
        compensate() {
            if (this.instances.length === 0) {
                let instance = {
                    id: new Date().getTime(),
                    name: '画板'
                };
                this.instances.push(instance);
                this.id = instance.id;
            } else {
                let index = this.instances.findIndex(i => i.id === this.id);
                if (index === -1) {
                    this.id = this.instances[0].id;
                }
            }
        },
        handleAdd() {
            this.instances.push({
                id: new Date().getTime(),
                name: '画板'
            });
        },
        handleDelete(id: any) {
            let index = this.instances.findIndex(i => i.id === id);
            if (index > -1) {
                this.instances.splice(index, 1);
            }
            this.compensate();
        },
        openTemplate() {
            this.templateShow = true;
        },
        async saveTemplate(record: { id: number, data: string }) {
            try {
                for (let instance of this.instances) {
                    if (instance.id === record.id) {
                        let name = instance.name;
                        if (name === "画板" && !instance.templateId) {
                            name = await MessageBoxUtil.prompt("请输入画板名称", "保存画板", {
                                inputValue: name
                            });
                        }
                        let template = await saveOrUpdateTemplate(GraphTypeEnum.DRAUU, {
                            record: record.data,
                            name,
                            config: {}
                        }, record.id + '')
                        MessageUtil.success("保存成功");
                        instance.templateId = template.id;
                        instance.name = name;
                        return;
                    }
                }
                MessageUtil.warning("未找到此条记录，无法保存");
            } catch (ignore) {
            }
        },
        async updateTemplate(record: { id: number, data: string }) {
            try {
                for (let instance of this.instances) {
                    if (instance.id === record.id) {
                        let name = await MessageBoxUtil.prompt("请输入新名称", "修改画板名称", {
                            inputValue: instance.name,
                        })
                        MessageUtil.success("更新名称成功");
                        instance.name = name;
                    }
                }
            } catch (ignore) {
            }
        },
        render(id: string, name: string) {
            // 先判断是否存在
            let tempId = parseInt(id);
            for (let instance of this.instances) {
                if (instance.id === tempId) {
                    this.id = tempId;
                    return;
                }
            }
            this.instances.push({
                id: tempId,
                name: name || '画板',
                templateId: id
            });
            this.id = tempId;
        }
    }
});
</script>
<style lang="less">
@import url(./instance.less);

.drauu {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: var(--color-neutral-2);

    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
        transition: 0.2s;
    }

    .tabs {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 39px;
        border-top: 1px solid var(--color-neutral-3);
        transition: 0.2s;
        background-color: var(--color-bg-1);
    }

    .toggle {
        position: absolute;
        left: 4px;
        transition: 0.2s;
        margin-bottom: 7px;
    }
}
</style>