<template>
    <div class="simple-mind-map-action"  :class="show ? 'show' : 'hidden'">
        <div class="op">
            <a-button @click="show = !show" type="text">
                <template #icon>
                    <icon-pen-fill />
                </template>
            </a-button>
        </div>
        <a-button-group type="text" size="mini" v-show="show" class="container">
            <a-button>
                <div class="icon">
                    <icon-undo />
                </div>
                <div class="name">后退</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-redo />
                </div>
                <div class="name">前进</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-unordered-list />
                </div>
                <div class="name">插入同级节点</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-mind-mapping />
                </div>
                <div class="name">插入子节点</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-delete />
                </div>
                <div class="name">删除节点</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-image />
                </div>
                <div class="name">图片</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-robot />
                </div>
                <div class="name">图标</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-link />
                </div>
                <div class="name">超链接</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-edit />
                </div>
                <div class="name">备注</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-tag />
                </div>
                <div class="name">标签</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-apps />
                </div>
                <div class="name">概要</div>
            </a-button>
            <a-button>
                <div class="icon">
                    <icon-oblique-line />
                </div>
                <div class="name">关联线</div>
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'simple-mind-map-action',
    data: () => ({
        show: false
    }),
});
</script>
<style scoped lang="less">
.simple-mind-map-action {
    .arco-btn {
        flex-direction: column;
        height: 50px;
    }
}
</style>