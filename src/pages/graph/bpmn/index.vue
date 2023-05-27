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
import LogicFlow, { Definition } from '@logicflow/core';
import {
    BpmnElement,
    BpmnXmlAdapter,
    Snapshot,
    Control,
    Menu,
    SelectionSelect,
    MiniMap,
} from '@logicflow/extension';
import "@logicflow/extension/lib/style/index.css";

import "@logicflow/core/dist/style/index.css";
import '@logicflow/extension/lib/style/index.css';
import './index.less';

import BpmnPattern from './pattern.vue';
import { useClearEvent, useExportEvent, useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useBpmnStore } from "@/store/BpmnStore";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";

// Bpmn适配器
LogicFlow.use(BpmnElement);
LogicFlow.use(BpmnXmlAdapter);
// 快照
LogicFlow.use(Snapshot);
// 控制器
LogicFlow.use(Control);
// 框选
LogicFlow.use(SelectionSelect);
// 小地图
LogicFlow.use(MiniMap);
// 右键菜单
LogicFlow.use(Menu);

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
        ...mapState(useGlobalStore, ['size']),
        ...mapState(useGlobalStore, ['title']),
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
    mounted() {
        this.render = false
        let lf = new LogicFlow({
            ...this.config,
            container: document.querySelector('#bpmn-view') as HTMLElement
        });

        // 获取取数
        this.id = this.$route.params.id as string;
        if (this.id !== '0') {
            this.loading = true;
            utools.db.promises.get(this._id)
                .then(res => {
                    if (res) {
                        this._rev = res._rev;
                        let value = res.value;
                        this.config = value.config;
                        lf.render(value.record);
                        lf.options = {
                            ...this.config,
                            container: document.querySelector('#bpmn-view') as HTMLElement
                        };
                    } else {
                        lf.render();
                    }
                }).catch(e => MessageUtil.error("获取数据失败", e))
                .finally(() => {
                    this.loading = false;
                    this.render = true;
                    this.lf = lf;
                });
        } else {
            lf.render();
            this.render = true;
            this.lf = lf;
        }

        this.showMiniMap();

        // 事件
        useSaveEvent.on(() => this.save());
        useUndoEvent.on(() => this.lf.undo())
        useClearEvent.on(() => {
            this.lf.clearData();
            this.save();
        });
        useExportEvent.on(type => {
            if (type === ExportTypeEnum.PNG) {
                this.lf.extension.snapshot.lf.getSnapshot(this.title + '.png');
            } else if (type === ExportTypeEnum.XML) {
                const data = lf.getGraphData() as string;
                BrowserUtil.download(data, this.title + '.xml', 'text/xml');
            }
        })
    },
    methods: {
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

    >.arco-spin {
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

.lf-graph {
    background-color: var(--color-bg-1);

    .lf-node-content {
        circle {
            fill: var(--color-neutral-2);
        }

        rect {
            fill: var(--color-neutral-2);
        }

        polygon {
            fill: var(--color-neutral-2);

        }
    }
}

.bpmn-pattern {
    background-color: var(--color-bg-3);
    color: var(--color-text-1);
}

.lf-control {
    background-color: var(--color-bg-3);
    color: var(--color-text-1);
}

.lf-control-item:hover {
    background-color: var(--color-neutral-4);

}
</style>