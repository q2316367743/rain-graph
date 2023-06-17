<template>
    <a-modal v-model:visible="dialog" title="JSON编辑器" ok-text="渲染" fullscreen popup-container=".echarts"
            :render-to-body="false" @ok="renderJson">
            <codemirror v-model="record" autofocus auto-destroy :extensions="extensions"
                style="width: 100%;height: 100%;" />
        </a-modal>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'json-editor',
    components: { Codemirror },
    emits: ['update:visible', 'render'],
    props: {
        visible: Boolean
    },
    data: () => ({
        dialog: false,
        record: '',
        extensions: markRaw([json()]) as any[],
    }),
    watch: {
        visible(newValue) {
            this.dialog = newValue;
        },
        dialog(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    methods: {
        renderJson() {
            try {
                let option = JSON.parse(this.record);
                this.$emit('render', option);
            } catch (e) {
                MessageUtil.error("渲染异常", e);
            } finally {
                this.dialog = false;
            }

        }
    }
});
</script>
<style scoped>

</style>