<template>
    <div>
        <a-button-group type="text">
            <a-dropdown>
                <a-button>文件</a-button>
                <template #content>
                    <a-doption @click="toHome">返回列表</a-doption>
                    <a-doption disabled>新建</a-doption>
                    <a-doption disabled>打开</a-doption>
                    <a-doption @click="$emit('save')">保存</a-doption>
                    <a-doption @click="$emit('save-as')">另存为</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown trigger="click">
                <a-button>编辑</a-button>
                <template #content>
                    <a-doption :disabled="index === 0" @click="$emit('back')">后退</a-doption>
                    <a-doption :disabled="index === len - 1" @click="$emit('forward')">前进</a-doption>
                    <a-doption :disabled="!hasNode" @click="$emit('add-node')">插入同级节点</a-doption>
                    <a-doption :disabled="!hasNode" @click="$emit('add-child-node')">插入子节点</a-doption>
                    <a-doption :disabled="!hasNode" @click="$emit('remove-node')">删除节点</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a-button>插入</a-button>
                <template #content>
                    <a-doption :disabled="!hasNode">
                        <template #icon><icon-image /></template>
                        图片
                    </a-doption>
                    <a-doption :disabled="!hasNode">
                        <template #icon><icon-robot /></template>
                        图标
                    </a-doption>
                    <a-doption :disabled="!hasNode" @click="openLink">
                        <template #icon><icon-link /></template>
                        超链接
                    </a-doption>
                    <a-doption :disabled="!hasNode">
                        <template #icon><icon-edit /></template>
                        备注
                    </a-doption>
                    <a-doption :disabled="!hasNode">
                        <template #icon><icon-tag /></template>
                        标签
                    </a-doption>
                    <a-doption :disabled="!hasNode">
                        <template #icon><icon-apps /></template>
                        概要
                    </a-doption>
                    <a-doption :disabled="!hasNode">
                        <template #icon><icon-oblique-line /></template>
                        关联线
                    </a-doption>
                </template>
            </a-dropdown>
            <a-dropdown trigger="click" @select="(e) => $emit('export', e)">
                <a-button>
                    导出
                </a-button>
                <template #content>
                    <a-doption :value="ExportTypeEnum.JSON">JSON</a-doption>
                    <a-doption :value="ExportTypeEnum.SVG">SVG</a-doption>
                    <a-doption :value="ExportTypeEnum.PNG">PNG</a-doption>
                    <a-doption :value="ExportTypeEnum.PDF">PDF</a-doption>
                    <a-doption :value="ExportTypeEnum.MD">Markdown</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown trigger="click">
                <a-button>
                    设置
                </a-button>
                <template #content>
                    <a-doption disabled>画布</a-doption>
                    <a-doption @click="openTheme">主题</a-doption>
                    <a-doption @click="layoutDrawer = true">布局</a-doption>
                    <a-doption @click="tocDrawer = true">大纲</a-doption>
                    <a-doption @click="keyboardShortcut = true;">快捷键</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>

        <!-- ------ 编辑相关 ------ -->

        <!-- 超链接 -->
        <a-modal v-model:visible="link.dialog" title="添加超链接" ok-text="添加" @ok="addLink">
            <a-form :model="link.record">
                <a-form-item label="名称">
                    <a-input v-model="link.record.name" />
                </a-form-item>
                <a-form-item label="链接地址">
                    <a-input v-model="link.record.href" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- ------ 设置相关 ------ -->

        <a-drawer v-model:visible="themeDrawer" mask-closable :footer="false" width="372px" class="simple-mind-map-theme">
            <template #title>
                <span>主题</span>
                <a-radio-group v-model="themeType" type="button" style="margin-left: 14px;">
                    <a-radio value="light">白天</a-radio>
                    <a-radio value="dark">黑夜</a-radio>
                </a-radio-group>
            </template>
            <a-list :bordered="false">
                <a-list-item v-for="theme of themeList">
                    <a-image :src="`./simple-mind-map/theme/${theme.value}.jpg`" fit="cover" :title="theme.name"
                        width="300px" :preview="false" style="cursor: pointer;" @click="switchTheme(theme.value)" />
                </a-list-item>
            </a-list>
        </a-drawer>
        <a-drawer title="布局" v-model:visible="layoutDrawer" mask-closable :footer="false" width="372px"
            class="simple-mind-map-layout">
            <a-list :bordered="false">
                <a-list-item v-for="layout of layoutList">
                    <a-image :src="`./simple-mind-map/layout/${layout.value}.jpg`" fit="cover" :title="layout.name"
                        width="300px" :alt="layout.name" :preview="false" style="cursor: pointer;"
                        @click="switchLayout(layout.value)" />
                </a-list-item>
            </a-list>
        </a-drawer>
        <a-drawer title="大纲" v-model:visible="tocDrawer" mask-closable :footer="false" width="372px" unmount-on-close>
            <a-tree :data="[renderTree || {}]" block-node>
                <template #title="nodeData">
                    <a-link @click="setNode(nodeData._node)">{{ nodeData.data.text }}</a-link>
                </template>
            </a-tree>
        </a-drawer>
        <a-drawer title="快捷键" v-model:visible="keyboardShortcut" mask-closable :footer="false" width="300px">
            <a-descriptions align="right" title="节点操作" :column="1">
                <a-descriptions-item label="插入下级节点">Tab</a-descriptions-item>
                <a-descriptions-item label="插入同级节点">Enter</a-descriptions-item>
                <a-descriptions-item label="上移节点">Ctrl + ↑</a-descriptions-item>
                <a-descriptions-item label="下移节点">Ctrl + ↓</a-descriptions-item>
                <a-descriptions-item label="保存">Ctrl + S</a-descriptions-item>
                <a-descriptions-item label="展开/收起节点">/</a-descriptions-item>
                <a-descriptions-item label="删除节点">Delete | Backspace</a-descriptions-item>
                <a-descriptions-item label="复制节点">Ctrl + C</a-descriptions-item>
                <a-descriptions-item label="剪切节点">Ctrl + X</a-descriptions-item>
                <a-descriptions-item label="粘贴节点">Ctrl + V</a-descriptions-item>
                <a-descriptions-item label="编辑节点">F2</a-descriptions-item>
                <a-descriptions-item label="文本换行">Shift + Enter</a-descriptions-item>
                <a-descriptions-item label="回退">Ctrl + Z</a-descriptions-item>
                <a-descriptions-item label="前进">Ctrl + Y</a-descriptions-item>
                <a-descriptions-item label="全选">Ctrl + A</a-descriptions-item>
                <a-descriptions-item label="多选">右键 / Ctrl + 左键</a-descriptions-item>
                <a-descriptions-item label="一键整理布局">Ctrl + L</a-descriptions-item>
            </a-descriptions>
            <a-descriptions align="right" title="画布操作" :column="1">
                <a-descriptions-item label="放大">Ctrl + +</a-descriptions-item>
                <a-descriptions-item label="缩小">Ctrl + -</a-descriptions-item>
                <a-descriptions-item label="恢复默认">Ctrl + Enter</a-descriptions-item>
            </a-descriptions>
        </a-drawer>

    </div>
