<template>
    <div class="mind">
        <div id="mind-view" :style="{ height: viewHeight + 'px' }"></div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import MindElixir from "mind-elixir";
import { data2Html } from '@mind-elixir/export-html'
import { useClearEvent, useExportEvent, useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useMindStore } from "@/store/MindStore";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import BrowserUtil from "@/utils/BrowserUtil";

const size = useWindowSize();
const viewHeight = computed(() => size.height.value - 33);

let mind: any | undefined;
let id = useRouter().currentRoute.value.params.id as string;
let _rev = undefined as string | undefined;

const option = {
    el: "#mind-view",
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
    allowUndo: true,
    data: {} as any
};
if (id !== '0') {
    let recordWrap = utools.db.get(`/${GraphTypeEnum.MIND}/${id}`);
    if (recordWrap) {
        // 存在
        option.data = recordWrap.value;
        _rev = recordWrap._rev;
    }
}

onMounted(() => {
    mind = new MindElixir(option);
    if (id !== '0') {
        mind.init(option.data);
    } else {
        mind.init(MindElixir.new("思维导图"));
    }
});

function save() {
    useMindStore().addMind(id).then(_id => {
        id = _id;
        utools.db.promises.put({
            _id: `/${GraphTypeEnum.MIND}/${id}`,
            _rev,
            value: mind.getData()
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

useSaveEvent.on(() => save());

useClearEvent.on(() => {
    if (mind) {
        mind.init(MindElixir.new("思维导图"));
        // 保存
        save();
    }
})

useUndoEvent.on(() => {
    if (mind) {
        mind.undo();
        save();
    }
});

useExportEvent.on((type: ExportTypeEnum) => {
    if (type === ExportTypeEnum.HTML) {
        BrowserUtil.download(
            data2Html(mind.getData()),
            useGlobalStore().title + ".html",
            'text/html')

    }
});

</script>
<style lang="less">
.mind {
    position: relative;
    height: 100%;
    width: 100%;
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