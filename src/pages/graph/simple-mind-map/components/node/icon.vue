<template>
    <a-modal class="nodeDialog" title="图标" v-model:visible="dialogVisible" width="700" :footer="false">
        <div class="item" v-for="item in nodeIconList" :key="item.name">
            <div class="title">{{ item.name }}</div>
            <div class="list">
                <div class="icon" v-for="icon in item.list" :key="icon.name" v-html="getHtml(icon.icon)" :class="{
                    selected: iconList.includes(item.type + '_' + icon.name)
                }" @click="setIcon(item.type, icon.name)"></div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { nodeIconList } from '../../data/icon';
import SimpleMindMapWrap from '../../SimpleMindMapWrap';
import MessageUtil from '@/utils/MessageUtil';

export default defineComponent({
    name: 'simple-mind-map-node-icon',
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
            nodeIconList,
            dialogVisible: false,
            iconList: [] as any[],
            activeNodes: []
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
                this.iconList = firstNode.getData('icon') || []
            } else {
                this.iconList = []
            }
        })
        this.simpleMindMapWrap.on('showNodeIcon', () => {
            this.dialogVisible = true
        });
    },
    methods: {
        getHtml(icon: string) {
            return /^<svg/.test(icon) ? icon : `<img src="${icon}" />`
        },

        setIcon(type: string, name: string) {
            try {
                let key = type + '_' + name
                let index = this.iconList.findIndex(item => {
                    return item === key
                })
                // 删除icon
                if (index !== -1) {
                    this.iconList.splice(index, 1)
                } else {
                    let typeIndex = this.iconList.findIndex(item => {
                        return item.split('_')[0] === type
                    })
                    // 替换icon
                    if (typeIndex !== -1) {
                        this.iconList.splice(typeIndex, 1, key)
                    } else {
                        // 增加icon
                        this.iconList.push(key)
                    }
                }
                this.activeNodes.forEach((node: any) => {
                    node.setIcon([...this.iconList])
                });
                this.dialogVisible = false;
            } catch (e) {
                MessageUtil.error("插入图标失败", e);
            }
        }
    }
})
</script>

<style lang="less" scoped>
.nodeDialog {

    .deleteBtn {
        margin-bottom: 20px;
    }

    .item {
        margin-bottom: 20px;
        font-weight: bold;

        .title {
            margin-bottom: 10px;
        }

        .list {
            display: flex;
            flex-wrap: wrap;

            .icon {
                width: 24px;
                height: 24px;
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                }

                svg {
                    width: 100%;
                    height: 100%;
                }

                &.selected {
                    &::after {
                        content: '';
                        position: absolute;
                        left: -4px;
                        top: -4px;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        border: 2px solid #409eff;
                    }
                }
            }
        }
    }
}
</style>