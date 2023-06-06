<template>
    <a-button-group type="text" class="simple-mind-map-scale">
        <a-tooltip content="缩小" placement="top">
            <a-button @click="narrow">
                <template #icon><icon-minus /></template>
            </a-button>
        </a-tooltip>
        <a-tooltip content="回到中心" placement="top">
            <div class="scaleInfo" @click="returnCenter">{{ scaleNum }}%</div>
        </a-tooltip>
        <a-tooltip content="放大" placement="top">
            <a-button @click="enlarge">
                <template #icon><icon-plus /></template>
            </a-button>
        </a-tooltip>
    </a-button-group>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import SimpleMindMapWrap from '../SimpleMindMapWrap';

// 放大缩小
export default defineComponent({
    name: 'simple-mind-map-scale',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
    },
    data() {
        return {
            scaleNum: "100"
        }
    },
    created() {
        this.simpleMindMapWrap.on('scale', (scale: number) => {
            this.scaleNum = this.toPer(scale)
        })
        this.scaleNum = this.toPer(this.simpleMindMapWrap.view.scale)
    },
    methods: {
        /**
         * 转换成百分数
         */
        toPer(scale: number): string {
            return (scale * 100).toFixed(0)
        },

        /**
         * 缩小
         */
        narrow() {
            this.simpleMindMapWrap.view.narrow()
        },

        /**
         * 放大
         */
        enlarge() {
            this.simpleMindMapWrap.view.enlarge()
        },

        returnCenter() {
            this.simpleMindMapWrap.viewReset()
        }
    }
})
</script>

<style lang="less" scoped>
.simple-mind-map-scale {
    padding: 0 12px;
    position: absolute;
    right: 1rem;
    bottom: 3rem;
    background-color: var(--color-neutral-2);
    color: var(--color-text-1);
    border-radius: 2px;
    opacity: 0.8;
    height: 32px;
    line-height: 22px;
    font-size: 12px;

    .btn {
        cursor: pointer;
    }

    .scaleInfo {
        width: 40px;
        text-align: center;
        margin: 0 5px;
        user-select: none;
        cursor: pointer;
    }
}
</style>