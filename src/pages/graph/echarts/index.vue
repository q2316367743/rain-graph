<template>
    <div class="echarts">
        <div class="header">
            <a-button-group type="text">
                <a-dropdown>
                    <a-button>文件</a-button>
                    <template #content>
                        <a-doption @click="toHome">返回文件列表</a-doption>
                        <a-doption @click="$emit('new')" disabled>新建</a-doption>
                        <a-doption @click="$emit('open')" disabled>打开</a-doption>
                        <a-doption @click="$emit('save')">保存</a-doption>
                        <a-doption @click="saveAs">另存为</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>类型</a-button>
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
                        <a-doption>JSON</a-doption>
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
                <a-dropdown>
                    <a-button>更多</a-button>
                    <template #content>
                        <a-doption disabled>主题</a-doption>
                        <a-doption>快捷键</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </div>
        <div class="container">
            <div id="echarts-view" :style="{ height, width }"></div>
        </div>
    </div>
</template>
<script lang="ts">
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { defineComponent } from "vue";
import EchartsTypeEnum from "./enumeration/EchartsTypeEnum";
import { init, EChartsType } from 'echarts';
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";
import { markRaw } from "vue";
import { renderData, getDefaultDataByItems, getDefaultDataByHeaders } from "./algorithm";

export default defineComponent({
    name: 'echarts',
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
            myChart: markRaw({}) as EChartsType
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
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.ECHARTS
                }
            });
        },
        saveAs() {

        },
        drawInitEcharts(type: EchartsTypeEnum) {
            this.option = renderData(type, getDefaultDataByItems(), getDefaultDataByHeaders(), this.config);
            this.drawEcharts();
        },
        drawEcharts() {
            this.myChart.setOption(this.option)
        },
        resize() {
            this.myChart.resize();
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