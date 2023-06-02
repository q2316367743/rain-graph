<template>
    <div class="drauu w-screen h-screen flex flex-col select-none">
        <!-- 顶部 -->
        <div class="header">
            <a-radio-group type="button" style="background: none;" v-model="color">
                <a-radio value="#f2f2f2" title="black">​⚪</a-radio>
                <a-radio value="#000000" title="black">​⚫️​</a-radio>
                <a-radio value="#ed153d" title="Red">​🔴​</a-radio>
                <a-radio value="#ed9a26" title="Orange">​🟠​​</a-radio>
                <a-radio value="#ede215" title="Yellow">​​🟡​​</a-radio>
                <a-radio value="#30bd20" title="Green">​🟢​​</a-radio>
                <a-radio value="#2656bf" title="Blue">​​🔵​​</a-radio>
                <a-radio value="#c24aed" title="Purple">​🟣​​</a-radio>
                <a-radio value="#bf6b26" title="Brown">​​🟤​</a-radio>
            </a-radio-group>
            <div style="text-align: center;">
                <a-slider v-model="size" :min="1" :max="10" :step="0.5" style="width: 150px;margin-top: 10px;"
                    show-tooltip />
            </div>
            <div style="text-align: right;">
                <a-button-group type="text">
                    <a-button title="后退" @click="undo">↩️</a-button>
                    <a-button title="前进" @click="redo">↪️</a-button>
                    <a-button title="清空" @click="clear">🗑</a-button>
                    <a-button title="导出" @click="download">📥</a-button>
                </a-button-group>
            </div>
        </div>
        <!-- 左侧边栏 -->
        <div class="side">
            <div class="side-btn" :class="brush === 'stylus' ? 'active' : ''" @click="brush = 'stylus'">✍️</div>
            <div class="side-btn" :class="brush === 'draw' ? 'active' : ''" @click="brush = 'draw'">✏️</div>
            <div class="side-btn" :class="brush === 'line' ? 'active' : ''" @click="brush = 'line'">⁄</div>
            <div class="side-btn" :class="brush === 'arrow' ? 'active' : ''" @click="brush = 'arrow'">↗</div>
            <div class="side-btn" :class="brush === 'rectangle' ? 'active' : ''" @click="brush = 'rectangle'">⃞</div>
            <div class="side-btn" :class="brush === 'ellipse' ? 'active' : ''" style="font-size: 26px;"
                @click="brush = 'ellipse'">○</div>
            <div class="side-btn" :class="brush === 'eraseLine' ? 'active' : ''" @click="brush = 'eraseLine'">🧹</div>
            <a-divider />
            <div class="side-btn" :class="dasharray === 'solid' ? 'active' : ''" @click="dasharray = 'solid'">—</div>
            <div class="side-btn" :class="dasharray === 'dashed' ? 'active' : ''" @click="dasharray = 'dashed'">┅</div>
            <div class="side-btn" :class="dasharray === 'dotted' ? 'active' : ''" @click="dasharray = 'dotted'">⋯</div>
        </div>
        <!-- 内容 -->
        <div class="drauu-view-wrap">
            <svg id="drauu-view" style="touch-action: none"></svg>
        </div>
        <!-- 帮助信息 -->
        <pre class="about">
<b>Drauu</b>
Headless SVG-based drawboard in browser
https://github.com/antfu/drauu
</pre>
        <pre class="help">
           d / draw
           s / stylus
           l / line
           r / rectangle
           e / ellipse
           c / clear
           + / increase size
           - / decrease size
      ctrl+z / undo
shift+ctrl+z / redo</pre>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { createDrauu, Drauu, DrawingMode } from 'drauu';
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

let drauu: Drauu;

type modeType = 'draw' | 'stylus' | 'line' | 'rectangle' | 'ellipse' | 'eraseLine' | 'arrow';

export default defineComponent({
    name: 'drauu',
    data: () => ({
        color: '#000000',
        size: 3,
        brush: 'stylus',
        dasharray: 'solid'
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark'])
    },
    watch: {
        color() {
            drauu.brush.color = this.color;
        },
        size() {
            drauu.brush.size = this.size;
        },
        brush() {
            drauu.brush.arrowEnd = this.brush === 'arrow';
            drauu.mode = this.brush === 'arrow' ? 'line' : this.brush as DrawingMode;
        },
        dasharray() {
            if (this.dasharray === 'solid') {
                drauu.brush.dasharray = undefined
            } else if (this.dasharray === 'dashed') {
                drauu.brush.dasharray = '4'
            } else if (this.dasharray === 'dotted') {
                drauu.brush.dasharray = '1 7'
            }
        }
    },
    created() {
        this.color = this.isDark ? '#f2f2f2' : '#000000';
    },
    mounted() {
        drauu = createDrauu({
            el: '#drauu-view',
            brush: {
                color: this.color,
                size: this.size,
            },
            // acceptsInputTypes: ['pen'],
        });
    },
    methods: {
        undo() { drauu.undo() },
        redo() { drauu.redo() },
        clear() { drauu.clear() },
        download() {
            drauu.el!.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
            const data = drauu.el!.outerHTML || ''
            const blob = new Blob([data], { type: 'image/svg+xml' })
            const elem = window.document.createElement('a')
            elem.href = window.URL.createObjectURL(blob)
            elem.download = 'drauu.svg'
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        }
    }
});
</script>
<style lang="less">
@import url(./index.less);

.drauu {
    position: relative;
    width: 100%;
    height: 100%;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 3px 6px;
        border-bottom: 1px solid var(--color-neutral-3);
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .side {
        position: absolute;
        top: 39px;
        left: 0;
        bottom: 0;
        padding: 6px 3px;
        border-right: 1px solid var(--color-neutral-3);

        .side-btn {
            width: 32px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
            border-radius: 50%;

            &:hover {
                background-color: #059669;
            }

            &.active {
                background-color: #167f3d;
            }
        }
    }

    .drauu-view-wrap {
        position: absolute;
        top: 39px;
        left: 39px;
        right: 0;
        bottom: 0;
    }

    .about {
        position: absolute;
        left: 4rem;
        bottom: 1.5rem;
        pointer-events: none;
        opacity: 0.35;
    }

    .help {
        position: absolute;
        right: 2rem;
        bottom: 1.5rem;
        pointer-events: none;
        opacity: 0.35;
    }
}

#drauu-view {
    width: 100%;
    height: 100%;
}
</style>