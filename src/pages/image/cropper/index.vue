<template>
    <a-layout class="cropper">
        <!-- 头部 -->
        <a-layout-header class="header">
            <a-button-group type="text">
                <a-button @click="collapsed = !collapsed" :disabled="imageSrc === '' || lock">
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
                    <a-button @click="preview.setting = true" :disabled="lock || imageSrc === ''">
                        <template #icon><icon-settings /></template>
                    </a-button>
                    <a-button @click="switchLock" :status="lock ? 'success' : 'normal'" :disabled="imageSrc === ''">
                        <template #icon><icon-lock /></template>
                    </a-button>
                    <a-button @click="openPreview" :disabled="imageSrc === ''">
                        <template #icon><icon-download /></template>
                    </a-button>
                </a-button-group>
            </div>
        </a-layout-header>
        <!-- 内容 -->
        <a-layout style="height: 400px;">
            <div class="cropper-container-wrap" ref="cropper-container-wrap">
                <img class="cropper-container" ref="cropper-container" :src="imageSrc" alt="示例图片" />
            </div>
        </a-layout>
        <!-- 裁剪预览 -->
        <a-image-preview :src="preview.src" v-model:visible="preview.dialog">
            <template #actions>
                <a-image-preview-action name="下载" @click="execDown"><icon-download /></a-image-preview-action>
            </template>
        </a-image-preview>
        <!-- 比例设置 -->
        <a-drawer placement="left" :header="false" :footer="false" v-model:visible="collapsed" popup-container=".cropper">
            <a-radio-group v-model="options.aspectRatio" @change="updateAspectRatio">
                <a-divider>比例</a-divider>
                <a-radio :value="proportion.value" v-for="proportion in proportions" style="margin: 7px 4px;">
                    {{ proportion.label }}
                </a-radio>
                <a-divider>尺寸</a-divider>
                <a-radio :value="size.value" v-for="size in sizes" style="margin: 7px 4px;">
                    {{ size.label }}
                </a-radio>
                <a-radio value="customer" style="margin: 7px 4px;">自定义</a-radio>
                <a-input-group style="margin-top: 7px;" v-if="options.aspectRatio === 'customer'">
                    <span>长</span>
                    <a-input-number v-model="aspectRatio.x" :min="1" style="margin-left: 14px;" />
                </a-input-group>
                <a-input-group style="margin-top: 7px;" v-if="options.aspectRatio === 'customer'">
                    <span>高</span>
                    <a-input-number v-model="aspectRatio.y" :min="1" style="margin-left: 14px;" />
                </a-input-group>
            </a-radio-group>
        </a-drawer>
        <!-- 预览设置 -->
        <a-drawer title="预览设置" :footer="false" v-model:visible="preview.setting" popup-container=".cropper">
            <a-form :model="preview" layout="vertical">
                <a-form-item label="宽度"> <a-input-number v-model="preview.width" :min="1" /> </a-form-item>
                <a-form-item label="高度"> <a-input-number v-model="preview.height" :min="1" /> </a-form-item>
            </a-form>
        </a-drawer>
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
        collapsed: false,
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
            viewMode: 1 as 0 | 1 | 2 | 3,
            // 裁剪图片的宽高比例
            aspectRatio: 1 as number | string,
        },
        lock: false,
        preview: {
            dialog: false,
            src: '',
            setting: false,
            width: 400,
            height: 400
        },
        aspectRatio: {
            x: 1,
            y: 1
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
        },
        aspectRatio: {
            handler() {
                if (!this.instance) {
                    return;
                }
                this.instance.setAspectRatio(this.aspectRatio.x / this.aspectRatio.y);
            },
            deep: true
        }
    },
    mounted() {
        let path = this.$route.query.path as string;
        // let name = this.$route.query.name as string;
        if (!path) {
            return;
        }
        window.preload.openFile(path)
            .then(buffer => {
                this.imageSrc = window.URL.createObjectURL(new Blob([buffer]));
                this.$nextTick(() => {
                    let instance = new Cropper(
                        this.$refs['cropper-container'] as HTMLImageElement,
                        {
                            // 是否显示虚拟网格线
                            guides: this.options.guides,
                            // 不允许超出图片边界
                            viewMode: this.options.viewMode,
                            // 裁剪图片的宽高比例
                            aspectRatio: typeof this.options.aspectRatio === 'number' ? this.options.aspectRatio : (this.aspectRatio.x / this.aspectRatio.y),
                            dragMode: this.drag ? 'move' : 'crop',
                        }
                    );
                    this.instance = markRaw(instance);
                })
            });
    },
    beforeUnmount() {
        if (this.imageSrc !== '') {
            window.URL.revokeObjectURL(this.imageSrc);
        }
        if (this.preview.src !== '') {
            window.URL.revokeObjectURL(this.preview.src);
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
                            aspectRatio: typeof this.options.aspectRatio === 'number' ? this.options.aspectRatio : (this.aspectRatio.x / this.aspectRatio.y),
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
        updateAspectRatio(aspectRatio: any) {
            if (!this.instance) {
                return;
            }
            if (typeof aspectRatio === 'number') {
                this.options.aspectRatio = aspectRatio;
                this.instance.setAspectRatio(this.options.aspectRatio as number);
            } else {
                this.instance.setAspectRatio(this.aspectRatio.x / this.aspectRatio.y);
            }
        }
    }
});
</script>
<style lang="less">
.cropper {
    position: relative;
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
        top: 32px;
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