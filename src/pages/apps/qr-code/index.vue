<template>
    <div class="qr-code">
        <!-- 内容编辑器 -->
        <div class="editor">
            <a-textarea v-model="value" allow-clear show-word-limit :max-length="255"
                :auto-size="{ minRows: 6, maxRows: 8 }" />
            <div class="option">
                <a-button style="margin-right: 7px;" @click="clean">清空</a-button>
                <a-button type="primary" @click="generate">生成</a-button>
            </div>
        </div>
        <!-- 预览 -->
        <div class="preview">
            <div ref="qr-code-preview"></div>
        </div>
        <!-- 设置 -->
        <div class="setting">
            <a-tabs v-model:active-key="settingActiveKey" hide-content>
                <a-tab-pane key="dot" title="点"></a-tab-pane>
                <a-tab-pane key="corners-square" title="角方形"></a-tab-pane>
                <a-tab-pane key="corners-dot" title="角点"></a-tab-pane>
                <a-tab-pane key="background" title="背景"></a-tab-pane>
                <a-tab-pane key="image" title="中间图片"></a-tab-pane>
            </a-tabs>
            <div class="container">
                <!-- 点设置 -->
                <a-form :model="dotSetting" layout="vertical" v-show="settingActiveKey === 'dot'">
                    <a-form-item label="类型">
                        <a-radio-group v-model="dotSetting.type" type="button">
                            <a-radio value="square">正方形</a-radio>
                            <a-radio value="dots">点</a-radio>
                            <a-radio value="rounded">圆角</a-radio>
                            <a-radio value="extra-rounded">重圆角</a-radio>
                            <a-radio value="classy">时尚</a-radio>
                            <a-radio value="classy-rounded">时尚圆形</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色类型">
                        <a-radio-group v-model="dotSetting.colorType">
                            <a-radio value="sign">单一颜色</a-radio>
                            <a-radio value="gradient">渐变颜色</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色" v-if="dotSetting.colorType === 'sign'">
                        <color-picker v-model:color="dotSetting.color" />
                    </a-form-item>
                    <a-form-item label="渐变类型" v-if="dotSetting.colorType === 'gradient'">
                        <a-radio-group v-model="dotSetting.gradientType" type="button">
                            <a-radio value="linear">线性</a-radio>
                            <a-radio value="radial">放射状</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="渐变颜色" v-if="dotSetting.colorType === 'gradient'">
                        <color-picker v-model:color="dotSetting.gradientColor1" />
                        <span style="margin: 0 7px;"> => </span>
                        <color-picker v-model:color="dotSetting.gradientColor2" />
                    </a-form-item>
                    <a-form-item label="渐变角度"
                        v-if="dotSetting.colorType === 'gradient' && dotSetting.gradientType === 'linear'">
                        <a-slider v-model="dotSetting.rotation" :min="0" :max="360" style="width: 300px;" />
                    </a-form-item>
                </a-form>
                <!-- 角方块 -->
                <a-form :model="cornersSquareSetting" layout="vertical" v-show="settingActiveKey === 'corners-square'">
                    <a-form-item label="类型">
                        <a-radio-group v-model="cornersSquareSetting.type" type="button">
                            <a-radio value="square">正方形</a-radio>
                            <a-radio value="dots">点</a-radio>
                            <a-radio value="extra-rounded">重圆角</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色类型">
                        <a-radio-group v-model="cornersSquareSetting.colorType">
                            <a-radio value="sign">单一颜色</a-radio>
                            <a-radio value="gradient">渐变颜色</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色" v-if="cornersSquareSetting.colorType === 'sign'">
                        <color-picker v-model:color="cornersSquareSetting.color" />
                    </a-form-item>
                    <a-form-item label="渐变类型" v-if="cornersSquareSetting.colorType === 'gradient'">
                        <a-radio-group v-model="cornersSquareSetting.gradientType" type="button">
                            <a-radio value="linear">线性</a-radio>
                            <a-radio value="radial">放射状</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="渐变颜色" v-if="cornersSquareSetting.colorType === 'gradient'">
                        <color-picker v-model:color="cornersSquareSetting.gradientColor1" />
                        <span style="margin: 0 7px;"> => </span>
                        <color-picker v-model:color="cornersSquareSetting.gradientColor2" />
                    </a-form-item>
                    <a-form-item label="渐变角度"
                        v-if="cornersSquareSetting.colorType === 'gradient' && cornersSquareSetting.gradientType === 'linear'">
                        <a-slider v-model="cornersSquareSetting.rotation" :min="0" :max="360" style="width: 300px;" />
                    </a-form-item>
                </a-form>
                <!-- 角点 -->
                <a-form :model="cornersDotSetting" layout="vertical" v-show="settingActiveKey === 'corners-dot'">
                    <a-form-item label="类型">
                        <a-radio-group v-model="cornersDotSetting.type" type="button">
                            <a-radio value="square">正方形</a-radio>
                            <a-radio value="dots">点</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色类型">
                        <a-radio-group v-model="cornersDotSetting.colorType">
                            <a-radio value="sign">单一颜色</a-radio>
                            <a-radio value="gradient">渐变颜色</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色" v-if="cornersDotSetting.colorType === 'sign'">
                        <color-picker v-model:color="cornersDotSetting.color" />
                    </a-form-item>
                    <a-form-item label="渐变类型" v-if="cornersDotSetting.colorType === 'gradient'">
                        <a-radio-group v-model="cornersDotSetting.gradientType" type="button">
                            <a-radio value="linear">线性</a-radio>
                            <a-radio value="radial">放射状</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="渐变颜色" v-if="cornersDotSetting.colorType === 'gradient'">
                        <color-picker v-model:color="cornersDotSetting.gradientColor1" />
                        <span style="margin: 0 7px;"> => </span>
                        <color-picker v-model:color="cornersDotSetting.gradientColor2" />
                    </a-form-item>
                    <a-form-item label="渐变角度"
                        v-if="cornersDotSetting.colorType === 'gradient' && cornersDotSetting.gradientType === 'linear'">
                        <a-slider v-model="cornersDotSetting.rotation" :min="0" :max="360" style="width: 300px;" />
                    </a-form-item>
                </a-form>
                <!-- 背景 -->
                <a-form :model="backgroundSetting" layout="vertical" v-show="settingActiveKey === 'background'">
                    <a-form-item label="颜色类型">
                        <a-radio-group v-model="backgroundSetting.colorType">
                            <a-radio value="sign">单一颜色</a-radio>
                            <a-radio value="gradient">渐变颜色</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="颜色" v-if="backgroundSetting.colorType === 'sign'">
                        <color-picker v-model:color="backgroundSetting.color" />
                    </a-form-item>
                    <a-form-item label="渐变类型" v-if="backgroundSetting.colorType === 'gradient'">
                        <a-radio-group v-model="backgroundSetting.gradientType" type="button">
                            <a-radio value="linear">线性</a-radio>
                            <a-radio value="radial">放射状</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="渐变颜色" v-if="backgroundSetting.colorType === 'gradient'">
                        <color-picker v-model:color="backgroundSetting.gradientColor1" />
                        <span style="margin: 0 7px;"> => </span>
                        <color-picker v-model:color="backgroundSetting.gradientColor2" />
                    </a-form-item>
                    <a-form-item label="渐变角度"
                        v-if="backgroundSetting.colorType === 'gradient' && backgroundSetting.gradientType === 'linear'">
                        <a-slider v-model="backgroundSetting.rotation" :min="0" :max="360" style="width: 300px;" />
                    </a-form-item>
                </a-form>
                <div v-show="settingActiveKey === 'image'">
                    <a-button type="primary" @click="open">选择图片</a-button>
                    <a-button type="primary" status="danger" style="margin-left: 7px;" @click="clearImage">清除图片</a-button>
                    <p>{{ imageName }}</p>
                </div>
            </div>
        </div>
        <!-- 下载 -->
        <div class="download">
            <a-button type="primary" long status="success" @click="download" :disabled="!allowDownload">下载</a-button>
            <a-form :model="downloadConfig" layout="vertical" style="margin-top: 7px;">
                <a-form-item label="类型">
                    <a-select v-model="downloadType">
                        <a-option value="svg">svg</a-option>
                        <a-option value="png">png</a-option>
                        <a-option value="jpeg">jpeg</a-option>
                        <a-option value="webp">webp</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="宽度">
                    <a-input-number v-model="downloadConfig.width" :min="1" />
                </a-form-item>
                <a-form-item label="高度">
                    <a-input-number v-model="downloadConfig.height" :min="1" />
                </a-form-item>
                <a-form-item label="外边距">
                    <a-input-number v-model="downloadConfig.margin" :min="1" />
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import QRCodeStyling, { DotType } from 'qr-code-styling'
import { markRaw } from "vue";
import MessageUtil from "@/utils/MessageUtil";

