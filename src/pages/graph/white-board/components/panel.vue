<template>
    <div class="white-board-panel">
        <div class="elementStyle" v-if="(activeElement || hasSelectedElements) && show">
            <!-- 描边 -->
            <div class="styleBlock" v-if="!['text', 'image'].includes(activeElement?.type) ||
                hasSelectedElements
                ">
                <div class="styleBlockTitle">描边</div>
                <div class="styleBlockContent">
                    <input type="color" :value="activeElement.style.strokeStyle" v-if="activeElement"
                        @input="updateStyle('strokeStyle', $event)" />
                </div>
            </div>
            <!-- 填充 -->
            <div class="styleBlock" v-if="!['image', 'line', 'arrow', 'freedraw'].includes(
                activeElement?.type
            ) || hasSelectedElements
                ">
                <div class="styleBlockTitle">填充</div>
                <div class="styleBlockContent">
                    <input type="color" :value="activeElement.style.fillStyle" v-if="activeElement"
                        @input="updateStyle('fillStyle', $event)" />
                </div>
            </div>
            <!-- 字体 -->
            <div class="styleBlock" v-if="['text'].includes(activeElement?.type) || hasSelectedElements">
                <div class="styleBlockTitle">字体</div>
                <div class="styleBlockContent">
                    <a-select v-model="fontFamily" placeholder="字体" @change="updateBaseStyle('fontFamily', $event)">
                        <a-option v-for="item in fontFamilyList" :key="item.value" :value="item.value"
                            :style="{ fontFamily: item.value }">{{ item.name }}</a-option>
                    </a-select>
                </div>
            </div>
            <!-- 字号 -->
            <div class="styleBlock" v-if="['text'].includes(activeElement?.type) || hasSelectedElements">
                <div class="styleBlockTitle">字号</div>
                <div class="styleBlockContent">
                    <a-select size="mini" v-model="fontSize" placeholder="字号" @change="updateBaseStyle('fontSize', $event)">
                        <a-option v-for="item in fontSizeList" :key="item.value" :value="item.value"
                            :style="{ fontSize: item.value }">{{ item.name }}
                        </a-option>
                    </a-select>
                </div>
            </div>
            <!-- 描边宽度 -->
            <div class="styleBlock" v-if="!['image', 'text'].includes(activeElement?.type) ||
                hasSelectedElements
                ">
                <div class="styleBlockTitle">描边宽度</div>
                <div class="styleBlockContent">
                    <a-radio-group v-model="lineWidth" @change="updateBaseStyle('lineWidth', $event)" type="button">
                        <a-radio :value="2">
                            <div class="lineWidthItem small">
                                <div class="bar"></div>
                            </div>
                        </a-radio>
                        <a-radio :value="4">
                            <div class="lineWidthItem middle">
                                <div class="bar"></div>
                            </div>
                        </a-radio>
                        <a-radio :value="6">
                            <div class="lineWidthItem large">
                                <div class="bar"></div>
                            </div>
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <!-- 边框样式 -->
            <div class="styleBlock" v-if="!['freedraw', 'image', 'text'].includes(activeElement?.type) ||
                hasSelectedElements
                ">
                <div class="styleBlockTitle">边框样式</div>
                <div class="styleBlockContent">
                    <a-radio-group v-model="lineDash" @change="updateBaseStyle('lineDash', $event)" type="button">
                        <a-radio :value="0">
                            <div>实线</div>
                        </a-radio>
                        <a-radio :value="5">
                            <div>大虚线</div>
                        </a-radio>
                        <a-radio :value="2">
                            <div>小虚线</div>
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <!-- 透明度 -->
            <div class="styleBlock">
                <div class="styleBlockTitle">透明度</div>
                <div class="styleBlockContent">
                    <a-slider v-model="globalAlpha" :min="0" :max="1" :step="0.1"
                        @change="updateBaseStyle('globalAlpha', $event)" />
                </div>
            </div>
            <!-- 角度 -->
            <div class="styleBlock" v-if="!hasSelectedElements">
                <div class="styleBlockTitle">角度</div>
                <div class="styleBlockContent">
                    <a-slider v-model="rotate" :min="0" :max="360" :step="1" @change="onRotateChange" />
                    <a-input-number style="width: 100px; margin-left: 20px" :controls="false" v-model="rotate" :min="0"
                        :max="360" @change="onRotateChange" />
                </div>
            </div>
        </div>
        <!-- 显示面板 -->
        <a-button-group type="primary" class="white-board-panel-action" :disabled="!(activeElement || hasSelectedElements)">
            <a-button @click="show = !show">
                <template #icon>
                    <icon-bg-colors />
                </template>
            </a-button>
            <a-button @click="copyElement" style="margin-left: 7px;">
                <template #icon>
                    <icon-copy />
                </template>
            </a-button>
            <a-button status="danger" @click="deleteElement" style="margin-left: 7px;">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { fontFamilyList, fontSizeList } from '../constants'

