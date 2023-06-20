<template>
    <div class="tui-image-editor">
        <div class="container">
            <div class="tie" ref="tie" :style="style"></div>
            <a-result status="404" title="请加载图片" class="empty" v-if="first"/>
        </div>
        <div class="tool">
            <a-button-group type="text">
                <a-button :disabled="first || cropMode" @click="startCrop()">裁剪</a-button>
            </a-button-group>
        </div>
        <div class="option">
            <a-button shape="round" style="margin-right: 7px;" @click="open()">
                加载图片
            </a-button>
            <a-button shape="round" type="primary" :disabled="first" @click="download()">
                下载图片
            </a-button>
        </div>
        <div class="action">
            <a-button shape="round" type="primary" :disabled="first || isEmptyUndoStack" style="margin-right: 7px;"
                      @click="undo()">
                <template #icon>
                    <icon-undo/>
                </template>
            </a-button>
            <a-button shape="round" type="primary" :disabled="first || isEmptyRedoStack" style="margin-right: 14px;"
                      @click="redo()">
                <template #icon>
                    <icon-redo/>
                </template>
            </a-button>
            <a-button shape="round" type="primary" v-if="cropMode" @click="applyCrop()" style="margin-right: 7px;">
                <template #icon>
                    <icon-save/>
                </template>
            </a-button>
            <a-button shape="round" type="primary" status="danger" v-if="cropMode" @click="stopCrop()">
                <template #icon>
                    <icon-close/>
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.min.css'
import {useFileSystemAccess} from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import {downloadByUrl} from "@/utils/BrowserUtil";


export default defineComponent({
    name: 'tui-image-editor',
    data: () => ({
        option: {} as tuiImageEditor.IOptions,
        imageEditor: null as ImageEditor | null,
        fileSystem: useFileSystemAccess({
            dataType: 'Blob',
            types: [{
                description: '图片',
                accept: {
                    'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                },
            }]
        }),
        first: true,
        customerWidth: 0,
        cropMode: false,
        isEmptyUndoStack: false,
        isEmptyRedoStack: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width']),
        style() {
            return {
                width: this.customerWidth + 'px',
                height: (this.height / 2) + 'px',
                left: ((this.width - 48) / 2 - this.customerWidth / 2) + 'px',
                top: (this.height / 2 - 150) + 'px'
            }
        }
    },
    mounted() {
        let imageEditor = new ImageEditor(this.$refs['tie'] as HTMLDivElement, this.option);
        imageEditor.on('mousedown', this.change);
        this.imageEditor = markRaw(imageEditor);
    },
    beforeUnmount() {
        if (this.imageEditor) {
            this.imageEditor.destroy();
        }
    },
    methods: {
        change() {
            if (!this.imageEditor) {
                return;
            }
            this.isEmptyUndoStack = this.imageEditor.isEmptyUndoStack();
            this.isEmptyRedoStack = this.imageEditor.isEmptyRedoStack();
            let res = this.imageEditor.getCanvasSize();
            this.customerWidth = res.width * (this.height / 2) / res.height
        },
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                if (!this.imageEditor) {
                    MessageUtil.warning("组件加载失败，请刷新后重试");
                    return;
                }
                this.first = false
                this.imageEditor.loadImageFromFile(this.fileSystem.data as File, this.fileSystem.fileName)
                    .then(res => this.customerWidth = res.newWidth * (this.height / 2) / res.newHeight);
            });
        },
        undo() {
            if (!this.imageEditor) {
                return;
            }
            this.imageEditor.undo();
            this.change();
        },
        redo() {
            if (!this.imageEditor) {
                return;
            }
            this.imageEditor.redo();
            this.change();
        },
        // ====================================================================
        // ------------------------------ 裁剪相关 ------------------------------
        // ====================================================================
        stopCrop() {
            this.cropMode = false;
            if (!this.imageEditor) {
                return;
            }
            this.imageEditor.stopDrawingMode();
        },
        startCrop() {
            if (!this.imageEditor) {
                return;
            }
            this.cropMode = true;
            this.imageEditor.startDrawingMode('CROPPER');
        },
        applyCrop() {
            if (!this.imageEditor) {
                return;
            }
            let res = this.imageEditor.getCropzoneRect();
            this.imageEditor.crop(res).then(() => {
                if (!this.imageEditor) {
                    return;
                }
                this.cropMode = false;
                this.imageEditor.stopDrawingMode();
                this.change();
            });
        },
        download() {
            if (!this.imageEditor) {
                return;
            }
            downloadByUrl(this.imageEditor.toDataURL(), this.fileSystem.fileName);
        }
    }
});
</script>
<style lang="less">
.tui-image-editor {
    position: relative;
    height: 100%;
    width: 100%;

    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 33px;

        .tie {
            position: absolute;
            user-select: none;
        }

        .empty {
            position: absolute;
            top: 20%;
        }
    }

    .action {
        position: absolute;
        top: 14px;
        left: 14px;
    }

    .option {
        position: absolute;
        top: 14px;
        right: 14px;
    }

    .tool {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 32px;
        border-top: 1px solid var(--color-neutral-3);
    }
}
</style>