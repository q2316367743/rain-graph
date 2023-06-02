<template>
    <div class="white-board-display">
        <a-button type="dashed" shape="circle" @click="$emit('scale-minus')">
            <icon-minus-circle />
        </a-button>
        <a-tooltip content="重置缩放" @click="$emit('scale-reset')">
            <div class="number">{{ (scale * 100).toFixed(0) }}%</div>
        </a-tooltip>
        <a-button type="dashed" shape="circle" @click="$emit('scale-plus')">
            <icon-plus-circle />
        </a-button>
        <a-tooltip content="滚动至中心">
            <a-button style="margin-left: 7px;" @click="$emit('scroll-to-center')">
                x:{{ scrollX? scrollX.toFixed(0) : '0' }} y:{{ scrollY ? scrollY.toFixed(0) : '0' }}
            </a-button>
        </a-tooltip>
        <a-trigger position="top" auto-fit-position :unmount-on-close="false" trigger="click" show-arrow
            :popup-translate="[0, -10]">
            <div class="color" :style="{ backgroundColor: backgroundColor }"></div>
            <template #content>
                <div class="white-board-display-color">
                    <div class="color" style="background-color: transparent;" @click="changeColor('var(--color-bg-1)')">无
                    </div>
                    <div class="color" v-for="color in colorList" :style="{ backgroundColor: color }"
                        @click="changeColor(color)"></div>
                </div>
            </template>
        </a-trigger>
        <a-input :model-value="backgroundColor" style="width: 250px;margin-left: 7px;">
            <template #prepend>背景颜色</template>
            <template #append>
                <input type="color" :value="backgroundColor" @change="changeCustomerColor" />
            </template>
        </a-input>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
    name: 'white-board-display',
    props: {
        app: Object,
        backgroundColor: String,
        scale: {
            type: Number,
            required: false,
            default: 1
        },
        scrollX: Number,
        scrollY: Number
    },
    emits: ['change-color', 'scale-plus', 'scale-minus', 'scale-reset', 'scroll-to-center'],
    data: () => ({
        colorList: ['#ffffff', '#f8f9fa', '#f1f3f5', '#fff5f5', '#fff0f6', '#f8f0fc',
            '#f3f0ff', '#edf2ff', '#e7f5ff', '#e3fafc', '#e6fcf5', '#f4fce3', '#fff9db',
            '#fff4e6'],
    }),
    methods: {
        changeCustomerColor(e: Event) {
            let target = e.target as any;
            if (target) {
                this.$emit('change-color', target.value);
            }
        },
        changeColor(color: string) {
            this.$emit('change-color', color)
        },
    }
});
</script>
<style lang="less">
.white-board-display {
    position: absolute;
    left: 14px;
    bottom: 7px;
    display: flex;

    .number {
        height: 32px;
        line-height: 32px;
        padding: 0 3px;
        margin: 0 4px;
        background-color: var(--color-fill-2);
        border-radius: 2px;
        cursor: pointer;
    }

    .color {
        width: 30px;
        height: 30px;
        border: 1px solid var(--color-neutral-3);
        margin-left: 7px;
        cursor: pointer;
        border-radius: 2px;
    }
}

.white-board-display-color {
    padding: 7px;
    display: flex;
    flex-wrap: wrap;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    background-color: var(--color-bg-1);
    width: 200px;
    padding-top: 14px;


    .color {
        width: 30px;
        height: 30px;
        border: 1px solid var(--color-neutral-3);
        margin-left: 7px;
        margin-bottom: 7px;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        line-height: 30px;
    }
}
</style>