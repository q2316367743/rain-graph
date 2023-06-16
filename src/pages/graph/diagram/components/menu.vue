<template>
    <div class="diagram-menu">
        <a-button-group type="text">
            <a-dropdown>
                <a-button>文件</a-button>
                <template #content>
                    <a-doption @click="toHome">返回文件列表</a-doption>
                    <a-doption @click="open">打开</a-doption>
                    <a-doption @click="$emit('save')">保存</a-doption>
                    <a-doption @click="saveAs">另存为</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>编辑</a-button>
                <template #content>
                    <a-doption @click="lf.undo()">后退</a-doption>
                    <a-doption @click="lf.redo()">前进</a-doption>
                    <a-doption @click="selectAll">全选</a-doption>
                    <a-doption @click="unSelectAll">全不选</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>查看</a-button>
                <template #content>
                    <a-doption @click="$emit('update-readonly')">
                        <template #icon><icon-check :style="{ visibility: readonly ? 'visible' : 'hidden' }" /></template>
                        只读
                    </a-doption>
                    <a-doption @click="panel = !panel">
                        <template #icon><icon-check :style="{ visibility: panel ? 'visible' : 'hidden' }" /></template>
                        面板
                    </a-doption>
                    <a-doption @click="showMiniMap">
                        <template #icon><icon-check
                                :style="{ visibility: display.miniMap ? 'visible' : 'hidden' }" /></template>
                        小地图
                    </a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>视图</a-button>
                <template #content>
                    <a-doption @click="reset">重置大小</a-doption>
                    <a-doption @click="plus">放大</a-doption>
                    <a-doption @click="reduce">缩小</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>导出</a-button>
                <template #content>
                    <a-doption @click="onExport(ExportTypeEnum.JSON)">JSON</a-doption>
                    <a-doption @click="onExport(ExportTypeEnum.XML)">XML</a-doption>
                    <a-doption @click="onExport(ExportTypeEnum.PNG)">PNG</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>更多</a-button>
                <template #content>
                    <a-doption disabled>主题</a-doption>
                    <a-doption @click="keyboardShortcut = true;">快捷键</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
        <div type="text">
            <!-- 锁定 -->
            <a-button type="text" @click="$emit('update-readonly')" :status="readonly ? 'success' : 'normal'">
                <template #icon>
                    <icon-lock />
                </template>
            </a-button>
            <!-- 全屏 -->
            <a-button type="text" @click="fullscreen.toggle()" :status="fullscreen.isFullscreen ? 'success' : 'normal'">
                <template #icon>
                    <icon-fullscreen-exit v-if="fullscreen.isFullscreen" />
                    <icon-fullscreen v-else />
                </template>
            </a-button>
            <!-- 面板 -->
            <a-button type="text" @click="panel = !panel" :status="panel ? 'success' : 'normal'">
                <template #icon>
                    <icon-layout />
                </template>
            </a-button>
        </div>
        <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
            <a-descriptions align="right" title="节点操作" :column="1">
                <a-descriptions-item label="保存">Ctrl + s</a-descriptions-item>
                <a-descriptions-item label="复制">Ctrl + c</a-descriptions-item>
                <a-descriptions-item label="粘贴">Ctrl + v</a-descriptions-item>
                <a-descriptions-item label="回退">Ctrl + Z</a-descriptions-item>
                <a-descriptions-item label="删除">backspace</a-descriptions-item>
                <a-descriptions-item label="侧边栏">Ctrl + b</a-descriptions-item>
                <a-descriptions-item label="小地图">Ctrl + m</a-descriptions-item>
                <a-descriptions-item label="选中">按住Ctrl + 鼠标左键拖动</a-descriptions-item>
                <a-descriptions-item label="放大/缩小">按住Ctrl + 滚轮</a-descriptions-item>
            </a-descriptions>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { mapState } from "pinia";
import { useFileSystemAccess, useFullscreen } from "@vueuse/core";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { download } from "@/utils/BrowserUtil";
import { useGlobalStore } from "@/store/GlobalStore";
import { useMapEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'diagram-menu',
    emits: ['update:panel-show', 'new', 'open', 'save', 'show-mini-map', 'update-readonly'],
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
        config: {
            type: Object,
            required: false,
            default: {}
        },
        collapsed: Boolean,
        panelShow: Boolean,
        readonly: Boolean
    },
    data: () => ({
        ExportTypeEnum,
        keyboardShortcut: false,
        fullscreen: useFullscreen(),
        panel: true,
        // 显示设置
        display: {
            miniMap: false
        },
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
        ...mapState(useGlobalStore, ['size', 'title']),
        miniMapLeft() {
            if (this.readonly) {
                return this.size.width - 156 - 10;
            }
            return this.size.width - 156 - 10 - (this.collapsed ? 0 : 200);
        },
        miniMapTop() {
            return this.size.height - 242 - 10 - 33;
        }
    },
    watch: {
        panel(newValue) {
            this.$emit('update:panel-show', newValue)
        },
    },
    created() {
        useMapEvent.on(() => this.showMiniMap());
        this.display.miniMap = this.lf.extension.miniMap.isShow;
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.DIAGRAM
                }
            })
        },
        onExport(type: ExportTypeEnum) {
            if (type === ExportTypeEnum.JSON) {
                download(JSON.stringify({
                    config: toRaw(this.config),
                    record: this.lf.getGraphRawData()
                }), this.title + '.json', 'text/json');
            } else if (type === ExportTypeEnum.PNG) {
                this.lf.extension.snapshot.lf.getSnapshot(this.title + '.png');
            } else if (type === ExportTypeEnum.XML) {
                const data = this.lf.getGraphData() as string;
                download(data, this.title + '.xml', 'text/xml');
            }
        },
        saveAs() {
            download(JSON.stringify({
                config: toRaw(this.config),
                record: this.lf.getGraphRawData()
            }), this.title + '.json', 'text/json');
        },
        showMiniMap() {
            try {
                if (this.lf.extension.miniMap.isShow) {
                    this.lf.extension.miniMap.hide();
                } else {
                    this.lf.extension.miniMap.show(this.miniMapLeft, this.miniMapTop);
                }
                this.display.miniMap = this.lf.extension.miniMap.isShow;
            } catch (_) {
            }
        },
        reset() {
            this.lf.resetZoom();
        },
        plus() {
            this.lf.zoom(true);
        },
        reduce() {
            this.lf.zoom(false);
        },
        selectAll() {
            let nodes = this.lf.getGraphRawData().nodes as any[];
            let first = true;
            for (let node of nodes) {
                if (node.id) {
                    this.lf.selectElementById(node.id, !first);
                    first = false;
                }
            }
        },
        unSelectAll() {
            this.lf.clearSelectElements();
        },
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let content = this.fileSystem.data || '';
                try {
                    let json = JSON.parse(content);
                    let config = json['config'];
                    let data = json['record'];
                    this.lf.updateEditConfig(config);
                    this.lf.renderRawData(data);
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
<style scoped lang="less">
.diagram-menu {
    display: flex;
    justify-content: space-between;

}
</style>