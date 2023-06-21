<template>
    <a-drawer v-model:visible="drawer" title="背景设置" :width="300" :footer="false">
        <a-form :model="config" layout="vertical">
            <a-divider>尺寸</a-divider>
            <a-form-item label="宽">
                <a-input-number v-model="config.width" :min="1"/>
            </a-form-item>
            <a-form-item label="高">
                <a-input-number v-model="config.height" :min="1"/>
            </a-form-item>
            <a-divider>预设尺寸</a-divider>
            <a-form-item>
                <a-button-group type="dashed">
                    <a-button v-for="size in backgroundSizes" @click="updateSize(size.width, size.height)">
                        {{ size.name }}({{ size.width }}x{{ size.height }})
                    </a-button>
                </a-button-group>
            </a-form-item>
            <a-divider>颜色</a-divider>
            <a-form-item>
                <color-picker v-model:color="config.color"/>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import FabricWrap from "@/pages/image/fabric/FabricWrap";
import {backgroundSizes} from "@/pages/image/fabric/data/constant";
import ColorPicker from "@/components/color-picker/index.vue";


export default defineComponent({
    name: 'more-background',
    components: {ColorPicker},
    emits: ['update:visible'],
    props: {
        instance: {
            type: Object,
            required: false,
            default: new FabricWrap()
        },
        visible: Boolean
    },
    data: () => ({
        backgroundSizes,
        drawer: false,
        config: {
            width: 420,
            height: 595,
            color: '#ffffff'
        }
    }),
    watch: {
        visible(newValue) {
            this.drawer = newValue;
        },
        drawer(newValue) {
            this.$emit('update:visible', newValue);
        },
        config: {
            handler() {
                this.instance.updateBackground(this.config);
            },
            deep: true
        }
    },
    methods: {
        updateSize(width: number, height: number) {
            this.config.width = width;
            this.config.height = height;
        }
    }
});
</script>
<style scoped>

</style>