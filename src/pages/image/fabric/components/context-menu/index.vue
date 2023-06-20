<template>
    <div class="fabric-context-menu" v-show="visible" :style="style">
        <div class="item">复制</div>
        <div class="item">删除</div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import FabricWrap from "@/pages/image/fabric/FabricWrap";
import {IEvent} from "fabric/fabric-impl";

export default defineComponent({
    name: 'fabric-context-menu',
    props: {
        instance: {
            type: FabricWrap,
            required: false,
            default: new FabricWrap()
        },
    },
    data: () => ({
        top: 0,
        left: 0,
        visible: false,
        zIndex: 0
    }),
    computed: {
        style() {
            return {
                top: this.top + 'px',
                left: this.left + 'px',
                zIndex: this.zIndex
            }
        }
    },
    mounted() {
        this.instance.canvas.on('mouse:down', this.handleMouseUp);
    },
    methods: {
        handleMouseUp(event: IEvent<MouseEvent>) {
            try {
                const canvas = this.instance.canvas;
                const activeObject = canvas.getActiveObjects();
                if (!activeObject.length) return this.hideMenu();
                // @ts-ignore
                if (event.button === 3 && event.target && event.target.id !== 'workspace') {
                    // 显示菜单，设置右键菜单位置
                    // 获取菜单组件的宽高
                    const menuWidth = 196;
                    const menuHeight = 196;
                    // 当前鼠标位置
                    let pointX = event.e ? event.e.pageX : 0;
                    let pointY = event.e ? event.e.pageY : 0;

                    // 计算菜单出现的位置
                    // 如果鼠标靠近画布右侧，菜单就出现在鼠标指针左侧
                    if ((canvas.width || 196) - pointX <= menuWidth) {
                        pointX -= menuWidth;
                    }
                    // 如果鼠标靠近画布底部，菜单就出现在鼠标指针上方
                    if ((canvas.height || 196) - pointY <= menuHeight) {
                        pointY -= menuHeight;
                    }
                    this.showMenu(pointX, pointY);
                } else {
                    this.hideMenu();
                }
            } catch (error) {
                console.log(error);
            }
        },

        showMenu(x: number, y: number) {
            this.visible = true;
            this.left = x + 120;
            this.top = y;
            this.zIndex = 100;
        },
        hideMenu() {
            this.visible = false;
            this.left = 0;
            this.top = 0;
            this.zIndex = -100;
        },
    }
});
</script>
<style scoped lang="less">
.fabric-context-menu {
    position: absolute;
    background-color: var(--color-bg-1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 7px 0;
    .item {
        padding: 7px 14px;
        cursor: pointer;
        &:hover {
            background-color: var(--color-neutral-2);
        }
    }
}
</style>