</template>
<script lang="ts">
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { themeByLightList, themeByDarkList, layoutList } from "../data/constants";

export default defineComponent({
    name: '',
    props: {
        renderTree: Object,
        index: {
            type: Number,
            required: false,
            default: 0
        },
        len: {
            type: Number,
            required: false,
            default: 0
        },
        hasNode: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ['save', 'save-as', 'export', 'add-link',
        // 设置相关
        'switch-theme', 'switch-layout', 'set-node',
        // 节点相关事件
        'add-child-node', 'add-node', 'remove-node', 'back', 'forward'],
    data: () => ({
        ExportTypeEnum,
        link: {
            dialog: false,
            record: {
                name: '',
                href: ''
            }
        },

        // ------ 设置相关 ------

        themeByLightList, themeByDarkList, layoutList,
        show: false,
        keyboardShortcut: false,
        themeDrawer: false,
        themeType: 'light',
        layoutDrawer: false,
        tocDrawer: false,
        fieldNames: {
            key: 'value',
            title: 'data.text',
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['width', 'isDark']),
        themeList() {
            if (this.themeType === 'light') {
                return themeByLightList;
            } else if (this.themeType === 'dark') {
                return themeByDarkList;
            } else {
                return [];
            }
        }
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.SIMPLE_MIND_MAP
                }
            })
        },
        openLink() {
            this.link = {
                dialog: true,
                record: {
                    name: '',
                    href: ''
                }
            };
        },
        addLink() {
            this.$emit('add-link', this.link.record.name, this.link.record.href);
            this.link.dialog = false;
        },

        // ------ 设置相关 ------
        openTheme() {
            this.themeType = this.isDark ? 'dark' : 'light';
            this.themeDrawer = true;
        },
        switchTheme(theme: string) {
            this.$emit('switch-theme', theme);
            this.themeDrawer = false;
        },
        switchLayout(layout: string) {
            this.$emit('switch-layout', layout);
            this.layoutDrawer = false;
        },
        setNode(node: any) {
            this.$emit('set-node', node);
        }
    }
});
</script>
<style scoped></style>