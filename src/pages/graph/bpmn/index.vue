<template>
    <div class="bpmn">
        <a-spin :loading="loading" tip="数据获取中">
            <div id="bpmn-view"></div>
        </a-spin>
        <bpmn-pattern :lf="lf" v-if="render" />
        <div class="show-mini-map">
            <a-button @click="showMiniMap" type="text">
                <template #icon>
                    <icon-location />
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import LogicFlow from '@logicflow/core';
import {
    BpmnElement,
    BpmnXmlAdapter,
    Snapshot,
    Control,
    Menu,
    SelectionSelect,
    MiniMap,
} from '@logicflow/extension';

import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css';
import './index.less';

import BpmnPattern from './pattern.vue';
import { useClearEvent, useExportEvent, useSaveAsEvent, useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useBpmnStore } from "@/store/BpmnStore";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";

export default defineComponent({
    name: 'bpmn',
    components: { BpmnPattern },
    data: () => ({
        id: '0',
        _rev: undefined as string | undefined,
        config: {
            grid: {
                size: 10,
                type: 'dot',
            },
            keyboard: {
                enabled: true,
            },
            snapline: true,
            background: {
                backgroundImage: 'var(--color-bg-1)'
            }
        },
        render: false,
        lf: {} as LogicFlow,
        loading: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'title']),
        _id() {
            return `/${GraphTypeEnum.BPMN}/${this.id}`;
        }
    },
    watch: {
        size: {
            handler() {
                this.lf.extension.miniMap.hide();
                this.lf.extension.miniMap.show(this.size.width - 156 - 10, this.size.height - 242 - 10 - 33);
            },
            deep: true
        }
    },
    created() {
        // 事件
        useSaveEvent.on(() => this.save());
        useSaveAsEvent.on(() => {
            BrowserUtil.download(JSON.stringify({
                config: toRaw(this.config),
                record: this.lf.getGraphData()
            }), this.title + '.json', 'text/json');
        });
        useUndoEvent.on(() => this.lf.undo())
        useClearEvent.on(() => {
            this.lf.clearData();
            this.save();
        });
        useExportEvent.on(type => {
            if (type === ExportTypeEnum.PNG) {
                console.log(this.lf.extension)
                this.lf.extension.snapshot.lf.getSnapshot(this.title + '.png');
            } else if (type === ExportTypeEnum.XML) {
                const data = this.lf.getGraphData() as string;
                BrowserUtil.download(data, this.title + '.xml', 'text/xml');
            }
        });
    },
    mounted() {
        this.render = false
        // 获取取数
        this.id = this.$route.params.id as string;
        if (this.id === '-1') {
            // 文件打开
            let path = this.$route.query.path as string;
            window.preload.openFileToString(path).then(value => {
                let data = undefined as any | undefined;
                try {
                    let val = JSON.parse(value);
                    this.config = val.config;
                    data = val.record;
                } catch (e) {
                    MessageUtil.error("文件打开失败", e)
                } finally {
                    this.init(data);
                }
            }).catch(e => MessageUtil.error("文件打开失败", e));
        } else if (this.id !== '0') {
            this.loading = true;
            utools.db.promises.get(this._id)
                .then(res => {
                    let data = undefined as any | undefined;
                    if (res) {
                        this._rev = res._rev;
                        let value = res.value;
                        this.config = value.config;
                        data = value.record;
                    }
                    this.init(data);
                    this.render = true;
                })
                .catch(e => {
                    MessageUtil.error("获取数据失败", e);
                    this.id = '0';
                    this.init();
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.init();
        }
    },
    methods: {
        init(data?: any) {
            let lf = new LogicFlow({
                ...this.config,
                container: document.querySelector('#bpmn-view') as HTMLElement,
                plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, Control, SelectionSelect, MiniMap, Menu]
            });
            lf.render(data);
            this.render = true;
            this.lf = lf;
            this.showMiniMap();
        },
        showMiniMap() {
            try {
                if (this.lf.extension.miniMap.isShow) {
                    this.lf.extension.miniMap.hide();
                } else {
                    this.lf.extension.miniMap.show(this.size.width - 156 - 10, this.size.height - 242 - 10 - 33);
                }
            } catch (_) {
            }
        },
        save() {
            useBpmnStore().add(this.id)
                .then(id => {
                    this.id = id;
                    // 保存记录
                    utools.db.promises.put({
                        _id: this._id,
                        _rev: this._rev,
                        value: {
                            config: toRaw(this.config),
                            record: this.lf.getGraphData()
                        }
                    }).then(res => {
                        if (res.error) {
                            MessageUtil.error(res.message || "保存失败");
                            return;
                        }
                        this._rev = res.rev;
                        MessageUtil.success("保存成功");
                    }).catch(e => MessageUtil.error("保存失败", e));
                }).catch(e => MessageUtil.error("保存BPMN失败", e));
        }
    }
});
</script>
<style lang="less">
.bpmn {
    position: relative;
    width: 100%;
    height: 100%;

    .show-mini-map {
        position: absolute;
        left: 10px;
        bottom: 10px;
    }

    &>.arco-spin {
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}

#bpmn-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>