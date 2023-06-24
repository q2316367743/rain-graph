<template>
    <div class="drauu-instance">
        <!-- 顶部 -->
        <div class="header">
            <div class="option">
                <a-button-group type="text">
                    <a-button title="保存" @click="save" style="width: 32px;">📋</a-button>
                    <a-button title="编辑名称" @click="update" style="width: 32px;">📝</a-button>
                    <a-button title="管理" @click="$emit('open-template')" style="width: 32px;">📁</a-button>
                    <a-button title="后退" @click="undo" style="width: 32px;">↩️</a-button>
                    <a-button title="前进" @click="redo" style="width: 32px;">↪️</a-button>
                    <a-button title="清空" @click="clear" style="width: 32px;">🗑</a-button>
                    <a-dropdown trigger="click">
                        <a-button title="导出" style="width: 32px;">📥</a-button>
                        <template #content>
                            <a-doption @click="downloadToSvg">SVG</a-doption>
                            <a-doption @click="downloadToPng">PNG</a-doption>
                        </template>
                    </a-dropdown>
                </a-button-group>
            </div>
            <a-divider direction="vertical" style="height: 32px"/>
            <div class="color-group">
                <div class="color-item" :class="color === '#f2f2f2' ? 'active' : ''" @click="color = '#f2f2f2'">⚪</div>
                <div class="color-item" :class="color === '#000000' ? 'active' : ''" @click="color = '#000000'">⚫️</div>
                <div class="color-item" :class="color === '#ed153d' ? 'active' : ''" @click="color = '#ed153d'">🔴</div>
                <div class="color-item" :class="color === '#ed9a26' ? 'active' : ''" @click="color = '#ed9a26'">🟠</div>
                <div class="color-item" :class="color === '#ede215' ? 'active' : ''" @click="color = '#ede215'">🟡</div>
                <div class="color-item" :class="color === '#30bd20' ? 'active' : ''" @click="color = '#30bd20'">🟢</div>
                <div class="color-item" :class="color === '#2656bf' ? 'active' : ''" @click="color = '#2656bf'">🔵</div>
                <div class="color-item" :class="color === '#c24aed' ? 'active' : ''" @click="color = '#c24aed'">🟣</div>
                <div class="color-item" :class="color === '#bf6b26' ? 'active' : ''" @click="color = '#bf6b26'">🟤</div>
            </div>
            <a-divider direction="vertical" style="height: 32px"/>
            <div class="thickness">
                <a-slider v-model="size" :min="1" :max="10" :step="0.5"
                          show-tooltip/>
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
                 @click="brush = 'ellipse'">○
            </div>
            <div class="side-btn" :class="brush === 'eraseLine' ? 'active' : ''" @click="brush = 'eraseLine'">🧹</div>
            <a-divider/>
            <div class="side-btn" :class="dasharray === 'solid' ? 'active' : ''" @click="dasharray = 'solid'">—</div>
            <div class="side-btn" :class="dasharray === 'dashed' ? 'active' : ''" @click="dasharray = 'dashed'">┅</div>
            <div class="side-btn" :class="dasharray === 'dotted' ? 'active' : ''" @click="dasharray = 'dotted'">⋯</div>
        </div>
        <!-- 内容 -->
        <div class="drauu-view-wrap">
            <svg class="drauu-view" ref="drauu-view" style="touch-action: none"></svg>
        </div>
        <!-- 帮助信息 -->
        <pre class="about">
<b>Drauu</b>
Headless SVG-based drawboard in browser
https://github.com/antfu/drauu
</pre>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {createDrauu, Drauu, DrawingMode} from 'drauu';
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import {downloadByBase64, svg2png} from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";


export default defineComponent({
    name: 'drauu-instance',
    emits: ['save-template', 'update-template', 'open-template'],
    props: {
        id: {
            type: Number,
            required: false,
            default: new Date().getTime()
        },
        templateId: String
    },
    data: () => ({
        color: '#000000',
        size: 3,
        brush: 'stylus',
        dasharray: 'solid',
        drauu: markRaw({} as Drauu)
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark'])
    },
    watch: {
        color() {
            if (this.drauu) {
                this.drauu.brush.color = this.color;
            }
        },
        size() {
            this.drauu.brush.size = this.size;
        },
        brush() {
            this.drauu.brush.arrowEnd = this.brush === 'arrow';
            this.drauu.mode = this.brush === 'arrow' ? 'line' : this.brush as DrawingMode;
        },
        dasharray() {
            if (this.dasharray === 'solid') {
                this.drauu.brush.dasharray = undefined
            } else if (this.dasharray === 'dashed') {
                this.drauu.brush.dasharray = '4'
            } else if (this.dasharray === 'dotted') {
                this.drauu.brush.dasharray = '1 7'
            }
        }
    },
    mounted() {
        this.init()
            .finally(() => this.color = this.isDark ? '#f2f2f2' : '#000000');
    },
    methods: {
        async init() {
            let element = this.$refs['drauu-view'] as SVGSVGElement;
            if (this.templateId) {
                let recordWrap = await utools.db.promises.get('/' + GraphTypeEnum.DRAUU + '/' + this.templateId);
                console.log('/' + GraphTypeEnum.DRAUU + '/' + this.templateId, recordWrap)
                if (recordWrap) {
                    // 存在，则初始化内容
                    element.innerHTML = recordWrap.value.record;
                }else {
                    MessageUtil.warning("未获取到【{}】模板内容", this.templateId)
                }
            }
            this.drauu = markRaw(createDrauu({
                el: element,
                brush: {
                    color: this.color,
                    size: this.size,
                },
            }));
        },
        undo() {
            this.drauu.undo()
        },
        redo() {
            this.drauu.redo()
        },
        clear() {
            this.drauu.clear()
        },
        downloadToSvg() {
            this.drauu.el!.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
            const data = this.drauu.el!.outerHTML || '';
            const blob = new Blob([data], {type: 'image/svg+xml'})
            const elem = window.document.createElement('a')
            elem.href = window.URL.createObjectURL(blob)
            elem.download = 'drauu.svg'
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        },
        downloadToPng() {
            svg2png(this.drauu.el!)
                .then(e => downloadByBase64(e))
                .catch(e => MessageUtil.error("下载图片失败", e));
        },
        save() {
            const data = this.drauu.el!.innerHTML || '';
            this.$emit('save-template', {
                id: this.id,
                data
            });
        },
        update() {
            const data = this.drauu.el!.innerHTML || '';
            this.$emit('update-template', {
                id: this.id,
                data
            });
        }
    }
});
</script>
<style lang="less"></style>