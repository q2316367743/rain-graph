<template>
    <div class="echarts">
        <div class="header">
            <a-button-group type="text">
                <a-dropdown>
                    <a-button>例子</a-button>
                    <template #content>
                        <a-dgroup title="折线图">
                            <a-doption @click="drawInitEcharts('line')">基础折线图</a-doption>
                        </a-dgroup>
                        <a-dgroup title="柱状图">
                            <a-doption @click="drawInitEcharts('bar')">基础柱状图</a-doption>
                        </a-dgroup>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>编辑</a-button>
                    <template #content>
                        <a-doption @click="openJsonDialog">JSON</a-doption>
                        <a-doption>表格</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>操作</a-button>
                    <template #content>
                        <a-doption @click="drawEcharts">刷新</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>导出</a-button>
                    <template #content>
                        <a-doption>JSON</a-doption>
                        <a-doption>PNG</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </div>
        <div class="container">
            <div id="echarts-view" :style="{ height, width }"></div>
        </div>
        <a-modal v-model:visible="json.dialog" title="JSON编辑器" ok-text="渲染" fullscreen popup-container=".echarts"
            :render-to-body="false" @ok="renderJson">
            <codemirror v-model="json.record" autofocus auto-destroy :extensions="extensions"
                style="width: 100%;height: 100%;" />
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { init, EChartsType } from 'echarts';
import { mapState } from "pinia";
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { useGlobalStore } from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import { getExample } from "./algorithm";
import EchartsTypeEnum from "./enumeration/EchartsTypeEnum";

export default defineComponent({
    name: 'echarts',
    components: { Codemirror },
    data: () => {
        let type = 'line' as EchartsTypeEnum
        let config = {
            title: '听雨图编辑器',
            subtitle: '使用echarts实现听雨图编辑器',
        };
        return {
            type,
            config,
            option: {},
            myChart: markRaw({}) as EChartsType,
            extensions: markRaw([json()]) as any[],
            json: {
                dialog: false,
                record: ''
            }
        }
    },
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'size']),
        viewHeight() {
            return (this.height - 33 - 28) + 'px';
        },
        viewWidth() {
            return (this.width - 28) + 'px';
        }
    },
    watch: {
        size: {
            handler() {
                this.resize();
            },
            deep: true
        }
    },
    mounted() {
        const echartsView = document.getElementById('echarts-view') as HTMLElement;
        this.myChart = markRaw(init(echartsView));
        this.drawInitEcharts('line');
    },
    beforeUnmount() {
        this.myChart.clear();
    },
    methods: {
        drawInitEcharts(type: EchartsTypeEnum) {
            this.option = getExample(type);
            this.drawEcharts();
        },
        drawEcharts() {
            this.myChart.clear();
            this.myChart.setOption(this.option)
        },
        resize() {
            this.myChart.resize();
        },
        openJsonDialog() {
            this.json = {
                dialog: true,
                record: JSON.stringify(this.option, null, 4)
            };
        },
        renderJson() {
            try {
                let option = JSON.parse(this.json.record); // 将字符串转换为对象形式。这是v3的生成
                this.option = option; // 将对象转换为ES6形式。这是v3的生成 或 v2的转
                this.drawEcharts(); // 重新绘制，以使新的option可以正确展示展示选择器的图
            } catch (e) {
                MessageUtil.error("渲染异常", e);
            } finally {
                this.json.dialog = false;
            }
        }
    }
});
</script>
<style lang="less">
.echarts {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: relative;
        height: 32px;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}

#echarts-view {
    position: absolute;
    top: 14px;
    left: 14px;
    height: v-bind(viewHeight);
    width: v-bind(viewWidth);
}
</style>