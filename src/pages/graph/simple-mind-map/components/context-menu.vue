<template>
    <div class="contextmenuContainer listBox" v-if="isShow" :style="{ left: left + 'px', top: top + 'px' }">
        <template v-if="type === 'node'">
            <div class="item" @click="exec('INSERT_NODE', insertNodeBtnDisabled)"
                :class="{ disabled: insertNodeBtnDisabled }">
                插入同级节点
                <span class="desc">Enter</span>
            </div>
            <div class="item" @click="exec('INSERT_CHILD_NODE')" :class="{ disabled: isGeneralization }">
                插入子节点
                <span class="desc">Tab</span>
            </div>
            <div class="item" @click="exec('ADD_GENERALIZATION')" :class="{ disabled: insertNodeBtnDisabled }">
                插入概要
                <span class="desc">Ctrl + S</span>
            </div>
            <div class="item" @click="exec('UP_NODE')" :class="{ disabled: upNodeBtnDisabled }">
                上移节点
                <span class="desc">Ctrl + ↑</span>
            </div>
            <div class="item" @click="exec('DOWN_NODE')" :class="{ disabled: downNodeBtnDisabled }">
                下移节点
                <span class="desc">Ctrl + ↓</span>
            </div>
            <div class="item danger" @click="exec('REMOVE_NODE')">
                删除节点
                <span class="desc">Delete</span>
            </div>
            <div class="item" @click="exec('COPY_NODE')" :class="{ disabled: isGeneralization }">
                复制节点
                <span class="desc">Ctrl + C</span>
            </div>
            <div class="item" @click="exec('CUT_NODE')" :class="{ disabled: isGeneralization }">
                剪切节点
                <span class="desc">Ctrl + X</span>
            </div>
            <div class="item" :class="{ disabled: copyData === null }" @click="exec('PASTE_NODE')">
                粘贴节点
                <span class="desc">Ctrl + V</span>
            </div>
        </template>
        <template v-if="type === 'svg'">
            <div class="item" @click="exec('RETURN_CENTER')">
                回到中心
            </div>
            <div class="item" @click="exec('EXPAND_ALL')">
                展开所有
            </div>
            <div class="item" @click="exec('UNEXPAND_ALL')">
                收起节点
            </div>
            <div class="item">
                未知
                <div class="subItems listBox">
                    <div class="item" v-for="(item, index) in expandList" :key="item"
                        @click="exec('UNEXPAND_TO_LEVEL', false, index + 1)">
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="item" @click="exec('RESET_LAYOUT')">
                一键整理布局
                <span class="desc">Ctrl + L</span>
            </div>
            <div class="item" @click="exec('TOGGLE_ZEN_MODE')">
                禅模式
                {{ isZenMode ? '√' : '' }}
            </div>
        </template>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

/**
 * @Author: 王林
 * @Date: 2021-06-24 22:53:10
 * @Desc: 右键菜单
 */
