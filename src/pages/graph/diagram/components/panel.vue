<template>
    <div class="diagram-panel">
        <div class="setting-block">
            <div>快捷样式</div>
            <div class="short-styles">
                <div v-for="(item, index) in shortStyles" :key="index"
                    :style="{ 'backgroundColor': item.backgroundColor, 'borderColor': item.borderColor, 'borderWidth': item.borderWidth }"
                    @click="setStyle(item)">
                </div>
            </div>
        </div>
        <div class="setting-block">
            <div class="setting-item">
                <span>背景色</span>
                <a-trigger trigger="click" position="bottom" auto-fit-position :unmount-on-close="false">
                    <div class="border-color" :style='{ "backgroundColor": style.backgroundColor }' slot="reference"></div>
                    <template #content>
                        <input type="color" v-model="style.backgroundColor" @input="sync" />
                    </template>
                </a-trigger>
            </div>
            <div class="setting-item">
                <span>线条颜色</span>
                <a-trigger trigger="click" position="bottom" auto-fit-position :unmount-on-close="false" @hide="sync">
                    <div class="border-color" :style='{ "backgroundColor": style.borderColor }' slot="reference"></div>
                    <template #content>
                        <input type="color" v-model="style.borderColor" @input="sync" />
                    </template>
                </a-trigger>
            </div>
            <div class="setting-item">
                <span>线条样式</span>
                <a-select v-model="style.borderStyle" size="small" @change="sync">
                    <a-option value="hidden" label="不显示"></a-option>
                    <a-option value="solid">
                        <div class="border-style" :style="{ borderBottomStyle: 'solid' }">实线</div>
                    </a-option>
                    <a-option value="dashed">
                        <div class="border-style" :style="{ borderBottomStyle: 'dashed' }">虚线</div>
                    </a-option>
                    <a-option value="dotted">
                        <div class="border-style" :style="{ borderBottomStyle: 'dotted' }">连续点</div>
                    </a-option>
                </a-select>
            </div>
            <div class="setting-item">
                <span>线条宽度</span>
                <a-select v-model="style.borderWidth" @change="sync">
                    <a-option v-for="item in borderWidthOptions" :key="item" :label="`${item}px`" :value="item"></a-option>
                </a-select>
            </div>
            <div class="setting-item">
                <span>文本颜色</span>
                <a-trigger trigger="click" position="bottom" auto-fit-position :unmount-on-close="false">
                    <div class="border-color" :style='{ "backgroundColor": style.fontColor }' slot="reference"></div>
                    <template #content>
                        <input type="color" v-model="style.fontColor" @change="sync" />
                    </template>
                </a-trigger>

            </div>
            <div class="setting-item">
                <span>文本大小</span>
                <a-input-number v-model="style.fontSize" size="mini" :min="12" :max="100" style="width: 80px;"
                    @change="sync">
                    <template #suffix>
                        px
                    </template>
                </a-input-number>
            </div>
            <div class="setting-item">
                <span>文本字体</span>
                <a-select v-model="style.fontFamily" size="small" allow-clear @change="sync">
                    <a-option v-for="(fontFamily, index) in fontFamilies" :value="fontFamily" :key="index">
                        {{ fontFamily }}
                    </a-option>
                </a-select>
            </div>
            <div class="setting-item">
                <span>行高</span>
                <a-select v-model="style.lineHeight" size="small" @change="sync">
                    <a-option v-for="(item, index) in lineHeightOptions" :key="index" :value="`${item}`">{{ item
                    }}</a-option>
                </a-select>
            </div>
            <div class="setting-item">
                <span>文本样式</span>
                <a-checkbox-group v-model="fontStyle" @change="syncFontStyle">
                    <a-checkbox value="underline">U</a-checkbox>
                    <a-checkbox value="bold">B</a-checkbox>
                    <a-checkbox value="italic">I</a-checkbox>
                </a-checkbox-group>
            </div>
            <div style="margin-top: 14px;">
                <a-button-group>
                    <a-button @click="$emit('set-level', 'top')">置为顶部</a-button>
                    <a-button @click="$emit('set-level', 'bottom')">置为底部</a-button>
                </a-button-group>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { shortStyles, borderStyles, fontFamilies } from '../constants'
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        elementsStyle: Object,
        onlyEdge: Boolean // 是否是只设置边的属性，当只设置边的属性时，隐藏快捷样式和背景色设置
    },
    emits: ['set-level', 'set-style'],
    data() {
        return {
            // 选项
            shortStyles,
            borderStyles,
            fontFamilies,
            borderWidthOptions: Array(11).fill(1).map((_, i) => i),
            lineHeightOptions: Array(5).fill(1).map((_, i) => _ + i * 0.5),
            // 样式
            style: {
                backgroundColor: '#ffffff', // 填充色
                borderType: 0, // 线条类型
                borderColor: '', // 填充颜色
                borderWidth: 1, // 线条宽度
                borderStyle: 'solid', // 线条类型
                fontSize: 12, // 文本大小
                fontColor: '#000000', // 文本颜色
                fontWeight: '', // 文本加粗
                fontFamily: '', // 文本样式
                lineHeight: '1', // 行高
                textAlign: 'center', // 对齐
                fontStyle: '',
                textDecoration: ''
            } as Record<string, any>,
            fontStyle: new Array<string>()
        }
    },
    watch: {
        elementsStyle: {
            handler(newValue) {
                this.fontStyle = new Array<string>()
                this.style = Object.assign({
                    backgroundColor: '#ffffff', // 填充色
                    borderType: 0, // 线条类型
                    borderColor: '', // 填充颜色
                    borderWidth: 1, // 线条宽度
                    borderStyle: 'solid', // 线条类型
                    fontSize: 12, // 文本大小
                    fontColor: '#000000', // 文本颜色
                    fontWeight: '', // 文本加粗
                    fontFamily: '', // 文本样式
                    lineHeight: '1', // 行高
                    textAlign: 'center', // 对齐
                    fontStyle: '',
                    textDecoration: ''
                }, newValue);
                if (this.style.textDecoration === 'underline') {
                    this.fontStyle.push('underline')
                }
                if (this.style.fontWeight === 'bold') {
                    this.fontStyle.push('bold')
                }
                if (this.style.fontStyle === 'italic') {
                    this.fontStyle.push('italic')
                }
            },
            immediate: true
        },
    },
    methods: {
        sync() {
            this.setStyle(this.style);
        },
        setStyle(item: any) {
            this.style = item;
            this.$emit('set-style', item)
        },
        syncFontStyle() {
            if (this.fontStyle.indexOf('underline') > -1) {
                this.style.textDecoration = 'underline'
            } else {
                this.style.textDecoration = 'none'
            }
            if (this.fontStyle.indexOf('italic') > -1) {
                this.style.fontStyle = 'italic'
            } else {
                this.style.fontStyle = 'none'
            }
            if (this.fontStyle.indexOf('bold') > -1) {
                this.style.fontWeight = 'bold'
            } else {
                this.style.fontWeight = 'normal'
            }
            this.sync();
        },

        changeTextAlign(val: any) {
            this.$emit('set-style', {
                textAlign: val
            })
        }
    },
})
</script>

<style scoped lang="less">
.diagram-panel {
    width: 236px;
}

.short-styles {
    width: 240px;
    margin-top: 14px;

    &>div {
        width: 20px;
        height: 20px;
        margin: 0 10px 5px 0;
        box-sizing: border-box;
        float: left;
        border: 1px solid #fff;
        cursor: pointer;
    }
}


.border-style {
    width: 150px;
    height: 0px;
    margin-top: 18px;
    border-bottom-width: 1px;
    border-bottom-color: black;
}

.setting-block {
    overflow: hidden;
}

.setting-item {
    line-height: 12px;
    font-size: 12px;
    display: flex;
    vertical-align: middle;
    align-items: center;
    margin-top: 10px;
}

.setting-item {
    &>span {
        margin-right: 10px;
        text-align: right;
        flex-shrink: 0;
        flex-grow: 0;

        &:first-child {
            width: 48px;
        }
    }
}

.border-color {
    width: 40px;
    height: 30px;
    display: inline-block;
    border: 1px solid #eaeaeb;
}
</style>