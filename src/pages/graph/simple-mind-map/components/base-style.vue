<template>
    <a-form :model="style" layout="vertical" class="simple-mind-map-base-style">
        <!-- 背景 -->
        <a-divider>背景</a-divider>
        <a-tabs class="tab" v-model:active-key="activeTab">
            <a-tab-pane title="颜色" key="color">
            </a-tab-pane>
            <a-tab-pane title="图片" key="image">
                <a-upload draggable action="/" style="width: 250px;" />
                <a-form-item label="图片重复">
                    <a-select size="mini" style="width: 120px" v-model="style.backgroundRepeat">
                        <a-option v-for="item in backgroundRepeatList" :key="item.value" :value="item.value">
                            {{ item.name }}
                        </a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="图片位置">
                    <a-select size="mini" style="width: 120px" v-model="style.backgroundPosition">
                        <a-option v-for="item in backgroundPositionList" :key="item.value" :value="item.value">
                            {{ item.name }}
                        </a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="图片大小">
                    <a-select size="mini" style="width: 120px" v-model="style.backgroundSize">
                        <a-option v-for="item in backgroundSizeList" :key="item.value">
                            {{ item.name }}
                        </a-option>
                    </a-select>
                </a-form-item>
            </a-tab-pane>
        </a-tabs>
        <a-divider>连线</a-divider>
        <a-form-item label="颜色">
            <input type="color" v-model="style.lineColor" />
        </a-form-item>
        <a-form-item label="粗细">
            <a-select size="mini" style="width: 80px" v-model="style.lineWidth">
                <a-option v-for="item in lineWidthList" :value="item">{{ item }}</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="风格">
            <a-select size="mini" style="width: 80px" v-model="style.lineStyle">
                <a-option v-for="item in lineStyleList" :key="item.value" :value="item.value">{{ item.name }}</a-option>
            </a-select>
        </a-form-item>
        <a-divider>概要连线</a-divider>
        <a-form-item label="颜色">
            <input type="color" v-model="style.generalizationLineColor" />
        </a-form-item>
        <a-form-item label="粗细">
            <a-select size="mini" style="width: 80px" v-model="style.generalizationLineWidth">
                <a-option v-for="item in lineWidthList" :value="item">{{ item }}</a-option>
            </a-select>
        </a-form-item>
        <a-divider>关联线</a-divider>
        <a-form-item label="颜色">
            <input type="color" v-model="style.associativeLineColor" />
        </a-form-item>
        <a-form-item label="粗细">
            <a-select size="mini" style="width: 80px" v-model="style.associativeLineWidth">
                <a-option v-for="item in lineWidthList" :value="item">{{ item }}</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="激活颜色">
            <input type="color" v-model="style.associativeLineActiveColor" />
        </a-form-item>
        <a-form-item label="激活粗细">
            <a-select size="mini" style="width: 80px" v-model="style.associativeLineActiveWidth">
                <a-option v-for="item in lineWidthList" :value="item">{{ item }}</a-option>
            </a-select>
        </a-form-item>
        <a-divider>关联线文字</a-divider>
        <a-form-item label="字体">
            <a-select size="mini" style="width: 80px" v-model="style.associativeLineTextFontFamily">
                <a-option v-for="item in fontFamilyList" :value="item">{{ item }}</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="颜色">
            <input type="color" v-model="style.associativeLineTextColor" />
        </a-form-item>
        <a-form-item label="字号">
            <a-select size="mini" style="width: 80px" v-model="style.associativeLineTextFontSize">
                <a-option v-for="item in fontSizeList" :value="item">{{ item }}</a-option>
            </a-select>
        </a-form-item>
        <a-divider>节点边框风格</a-divider>
        <a-form-item label="是否使用只有底边框的风格">
            <a-switch v-model="style.nodeUseLineStyle" />
        </a-form-item>
        <a-divider>内边距</a-divider>
        <a-form-item label="水平">
            <a-slider v-model="style.paddingX" />
        </a-form-item>
        <a-form-item label="垂直">
            <a-slider v-model="style.paddingY" />
        </a-form-item>
        <a-divider>图片</a-divider>
        <a-form-item label="图片宽度">
            <a-slider v-model="style.imgMaxWidth" />
        </a-form-item>
        <a-form-item label="图片高度">
            <a-slider v-model="style.imgMaxHeight" />
        </a-form-item>
        <a-divider>图标</a-divider>
        <a-form-item label="大小">
            <a-slider v-model="style.iconSize" />
        </a-form-item>
    </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { lineWidthList, lineStyleList, backgroundRepeatList, backgroundPositionList, backgroundSizeList, fontFamilyList, fontSizeList } from '../data/theme'
