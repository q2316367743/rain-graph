<template>
    <div>
        <div class="container">
            <a-button-group type="text">
                <a-tooltip content="返回列表">
                    <a-button @click="toHome">
                        <template #icon><icon-menu /></template>
                    </a-button>
                </a-tooltip>
                <a-tooltip content="保存">
                    <a-button @click="$emit('save')">
                        <template #icon><icon-save /></template>
                    </a-button>
                </a-tooltip>
                <a-tooltip content="另存为">
                    <a-button @click="$emit('save-as')">
                        <template #icon><icon-file /></template>
                    </a-button>
                </a-tooltip>
                <a-dropdown trigger="click" @select="(e) => $emit('export', e)">
                    <a-button>
                        <template #icon><icon-export /></template>
                    </a-button>
                    <template #content>
                        <a-doption :value="ExportTypeEnum.JSON">JSON</a-doption>
                        <a-doption :value="ExportTypeEnum.SVG">SVG</a-doption>
                        <a-doption :value="ExportTypeEnum.PNG">PNG</a-doption>
                        <a-doption :value="ExportTypeEnum.PDF">PDF</a-doption>
                        <a-doption :value="ExportTypeEnum.MD">Markdown</a-doption>
                    </template>
                </a-dropdown>
                <div style="width: 200px" v-if="width / 2 - 180 - 7 > 342">{{ name }}</div>
            </a-button-group>
        </div>
    </div>
</template>
<script lang="ts">
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
    name: '',
    props: {
        title: {
            type: String,
            required: false,
            default: ''
        }
    },
    emits: ['save', 'save-as', 'export'],
    data: () => ({
        ExportTypeEnum,
        name: '',
    }),
    computed: {
        ...mapState(useGlobalStore, ['width'])
    },
    created() {
        this.name = this.title
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
    }
});
</script>
<style scoped></style>