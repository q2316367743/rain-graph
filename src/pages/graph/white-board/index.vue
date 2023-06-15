<template>
    <div class="white-board">
        <div class="header">
            <a-button-group type="text">
                <a-dropdown>
                    <a-button>文件</a-button>
                    <template #content>
                        <a-doption @click="toHome">返回列表</a-doption>
                        <a-doption @click="open">打开</a-doption>
                        <a-doption @click="save(true)">保存</a-doption>
                        <a-doption @click="saveAs">另存为</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click">
                    <a-button>编辑</a-button>
                    <template #content>
                        <a-doption>背景颜色</a-doption>
                        <a-doption @click="undo">后退</a-doption>
                        <a-doption @click="redo">前进</a-doption>
                        <a-doption @click="empty">清空</a-doption>
                        <a-doption @click="selectAll">全选</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click">
                    <a-button>
                        导出
                    </a-button>
                    <template #content>
                        <a-doption @click="exportPngDialog = true">图片</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click">
                    <a-button>更多</a-button>
                    <template #content>
                        <a-doption @click="changeGrid">网格</a-doption>
                        <a-doption @click="changeReadonly">编辑/只读</a-doption>
                        <a-doption @click="helpDrawer = true">帮助</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
            <a-button-group type="text">
                <a-button @click="fullscreen.toggle()">
                    <template #icon>
                        <icon-fullscreen-exit v-if="fullscreen.isFullscreen" />
                        <icon-fullscreen v-else />
                    </template>
                </a-button>
                <a-switch :model-value="config.readonly" type="round" style="margin: 4px 6px;" @change="changeReadonly">
                    <template #checked>锁定</template>
                    <template #unchecked>编辑</template>
                </a-switch>
            </a-button-group>
        </div>
        <a-layout class="container">
            <div id="white-board-view"></div>
            <!-- 选择器 -->
            <div class="white-board-draw-type" :style="{ left: drawTypeLeft }" v-show="!config.readonly">
                <a-radio-group type="button" v-model="activeKey" class="draw-type">
                    <a-tooltip content="选择">
                        <a-radio value="selection"><icon-choose style="margin-top: 6px;" /></a-radio>
                    </a-tooltip>
                    <a-tooltip content="橡皮擦">
                        <a-radio value="eraser"><icon-eraser /></a-radio>
                    </a-tooltip>
                    <a-radio value="rectangle"><icon-rect style="margin-top: 6px;" /></a-radio>
                    <a-radio value="diamond"><icon-diamond style="margin-top: 6px;" /></a-radio>
                    <a-radio value="triangle"><icon-triangle style="margin-top: 6px;" /></a-radio>
                    <a-radio value="circle"><icon-circle style="margin-top: 6px;" /></a-radio>
                    <a-radio value="line"><icon-line style="margin-top: 6px;" /></a-radio>
                    <a-radio value="arrow"><icon-arrow-right /></a-radio>
                    <a-tooltip content="画笔">
                        <a-radio value="freedraw"><icon-pen /></a-radio>
                    </a-tooltip>
                    <a-tooltip content="文字">
                        <a-radio value="text"><icon-edit /></a-radio>
                    </a-tooltip>
                    <a-tooltip content="图片">
                        <a-radio value="image"><icon-image /></a-radio>
                    </a-tooltip>
                </a-radio-group>
            </div>
            <!-- 面板 -->
            <white-board-panel class="white-board-panel" v-if="render" v-show="!config.readonly" :app="app"
                :active-element="activeElement" :has-selected-elements="hasSelectedElements" :panel="panel" />
        </a-layout>
        <!-- 菜单 -->
        <white-board-context-menu :app="app" v-if="render" v-show="!config.readonly" />
        <!-- 图片导出 -->
        <white-board-export-png v-model:show="exportPngDialog" :app="app" />
        <!-- 显示设置 -->
        <white-board-display v-show="!config.readonly" :background-color="config.backgroundColor" :scale="config.scale"
            :scroll-x="config.scrollX" :scroll-y="config.scrollY" @change-color="changeBackgroundColor"
            @scale-plus="scalePlus" @scale-minus="scaleMinus" @scale-reset="scaleReset"
            @scroll-to-center="scrollToCenter" />
        <!-- 帮助 -->
        <a-drawer v-model:visible="helpDrawer" title="帮助" width="300px" :footer="false">
            <white-board-help />
        </a-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw, markRaw } from "vue";
import TinyWhiteboard from "tiny-whiteboard";
import { mapState } from "pinia";

import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

