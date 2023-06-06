<template>
    <a-modal class="nodeDialog" title="超链接" v-model:visible="dialogVisible" width="500" @cancel="cancel" @ok="confirm"
        ok-text="保存">
        <a-form :model="link" @submit="confirm">
            <a-form-item label="链接">
                <a-input v-model="link.value" size="mini" placeholder="http://xxxx.xx/"></a-input>
            </a-form-item>
            <a-form-item label="名称">
                <a-input v-model="link.name" size="mini"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import SimpleMindMapWrap from '../../SimpleMindMapWrap';

export default defineComponent({
    name: 'simple-mind-map-node-hyper-link',
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
            link: {
                name: '',
                value: ''
            },
            activeNodes: [] as any[]
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
                let firstNode = this.activeNodes[0] as any;
                this.link.value = firstNode.getData('hyperlink')
                this.link.name = firstNode.getData('hyperlinkTitle')
            } else {
                this.link.value = ''
                this.link.name = ''
            }
        })
        this.simpleMindMapWrap.on('showNodeLink', () => {
            if (this.activeNodes.length > 0) {
                this.activeNodes[0].mindMap.keyCommand.pause()
            }
            this.dialogVisible = true
        })
    },
    methods: {
        cancel() {
            this.dialogVisible = false
            this.activeNodes[0].mindMap.keyCommand.recovery()
        },

        confirm() {
            this.activeNodes.forEach(node => {
                node.setHyperlink(this.link.value, this.link.name)
                this.cancel()
            })
        }
    }
})
</script>

<style lang="less" scoped>
.nodeDialog {
    .item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .name {
            display: block;
            width: 50px;
        }
    }
}
</style>