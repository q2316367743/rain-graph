<template>
    <div class="operate" :style="{left: left}">
        <a-radio-group v-model="key">
            <a-radio value="selection">
                <template #radio="{ checked }">
                    <a-tooltip content="选择">
                        <div class="item" :class="checked ? 'active' : ''">
                            <icon-choose/>
                        </div>
                    </a-tooltip>
                </template>
            </a-radio>
            <a-radio value="eraser">
                <template #radio="{ checked }">
                    <a-tooltip content="橡皮擦">
                        <div class="item" :class="checked ? 'active' : ''">
                            <icon-eraser/>
                        </div>
                    </a-tooltip>
                </template>
            </a-radio>
            <a-radio value="rectangle">
                <template #radio="{ checked }">
                    <div class="item" :class="checked ? 'active' : ''">
                        <icon-rect/>
                    </div>
                </template>
            </a-radio>
            <a-radio value="diamond">
                <template #radio="{ checked }">
                    <div class="item" :class="checked ? 'active' : ''">
                        <icon-diamond/>
                    </div>
                </template>
            </a-radio>
            <a-radio value="triangle">
                <template #radio="{ checked }">
                    <div class="item" :class="checked ? 'active' : ''">
                        <icon-triangle/>
                    </div>
                </template>
            </a-radio>
            <a-radio value="circle">
                <template #radio="{ checked }">
                    <div class="item" :class="checked ? 'active' : ''">
                        <icon-circle/>
                    </div>
                </template>
            </a-radio>
            <a-radio value="line">
                <template #radio="{ checked }">
                    <div class="item" :class="checked ? 'active' : ''">
                        <icon-line/>
                    </div>
                </template>
            </a-radio>
            <a-radio value="arrow">
                <template #radio="{ checked }">
                    <div class="item" :class="checked ? 'active' : ''">
                        <icon-arrow-right/>
                    </div>
                </template>
            </a-radio>
            <a-radio value="free-draw">
                <template #radio="{ checked }">
                    <a-tooltip content="画笔">
                        <div class="item" :class="checked ? 'active' : ''">
                            <icon-pen/>
                        </div>
                    </a-tooltip>
                </template>
            </a-radio>
            <a-radio value="spray-brush">
                <template #radio="{ checked }">
                    <a-tooltip content="喷雾">
                        <div class="item" :class="checked ? 'active' : ''">
                            <icon-bg-colors/>
                        </div>
                    </a-tooltip>
                </template>
            </a-radio>
            <a-radio value="text">
                <template #radio="{ checked }">
                    <a-tooltip content="文字">
                        <div class="item" :class="checked ? 'active' : ''">
                            <icon-text/>
                        </div>
                    </a-tooltip>
                </template>
            </a-radio>
        </a-radio-group>
        <a-button-group type="text">
            <a-tooltip content="图片">
                <a-button @click="$emit('append-image')">
                    <template #icon>
                        <icon-image/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="iconfont">
                <a-button>
                    <template #icon>
                        <icon-face-smile-fill />
                    </template>
                </a-button>
            </a-tooltip>
            <a-button status="danger" @click="$emit('clear')">
                <template #icon>
                    <icon-delete/>
                </template>
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
// 图标
import IconTriangle from "@/icon/white-board/IconTriangle.vue";
import IconLine from "@/icon/white-board/IconLine.vue";
import IconRect from "@/icon/white-board/IconRect.vue";
import IconDiamond from "@/icon/white-board/IconDiamond.vue";
import IconCircle from "@/icon/white-board/IconCircle.vue";
import IconChoose from "@/icon/white-board/IconChoose.vue";
import IconText from '@/icon/white-board/IconText.vue';

export default defineComponent({
    name: 'fabric-wb-operate',
    components: {IconChoose, IconCircle, IconDiamond, IconRect, IconLine, IconTriangle, IconText},
    emits: ['update:modelValue', 'clear', 'append-image'],
    props: {
        modelValue: String
    },
    data: () => ({
        key: 'selection'
    }),
    computed: {
        ...mapState(useGlobalStore, ['width']),
        left() {
            return (this.width - 296) / 2 + 'px';
        }
    },
    watch: {
        modelValue(newValue) {
            this.key = newValue;
        },
        key(newValue) {
            this.$emit('update:modelValue', newValue);
        }
    }
});
</script>
<style scoped lang="less">
.operate {
    position: absolute;
    top: 7px;
    background-color: var(--color-neutral-2);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 4px;
    border: 1px solid var(--color-neutral-3);

    .arco-radio-group .arco-radio {
        margin-right: 0;
    }

    .arco-radio {
        padding-left: 0;
    }

    .item {
        padding: 4px 4px;
        margin: 0 2px;

        &:hover {
            background-color: var(--color-neutral-4);
            border-radius: 2px;
            cursor: pointer;
        }

        &.active {
            background-color: #9c9bae;
        }

        svg {
            fill: var(--color-text-1);
        }
    }
}
</style>
