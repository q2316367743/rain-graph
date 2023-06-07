<template>
    <a-modal class="nodeDialog" title="标签" v-model:visible="dialogVisible" width="500" ok-text="保存" @cancel="cancel"
        @ok="confirm">
        <a-input v-model="tag" @keyup.native.enter="add" @keyup.native.stop :disabled="tagArr.length >= max"
            placeholder="请输入标签，回车新增">
        </a-input>
        <div class="tagList">
            <div class="tagItem" v-for="(item, index) in tagArr" :key="index" :style="{
                backgroundColor: tagColorList[index].background,
                color: tagColorList[index].color
            }">
                {{ item }}
                <div class="delBtn" @click="del(index)">
                    <icon-delete :size="20"/>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
import SimpleMindMapWrap from '../../SimpleMindMapWrap';
import { tagColorList } from '../../data/constants'
import { PropType, defineComponent } from 'vue';

export default defineComponent({
    name: 'simple-mind-map-node-tag',
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
            tagColorList,
            tagArr: new Array<string>(),
            tag: '',
            activeNodes: [],
            max: 5
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
                this.tagArr = firstNode.getData('tag') || []
            } else {
                this.tagArr = []
                this.tag = ''
            }
        })
    },
    methods: {
        /**
         * @Author: 王林
         * @Date: 2021-06-24 21:48:14
         * @Desc: 添加
         */
        add() {
            this.tagArr.push(this.tag)
            this.tag = ''
        },

        /**
         * @Author: 王林
         * @Date: 2021-06-24 21:57:53
         * @Desc: 删除
         */
        del(index: number) {
            this.tagArr.splice(index, 1)
        },

        /**
         * @Author: 王林
         * @Date: 2021-06-22 22:08:11
         * @Desc: 取消
         */
        cancel() {
            this.dialogVisible = false
        },

        /**
         * @Author: 王林
         * @Date: 2021-06-06 22:28:20
         * @Desc:  确定
         */
        confirm() {
            this.activeNodes.forEach((node: any) => {
                node.setTag(this.tagArr)
            })
            this.cancel()
        }
    }
})
</script>

<style lang="less" scoped>
.nodeDialog {
    .tagList {
        display: flex;
        flex-wrap: wrap;
        margin-top: 5px;

        .tagItem {
            position: relative;
            padding: 3px 5px;
            margin-right: 5px;
            margin-bottom: 5px;

            .delBtn {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.4);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                visibility: hidden;
            }

            &:hover {
                .delBtn {
                    visibility: visible;
                }
            }
        }
    }
}
</style>