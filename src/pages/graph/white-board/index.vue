<template>
    <div class="white-board">
        <div class="header">
            <a-button-group type="text">
                <a-dropdown>
                    <a-button>文件</a-button>
                    <template #content>
                        <a-doption @click="toHome">返回列表</a-doption>
                        <a-doption disabled>新建</a-doption>
                        <a-doption disabled>打开</a-doption>
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
                <a-dropdown trigger="click" @select="exportData">
                    <a-button>
                        导出
                    </a-button>
                    <template #content>
                        <a-doption :value="ExportTypeEnum.HTML">HTML</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click">
                    <a-button>更多</a-button>
                    <template #content>
                        <a-doption @click="changeGrid">网格显示</a-doption>
                        <a-doption @click="changeReadonly">编辑/只读</a-doption>
                        <a-doption @click="helpDrawer = true">帮助</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
            <a-radio-group type="button" v-model="activeKey">
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
        <div class="container">
            <div id="white-board-view"></div>
        </div>
        <a-drawer v-model:visible="helpDrawer" title="帮助" width="300px" :footer="false">
            <white-board-help />
        </a-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import TinyWhiteboard from "tiny-whiteboard";

import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

import IconChoose from './icon/IconChoose.vue';
import IconCircle from './icon/IconCircle.vue';
import IconDiamond from './icon/IconDiamond.vue';
import IconLine from './icon/IconLine.vue';
import IconRect from './icon/IconRect.vue';
import IconTriangle from './icon/IconTriangle.vue';

import WhiteBoardHelp from './components/help.vue';
import { markRaw } from "vue";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import { useWhiteBoardStore } from "@/store/graph/WhiteBoardStore";
import MessageUtil from "@/utils/MessageUtil";
import { useSaveEvent, useUndoEvent } from "@/global/BeanFactory";

export default defineComponent({
    name: 'white-board',
    components: { IconChoose, IconCircle, IconDiamond, IconLine, IconRect, IconTriangle, WhiteBoardHelp },
    data: () => ({
        ExportTypeEnum,
        // 数据
        id: '0',
        _rev: undefined as string | undefined,
        activeKey: 'selection',
        helpDrawer: false,
        app: markRaw({} as any),
        config: {
            grid: false,
            readonly: false
        },
        element: {}
    }),
    computed: {
        ...mapState(useGlobalStore, ['size']),
        _id() {
            return `/${GraphTypeEnum.WHITE_BOARD}/${this.id}`;
        }
    },
    watch: {
        size: {
            handler() {
                this.app.resize();
            },
            deep: true
        },
        activeKey() {
            this.app.updateCurrentType(this.activeKey);
            if (this.activeKey !== 'selection') {
                this.app.cancelActiveElement();
            }
        }
    },
    created() {
        useSaveEvent.on(() => this.save());
        useUndoEvent.on(() => this.undo());
    },
    mounted() {
        this.app = markRaw(new TinyWhiteboard({
            container: document.getElementById('white-board-view')
        }));
        // 初始化设置
        if (this.config.grid) {
            this.app.showGrid();
        } else {
            this.app.hideGrid();
        }
        if (this.config.readonly) {
            this.app.setReadonlyMode();
        } else {
            this.app.setEditMode();
        }
        // 事件监听
        this.app.on('currentTypeChange', (drawType: string) => {
            if (drawType === 'selection') {
                this.activeKey = 'selection';
            }
        });
        this.app.on('change', () => {
            if (this.id !== '0' && this.id !== '-1') {
                this.save()
            }
        });
        this.app.on('activeElementChange', (element: any) => {
            this.element = element;
        })
    },
    methods: {
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
            this.config.grid = !this.config.grid;
            if (this.config.grid) {
                this.app.showGrid();
            } else {
                this.app.hideGrid();
            }
        },
        changeReadonly() {
            this.config.readonly = !this.config.readonly;
            if (this.config.readonly) {
                this.app.setReadonlyMode();
            } else {
                this.app.setEditMode();
            }
        },
        save(show: boolean = false) {
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
                        if (show) {
                            MessageUtil.success("保存成功");
                        }
                    }).catch(e => MessageUtil.error("保存失败", e));
                }).catch(e => MessageUtil.error("保存失败", e));
        },
        saveAs() { },
        exportData(type: any) {

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