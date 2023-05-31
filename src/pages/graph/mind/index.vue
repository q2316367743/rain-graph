<template>
    <div class="mind-elixir">
        <div id="mind-elixir-view" :style="{ height: viewHeight + 'px' }"></div>
        <div class="header">
            <a-button-group type="text">
                <a-tooltip content="返回列表">
                    <a-button @click="toHome">
                        <template #icon><icon-menu /></template>
                    </a-button>
                </a-tooltip>
                <a-tooltip content="保存">
                    <a-button @click="save">
                        <template #icon><icon-save /></template>
                    </a-button>
                </a-tooltip>
                <a-dropdown trigger="click" @select="exportData">
                    <a-button>
                        <template #icon><icon-export /></template>
                    </a-button>
                    <template #content>
                        <a-doption :value="ExportTypeEnum.HTML">HTML</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import MindElixir from "mind-elixir";
import { data2Html } from '@mind-elixir/export-html'
import { useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useMindStore } from "@/store/MindStore";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";

const size = useWindowSize();
const viewHeight = computed(() => size.height.value - 33);
const router = useRouter()

// 参数
let mind: any | undefined;
let id = useRoute().params.id as string;
let _id = `/mind/${id}`;
let path = useRoute().query.path as string;
let _rev = undefined as string | undefined;

let option = {
    el: "#mind-elixir-view",
    direction: MindElixir.RIGHT,
    // create new map data
    // the data return from `.getData()`
    draggable: true, // default true
    contextMenu: true, // default true
    toolBar: true, // default true
    nodeMenu: true, // default true
    keypress: true, // default true
    locale: 'zh_CN', // [zh_CN,zh_TW,en,ja,pt] waiting for PRs
    overflowHidden: false, // default false
    mainLinkStyle: 2, // [1,2] default 1
    mainNodeVerticalGap: 15, // default 25
    mainNodeHorizontalGap: 15, // default 65
    allowUndo: true
};
let data = {} as any;

async function initData() {
    return new Promise<void>((resolve, reject) => {
        if (id === '-1') {
            // 文件打开
            window.preload.openFileToString(path).then(value => {
                try {
                    let val = JSON.parse(value);
                    option = Object.assign(option, val.option);
                    data = val.record;
                } catch (e) {
                    MessageUtil.error("文件打开失败", e)
                } finally {
                    resolve();
                }
            }).catch(e => MessageUtil.error("文件打开失败", e));
        } if (id !== '0') {
            utools.db.promises.get(_id).then(res => {
                if (res) {
                    _rev = res._rev;
                    let value = res.value;
                    option = Object.assign(option, value.option);
                    data = value.record;
                }
                resolve();
            }).catch(e => {
                MessageUtil.error("获取数据失败", e);
                id = '0';
                resolve();
            })
        } else {
            resolve();
        }
    })
}

onMounted(() => {
    initData().catch(e => MessageUtil.error("获取数据失败", e))
        .finally(() => {
            mind = new MindElixir(option);
            if (id !== '0') {
                mind.init(data);
            } else {
                mind.init(MindElixir.new("思维导图"));
            }
        });
});

function save() {
    useMindStore().addMind(id).then(_id => {
        id = _id;
        utools.db.promises.put({
            _id: `/${GraphTypeEnum.MIND}/${id}`,
            _rev,
            value: {
                record: mind.getData(),
                option: option
            }
        }).then(res => {
            if (res.error) {
                MessageUtil.error(res.message || "保存失败");
                return;
            }
            _rev = res.rev;
            MessageUtil.success('保存成功');
        });
    });
}

function toHome() {
    router.push({
        path: '/home',
        query: {
            name: GraphTypeEnum.MIND
        }
    })
}

useSaveEvent.on(() => save());
useUndoEvent.on(() => {
    if (mind) {
        mind.undo();
        save();
    }
});
function exportData(type: any) {
    if (type === ExportTypeEnum.HTML) {
        BrowserUtil.download(
            data2Html(mind.getData()),
            useGlobalStore().title + ".html",
            'text/html')
    }
}

</script>
<style lang="less">
.mind-elixir {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 14px;
        left: 14px;
        text-align: center;
        background-color: var(--color-bg-2);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
}

#mind-elixir-view {
    position: relative;
    height: 100%;
    width: 100%;

    .mind-elixir-toolbar {
        svg {
            color: #000;
        }
    }

    .mind-elixir-toolbar.lt {
        top: 56px !important;
        left: 14px;
    }
}

#mind-view {
    width: 100%;
}


.map-container {
    .map-canvas {
        background-color: var(--color-bg-1);
    }
}
</style>