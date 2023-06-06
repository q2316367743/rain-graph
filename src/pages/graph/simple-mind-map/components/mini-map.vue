<template>
    <div class="simple-mind-map-mini-map" ref="navigatorBox" :style="miniMapStyle" @mousedown="onMousedown"
        @mousemove="onMousemove" @mouseup="onMouseup">
        <div class="svgBox" ref="svgBox" :style="{
            transform: `scale(${svgBoxScale})`,
            left: svgBoxLeft + 'px',
            top: svgBoxTop + 'px'
        }" v-html="svgHtml"></div>
        <div class="windowBox" :style="viewBoxStyle"></div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import SimpleMindMapWrap from '../SimpleMindMapWrap';

export default defineComponent({
    name: 'simple-mind-map-mini-map',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
    },
    data() {
        return {
            timer: -1,
            boxWidth: 150,
            boxHeight: 90,
            svgBoxScale: 1,
            svgBoxLeft: 0,
            svgBoxTop: 0,
            viewBoxStyle: {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            },
            svgHtml: ''
        }
    },
    computed: {
        miniMapStyle() {
            return {
                width: this.boxWidth + 'px',
                height: this.boxHeight + 'px'
            };
        }
    },
    mounted() {
        this.simpleMindMapWrap.on('data_change', this.data_change)
        this.simpleMindMapWrap.on('view_data_change', this.data_change)
        this.simpleMindMapWrap.on('node_tree_render_end', this.data_change)
    },
    beforeUnmount() {
        this.simpleMindMapWrap.off('data_change', this.data_change)
        this.simpleMindMapWrap.off('view_data_change', this.data_change)
        this.simpleMindMapWrap.off('node_tree_render_end', this.data_change)
    },
    methods: {
        data_change() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.drawMiniMap()
            }, 500)
        },
        drawMiniMap() {
            let data = this.simpleMindMapWrap.miniMap.calculationMiniMap(this.boxWidth, this.boxHeight);
            // 渲染到小地图
            this.svgHtml = data.svgHTML;
            this.viewBoxStyle = data.viewBoxStyle
            this.svgBoxScale = data.miniMapBoxScale
            this.svgBoxLeft = data.miniMapBoxLeft
            this.svgBoxTop = data.miniMapBoxTop
        },

        onMousedown(e: any) {
            this.simpleMindMapWrap.miniMap.onMousedown(e)
        },

        onMousemove(e: any) {
            this.simpleMindMapWrap.miniMap.onMousemove(e)
        },

        onMouseup(e: any) {
            this.simpleMindMapWrap.miniMap.onMouseup(e)
        }
    }
});
</script>

<style lang="less" scoped>
.simple-mind-map-mini-map {
    position: absolute;
    background-color: var(--color-bg-1);
    bottom: 80px;
    right: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid var(--color-neutral-3);
    cursor: pointer;
    user-select: none;

    .svgBox {
        position: absolute;
        left: 0;
        transform-origin: left top;
        width: 250px;
        height: 120px;
    }

    .windowBox {
        position: absolute;
        transition: all 0.3s;
        border: 1px solid rgb(var(--red-6));
    }
}
</style>