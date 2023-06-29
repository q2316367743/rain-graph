<template>
    <a-dropdown>
        <a-button :disabled="isNotVip">模板</a-button>
        <template #content>
            <a-doption @click="saveToTemplate()">保存为模板</a-doption>
            <a-doption @click="visible = true">模板管理</a-doption>
        </template>
        <template-manage v-model:visible="visible" :graph-type="GraphTypeEnum.MIND_MAP" :type="MindMapSubType.SIMPLE_MIND_MAP" @render="render" />
    </a-dropdown>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import SimpleMindMapWrap from "../../SimpleMindMapWrap";
import MessageUtil from "@/utils/MessageUtil";
import TemplateManage from '@/components/template-manage/index.vue'
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {mapState} from "pinia";
import {useVipStore} from "@/store/VipStore";
import {MindMapSubType} from "@/enumeration/GraphSubTypeEnum";

export default defineComponent({
    name: 'menu-file',
    components: { TemplateManage },
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({
        visible: false,
        GraphTypeEnum,
        MindMapSubType
    }),
    computed: {
        ...mapState(useVipStore, ['isNotVip'])
    },
    methods: {
        saveToTemplate() {
            this.simpleMindMapWrap.saveToTemplate();
        },
        render(id: string) {
            utools.db.promises.get(`/${GraphTypeEnum.MIND_MAP}/${id}`)
                .then(valueWrap => {
                    if (!valueWrap) {
                        MessageUtil.error("模板不存在，请刷新后重试");
                        return;
                    }
                    let value = valueWrap.value;
                    let config = value['config'];
                    let data = value['record'];
                    this.simpleMindMapWrap.setConfig(config);
                    this.simpleMindMapWrap.setData(data);
                })
                .catch(e => MessageUtil.error("获取模板失败", e));
        }
    }
});
</script>
<style scoped></style>
