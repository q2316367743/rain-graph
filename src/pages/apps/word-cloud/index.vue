<template>
    <div class="word-cloud">
        <a-tabs class="header" v-model:active-key="activeKey" hide-content>
            <a-tab-pane key="keyword" title="关键字" />
            <a-tab-pane key="setting" title="配置" />
            <template #extra>
                <a-button type="text" @click="render">生成</a-button>
            </template>
        </a-tabs>
        <div class="container">
            <div class="content" v-show="activeKey === 'keyword'">
                <a-button-group>
                    <a-button @click="addKeyword" type="primary">新增关键字</a-button>
                    <a-button @click="importKeyword" type="primary">导入关键字</a-button>
                </a-button-group>
                <a-list :bordered="false" class="keyword-record">
                    <a-list-item v-for="(keyword, i) in keywords">
                        <span style="margin-left: 7px;">关键字：</span>
                        <a-input v-model="keywords[i].value" allow-clear style="width: 100px;" />
                        <span style="margin-left: 14px;">字体大小：</span>
                        <a-input-number v-model="keywords[i].size" :min="1" style="width: 70px;" />
                        <span style="margin-left: 14px;" v-if="config.color === 'customer'">颜色：</span>
                        <color-picker v-model:color="keywords[i].color" v-if="config.color === 'customer'" />
                        <template #actions>
                            <a-button type="text" status="danger" @click="removeKeyword(i)">
                                <template #icon>
                                    <icon-delete />
                                </template>
                            </a-button>
                        </template>
                    </a-list-item>
                </a-list>
            </div>
            <div class="content" v-show="activeKey === 'setting'">
                <a-form :model="config" layout="vertical">
                    <a-form-item label="文字颜色">
                        <a-select v-model="config.color" style="width: 150px;">
                            <a-option value="random-light">随机亮色</a-option>
                            <a-option value="random-dark">随机暗色</a-option>
                            <a-option value="customer">自定义</a-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="背景颜色">
                        <color-picker v-model:color="config.background" />
                    </a-form-item>
                    <a-form-item label="字体">
                        <a-select v-model="config.fontFamily" :style="{ width: '320px' }" multiple>
                            <a-option v-for="font in fontFamilyList" :value="font.value">{{ font.label }}</a-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <a-modal title="预览图" v-model:visible="visible" fullscreen>
            <canvas class="word-cloud-preview" ref="word-cloud-preview"></canvas>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import WordCloud from 'wordcloud';
import { fontFamilyList } from '@/global/theme';
import WordCloudKeyword from "./WordCloudKeyword";

import ColorPicker from '@/components/color-picker/index.vue';

export default defineComponent({
    name: 'word-cloud',
    components: { ColorPicker },
    data: () => ({
        fontFamilyList,
        activeKey: 'keyword',
        keywords: new Array<WordCloudKeyword>(),
        config: {
            fontFamily: ['微软雅黑, Microsoft YaHei'],
            // 字体粗细：normal、bold、100
            fontWeight: 'normal',
            // random-light、random-dark
            color: 'random-light',
            // 最小字体
            minSize: 8,
            // 缩放
            scale: 4,
            // 背景颜色
            background: '#ffffff'
        },
        visible: false
    }),
    methods: {
        addKeyword() {
            this.keywords.push({
                value: '',
                size: Math.floor((Math.random() * 10) + 16),
                color: '#000000',
                angle: 'auto'
            })
        },
        removeKeyword(i: number) {
            this.keywords.splice(i, 1);
        },
        importKeyword() {

        },
        render() {
            this.visible = true;
            WordCloud(this.$refs['word-cloud-preview'] as HTMLElement, {
                list: this.keywords.map(keyword => ([keyword.value, keyword.size, keyword.color])),
                fontFamily: this.config.fontFamily.join(','),
                fontWeight: this.config.fontWeight,
                minSize: this.config.minSize,
                backgroundColor: this.config.background,
                color: this.config.color
            });
        }
    }
});
</script>
<style lang="less">
.word-cloud {
    position: relative;
    height: 100%;
    width: 100%;

    .container {
        position: absolute;
        top: 47px;
        left: 7px;
        right: 7px;
        bottom: 7px;

        .content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            .keyword-record {
                position: absolute;
                top: 32px;
                left: 0;
                right: 0;
                bottom: 0;

                .arco-list-item-content {
                    display: flex;
                    line-height: 32px;
                }

                .arco-scrollbar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    overflow: auto;
                }
            }
        }
    }
}

.word-cloud-preview {
    width: 100%;
}
</style>