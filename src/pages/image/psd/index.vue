<template>
    <a-spin class="psd" :loading="loading" tip="解析中">
        <div class="header">
            <a-button-group type="text">
                <a-button @click="open">
                    <template #icon>
                        <icon-upload/>
                    </template>
                </a-button>
                <a-button @click="download" :disabled="psd === null">
                    <template #icon>
                        <icon-download/>
                    </template>
                </a-button>
            </a-button-group>
            <div class="desc" v-if="preview.src !== ''">
                像素：{{ preview.width }}×{{ preview.height }}，{{ prettyDataUnit(preview.size) }}
            </div>
        </div>
        <div class="container">
            <a-image height="100%" :src="preview.src" v-if="preview.src !== ''"/>
        </div>
    </a-spin>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {useFileSystemAccess} from "@vueuse/core";
import PSD from 'psd.js';
import {downloadByBase64, prettyDataUnit} from '@/utils/BrowserUtil';

export default defineComponent({
    name: 'psd',
    data: () => ({
        loading: false,
        fileSystem: useFileSystemAccess({
            dataType: 'Blob',
            types: [{
                description: 'psd',
                accept: {
                    'application/octet-stream': ['.psd'],
                },
            }]
        }),
        psd: null as PSD | null,
        sourceSrc: '',
        preview: {
            src: '',
            width: 0,
            height: 0,
            size: 0
        }
    }),
    beforeUnmount() {
        this.release();
    },
    methods: {
        prettyDataUnit,
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => this.render());
        },
        render() {
            // 释放旧的资源
            this.release();
            this.sourceSrc = window.URL.createObjectURL(this.fileSystem.data as Blob);
            this.loading = true;
            PSD.fromURL(this.sourceSrc)
                .then(psd => {
                    this.psd = psd;
                    this.psd.parse();
                    this.preview = {
                        src: psd.image.toPng().src,
                        width: psd.image.header.width,
                        height: psd.image.header.height,
                        size: psd.image.file.pos
                    }
                    this.$nextTick(() => this.loading = false);
                });
        },
        release() {
            if (this.sourceSrc !== '') {
                window.URL.revokeObjectURL(this.sourceSrc);
            }
            this.sourceSrc = '';
        },
        download() {
            if (!this.psd) {
                return;
            }
            downloadByBase64(this.preview.src, this.fileSystem.fileName.replace(".psd", "") + ".png");
        }
    }
});
</script>
<style lang="less">

.psd {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-neutral-3);

        .desc {
            line-height: 32px;
            padding-right: 14px;
        }
    }

    .container {
        position: absolute;
        top: 40px;
        left: 7px;
        right: 8px;
        bottom: 7px;
        overflow: auto;
        display: flex;
        justify-content: center;
    }
}
</style>