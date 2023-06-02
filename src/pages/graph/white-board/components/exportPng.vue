<template>
    <!-- 导出图片弹窗 -->
    <a-modal v-model:visible="visible" title="导出为图片" :width="800" fullscreen>
        <div class="imagePreviewBox">
            <a-image :src="imageUrl" alt="" height="100%" fit="cover"/>
        </div>
        <template #footer>
            <a-checkbox v-model="onlySelected" @change="reRenderExportImage" style="margin-right: 10px">仅导出被选中</a-checkbox>
            <a-checkbox v-model="renderBackground" @change="reRenderExportImage" style="margin-right: 10px">背景</a-checkbox>
            <a-input v-model="fileName" placeholder="文件名" style="width: 250px; margin-right: 10px"></a-input>
            <a-input-number v-model="imagePaddingX" placeholder="上边距" :min="10" :max="100" :step="5" controls-position="right"
                @change="reRenderExportImage" style="margin-right: 10px;width: 100px;" />
            <a-input-number v-model="imagePaddingY" placeholder="左边距" :min="10" :max="100" :step="5" controls-position="right"
                @change="reRenderExportImage" style="margin-right: 10px;width: 100px;" />
            <a-button type="primary" @click="download">下载</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts">
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'white-board-export-png',
    props: {
        app: Object,
        show: Boolean
    },
    emits: ['update:show'],
    data: () => ({
        visible: false,
        imageUrl: '',
        onlySelected: false,
        renderBackground: true,
        fileName: '',
        imagePaddingX: 20,
        imagePaddingY: 20
    }),
    computed: {
        ...mapState(useGlobalStore, ['title'])
    },
    watch: {
        show(newValue: boolean) {
            this.visible = newValue;
            if (newValue) {
                this.reRenderExportImage()
            }
        },
        visible(newValue: boolean) {
            this.$emit('update:show', newValue);
        }
    },
    created() {
        this.fileName = this.title;
    },
    methods: {
        reRenderExportImage() {
            if (this.app) {
                this.imageUrl = this.app.exportImage({
                    renderBg: this.renderBackground,
                    paddingX: this.imagePaddingX,
                    paddingY: this.imagePaddingY,
                    onlySelected: this.onlySelected
                });
            }
        },
        download() {

        }
    }
});
</script>
<style scoped>
.imagePreviewBox {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==');
}
</style>