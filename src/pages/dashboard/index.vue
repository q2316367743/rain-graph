<template>
    <div class="dashboard">
        <a-row :gutter="7" style="margin: 7px">
            <a-col :span="6">
                <a-card>
                    <a-statistic title="简易思维导图" :value="minds.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="完整思维导图" :value="simpleMindMaps.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="流程图" :value="diagrams.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="白板" :value="whiteBoards.length" show-group-separator/>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="7" style="margin: 7px">
            <a-col :span="24">
                <a-card title="活跃图">
                    <template #extra>{{ endDate}}</template>
                    <calendar-heatmap :values="values" :dark-mode="isDark" :end-date="endDate" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {CalendarHeatmap} from 'vue3-calendar-heatmap';
import 'vue3-calendar-heatmap/dist/style.css'
import {mapState} from "pinia";
import {useSimpleMindMapStore} from "@/store/graph/SimpleMindMapStore";
import {useMindStore} from "@/store/graph/MindStore";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import {useGlobalStore} from "@/store/GlobalStore";

interface CalenderNode {
    date: string | Date,
    count: number
}

export default defineComponent({
    name: 'dashboard',
    components: {CalendarHeatmap},
    computed: {
        ...mapState(useGlobalStore, ['isDark']),
        ...mapState(useSimpleMindMapStore, ['simpleMindMaps']),
        ...mapState(useMindStore, ['minds']),
        ...mapState(useDiagramStore, ['diagrams']),
        ...mapState(useWhiteBoardStore, ['whiteBoards']),
    },
    data: () => {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        return {
            values: new Array<CalenderNode>(),
            endDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() as any
        }
    },
    created() {
        const nodeMap = new Map<string, number>();
        for (const item of [...this.simpleMindMaps, ...this.minds, ...this.diagrams, ...this.whiteBoards]) {
            if (typeof item.createTime === 'string') {
                let date = item.createTime.substring(0, 10);
                if (nodeMap.has(date)) {
                    nodeMap.set(date, (nodeMap.get(date) || 1) + 1);
                } else {
                    nodeMap.set(date, 1);
                }
            }
        }
        nodeMap.forEach((value, key) => {
            this.values.push({
                date: key,
                count: value
            });
        });
    }
});
</script>
<style lang="less">
.dashboard {
    position: relative;
    height: 100%;
    width: 100%;
    .vch__legend {
        margin-top: 7px;
    }
}
</style>