export default defineComponent({
    name: 'Contextmenu',
    props: {
        mindMap: {
            type: Object as any,
            required: false,
            default: {} as any
        }
    },
    data() {
        return {
            isShow: false,
            left: 0,
            top: 0,
            node: null as any,
            copyData: null,
            type: '',
            isMousedown: false,
            mosuedownX: 0,
            mosuedownY: 0,
            isZenMode: false
        }
    },
    computed: {
        expandList() {
            return [
                "一级标题",
                "二级标题",
                "三级标题",
                "四级标题",
                "五级标题",
                "六级标题",
            ]
        },
        insertNodeBtnDisabled() {
            return !this.node || this.node.isRoot || this.node.isGeneralization
        },
        upNodeBtnDisabled() {
            if (!this.node || this.node.isRoot || this.node.isGeneralization) {
                return true
            }
            let isFirst =
                this.node.parent.children.findIndex((item: any) => {
                    return item === this.node
                }) === 0
            return isFirst
        },
        downNodeBtnDisabled() {
            if (!this.node || this.node.isRoot || this.node.isGeneralization) {
                return true
            }
            let children = this.node.parent.children
            let isLast =
                children.findIndex((item: any) => {
                    return item === this.node
                }) ===
                children.length - 1
            return isLast
        },
        isGeneralization() {
            return this.node.isGeneralization
        }
    },
    methods: {

        /**
         * @Author: 王林
         * @Date: 2021-07-14 21:38:50
         * @Desc: 节点右键显示
         */
        show(e: any, node: any) {
            this.type = 'node'
            this.left = e.clientX + 10
            this.top = e.clientY + 10
            this.isShow = true
            this.node = node
        },

        /**
         * @Author: 王林
         * @Date: 2021-07-16 13:27:48
         * @Desc: 鼠标按下事件
         */
        onMousedown(e: any) {
            if (e.which !== 3) {
                return
            }
            this.mosuedownX = e.clientX
            this.mosuedownY = e.clientY
            this.isMousedown = true
        },

        /**
         * @Author: 王林
         * @Date: 2021-07-16 13:27:53
         * @Desc: 鼠标松开事件
         */
        onMouseup(e: any) {
            if (!this.isMousedown) {
                return
            }
            this.isMousedown = false
            if (
                Math.abs(this.mosuedownX - e.clientX) > 3 ||
                Math.abs(this.mosuedownY - e.clientY) > 3
            ) {
                this.hide()
                return
            }
            this.show2(e)
        },

        /**
         * @Author: 王林
         * @Date: 2021-07-15 22:54:08
         * @Desc: 画布右键显示
         */
        show2(e: any) {
            this.type = 'svg'
            this.left = e.clientX + 10
            this.top = e.clientY + 10
            this.isShow = true
        },

        /**
         * @Author: 王林
         * @Date: 2021-07-14 21:37:55
         * @Desc: 隐藏
         */
        hide() {
            this.isShow = false
            this.left = 0
            this.top = 0
            this.type = ''
        },

        /**
         * @Author: 王林
         * @Date: 2021-07-14 23:27:54
         * @Desc: 执行命令
         */
        exec(key: string, disabled: boolean = true, ...args: any) {
            if (disabled) {
                return
            }
            switch (key) {
                case 'COPY_NODE':
                    this.copyData = this.mindMap.renderer.copyNode()
                    break
                case 'CUT_NODE':
                    this.$emit('execCommand', key, (copyData: any) => {
                        this.copyData = copyData
                    })
                    break
                case 'PASTE_NODE':
                    this.$emit('execCommand', key, this.copyData)
                    break
                case 'RETURN_CENTER':
                    this.mindMap.view.reset()
                    break
                case 'TOGGLE_ZEN_MODE':
                    // 切换禅模式
                    break
                default:
                    this.$emit('execCommand', key, ...args)
                    break
            }
            this.hide()
        },

        /**
         * @Author: 王林25
         * @Date: 2022-08-04 14:25:45
         * @Desc: 复制
         */
        copy() {
            this.exec('COPY_NODE')
        },

        /**
         * @Author: 王林25
         * @Date: 2022-08-04 14:26:43
         * @Desc: 粘贴
         */
        paste() {
            this.exec('PASTE_NODE')
        },

        /**
         * @Author: 王林25
         * @Date: 2022-08-04 14:27:32
         * @Desc: 剪切
         */
        cut() {
            this.exec('CUT_NODE')
        }
    }
})
</script>
  
<style lang="less" scoped>
.listBox {
    width: 200px;
    background: #fff;
    box-shadow: 0 4px 12px 0 hsla(0, 0%, 69%, 0.5);
    border-radius: 4px;
    padding-top: 16px;
    padding-bottom: 16px;
}

.contextmenuContainer {
    position: fixed;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1a1a1a;

    .item {
        position: relative;
        height: 28px;
        line-height: 28px;
        padding: 0 16px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;

        &.danger {
            color: #f56c6c;
        }

        &:hover {
            background: #f5f5f5;

            .subItems {
                visibility: visible;
            }
        }

        &.disabled {
            color: grey;
            cursor: not-allowed;
            pointer-events: none;

            &:hover {
                background: #fff;
            }
        }

        .desc {
            color: #999;
        }

        .subItems {
            position: absolute;
            left: 100%;
            top: 0;
            visibility: hidden;
        }
    }
}
</style>