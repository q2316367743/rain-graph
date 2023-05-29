<template>
    <div class="simple-mind-map-wrap" :style="{ height: height + 'px' }">
        <div id="simple-mind-map"></div>
        <simple-mind-map-option class="option" @switch-theme="setTheme" @switch-layout="setLayout" @set-node="setNode"
            :render-tree="renderTree" />
        <simple-mind-map-action class="action" :index="index" :len="len" @add-node="addBothNode"
            @add-child-node="addChildNode" @remove-node="removeNode" @back="back" @forward="forward" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SimpleMindMapWrap from "./SimpleMindMapWrap";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

// 组件
import SimpleMindMapOption from './components/option.vue';
import SimpleMindMapAction from './components/action.vue';
import { useSaveAsEvent, useSaveEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import { toRaw } from "vue";

let simpleMindMapWrap = {} as SimpleMindMapWrap;

export default defineComponent({
    name: '',
    components: { SimpleMindMapOption, SimpleMindMapAction },
    props: {
        sourceId: {
            type: String,
            required: false,
            default: '0'
        },
        source_rev: String,
        value: Object
    },
    data: () => ({
        renderTree: undefined as any | undefined,
        index: 0,
        len: 0
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'title'])
    },
    created() {
        useSaveEvent.on(() => {
            simpleMindMapWrap.save()
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        });
        useSaveAsEvent.on(() => simpleMindMapWrap.saveAs(this.title));
    },
    mounted() {
        simpleMindMapWrap = new SimpleMindMapWrap(
            "#simple-mind-map",
            this.value ? toRaw(this.value.config) : undefined,
            this.value ? this.value.record : undefined);
        simpleMindMapWrap.init(this.sourceId, this.source_rev);
        // 事件
        simpleMindMapWrap.onDataChange(renderTree => this.renderTree = renderTree);
        simpleMindMapWrap.onBackForward((index, len) => {
            this.index = index;
            this.len = len;
        })
    },
    methods: {
        setTheme(theme: string) {
            simpleMindMapWrap.setTheme(theme);
        },
        setLayout(layout: string) {
            simpleMindMapWrap.setLayout(layout);
        },
        setNode(node: any) {
            simpleMindMapWrap.setNode(node);
            node.active();
        },
        addChildNode() {
            simpleMindMapWrap.addChildNode();
        },
        addBothNode() {
            simpleMindMapWrap.addBothNode();
        },
        removeNode() {
            simpleMindMapWrap.removeNode();
        },
        back() {
            simpleMindMapWrap.back();
        },
        forward() {
            simpleMindMapWrap.forward();
        }
    }
});
</script>
<style lang="less">
.simple-mind-map-wrap {
    position: relative;
    width: 100%;

    .option {
        position: absolute;
        top: 10px;
        padding: 7px;
        display: flex;
        transition: 0.2s;

        &.show {
            right: 0px;
        }

        &.hidden {
            right: -95px;
        }

        .container {
            width: 88px;
            text-align: center;
            background-color: var(--color-bg-2);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

            .arco-btn {
                width: 88px;
            }
        }
    }

    .action {
        position: absolute;
        left: 10px;
        padding: 7px;
        transition: 0.2s;

        &.show {
            bottom: 10px;
        }

        &.hidden {
            bottom: 5px;
        }

        .op {
            .arco-btn {
                height: 32px;
            }
        }

        .container {
            text-align: center;
            background-color: var(--color-bg-2);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            height: 50px;
        }
    }
}

#simple-mind-map {
    width: 100%;
    height: 100%;
}

#simple-mind-map * {
    margin: 0;
    padding: 0;
}
</style>