import ColorPicker from '@/components/color-picker/index.vue';
import { useFileSystemAccess } from "@vueuse/core";

export default defineComponent({
    name: 'qr-code',
    components: { ColorPicker },
    data: () => ({
        value: '',
        instance: markRaw(new QRCodeStyling({
            width: 186,
            height: 186,
            type: 'svg',
        })),
        downloadConfig: {
            margin: 0,
            width: 186,
            height: 186
        },
        downloadType: 'png' as "svg" | "png" | "jpeg" | "webp",
        allowDownload: false,
        settingActiveKey: 'dot',
        dotSetting: {
            type: "extra-rounded" as DotType,
            colorType: 'sign',
            color: "#000000",
            gradientType: 'linear',
            rotation: 0,
            gradientColor1: '#555555',
            gradientColor2: '$999999'
        },
        cornersSquareSetting: {
            type: "extra-rounded" as DotType,
            colorType: 'sign',
            color: "#000000",
            gradientType: 'linear',
            rotation: 0,
            gradientColor1: '#555555',
            gradientColor2: '$999999'
        },
        cornersDotSetting: {
            type: "square" as DotType,
            colorType: 'sign',
            color: "#000000",
            gradientType: 'linear',
            rotation: 0,
            gradientColor1: '#555555',
            gradientColor2: '$999999'
        },
        backgroundSetting: {
            colorType: 'sign',
            color: "#ffffff",
            gradientType: 'linear',
            rotation: 0,
            gradientColor1: '#555555',
            gradientColor2: '$999999'
        },
        image: '',
        imageName: '',
        fileSystem: useFileSystemAccess({
            dataType: 'Blob',
            types: [{
                description: '图片',
                accept: {
                    'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                },
            }]
        })
    }),
    methods: {
        clean() {
            this.value = '';
            let preview = this.$refs['qr-code-preview'] as HTMLElement;
            preview.innerHTML = '';
            this.allowDownload = false;
            this.downloadConfig = {
                margin: 0,
                width: 186,
                height: 186
            };
            this.clearImage();
        },
        generate() {
            // 校验文字
            if (this.value.trim() === "") {
                MessageUtil.warning("请输入文字");
                return;
            }
            // 点设置
            let dotsOptions = {
                type: this.dotSetting.type
            } as Record<string, any>;
            if (this.dotSetting.colorType === 'sign') {
                dotsOptions['color'] = this.dotSetting.color
            } else {
                dotsOptions['gradient'] = {
                    type: this.dotSetting.gradientType,
                    rotation: this.dotSetting.rotation,
                    colorStops: [{
                        offset: 0,
                        color: this.dotSetting.gradientColor1
                    }, {
                        offset: 180,
                        color: this.dotSetting.gradientColor2
                    }]
                }
            }
            // 角方块
            let cornersSquareOptions = {
                type: this.cornersSquareSetting.type
            } as Record<string, any>;
            if (this.cornersSquareSetting.colorType === 'sign') {
                cornersSquareOptions['color'] = this.cornersSquareSetting.color
            } else {
                cornersSquareOptions['gradient'] = {
                    type: this.cornersSquareSetting.gradientType,
                    rotation: this.cornersSquareSetting.rotation,
                    colorStops: [{
                        offset: 0,
                        color: this.cornersSquareSetting.gradientColor1
                    }, {
                        offset: 180,
                        color: this.cornersSquareSetting.gradientColor2
                    }]
                }
            }
            // 角点
            let cornersDotOptions = {
                type: this.cornersDotSetting.type
            } as Record<string, any>;
            if (this.cornersDotSetting.colorType === 'sign') {
                cornersDotOptions['color'] = this.cornersDotSetting.color
            } else {
                cornersDotOptions['gradient'] = {
                    type: this.cornersDotSetting.gradientType,
                    rotation: this.cornersDotSetting.rotation,
                    colorStops: [{
                        offset: 0,
                        color: this.cornersDotSetting.gradientColor1
                    }, {
                        offset: 180,
                        color: this.cornersDotSetting.gradientColor2
                    }]
                }
            }
            // 角点
            let backgroundOptions = {
            } as Record<string, any>;
            if (this.backgroundSetting.colorType === 'sign') {
                backgroundOptions['color'] = this.backgroundSetting.color
            } else {
                backgroundOptions['gradient'] = {
                    type: this.backgroundSetting.gradientType,
                    rotation: this.backgroundSetting.rotation,
                    colorStops: [{
                        offset: 0,
                        color: this.backgroundSetting.gradientColor1
                    }, {
                        offset: 180,
                        color: this.backgroundSetting.gradientColor2
                    }]
                }
            }
            // 更新设置
            this.instance.update({
                data: this.value,
                ...this.downloadConfig,
                dotsOptions,
                cornersSquareOptions,
                cornersDotOptions,
                backgroundOptions,
                image: this.image
            })
            // 生成
            this.instance.append(this.$refs['qr-code-preview'] as HTMLElement);
            this.allowDownload = true;
        },
        download() {
            this.instance.download({
                name: "二维码",
                extension: this.downloadType
            })
        },
        async open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                console.log(this.fileSystem.data);
                this.image = window.URL.createObjectURL(this.fileSystem.data as Blob);
                this.imageName = this.fileSystem.fileName;
            })
        },
        clearImage() {
            if (this.image !== '') {
                window.URL.revokeObjectURL(this.image);
            }
            this.image = '';
            this.imageName = '';
        }
    }
});
</script>
<style lang="less">
.qr-code {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-rows: 200px 1fr;
    grid-template-columns: 1fr 200px;


    .editor {
        padding: 7px;
        border-right: 1px solid var(--color-neutral-3);
        border-bottom: 1px solid var(--color-neutral-3);

        .option {
            width: 100%;
            text-align: center;
            margin-top: 10px;
        }
    }

    .preview {
        padding: 7px;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .setting {
        border-right: 1px solid var(--color-neutral-3);
        position: relative;

        .container {
            position: absolute;
            top: 47px;
            left: 7px;
            right: 7px;
            bottom: 7px;
            overflow: auto;
        }
    }

    .download {
        padding: 7px;
        overflow: auto;
    }
}
</style>