export default defineComponent({
    name: 'white-board-panel',
    props: {
        app: Object,
        activeElement: Object,
        hasSelectedElements: Boolean,
        panel: Object
    },
    data: () => ({
        fontFamilyList, fontSizeList,
        lineWidth: 4,
        fontFamily: '',
        fontSize: 18,
        lineDash: 0,
        globalAlpha: 0,
        rotate: 0,
        // 显示
        show: false
    }),
    created() {
        if (this.panel) {
            this.lineWidth = this.panel.lineWidth;
            this.fontFamily = this.panel.fontFamily;
            this.fontSize = this.panel.fontSize;
            this.lineDash = this.panel.lineDash;
            this.globalAlpha = this.panel.globalAlpha;
            this.rotate = this.panel.rotate;
            this.show = false;
        }
    },
    watch: {
        panel: {
            handler(panel: any) {
                this.lineWidth = panel.lineWidth
                this.fontFamily = panel.fontFamily
                this.fontSize = panel.fontSize
                this.lineDash = panel.lineDash
                this.globalAlpha = panel.globalAlpha
                this.rotate = panel.rotate;
                this.show = false;
            },
            deep: true
        }
    },
    methods: {
        updateStyle(key: string, e: any) {
            if (this.app) {
                this.app.setCurrentElementsStyle({
                    [key]: e.target.value
                });
            }
        },
        updateBaseStyle(key: string, e: any) {
            if (this.app) {
                this.app.setCurrentElementsStyle({
                    [key]: e
                });
            }

        },
        deleteElement() {
            if (this.app) {
                this.app.deleteCurrentElements();
            }
        },
        copyElement() {
            if (this.app) {
                this.app.copyPasteCurrentElements()
            }
        },
        onRotateChange(rotate: any) {
            if (this.app) {
                this.app.updateActiveElementRotate(rotate);
            }
        },
    }
});
</script>
<style scoped lang="less">
.white-board-panel {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 220px;

    .elementStyle {
        padding: 10px;
        background-color: var(--color-bg-2);
        color: var(--color-text-1);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        position: absolute;
        right: 14px;
        bottom: 85px;

        .styleBlock {
            margin-bottom: 10px;

            .styleBlockTitle {
                color: var(--color-text-1);
                font-size: 14px;
                margin-bottom: 10px;
            }

            .styleBlockContent {
                display: flex;

                .lineWidthItem {
                    display: flex;
                    width: 30px;
                    height: 20px;
                    align-items: center;

                    .bar {
                        width: 100%;
                        background-color: #212529;
                    }

                    &.small {
                        .bar {
                            height: 2px;
                        }
                    }

                    &.middle {
                        .bar {
                            height: 4px;
                        }
                    }

                    &.large {
                        .bar {
                            height: 6px;
                        }
                    }
                }

            }
        }
    }

    .white-board-panel-action {
        position: absolute;
        right: 14px;
        bottom: 39px;
        background-color: var(--color-bg-1);
        padding: 4px;
    }
}
</style>