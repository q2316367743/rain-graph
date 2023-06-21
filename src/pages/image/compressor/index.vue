<template>
    <div class="compressor">
        <a-spin :loading="loading" tip="渲染中">
            <div class="header">
                <a-button-group type="text">
                    <a-button @click="open()">
                        <template #icon>
                            <icon-upload/>
                        </template>
                    </a-button>
                    <a-button @click="render()" :disabled="source.src === ''">
                        <template #icon>
                            <icon-refresh/>
                        </template>
                    </a-button>
                    <a-button @click="release()" :disabled="source.src === ''">
                        <template #icon>
                            <icon-delete/>
                        </template>
                    </a-button>
                </a-button-group>
                <div style="width: 200px;margin-top: 10px">
                    <a-slider v-model="config.quality" :min="0" :max="1" :step="0.1" :disabled="source.src === ''"
                              @change="render()"/>
                </div>
                <a-button-group type="text">
                    <a-button @click="drawer = true">
                        <template #icon>
                            <icon-settings/>
                        </template>
                    </a-button>
                </a-button-group>
            </div>
            <div class="container">
                <a-card title="原始图片">
                    <template #extra>
                        <a-button type="text" :disabled="source.src === ''" @click="sourceDownload()">
                            <template #icon>
                                <icon-download/>
                            </template>
                        </a-button>
                    </template>
                    <a-image :height="180" :src="source.src"/>
                    <a-descriptions :column="1" align="left" v-if="source.src !== ''" class="info">
                        <a-descriptions-item label="最后修改日期">{{
                                source.lastModifiedDate ? toDateString(source.lastModifiedDate) : ''
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="文件名">{{ source.name }}</a-descriptions-item>
                        <a-descriptions-item label="文件类型">{{ source.type }}</a-descriptions-item>
                        <a-descriptions-item label="文件大小">{{ prettyDataUnit(source.size) }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>
                <a-card title="压缩后的图片" style="margin-top: 7px">
                    <template #extra>
                        <a-button type="text" :disabled="source.src === ''" @click="targetDownload()">
                            <template #icon>
                                <icon-download/>
                            </template>
                        </a-button>
                    </template>
                    <a-image :height="180" :src="compressor.src"/>
                    <a-descriptions :column="1" align="left" v-if="compressor.src !== ''" class="info">
                        <a-descriptions-item label="最后修改日期">{{
                                toDateString(compressor.lastModifiedDate)
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="文件名">{{ compressor.name }}</a-descriptions-item>
                        <a-descriptions-item label="文件类型">{{ compressor.type }}</a-descriptions-item>
                        <a-descriptions-item label="文件大小">
                            {{ prettyDataUnit(compressor.size) }}
                            （压缩率：{{ ((source.size - compressor.size) / compressor.size * 100).toFixed(2) }}%）
                        </a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </div>
        </a-spin>
        <a-drawer title="设置" v-model:visible="drawer" :width="300" :footer="false" @close="render()">
            <a-form :model="config" layout="vertical">
                <a-form-item label="严格">
                    <a-switch v-model="config.strict"/>
                </a-form-item>
                <a-form-item label="检查方向">
                    <a-switch v-model="config.checkOrientation"/>
                </a-form-item>
                <a-form-item label="保留Exif">
                    <a-switch v-model="config.retainExif"/>
                </a-form-item>
                <a-form-item label="最大宽度">
                    <a-input-number v-model="config.maxWidth" :min="0"/>
                </a-form-item>
                <a-form-item label="最大高度">
                    <a-input-number v-model="config.maxHeight" :min="0"/>
                </a-form-item>
                <a-form-item label="最小宽度">
                    <a-input-number v-model="config.minWidth" :min="0"/>
                </a-form-item>
                <a-form-item label="最小高度">
                    <a-input-number v-model="config.minHeight" :min="0"/>
                </a-form-item>
                <a-form-item label="宽度">
                    <a-input-number v-model="config.width" :min="0"/>
                </a-form-item>
                <a-form-item label="高度">
                    <a-input-number v-model="config.height" :min="0"/>
                </a-form-item>
                <a-form-item label="重置大小">
                    <a-radio-group v-model="config.resize" type="button">
                        <a-radio value="none">无</a-radio>
                        <a-radio value="contain">包含</a-radio>
                        <a-radio value="cover">覆盖</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="质量">
                    <a-slider v-model="config.quality" :min="0" :max="1" :step="0.1"></a-slider>
                </a-form-item>
                <a-form-item label="mimeType">
                    <a-input v-model="config.mimeType"/>
                </a-form-item>
                <a-form-item label="转换类型">
                    <a-input v-model="config.convertTypes"/>
                </a-form-item>
                <a-form-item label="转换大小">
                    <a-input-number v-model="config.convertSize" :min="0"/>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Compressor from 'compressorjs';
import {useFileSystemAccess} from "@vueuse/core";
import {downloadByUrl, prettyDataUnit} from '@/utils/BrowserUtil';
import {toDateString} from "xe-utils";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'compressor',
    data: () => ({
        config: {
            strict: true,
            checkOrientation: true,
            retainExif: false,
            maxWidth: undefined as number | undefined,
            maxHeight: undefined as number | undefined,
            minWidth: undefined as number | undefined,
            minHeight: undefined as number | undefined,
            width: undefined as number | undefined,
            height: undefined as number | undefined,
            resize: 'none' as 'contain' | 'cover' | 'none',
            quality: 0.8,
            mimeType: 'auto',
            convertTypes: 'image/png' as string,
            convertSize: 5000000,
        },
        fileSystem: useFileSystemAccess({
            dataType: 'Blob',
            types: [{
                description: '图片',
                accept: {
                    'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                },
            }]
        }),
        source: {
            src: '',
            blob: new Blob(),
            lastModifiedDate: new Date() as Date | null,
            name: '',
            type: 'image/jpeg',
            size: 0
        },
        compressor: {
            src: '',
            lastModifiedDate: new Date(),
            name: '',
            type: 'image/jpeg',
            size: 0
        },
        drawer: false,
        loading: false
    }),
    mounted() {
        let path = this.$route.query.path as string;
        let name = this.$route.query.name as string;
        if (!path) {
            return;
        }
        window.preload.openFile(path)
            .then(buffer => {
                try {
                    let strings = name.split('.');
                    let type = 'image/' + (strings.length > 0 ? strings[strings.length - 1] : 'png');
                    let blob = new Blob([buffer.buffer], {type});
                    this.source = {
                        src: window.URL.createObjectURL(blob),
                        blob: new File([blob], name, {type}),
                        lastModifiedDate: new Date(),
                        type,
                        name,
                        size: buffer.length
                    };
                    this.render();
                } catch (e) {
                    MessageUtil.error("压缩失败", e);
                }
            })
    },
    beforeUnmount() {
        this.release();
    },
    methods: {
        prettyDataUnit,
        toDateString,
        open() {
            this.release();
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let body = this.fileSystem.data as Blob;
                // 原始图片
                this.source = {
                    src: window.URL.createObjectURL(body),
                    blob: body,
                    lastModifiedDate: new Date(this.fileSystem.fileLastModified),
                    type: this.fileSystem.fileMIME,
                    name: this.fileSystem.fileName,
                    size: this.fileSystem.fileSize
                };
                this.render();
            });
        },
        render() {
            if (this.source.src === '') {
                return;
            }
            if (this.loading) {
                return;
            }
            this.loading = true;
            new Compressor(this.source.blob, {
                ...this.config,
                success: (file: File) => {
                    this.loading = false;
                    this.compressor = {
                        src: window.URL.createObjectURL(file),
                        lastModifiedDate: new Date(file.lastModified),
                        type: file.type,
                        name: file.name,
                        size: file.size
                    }
                }
            });
        },
        release() {
            if (this.source.src !== '') {
                window.URL.revokeObjectURL(this.source.src);
            }
            if (this.compressor.src !== '') {
                window.URL.revokeObjectURL(this.compressor.src);
            }
            this.source.src = '';
            this.compressor.src = '';
        },
        sourceDownload() {
            downloadByUrl(this.source.src, "原始图片");
        },
        targetDownload() {
            downloadByUrl(this.compressor.src, "压缩图片")
        }
    }
});
</script>
<style lang="less">
.compressor {
    position: relative;
    height: 100%;
    width: 100%;

    .arco-spin {
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 40px;
        left: 7px;
        right: 8px;
        bottom: 7px;
        overflow: auto;

        .arco-card-body {
            display: flex;

            .info {
                margin: 30px;
            }
        }
    }
}
</style>