<template>
    <a-modal class="nodeDialog" title="导出" v-model:visible="dialogVisible" width="700px" ok-text="导出" @ok="confirm"
        @cancel="cancel" draggable>
        <div>
            <div class="nameInputBox">
                <span class="name">导出文件名称</span>
                <a-input style="width: 300px" v-model="title" size="mini"></a-input>
                <a-checkbox v-show="['smm', 'json'].includes(exportType)" v-model="widthConfig" style="margin-left: 12px">
                    是否包含主题、结构等配置信息
                </a-checkbox>
            </div>
            <div class="paddingInputBox" v-show="['svg', 'png', 'pdf'].includes(exportType)">
                <span class="name">水平内边距</span>
                <a-input-number style="width: 100px" v-model="paddingX" size="mini"
                    @change="onPaddingChange"></a-input-number>
                <span class="name" style="margin-left: 10px;">垂直内边距</span>
                <a-input-number style="width: 100px" v-model="paddingY" size="mini"
                    @change="onPaddingChange"></a-input-number>
                <a-checkbox v-show="['png'].includes(exportType)" v-model="isTransparent" style="margin-left: 12px">
                    背景是否透明
                </a-checkbox>
            </div>
            <div class="downloadTypeList">
                <div class="downloadTypeItem" v-for="item in downTypeList" :key="item.type"
                    :class="{ active: exportType === item.type }" @click="exportType = item.type">
                    <div class="info">
                        <div class="name">{{ item.name }}</div>
                        <div class="desc">{{ item.desc }}</div>
                    </div>
                </div>
            </div>
            <div class="tip">tips：.smm和.json文件可用于导入</div>
        </div>
    </a-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { mapState } from 'pinia';
import { useGlobalStore } from '@/store/GlobalStore';
import { downTypeList } from '../../../data/constants';
import SimpleMindMapWrap from '../../../SimpleMindMapWrap';

//导出
export default defineComponent({
    name: 'simple-mind-map-export',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
        visible: Boolean
    },
    data() {
        return {
            downTypeList,
            dialogVisible: false,
            exportType: 'smm',
            widthConfig: true,
            isTransparent: false,
            paddingX: 10,
            paddingY: 10
        }
    },
    watch: {
        visible(newValue) {
            this.dialogVisible = newValue;
        },
        dialogVisible(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    computed: {
        ...mapState(useGlobalStore, ['title'])
    },
    methods: {
        onPaddingChange() {
        },
        cancel() {
            this.dialogVisible = false
        },
        confirm() {
            if (this.exportType === 'svg') {
                this.simpleMindMapWrap.export(
                    this.exportType,
                    true,
                    this.title,
                    `* { margin: 0; padding: ${this.paddingX}px ${this.paddingY}px; box-sizing: border-box; }`
                )
            } else if (['smm', 'json'].includes(this.exportType)) {
                this.simpleMindMapWrap.export(
                    this.exportType,
                    true,
                    this.title,
                    this.widthConfig
                )
            } else if (this.exportType === 'png') {
                this.simpleMindMapWrap.export(this.exportType,
                    true,
                    this.title,
                    this.isTransparent
                )
            } else {
                this.simpleMindMapWrap.export(
                    this.exportType,
                    true,
                    this.title
                )
            }
            this.cancel()
        }
    }
})
</script>
<style lang="less" scoped>
.nodeDialog {

    .nameInputBox {
        margin-bottom: 20px;

        .name {
            margin-right: 10px;
        }
    }

    .paddingInputBox {
        margin-bottom: 10px;

        .name {
            margin-right: 10px;
        }
    }

    .tip {
        margin-top: 10px;

        &.warning {
            color: #F56C6C;
        }
    }

    .downloadTypeList {
        display: flex;
        flex-wrap: wrap;

        .downloadTypeItem {
            width: 150px;
            height: 88px;
            padding: 12px 22px;
            overflow: hidden;
            margin: 10px;
            border-radius: 2px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            background-color: var(--color-neutral-2)#fff;
            display: flex;
            align-items: center;
            cursor: pointer;
            border: 2px solid var(--color-neutral-3);

            &.active {
                border-color: rgb(var(--arcoblue-6));
            }

            .info {
                .name {
                    color: var(--color-text-1);
                    font-size: 15px;
                    margin-bottom: 5px;
                }

                .desc {
                    color: var(--color-text-2);
                    font-size: 12px;
                }
            }
        }
    }
}
</style>