<template>
    <a-drawer title="设置" v-model:visible="settingDrawer" mask-closable width="300px" cancel-text="取消" ok-text="保存"
        @ok="save">
        <a-form :model="instance" layout="vertical" class="smm-menu-more-setting">
            <a-divider>基础数据</a-divider>
            <a-form-item label="倾斜角度">
                <a-input-number v-model="instance.fishboneDeg" :min="1" :max="179" style="width: 100px;">
                    <template #append>°</template>
                </a-input-number>
                <template #help>如果结构为鱼骨图，那么可以通过该选项控制倾斜角度</template>
            </a-form-item>
            <a-form-item label="放大缩小的增量比例">
                <a-input-number v-model="instance.scaleRatio" :min="0" :step="0.1" :max="1" />
            </a-form-item>
            <a-form-item label="最多显示几个标签">
                <a-input-number v-model="instance.maxTag" />
            </a-form-item>
            <a-form-item label="展开收缩按钮尺寸">
                <a-input-number v-model="instance.expandBtnSize" />
            </a-form-item>
            <a-form-item label="节点里图片和文字的间距">
                <a-input-number v-model="instance.imgTextMargin" />
            </a-form-item>
            <a-form-item label="节点里各种文字信息的间距，如图标和文字的间距">
                <a-input-number v-model="instance.textContentMargin" />
            </a-form-item>
            <a-form-item label="多选节点时鼠标移动到边缘时的画布移动偏移量">
                <a-input-number v-model="instance.selectTranslateStep" />
            </a-form-item>
            <a-form-item label="多选节点时鼠标移动距边缘多少距离时开始偏移">
                <a-input-number v-model="instance.selectTranslateLimit" />
            </a-form-item>
            <a-divider>水印</a-divider>
            <a-form-item label="是否显示水印">
                <a-switch v-model="waterShow" @change="waterShowSwitch()" />
            </a-form-item>
            <a-form-item label="水印文字" v-if="waterShow">
                <a-input v-model="instance.watermarkConfig.text" />
            </a-form-item>
            <a-form-item label="文字颜色" v-if="waterShow">
                <color-picker v-model:color="instance.watermarkConfig.textStyle.color" />
            </a-form-item>
            <a-form-item label="文字透明度" v-if="waterShow">
                <a-slider v-model="instance.watermarkConfig.textStyle.opacity" :min="0.1" :step="0.1" :max="1" />
            </a-form-item>
            <a-form-item label="文字字号" v-if="waterShow">
                <a-input-number v-model="instance.watermarkConfig.textStyle.fontSize" />
            </a-form-item>
            <a-form-item label="旋转角度" v-if="waterShow">
                <a-input-number v-model="instance.watermarkConfig.angle" />
            </a-form-item>
            <a-form-item label="水印行间距" v-if="waterShow">
                <a-input-number v-model="instance.watermarkConfig.lineSpacing" />
            </a-form-item>
            <a-form-item label="水印文字间距" v-if="waterShow">
                <a-input-number v-model="instance.watermarkConfig.textSpacing" />
            </a-form-item>
            <a-divider>默认文字</a-divider>
            <a-form-item label="自定义节点备注内容显示">
                <a-input v-model="instance.customNoteContentShow" />
            </a-form-item>
            <a-form-item label="默认插入的二级节点的文字">
                <a-input v-model="instance.defaultInsertSecondLevelNodeText" />
            </a-form-item>
            <a-form-item label="默认插入的二级以下节点的文字">
                <a-input v-model="instance.defaultInsertBelowSecondLevelNodeText" />
            </a-form-item>
            <a-form-item label="关联线默认文字">
                <a-input v-model="instance.defaultAssociativeLineText" />
            </a-form-item>
            <a-divider>导出设置</a-divider>
            <a-form-item label="导出图片时的内边距">
                <a-input-number v-model="instance.exportPadding" />
            </a-form-item>
            <a-form-item label="导出png、svg、pdf时的图形内边距">
                <a-input-number v-model="instance.exportPaddingX" />
                <template #help>上下</template>
            </a-form-item>
            <a-form-item label="导出png、svg、pdf时的图形内边距">
                <a-input-number v-model="instance.exportPaddingY" />
                <template #help>左右</template>
            </a-form-item>
            <a-divider>其他设置</a-divider>
            <a-form-item label="达到该宽度文本自动换行">
                <a-input-number v-model="instance.textAutoWrapWidth" />
            </a-form-item>
            <a-form-item label="鼠标滚动的行为">
                <a-radio-group v-model="instance.mousewheelAction">
                    <a-radio value="zoom">放大缩小</a-radio>
                    <a-radio value="move">上下移动</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="视图移动的步长" v-if="instance.mousewheelAction === 'move'">
                <a-input-number v-model="instance.mousewheelMoveStep">
                    <template #append>px</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="是否开启节点自由拖拽">
                <a-switch v-model="instance.enableFreeDrag" />
            </a-form-item>
            <a-form-item label="是否只有当鼠标在画布内才响应快捷键事件">
                <a-switch v-model="instance.enableShortcutOnlyWhenMouseInSvg" />
            </a-form-item>
            <a-form-item label="是否开启节点动画过渡">
                <a-switch v-model="instance.enableNodeTransitionMove" />
            </a-form-item>
            <a-form-item label="过渡的时间" v-if="instance.enableNodeTransitionMove">
                <a-input-number v-model="instance.mousewheelMoveStep">
                    <template #append>ms</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="是否在点击了画布外的区域时结束节点文本的编辑状态">
                <a-switch v-model="instance.isEndNodeTextEditOnClickOuter" />
            </a-form-item>
            <a-form-item label="最大历史记录数">
                <a-input-number v-model="instance.maxHistoryCount" />
            </a-form-item>
            <a-form-item label="是否一直显示节点的展开收起按钮">
                <a-switch v-model="instance.alwaysShowExpandBtn" />
                <template #help>默认为鼠标移上去和激活时才显示</template>
            </a-form-item>
            <a-form-item label="节点最大缓存数量">
                <a-input-number v-model="instance.maxNodeCacheCount" />
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import { PropType } from "vue";
import { defineComponent } from "vue";
import { getDefaultConfig } from "../../../data/config";
import SimpleMindMapWrap from "../../../SimpleMindMapWrap";
import { toRaw } from "vue";
import ColorPicker from "@/components/color-picker/index.vue";

export default defineComponent({
    name: 'smm-menu-more-setting',
    components: {ColorPicker},
    emits: ["update:visible"],
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
        visible: Boolean
    },
    data: () => ({
        instance: getDefaultConfig(),
        settingDrawer: false,
        waterShow: false,
        first: true
    }),
    watch: {
        visible(newValue) {
            this.settingDrawer = newValue;
            if (newValue) {
                this.instance = Object.assign(this.instance, this.simpleMindMapWrap.getConfig());
                this.waterShow = this.instance.watermarkConfig.text !== '';
            }
        },
        settingDrawer(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    methods: {
        save() {
            this.simpleMindMapWrap.setConfig(toRaw(this.instance));
        },
        waterShowSwitch() {
            if (this.waterShow) {
                // 显示
                this.instance.watermarkConfig = {
                    text: '水印文字',
                    lineSpacing: 100,
                    textSpacing: 100,
                    angle: 30,
                    textStyle: {
                        color: '#999',
                        opacity: 0.5,
                        fontSize: 14
                    }
                }
            } else {
                this.instance.watermarkConfig.text = '';
            }
        }
    }
});
</script>
<style scoped></style>