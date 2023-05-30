<template>
    <div class="simple-mind-map-wrap" :style="{ height: height + 'px' }">
        <div id="simple-mind-map"></div>
        <simple-mind-map-option class="option" @switch-theme="setTheme" @switch-layout="setLayout" @set-node="setNode"
            :render-tree="renderTree" />
        <simple-mind-map-action class="action" :index="index" :len="len" :has-node="hasNode" @add-node="addBothNode"
            @add-child-node="addChildNode" @remove-node="removeNode" @back="back" @forward="forward" @add-link="addLink" />
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import SimpleMindMapWrap from "./SimpleMindMapWrap";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

// 组件
import SimpleMindMapOption from './components/option.vue';
import SimpleMindMapAction from './components/action.vue';
import { useExportEvent, useSaveAsEvent, useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { SimpleMindMapConfig } from "./domain/SimpleMindMapConfig";

interface Wrap {

    config: Partial<SimpleMindMapConfig>;

    record?: any;

    id: string;

    _rev?: string;

}

let simpleMindMapWrap = {} as SimpleMindMapWrap;

export default defineComponent({
    name: '',
    components: { SimpleMindMapOption, SimpleMindMapAction },
    data: () => ({
        renderTree: undefined as any | undefined,
        index: 0,
        len: 0,
        hasNode: false,

        // 本身数据
    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'width', 'title', 'isDark'])
    },
    watch: {
        height() {
            simpleMindMapWrap.setSize(this.width, this.height);
        },
        width() {
            simpleMindMapWrap.setSize(this.width, this.height);
        }
    },
    created() {
        useSaveEvent.on(() => {
            simpleMindMapWrap.save()
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        });
        useSaveAsEvent.on(() => simpleMindMapWrap.saveAs(this.title));
        useUndoEvent.on(() => {
            if (this.index > 0) {
                simpleMindMapWrap.back();
            }
        });
        useExportEvent.on(type => {
            // json特殊处理
            if (type === 'json') {
                simpleMindMapWrap.saveAs(this.title);
            } else {
                simpleMindMapWrap.export(type, true, this.title, true)
            }
        })

    },
    mounted() {
        this.initData().then(value => {
            simpleMindMapWrap = new SimpleMindMapWrap(
                "#simple-mind-map",
                value.config,
                value.record);
            simpleMindMapWrap.init(value.id, value._rev);
            this.initAfter();
        }).catch(e => {
            MessageUtil.error("初始化数据出错", e);
            simpleMindMapWrap = new SimpleMindMapWrap(
                "#simple-mind-map",
                {});
            simpleMindMapWrap.init("0");
            this.initAfter();
        })
    },
    methods: {
        async initData(): Promise<Wrap> {
            let id = this.$route.params.id as string;
            let path = this.$route.query.path as string;
            if (id === '-1') {
                // 文件打开
                let value = await window.preload.openFileToString(path)
                let val = JSON.parse(value);
                return Promise.resolve({
                    config: val.config,
                    record: val.record,
                    id,
                })
            } if (id !== '0') {
                let res = await utools.db.promises.get(`/${GraphTypeEnum.SIMPLE_MIND_MAP}/${id}`);
                console.log(res)
                if (res) {
                    let val = res.value;
                    return Promise.resolve({
                        config: val.config,
                        record: val.record,
                        id,
                    });
                }
                return Promise.reject("数据不存在");
            } else {
                return Promise.resolve({
                    config: {
                        theme: this.isDark ? 'dark' : 'default'
                    },
                    id
                });
            }
        },
        initAfter() {
            // 事件
            simpleMindMapWrap.onDataChange(renderTree => this.renderTree = renderTree);
            simpleMindMapWrap.onBackForward((index, len) => {
                this.index = index;
                this.len = len;
            });
            simpleMindMapWrap.onNodeActive((hasNode) => {
                this.hasNode = hasNode;
            });
        },
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
        },
        addLink(name: string, href: string) {
            simpleMindMapWrap.addLink(name, href);
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
        top: 96px;
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
            top: 5px;
        }

        &.hidden {
            top: -8px;
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