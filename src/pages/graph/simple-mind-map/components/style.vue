<template>
    <div class="simple-mind-map-style">
        <a-result status="404" subtitle="请选择一个节点" style="margin-top: 20vh;" v-if="activeNodes.length == 0" />
        <a-form :model="style" layout="horizontal" v-else>
            <a-divider>文字</a-divider>
            <a-form-item label="字体">
                <a-select size="mini" v-model="style.fontFamily" :disabled="checkDisabled('fontFamily')"
                    @change="update('fontFamily')">
                    <a-option v-for="item in fontFamilyList" :key="item.value" :value="item.value"
                        :style="{ fontFamily: item.value }"> {{ item.name }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="字号">
                <a-select size="mini" style="width: 80px" v-model="style.fontSize" :disabled="checkDisabled('fontSize')"
                    @change="update('fontSize')">
                    <a-option v-for="item in fontSizeList" :key="item" :value="item" :style="{ fontSize: item + 'px' }">
                        {{ item }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="行高">
                <a-select size="mini" style="width: 80px" v-model="style.lineHeight" :disabled="checkDisabled('lineHeight')"
                    @change="update('lineHeight')">
                    <a-option v-for="item in lineHeightList" :key="item" :value="item">
                        {{ item }}
                    </a-option>
                </a-select>
            </a-form-item>
            <div class="row">
                <div class="btnGroup">
                    <a-trigger placement="bottom" trigger="hover" :disabled="checkDisabled('color')">
                        <a-tooltip content="颜色" placement="bottom">
                            <div class="styleBtn" :class="{ disabled: checkDisabled('color') }">
                                A
                                <span class="colorShow" :style="{ backgroundColor: style.color || '#eee' }"></span>
                            </div>
                        </a-tooltip>
                        <template #content>
                            <simple-mind-map-base-color v-model:color="style.color" @change="update('color')" />
                        </template>
                    </a-trigger>
                    <a-tooltip content="加粗" placement="bottom">
                        <div class="styleBtn" :class="{
                            actived: style.fontWeight === 'bold',
                            disabled: checkDisabled('fontWeight')
                        }" @click="toggleFontWeight">
                            B
                        </div>
                    </a-tooltip>
                    <a-tooltip content="斜体" placement="bottom">
                        <div class="styleBtn i" :class="{
                            actived: style.fontStyle === 'italic',
                            disabled: checkDisabled('fontStyle')
                        }" @click="toggleFontStyle">
                            I
                        </div>
                    </a-tooltip>
                    <a-trigger placement="bottom" trigger="hover" :disabled="checkDisabled('textDecoration')"
                        :popup-translate="[-100, 10]">
                        <a-tooltip content="划线" placement="bottom">
                            <div class="styleBtn u" :style="{ textDecoration: style.textDecoration || 'none' }"
                                :class="{ disabled: checkDisabled('textDecoration') }">
                                U
                            </div>
                        </a-tooltip>
                        <template #content>
                            <div
                                style="padding: 7px;background-color: var(--color-bg-1);box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);width: 235px;">
                                <a-radio-group type="button" size="mini" v-model="style.textDecoration"
                                    @change="update('textDecoration')">
                                    <a-radio :value="''">无</a-radio>
                                    <a-radio value="underline">下划线</a-radio>
                                    <a-radio value="line-through">中划线</a-radio>
                                    <a-radio value="overline">上划线</a-radio>
                                </a-radio-group>
                            </div>
                        </template>
                    </a-trigger>
                </div>
            </div>
            <a-divider>边框</a-divider>
            <a-form-item label="颜色">
                <a-trigger placement="bottom" trigger="hover" :disabled="checkDisabled('borderColor')">
                    <span class="block" :style="{ backgroundColor: style.borderColor }"
                        :class="{ disabled: checkDisabled('borderColor') }"></span>
                    <template #content>
                        <simple-mind-map-base-color v-model:color="style.borderColor" @change="update('borderColor')" />
                    </template>
                </a-trigger>
            </a-form-item>
            <a-form-item label="样式">
                <a-select size="mini" style="width: 80px" v-model="style.borderDasharray"
                    :disabled="checkDisabled('borderDasharray')" @change="update('borderDasharray')">
                    <a-option v-for="item in borderDasharrayList" :key="item.value" :value="item.value">
                        {{ item.name }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="宽度">
                <a-select size="mini" style="width: 80px" v-model="style.borderWidth"
                    :disabled="checkDisabled('borderWidth')" @change="update('borderWidth')">
                    <a-option v-for="item in borderWidthList" :key="item" :value="item">
                        {{ item }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="颜色">
                <a-select size="mini" style="width: 80px" v-model="style.borderRadius"
                    :disabled="checkDisabled('borderRadius')" @change="update('borderRadius')">
                    <a-option v-for="item in borderRadiusList" :key="item" :value="item">
                        {{ item }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-divider>背景</a-divider>
            <a-form-item label="颜色">
                <a-trigger placement="bottom" trigger="hover" :disabled="checkDisabled('fillColor')">
                    <span class="block" :style="{ backgroundColor: style.fillColor }"
                        :class="{ disabled: checkDisabled('fillColor') }"></span>
                    <template #content>
                        <simple-mind-map-base-color v-model:color="style.fillColor" @change="update('fillColor')" />
                    </template>
                </a-trigger>
            </a-form-item>
            <a-divider>形状</a-divider>
            <div>
                <a-select size="mini" style="width: 120px" v-model="style.shape" :disabled="checkDisabled('shape')"
                    @change="update('shape')">
                    <a-option v-for="item in shapeList" :key="item.value" :value="item.value">
                        {{ item.name }}
                    </a-option>
                </a-select>
            </div>
            <a-divider>线条</a-divider>
            <a-form-item label="颜色">
                <a-trigger placement="bottom" trigger="hover" :disabled="checkDisabled('lineColor')">
                    <span class="block" :style="{ backgroundColor: style.lineColor }"
                        :class="{ disabled: checkDisabled('lineColor') }"></span>
                    <template #content>
                        <simple-mind-map-base-color v-model:color="style.lineColor" @change="update('lineColor')" />
                    </template>
                </a-trigger>
            </a-form-item>
            <a-form-item label="样式">
                <a-select size="mini" style="width: 80px" v-model="style.lineDasharray"
                    :disabled="checkDisabled('lineDasharray')" @change="update('lineDasharray')">
                    <a-option v-for="item in borderDasharrayList" :key="item.value" :value="item.value">
                        {{ item.name }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item label="宽度">
                <a-select size="mini" style="width: 80px" v-model="style.lineWidth" :disabled="checkDisabled('lineWidth')"
                    @change="update('lineWidth')">
                    <a-option v-for="item in borderWidthList" :key="item" :value="item">
                        {{ item }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-divider>节点内边距</a-divider>
            <a-form-item label="水平">
                <a-slider style="width: 200px" v-model="style.paddingX" :disabled="checkDisabled('paddingX')"
                    @change="update('paddingX')"></a-slider>
            </a-form-item>
            <a-form-item label="垂直">
                <a-slider style="width: 200px" v-model="style.paddingY" :disabled="checkDisabled('paddingY')"
                    @change="update('paddingY')"></a-slider>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue';
import {
    fontFamilyList,
    fontSizeList,
    borderWidthList,
    borderDasharrayList,
    borderRadiusList,
    lineHeightList,
    shapeList
} from '../data/theme'
import SimpleMindMapWrap from '../SimpleMindMapWrap';

import SimpleMindMapBaseColor from './base/color.vue';

// 节点样式设置
export default defineComponent({
    name: 'simple-mind-map-style',
    components: { SimpleMindMapBaseColor },
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
    },
    data: () => ({
        supportActiveStyle: new Array<string>(),

        fontSizeList,
        borderWidthList,

        borderRadiusList,
        lineHeightList,
        activeNodes: new Array<any>(),
        activeTab: 'normal',
        style: {
            shape: '',
            paddingX: 0,
            paddingY: 0,
            color: '',
            fontFamily: '',
            fontSize: '',
            lineHeight: '',
            textDecoration: '',
            fontWeight: '',
            fontStyle: '',
            borderWidth: '',
            borderColor: '',
            fillColor: '',
            borderDasharray: '',
            borderRadius: '',
            lineColor: '',
            lineDasharray: '',
            lineWidth: ''
        } as Record<string, any>,
        fontFamilyList, borderDasharrayList, shapeList
    }),
    created() {
        this.simpleMindMapWrap.on('node_active', this.onNodeActive)
    },
    beforeDestroy() {
        this.simpleMindMapWrap.off('node_active', this.onNodeActive)
    },
    methods: {
        // 监听节点激活事件
        onNodeActive(...args: any[]) {
            this.$nextTick(() => {
                this.activeTab = 'normal'
                this.activeNodes = args[1]
                this.initNodeStyle()
            })
        },
        // tab切换
        handleTabClick() {
            this.initNodeStyle()
        },
        // 检查是否禁用
        checkDisabled(prop: string) {
            return (
                this.activeTab === 'active' && !this.supportActiveStyle.includes(prop)
            )
        },
        // 初始节点样式
        initNodeStyle() {
            if (this.activeNodes.length <= 0) {
                this.activeTab = 'normal'
                return
            }
            ;[
                'shape',
                'paddingX',
                'paddingY',
                'color',
                'fontFamily',
                'fontSize',
                'lineHeight',
                'textDecoration',
                'fontWeight',
                'fontStyle',
                'borderWidth',
                'borderColor',
                'fillColor',
                'borderDasharray',
                'borderRadius',
                'lineColor',
                'lineDasharray',
                'lineWidth'
            ].forEach(item => {
                this.style[item] = this.activeNodes[0].getStyle(
                    item,
                    false,
                    this.activeTab === 'active'
                )
            })
        },
        // 修改样式
        update(prop: string) {
            this.activeNodes.forEach(node => {
                node.setStyle(prop, this.style[prop], this.activeTab === 'active')
            });
            // 更新后，保存
            this.simpleMindMapWrap.save();
        },
        // 切换加粗样式
        toggleFontWeight() {
            if (this.style.fontWeight === 'bold') {
                this.style.fontWeight = 'normal'
            } else {
                this.style.fontWeight = 'bold'
            }
            this.update('fontWeight')
        },
        // 切换字体样式
        toggleFontStyle() {
            if (this.style.fontStyle === 'italic') {
                this.style.fontStyle = 'normal'
            } else {
                this.style.fontStyle = 'italic'
            }
            this.update('fontStyle')
        },
        // 修改字体颜色
        changeFontColor(color: string) {
            this.style.color = color
            this.update('color')
        },
        // 修改边框颜色
        changeBorderColor(color: string) {
            this.style.borderColor = color
            this.update('borderColor')
        },
        // 修改线条颜色
        changeLineColor(color: string) {
            this.style.lineColor = color
            this.update('lineColor')
        },
        // 修改背景颜色
        changeFillColor(color: string) {
            this.style.fillColor = color
            this.update('fillColor')
        }
    }
})
</script>
<style lang="less" scoped>
.simple-mind-map-style {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 0 7px;
    padding-bottom: 28px;
    background-color: var(--color-bg-1);

    .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;

        &.disabled {
            background-color: #f5f7fa !important;
            border-color: #e4e7ed !important;
            color: #c0c4cc !important;
            cursor: not-allowed !important;
        }
    }

    .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .btnGroup {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .styleBtn {
            position: relative;
            width: 50px;
            height: 30px;
            background: #fff;
            border: 1px solid #eee;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            cursor: pointer;
            border-radius: 4px;

            &.actived {
                background-color: #eee;
            }

            &.disabled {
                background-color: #f5f7fa !important;
                border-color: #e4e7ed !important;
                color: #c0c4cc !important;
                cursor: not-allowed !important;
            }

            &.i {
                font-style: italic;
            }

            .colorShow {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 2px;
            }
        }
    }
}
</style>