<template>
    <a-modal class="nodeDialog" title="备注" v-model:visible="dialogVisible" fullscreen width="500" ok-text="保存"
        @cancel="cancel" @ok="confirm">
        <a-textarea :auto-size="{ minRows: 3, maxRows: 10 }" v-model="note" />
    </a-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import SimpleMindMapWrap from '../../SimpleMindMapWrap';

export default defineComponent({
    name: 'simple-mind-map-node-note',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
        visible: Boolean
    },
    data() {
        return {
            dialogVisible: false,
            note: '',
            activeNodes: [],
        }
    },
    watch: {
        visible(newValue) {
            this.dialogVisible = newValue;
        },
        dialogVisible(newValue) {
            this.$emit('update:visible', newValue);
        }
    },
    created() {
        this.simpleMindMapWrap.on('node_active', (...args) => {
            this.activeNodes = args[1]
            if (this.activeNodes.length > 0) {
                let firstNode = this.activeNodes[0] as any
                this.note = firstNode.getData('note')
            } else {
                this.note = ''
            }
        })
    },
    methods: {
        cancel() {
            this.dialogVisible = false
        },
        confirm() {
            this.activeNodes.forEach((node: any) => {
                node.setNote(this.note)
            })
            this.cancel()
        }
    }
})
</script>

<style lang="less" scoped>
.nodeDialog {
    .tip {
        margin-top: 5px;
        color: #dcdfe6;
    }
}
</style>