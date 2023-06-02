<template>
    <div class="mind-elixir">
        <div class="header">
            <a-button-group type="text">
                <a-dropdown>
                    <a-button>文件</a-button>
                    <template #content>
                        <a-doption @click="toHome">返回列表</a-doption>
                        <a-doption disabled>新建</a-doption>
                        <a-doption disabled>打开</a-doption>
                        <a-doption @click="save(true)">保存</a-doption>
                        <a-doption @click="saveAs">另存为</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click">
                    <a-button>编辑</a-button>
                    <template #content>
                        <a-doption @click="toUndo">后退</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click" @select="exportData">
                    <a-button>
                        导出
                    </a-button>
                    <template #content>
                        <a-doption :value="ExportTypeEnum.HTML">HTML</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </div>
        <div class="container">
            <div id="mind-elixir-view" :style="{ height: viewHeight + 'px' }"></div>
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
import { useMindStore } from "@/store/graph/MindStore";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";
import { getRecord } from "@/utils/utools/DbUtil";

const size = useWindowSize();
const viewHeight = computed(() => size.height.value - 33);
const router = useRouter()

// 参数
let mind: any | undefined;
let id = useRoute().params.id as string;
let _id = computed(() => `/mind/${id}`);
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
    let id = useRoute().params.id as string;
    let path = useRoute().query.path as string;
    let record = await getRecord(GraphTypeEnum.MIND, id, path)
    id = record.id;
    _rev = record._rev;
    option = Object.assign(option, record.option);
    data = record.record;
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

function save(show: boolean = true) {
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
            if (show) {
                MessageUtil.success('保存成功');
            }
        });
    });
}

function saveAs() {
    BrowserUtil.download(JSON.stringify({
        record: mind.getData(),
        option: option
    }, null, 4), useGlobalStore().title + '.json', 'application/json');
}

function toUndo() {
    if (mind) {
        mind.undo();
        save(false);
    }
}

function toHome() {
    router.push({
        path: '/home',
        query: {
            name: GraphTypeEnum.MIND
        }
    })
}

function exportData(type: any) {
    if (type === ExportTypeEnum.HTML) {
        BrowserUtil.download(
            data2Html(mind.getData()),
            useGlobalStore().title + ".html",
            'text/html')
    }
}

useSaveEvent.on(() => save());
useUndoEvent.on(() => toUndo());

</script>
<style lang="less">
.mind-elixir {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;
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