<template>
    <div class="diagram-toolbar">
        <div class="toolbar-item" :class="{ 'selection-active': selectionOpened }" @click="selectionSelect()">
            <icon-fullscreen :size="18" />
        </div>
        <div class="toolbar-item" @click="zoomIn()">
            <icon-zoom-in :size="18" />
        </div>
        <div class="toolbar-item" @click="zoomOut()">
            <icon-zoom-out :size="18" />
        </div>
        <div class="toolbar-item" :class="{ 'disabled': !undoAble }" @click="undo()">
            <icon-undo :size="18" />
        </div>
        <div class="toolbar-item" :class="{ 'disabled': !redoAble }" @click="redo()">
            <icon-redo :size="18" />
        </div>
        <div>
            <a-select v-model="linetype" size="mini" @change="changeLineType">
                <a-option v-for="item in lineOptions" :key="item.value" :value="item.value" :label="item.label"></a-option>
            </a-select>
        </div>
    </div>
</template>

<script lang="ts">
import { useKeyModifier } from '@vueuse/core'
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        lf: Object,
        activeEdges: Array<any>
    },
    data: () => ({
        selectionOpened: false,
        undoAble: false,
        redoAble: false,
        colors: '#345678',
        linetype: 'pro-polyline',
        lineOptions: [
            {
                value: 'pro-polyline',
                label: '折线'
            },
            {
                value: 'pro-line',
                label: '直线'
            },
            {
                value: 'pro-bezier',
                label: '曲线'
            }
        ],
        control: useKeyModifier('Control')
    }),
    watch: {
        control() {
            this.selectionOpened = !(this.control || false);
            this.selectionSelect();
        }
    },
    methods: {
        changeFillColor(val: string) {
            this.$emit('changeNodeFillColor', val)
        },
        saveGraph() {
            this.$emit('saveGraph')
        },
        zoomIn() {
            if (this.lf) {
                this.lf.zoom(true)
            }
        },
        zoomOut() {
            if (this.lf) {
                this.lf.zoom(false)
            }
        },
        undo() {
            if (this.lf) {
                this.lf.undo()
            }
        },
        redo() {
            if (this.lf) {

                this.lf.redo()
            }
        },
        selectionSelect() {
            this.selectionOpened = !this.selectionOpened
            if (this.lf) {
                if (this.selectionOpened) {
                    this.lf.extension.selectionSelect.openSelectionSelect()
                } else {
                    this.lf.extension.selectionSelect.closeSelectionSelect()
                }
            }
        },
        changeLineType(value: any) {
            if (this.lf) {
                const { lf, activeEdges } = this
                const { graphModel } = lf
                this.lf.setDefaultEdgeType(value)
                if (activeEdges && activeEdges.length > 0) {
                    activeEdges.forEach(edge => {
                        graphModel.changeEdgeType(edge.id, value)
                    })
                }
            }
        }
    },
})
</script>

<style scoped>
.toolbar-item {
    width: 18px;
    height: 18px;
    float: left;
    margin: 12px 4px;
    cursor: pointer;
}

.toolbar-color-picker {
    width: 24px;
    height: 24px;
    margin: 8px 4px;
}

.selection-active {
    background: #33a3dc;
}
</style>