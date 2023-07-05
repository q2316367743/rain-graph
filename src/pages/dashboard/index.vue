<template>
    <div class="dashboard">
        <a-row :gutter="7" style="margin: 7px">
            <a-col :span="8">
                <a-card>
                    <a-statistic title="思维导图" :value="mindMaps.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card>
                    <a-statistic title="流程图" :value="diagrams.length" show-group-separator/>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card>
                    <a-statistic title="白板" :value="whiteBoards.length" show-group-separator/>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="7" style="margin: 7px">
            <a-col :span="24">
                <a-card title="活跃图">
                    <template #extra>{{ endDate }}</template>
                    <calendar-heatmap :values="values" :dark-mode="isDark" :end-date="endDate"/>
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
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useMindMapStore} from "@/store/graph/MindMapStore";

interface CalenderNode {
    date: string | Date,
    count: number
}

export default defineComponent({
    name: 'dashboard',
    components: {CalendarHeatmap},
    computed: {
        ...mapState(useGlobalStore, ['isDark']),
        ...mapState(useMindMapStore, ['mindMaps']),
        ...mapState(useDiagramStore, ['diagrams']),
        ...mapState(useWhiteBoardStore, ['whiteBoards']),
    },
    data: () => {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        let month = date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
        let day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        return {
            values: new Array<CalenderNode>(),
            endDate: date.getFullYear() + '-' + month + '-' + day as any
        }
    },
    created() {
        const nodeMap = new Map<string, number>();
        for (const item of [...this.mindMaps, ...this.diagrams, ...this.whiteBoards]) {
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