import IconChoose from './icon/IconChoose.vue';
import IconCircle from './icon/IconCircle.vue';
import IconDiamond from './icon/IconDiamond.vue';
import IconLine from './icon/IconLine.vue';
import IconRect from './icon/IconRect.vue';
import IconTriangle from './icon/IconTriangle.vue';

import WhiteBoardHelp from './components/help.vue';
import WhiteBoardContextMenu from './components/contextmenu.vue';
import WhiteBoardExportPng from './components/exportPng.vue';
import WhiteBoardDisplay from './components/display.vue';
import WhiteBoardPanel from './components/panel.vue';

import { useGlobalStore } from "@/store/GlobalStore";
import { useWhiteBoardStore } from "@/store/graph/WhiteBoardStore";
import { useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import { getRecord } from '@/utils/utools/DbUtil';
import { useFileSystemAccess, useFullscreen } from "@vueuse/core";
import { download } from "@/utils/BrowserUtil";

let first = true;

export default defineComponent({
    name: 'white-board',
    components: {
        IconChoose, IconCircle, IconDiamond, IconLine, IconRect, IconTriangle,
        WhiteBoardHelp, WhiteBoardContextMenu, WhiteBoardExportPng, WhiteBoardDisplay, WhiteBoardPanel
    },
    data: () => ({
        ExportTypeEnum,
        // 数据
        id: '0',
        _rev: undefined as string | undefined,
        activeKey: 'selection',
        helpDrawer: false,
        app: markRaw({} as any),
        config: {
            scrollX: 0,
            scrollY: 0,
            // 显示布局
            showGrid: false,
            // 只读
            readonly: false,
            // 背景颜色
            backgroundColor: 'var(--color-bg-1)',
            // 默认字体
            fontFamily: '微软雅黑',
            // 默认字体大小
            fontSize: 18,
            // 	默认线条颜色
            strokeStyle: 'var(--color-text-1)',
            // 默认填充颜色
            fillStyle: 'transparent',
            // 选中元素的拖拽元素的默认线条颜色
            dragStrokeStyle: 'var(--color-neutral-8)',
            // 缩放
            scale: 1
        },
        exportPngDialog: false,
        element: {},
        render: false,
        lock: false,

        // 面板
        activeElement: undefined as any | undefined,
        selectedElements: [] as any[],
        panel: {
            lineWidth: 'middle',
            fontFamily: '',
            fontSize: 18,
            lineDash: 0,
            globalAlpha: 0,
            rotate: 0,
        },

        // 全屏
        fullscreen: useFullscreen(),
        fileSystem: useFileSystemAccess({
            dataType: 'Text',
            types: [{
                description: 'json',
                accept: {
                    'application/json': ['.json'],
                },
            }]
        })
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'width', 'isDark', 'title']),
        _id() {
            return `/${GraphTypeEnum.WHITE_BOARD}/${this.id}`;
        },
        drawTypeLeft() {
            return ((this.width - 460) / 2) + 'px';
        },
        hasSelectedElements() {
            return this.selectedElements.length > 0;
        }
    },
    watch: {
        size: {
            handler() {
                this.app.resize();
            },
            deep: true
        },
        collapsed() {
            this.app.resize();
        },
        activeKey() {
            this.app.updateCurrentType(this.activeKey);
            if (this.activeKey !== 'selection') {
                this.app.cancelActiveElement();
            }
        },
        config: {
            handler() {
                this.save();
            },
            deep: true
        }
    },
    created() {
        useSaveEvent.on(() => this.save(true));
        useUndoEvent.on(() => this.undo());
    },
    mounted() {
        this.id = this.$route.params.id as string;
        let path = this.$route.query.path as string;
        getRecord(GraphTypeEnum.WHITE_BOARD, this.id, path)
            .then(record => {
                if (record.error) {
                    MessageUtil.warning(record.message);
                }
                this.id = record.id;
                this._rev = record._rev;
                this.config = Object.assign(this.config, record.config);
                let data = record.record;
                // 初始化
                this.init();
                // 设置数据
                if (data) {
                    this.app.setData(data);
                }
                first = false;
            }).catch(e => {
                MessageUtil.error("初始化数据错误", e);
                this.init();
            })
    },
    beforeUnmount() {
        this.save();
    },
    methods: {
        init() {
            // 初始化数据
            this.app = markRaw(new TinyWhiteboard({
                container: document.getElementById('white-board-view'),
                state: toRaw(this.config)
            }));
            // 事件监听
            this.app.on('currentTypeChange', (drawType: string) => {
                if (drawType === 'selection') {
                    this.activeKey = 'selection';
                }
            });
            this.app.on('change', () => {
                if (this.id !== '0' && this.id !== '-1') {
                    if (!first) {
                        this.save();
                    }
                }
            });
            this.app.on('activeElementChange', (element: any) => {
                this.element = element;
            });
            this.app.on('zoomChange', (scale: number) => {
                this.config.scale = scale;
            });
            this.app.on('scrollChange', (x: number, y: number) => {
                this.config.scrollX = x;
                this.config.scrollY = y;
            });
            this.app.on('activeElementChange', (element: any) => {
                if (this.activeElement) {
                    this.activeElement.off('elementRotateChange', this.onElementRotateChange);
                }
                this.activeElement = element
                if (element) {
                    let { style, rotate: elementRotate } = element
                    this.panel = {
                        lineWidth: style.lineWidth,
                        fontFamily: style.fontFamily,
                        fontSize: style.fontSize,
                        lineDash: style.lineDash,
                        globalAlpha: style.globalAlpha,
                        rotate: elementRotate
                    }
                    element.on('elementRotateChange', this.onElementRotateChange)
                }
            });
            this.app.on('multiSelectChange', (elements: any[]) => {
                this.selectedElements = elements
            })
            this.render = true;
        },
        onElementRotateChange(elementRotate: any) {
            this.panel.rotate = elementRotate;
        },
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.WHITE_BOARD
                }
            })
        },
        undo() { this.app.undo() },
        redo() { this.app.redo() },
        empty() { this.app.empty() },
        selectAll() { this.app.selectAll() },
        changeGrid() {
            this.config.showGrid = !this.config.showGrid;
            if (this.config.showGrid) {
                this.app.showGrid();
            } else {
                this.app.hideGrid();
            }
        },
        changeReadonly() {
            // 变更只读
            this.config.readonly = !this.config.readonly;
            // 取消全部选中
            this.app.cancelActiveElement();
            // 处理
            if (this.config.readonly) {
                this.app.setReadonlyMode();
            } else {
                this.app.setEditMode();
            }
        },
        changeBackgroundColor(color: string) {
            this.config.backgroundColor = color;
            this.app.setBackgroundColor(color);
        },
        scalePlus() {
            this.app.zoomIn(0.1);
        },
        scaleMinus() {
            this.app.zoomOut(0.1);
        },
        scaleReset() {
            this.app.setZoom(1);
        },
        scrollToCenter() {
            this.app.scrollToCenter();
        },
        changeScale(scale: number) {
            this.config.scale = scale;
            if (scale > 1) {
                this.app.zoomIn(scale - 1);
            } else if (scale < 1) {
                this.app.zoomOut(1 - scale);
            } else {
                this.app.setZoom(scale)
            }
        },
        save(show: boolean = false) {
            if (!this.render) {
                return;
            }
            if (this.lock) {
                return;
            }
            if (!show) {
                if (this.id === '0' || this.id === '-1') {
                    return;
                }
            }
            this.lock = true;
            useWhiteBoardStore().add(this.id)
                .then(id => {
                    this.id = id;
                    // 保存记录
                    utools.db.promises.put({
                        _id: this._id,
                        _rev: this._rev,
                        value: {
                            config: toRaw(this.config),
                            record: this.app.getData()
                        }
                    }).then(res => {
                        if (res.error) {
                            MessageUtil.error(res.message || "保存失败");
                            return;
                        }
                        this._rev = res.rev;
                        this.lock = false;
                        if (show) {
                            MessageUtil.success("保存成功");
                        }
                    }).catch(e => MessageUtil.error("保存失败", e));
                }).catch(e => MessageUtil.error("保存失败", e));
        },
        saveAs() {
            download(JSON.stringify({
                config: toRaw(this.config),
                record: this.app.getData()
            }), this.title + ".json", "application/json")
        },
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let content = this.fileSystem.data || '';
                try {
                    let json = JSON.parse(content);
                    let config = json['config'];
                    let data = json['record'];
                    this.app.updateState(config);
                    this.app.setData(data);
                } catch (e) {
                    MessageUtil.error("文件解析失败", e);
                }
            }).catch(e => {
                if (e.name === 'AbortError') {
                    return;
                }
                MessageUtil.error("打开失败", e)
            });
        }
    }
});
</script>
<style lang="less" scoped>
.white-board {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 32px;
        border-bottom: 1px solid var(--color-neutral-3);
        display: flex;
        justify-content: space-between;
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;

        .white-board-draw-type {
            position: absolute;
            top: 7px;
            background-color: var(--color-bg-1);
            border-radius: 2px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            transition: 0.2ms all;
            border: 1px solid var(--color-neutral-3);
        }

    }

    .draw-type {
        svg {
            fill: var(--color-text-1);
        }
    }

}

#white-board-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>