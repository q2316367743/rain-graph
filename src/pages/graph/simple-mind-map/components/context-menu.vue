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
                展开到
                <div class="subItems listBox">
                    <div class="item" v-for="(item, index) in expandList" :key="item"
                        @click="exec('UNEXPAND_TO_LEVEL', index + 1)">
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="item" @click="exec('RESET_LAYOUT')">
                一键整理布局
                <span class="desc">Ctrl + L</span>
            </div>
        </template>
    </div>
</template>
  
<script lang="ts">
import { PropType } from 'vue';
import { defineComponent } from 'vue';
import SimpleMindMapWrap from '../SimpleMindMapWrap';
import MessageUtil from '@/utils/MessageUtil';

export default defineComponent({
    name: 'simple-mind-map-context-menu',
    props: {
        mindMap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
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
            mousedownX: 0,
            mousedownY: 0
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
    created() {
        // 事件监听
        this.mindMap.on('node_contextmenu', this.show)
        this.mindMap.on('node_click', this.hide)
        this.mindMap.on('draw_click', this.hide)
        this.mindMap.on('expand_btn_click', this.hide)
        this.mindMap.on('svg_mousedown', this.onMousedown)
        this.mindMap.on('mouseup', this.onMouseup)
        // 快捷键监听
        // this.mindMap.keyCommand.addShortcut('Control+c', this.copy)
        // this.mindMap.keyCommand.addShortcut('Control+v', this.paste)
        // this.mindMap.keyCommand.addShortcut('Control+x', this.cut)
    },
    methods: {
        show(e: any, node: any) {
            this.type = 'node'
            this.left = e.clientX + 10
            this.top = e.clientY + 10
            this.isShow = true
            this.node = node
        },
        onMousedown(e: any) {
            if (e.which !== 3) {
                return
            }
            this.mousedownX = e.clientX
            this.mousedownY = e.clientY
            this.isMousedown = true
        },
        onMouseup(e: any) {
            if (!this.isMousedown) {
                return
            }
            this.isMousedown = false
            if (
                Math.abs(this.mousedownX - e.clientX) > 3 ||
                Math.abs(this.mousedownY - e.clientY) > 3
            ) {
                this.hide()
                return
            }
            this.show2(e)
        },
        show2(e: any) {
            this.type = 'svg'
            this.left = e.clientX + 10
            this.top = e.clientY + 10
            this.isShow = true
        },
        hide() {
            this.isShow = false
            this.left = 0
            this.top = 0
            this.type = ''
        },
        exec(key: string, index: number = -1) {
            try {
                switch (key) {
                    case 'RETURN_CENTER':
                        // 回到中央
                        this.mindMap.viewReset()
                        break
                    default:
                        this.mindMap.execCommand(key, index === -1 ? undefined : index);
                        break
                }
            } catch (e) {
                MessageUtil.error("命令执行异常", e);
            }
            this.hide()
        },
        copy() {
            this.exec('COPY_NODE')
        },
        paste() {
            this.exec('PASTE_NODE')
        },
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