import SimpleMindMapWrap from '../SimpleMindMapWrap'

/**
 * @Author: 王林
 * @Date: 2021-06-24 22:52:56
 * @Desc: 基础样式
 */
export default defineComponent({
    name: 'simple-mind-map-base-style',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
    },
    data: () => ({
        lineWidthList,
        fontSizeList,
        activeTab: 'color',
        marginActiveTab: 'second',
        style: {
            backgroundColor: '',
            lineColor: '',
            lineWidth: '',
            lineStyle: '',
            generalizationLineWidth: '',
            generalizationLineColor: '',
            associativeLineColor: '',
            associativeLineWidth: 0,
            associativeLineActiveWidth: 0,
            associativeLineActiveColor: '',
            associativeLineTextFontSize: 0,
            associativeLineTextColor: '',
            associativeLineTextFontFamily: '',
            paddingX: 0,
            paddingY: 0,
            imgMaxWidth: 0,
            imgMaxHeight: 0,
            iconSize: 0,
            backgroundImage: '',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '',
            backgroundSize: '',
            marginX: 0,
            marginY: 0,
            nodeUseLineStyle: false
        } as Record<string, any>,
        config: {
            enableFreeDrag: false,
            mousewheelAction: 'zoom'
        },
        watermarkConfig: {
            show: false,
            text: '',
            lineSpacing: 100,
            textSpacing: 100,
            angle: 30,
            textStyle: {
                color: '',
                opacity: 0,
                fontSize: 1
            }
        },
        updateWatermarkTimer: null,
        enableNodeRichText: true,
        lineStyleList, backgroundRepeatList, backgroundPositionList, backgroundSizeList, fontFamilyList
    }),
    created() {
    },
    methods: {
        /**
         * @Author: 王林
         * @Date: 2021-05-05 14:02:12
         * @Desc: 初始样式
         */
        initStyle() {
            [
                'backgroundColor',
                'lineWidth',
                'lineStyle',
                'lineColor',
                'generalizationLineWidth',
                'generalizationLineColor',
                'associativeLineColor',
                'associativeLineWidth',
                'associativeLineActiveWidth',
                'associativeLineActiveColor',
                'associativeLineTextFontSize',
                'associativeLineTextColor',
                'associativeLineTextFontFamily',
                'paddingX',
                'paddingY',
                'imgMaxWidth',
                'imgMaxHeight',
                'iconSize',
                'backgroundImage',
                'backgroundRepeat',
                'backgroundPosition',
                'backgroundSize',
                'nodeUseLineStyle'
            ].forEach(key => {
                this.style[key] = this.simpleMindMapWrap.getThemeConfig(key)
                if (key === 'backgroundImage' && this.style[key] === 'none') {
                    this.style[key] = ''
                }
            })
        },


        /**
         * @Author: 王林
         * @Date: 2021-05-05 14:05:40
         * @Desc: 更新配置
         */
        update(key: string, value: string) {
        },

        updateMargin(type: string, value: string) {
        },

    }
})
</script>

<style lang="less" scoped>
.simple-mind-map-base-style {
    background-color: var(--color-bg-1);
    overflow-x: hidden;
    padding: 15px;
    width: 250px;

    .arco-form {
        overflow: hidden;
    }


}
</style>