<template>
    <a-drawer :width="340" v-model:visible="drawer" title="设置" ok-text="渲染" @ok="render" :header="false" hide-cancel>
        <a-divider>基础设置</a-divider>
        <a-form :model="base" layout="vertical">
            <a-form-item label="标题">
                <a-input v-model="base.title" style="width: 300px;" allow-clear />
            </a-form-item>
            <a-form-item label="副标题">
                <a-input v-model="base.subtitle" style="width: 450px;" allow-clear />
            </a-form-item>
            <a-form-item label="提示框是否显示">
                <a-switch v-model="base.tooltipShow" />
            </a-form-item>
            <a-form-item label="图例是否显示">
                <a-switch v-model="base.legendShow" />
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { getDefaultBaseSetting } from "../../data/Constant";

export default defineComponent({
    name: 'draw-echarts-setting',
    emits: ['update:visible', "update:base-setting", "render"],
    props: {
        visible: Boolean,
        baseSetting: Object
    },
    data: () => ({
        drawer: false,
        base: getDefaultBaseSetting()
    }),
    watch: {
        visible(newValue) {
            this.drawer = newValue;
        },
        drawer(newValue) {
            this.$emit('update:visible', newValue);
        },
        base: {
            handler(newValue) {
                this.$emit('update:base-setting', newValue);
            },
            deep: true
        }
    },
    methods: {
        render() {
            this.$emit('render')
        }
    }
});
</script>
<style scoped></style>