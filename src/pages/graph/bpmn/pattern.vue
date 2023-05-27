<template>
    <!-- 侧边工具栏 -->
    <div class="bpmn-pattern">
        <div class="pattern-selection" @mousedown="openSelection" />
        <div>选区</div>
        <div class="pattern-start" @mousedown="addStartNode" />
        <div>开始</div>
        <div class="pattern-user" @mousedown="addUserTask" />
        <div>用户任务</div>
        <div class="pattern-user" @mousedown="addServiceTask" />
        <div>系统任务</div>
        <div class="pattern-condition" @mousedown="addGateWay" />
        <div>条件判断</div>
        <div class="pattern-end" @mousedown="addEndNode" />
        <div>结束</div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'bpmn-pattern',
    props: {
        lf: Object
    },
    data: () => ({

    }),
    created() {
        this.lf && this.lf.on('selection:selected', () => {
            if (this.lf) {
                this.lf.updateEditConfig({
                    stopMoveGraph: false,
                });
            }
        });
    },
    methods: {
        addStartNode() {
            if (this.lf) {
                this.lf.dnd.startDrag({
                    type: 'bpmn:startEvent',
                    text: '开始'
                });
            }
        },
        addUserTask() {
            if (this.lf) {
                this.lf.dnd.startDrag({
                    type: 'bpmn:userTask',
                });
            }
        },
        addServiceTask() {
            if (this.lf) {
                this.lf.dnd.startDrag({
                    type: 'bpmn:serviceTask',
                });
            }
        },
        addGateWay() {
            if (this.lf) {
                this.lf.dnd.startDrag({
                    type: 'bpmn:exclusiveGateway',
                });
            }
        },
        addEndNode() {
            if (this.lf) {
                this.lf.dnd.startDrag({
                    type: 'bpmn:endEvent',
                    text: '结束'
                });
            }
        },
        openSelection() {
            if (this.lf) {
                this.lf.updateEditConfig({
                    stopMoveGraph: true,
                });
            }
        }
    }
});
</script>
<style scoped></style>