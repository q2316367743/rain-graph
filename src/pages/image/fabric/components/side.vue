<template>
    <div class="fabric-side">
        <a-collapse :default-active-key="['1']" :bordered="false">
            <a-collapse-item key="1" header="基础节点">
                <a-button-group type="text">
                    <a-button v-for="node of basicNodes" @click="addTo(node)" :draggable="true"
                              @dragend="dragTo(node)">
                        <template #icon>
                            <span v-html="node.icon"/>
                        </template>
                    </a-button>
                </a-button-group>
            </a-collapse-item>
        </a-collapse>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import FabricWrap from "@/pages/image/fabric/FabricWrap";
import FabricNode from "@/pages/image/fabric/node/FabricNode";
import {basicNodes} from "@/pages/image/fabric/node";

export default defineComponent({
    name: 'fabric-side',
    props: {
        instance: {
            type: FabricWrap,
            required: false,
            default: new FabricWrap()
        },
        collapsedWidth: Number
    },
    data: () => ({
        basicNodes,
        option: {
            left: 0,
            top: 0
        }
    }),
    created() {
        this.instance.canvas.on('drop', (event: any) => {
            // 画布元素距离浏览器左侧和顶部的距离
            const offset = {
                left: this.instance.canvas.getSelectionElement().getBoundingClientRect().left,
                top: this.instance.canvas.getSelectionElement().getBoundingClientRect().top,
            };

            // 鼠标坐标转换成画布的坐标（未经过缩放和平移的坐标）
            const point = {
                x: event.e.x - offset.left,
                y: event.e.y - offset.top,
            };

            // 转换后的坐标，restorePointerVpt 不受视窗变换的影响
            const pointerVpt = this.instance.canvas.restorePointerVpt(point);
            this.option.left = pointerVpt.x;
            this.option.top = pointerVpt.y;
        });
    },
    methods: {
        dragTo(node: FabricNode) {
            let object = node.component(this.option);
            this.instance.canvas.add(object);
            this.instance.canvas.setActiveObject(object);
        },
        addTo(node: FabricNode) {
            let object = node.component();
            this.instance.canvas.add(object);
            object.center();
            this.instance.canvas.setActiveObject(object);
        }
    }
});
</script>
<style scoped>

</style>