<template>
    <a-layout class="cropper">
        <a-layout-header class="header">
            <a-button-group type="text">
                <a-button @click="collapsed = !collapsed" :status="collapsed ? 'normal' : 'success'"
                    :disabled="imageSrc === '' || lock">
                    <template #icon><icon-layout /></template>
                </a-button>
                <a-button @click="upload" :disabled="lock">
                    <template #icon><icon-upload /></template>
                </a-button>
                <a-button @click="reset" :disabled="lock || imageSrc === ''">
                    <template #icon><icon-refresh /></template>
                </a-button>
                <a-button @click="clear" :disabled="lock || imageSrc === ''">
                    <template #icon><icon-delete /></template>
                </a-button>
            </a-button-group>
            <a-radio-group v-model="drag" type="button" :disabled="lock || imageSrc === ''">
                <a-radio :value="true"><icon-drag-arrow /></a-radio>
                <a-radio :value="false"><icon-fullscreen /></a-radio>
            </a-radio-group>
            <div style="text-align: right;">
                <a-button-group type="text">
                    <a-button @click="switchLock" :status="lock ? 'success' : 'normal'" :disabled="imageSrc === ''">
                        <template #icon><icon-lock /></template>
                    </a-button>
                    <a-button @click="openPreview" :disabled="imageSrc === ''">
                        <template #icon><icon-download /></template>
                    </a-button>
                </a-button-group>
            </div>
        </a-layout-header>
        <a-layout style="height: 400px;">
            <a-layout-sider :width="230" :collapsed-width="0" :collapsed="collapsed">
                <a-divider>比例</a-divider>
                <a-button type="outline" v-for="proportion in proportions" style="margin: 3px 4px;"
                    @click="updateAspectRatio(proportion.value)">
                    {{ proportion.label }}
                </a-button>
                <a-divider>尺寸</a-divider>
                <a-button type="outline" v-for="size in sizes" style="margin: 3px 4px;"
                    @click="updateAspectRatio(size.value)">
                    {{ size.label }}
                </a-button>
            </a-layout-sider>
            <a-layout-content>
                <div class="cropper-container-wrap" ref="cropper-container-wrap">
                    <img class="cropper-container" ref="cropper-container" :src="imageSrc" />
                </div>
            </a-layout-content>
        </a-layout>
        <a-image-preview :src="preview.src" v-model:visible="preview.dialog">
            <template #actions>
                <a-image-preview-action name="下载" @click="execDown"><icon-download /></a-image-preview-action>
            </template>
        </a-image-preview>
    </a-layout>
</template>
<script lang="ts">
import { downloadByUrl } from "@/utils/BrowserUtil";
import { useFileSystemAccess } from "@vueuse/core";
import Cropper from "cropperjs";
import 'cropperjs/dist/cropper.min.css';
import { markRaw } from "vue";
import { defineComponent } from "vue";
import { sizes, proportions } from './constant';

export default defineComponent({
    name: 'cropper',
    data: () => ({
        sizes, proportions,
        collapsed: true,
        drag: false,
        instance: undefined as Cropper | undefined,
        fileSystem: useFileSystemAccess({
            dataType: 'Blob',
            types: [{
                description: '图片',
                accept: {
                    'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                },
            }]
        }),
        imageSrc: '',
        options: {
            // 是否显示虚拟网格线
            guides: true,
            // 不允许超出图片边界
            viewMode: 1,
            // 裁剪图片的宽高比例
            aspectRatio: 1 / 1,
        } as Cropper.Options<HTMLImageElement>,
        lock: false,
        preview: {
            dialog: false,
            src: '',
            width: 200,
            height: 200
        }
    }),
    watch: {
        drag(newValue) {
            if (!this.instance) {
                return;
            }
            if (newValue) {
                this.instance.setDragMode('move');
            } else {
                this.instance.setDragMode('crop');
            }
        }
    },
    methods: {
        upload() {
            if (this.imageSrc !== '') {
                window.URL.revokeObjectURL(this.imageSrc);
            }
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                this.imageSrc = window.URL.createObjectURL(this.fileSystem.data as Blob);
                this.$nextTick(() => {
                    let instance = new Cropper(
                        this.$refs['cropper-container'] as HTMLImageElement,
                        {
                            // 是否显示虚拟网格线
                            guides: this.options.guides,
                            // 不允许超出图片边界
                            viewMode: this.options.viewMode,
                            // 裁剪图片的宽高比例
                            aspectRatio: this.options.aspectRatio,
                            dragMode: this.drag ? 'move' : 'crop',
                        }
                    );
                    this.instance = markRaw(instance);
                })
            });
        },
        reset() {
            if (this.instance) {
                this.instance.reset();
            }
        },
        clear() {
            if (this.instance) {
                this.instance.clear();
            }
        },
        switchLock() {
            if (!this.instance) {
                return;
            }
            this.lock = !this.lock;
            if (this.lock) {
                this.instance.disable();
            } else {
                this.instance.enable();
            }
        },
        openPreview() {
            if (!this.instance) {
                return;
            }
            if (this.preview.src !== '') {
                window.URL.revokeObjectURL(this.preview.src);
            }
            this.preview.dialog = true;
            this.preview.src = this.instance.getCroppedCanvas({
                width: this.preview.width,
                height: this.preview.height
            }).toDataURL();
        },
        execDown() {
            downloadByUrl(this.preview.src, "图片编辑器.png");
        },
        updateAspectRatio(aspectRatio: number) {
            if (!this.instance) {
                return;
            }
            this.options.aspectRatio = aspectRatio;
            this.instance.setAspectRatio(this.options.aspectRatio);
        }
    }
});
</script>
<style lang="less">
.cropper {
    position: relation;
    height: 100%;
    width: 100%;

    .header {
        display: grid;
        grid-template-columns: 1fr 85px 1fr;
    }

    .cropper-container {
        width: 100%;
        display: block;
        max-width: 100%;
    }

    .cropper-container-wrap {
        // 定位
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        // 布局
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

.cropper-preview-wrap {
    height: 200px;

}
</style>