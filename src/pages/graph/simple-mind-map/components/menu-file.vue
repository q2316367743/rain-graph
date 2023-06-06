<template>
    <a-dropdown>
        <a-button>文件</a-button>
        <template #content>
            <a-doption @click="toHome">返回列表</a-doption>
            <a-doption disabled>新建</a-doption>
            <a-doption disabled>打开</a-doption>
            <a-doption @click="save">保存</a-doption>
            <a-doption @click="saveAs">另存为</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";
import MessageUtil from "@/utils/MessageUtil";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import { useSaveEvent } from "@/global/BeanFactory";

export default defineComponent({
    name: 'menu-file',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({

    }),
    computed: {
        ... mapState(useGlobalStore, ['title'])
    },
    created() {
        useSaveEvent.on(() => this.save());
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.SIMPLE_MIND_MAP
                }
            })
        },
        save() {
            this.simpleMindMapWrap.save()
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        },
        saveAs() {
            this.simpleMindMapWrap.saveAs(this.title)
        },
    }
});
</script>
<style scoped></style>