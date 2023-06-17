<template>
    <div class="mind-elixir">
        <div class="header">
            <a-button-group type="text">
                <a-dropdown>
                    <a-button>文件</a-button>
                    <template #content>
                        <a-doption @click="toHome">返回列表</a-doption>
                        <a-doption @click="save(true)">保存</a-doption>
                        <a-doption @click="open" :disabled="isNotVip">打开</a-doption>
                        <a-doption @click="saveAs" :disabled="isNotVip">另存为</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click">
                    <a-button>编辑</a-button>
                    <template #content>
                        <a-doption @click="toUndo" :disabled="!option.allowUndo">后退</a-doption>
                        <a-doption @click="settingVisible = !settingVisible">设置</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown trigger="click" @select="exportData">
                    <a-button>
                        导出
                    </a-button>
                    <template #content>
                        <a-doption :value="ExportTypeEnum.HTML">HTML</a-doption>
                        <a-doption :value="ExportTypeEnum.MD">Markdown</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button :disabled="isNotVip">模板</a-button>
                    <template #content>
                        <a-doption @click="saveToTemplate">保存为模板</a-doption>
                        <a-doption @click="templateDrawer = true">模板管理</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
            <a-button-group type="text">
                <a-button @click="switchReadonly" :status="readonly ? 'warning' : 'normal'">
                    <template #icon><icon-lock /></template>
                </a-button>
            </a-button-group>
        </div>
        <div class="container">
            <div id="mind-elixir-view" :style="{ height: viewHeight + 'px' }"></div>
        </div>
        <mind-elixir-setting v-model:visible="settingVisible" :option="option" @save="saveOption" />
        <template-manage v-model:visible="templateDrawer" :type="GraphTypeEnum.MIND" @render="renderTo" />
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFileSystemAccess, useWindowSize } from "@vueuse/core";
import MindElixir from "mind-elixir";
import { data2Html } from '@mind-elixir/export-html'
import { useSaveEvent, useUndoEvent } from "@/global/BeanFactory";
import { useMindStore } from "@/store/graph/MindStore";
import MessageUtil from "@/utils/MessageUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useGlobalStore } from "@/store/GlobalStore";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import { download } from "@/utils/BrowserUtil";
import { getRecord, saveTemplate } from "@/utils/utools/DbUtil";
import { MindOption, getDefaultOption } from "./domain/MindOption";
import MindElixirSetting from './components/setting.vue';
import TemplateManage from '@/components/template-manage/index.vue';
import { useVipStore } from "@/store/VipStore";

const size = useWindowSize();
const viewHeight = computed(() => size.height.value - 33);
const router = useRouter()

// 参数
let mind: any | undefined;
let id = useRoute().params.id as string;
let path = useRoute().query.path as string;
let _rev = undefined as string | undefined;
const readonly = ref(false);
const settingVisible = ref(false);
const isNotVip = useVipStore().isNotVip;
const templateDrawer = ref(false);

let defaultOption = {
    el: "#mind-elixir-view",
    direction: MindElixir.RIGHT,
};

let option = ref(getDefaultOption());
let data = {} as any;

const fileSystem = useFileSystemAccess({
    dataType: 'Text',
    types: [{
        description: 'json',
        accept: {
            'application/json': ['.json', '.ssm'],
        },
    }]
});

async function initData() {
    let id = useRoute().params.id as string;
    let path = useRoute().query.path as string;
    let record = await getRecord(GraphTypeEnum.MIND, id, path)
    id = record.id;
    _rev = record._rev;
    option.value = Object.assign(option.value, record.option);
    data = record.record;
}

onMounted(() => {
    initData().catch(e => MessageUtil.error("获取数据失败", e))
        .finally(() => {
            mind = new MindElixir({
                ...option.value,
                ...defaultOption
            });
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
                option: toRaw(option.value)
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

function open() {
    let res = fileSystem.open() as Promise<void>;
    res.then(() => {
        let content = fileSystem.data.value || '';
        try {
            let json = JSON.parse(content);
            let optionWrap = json['option'];
            let record = json['record'];
            // 赋值
            option.value = Object.assign(option.value, optionWrap);
            data = record
            // 初始化对象
            mind = new MindElixir({
                ...option.value,
                ...defaultOption
            });
            mind.init(data);
        } catch (e) {
            MessageUtil.error("文件解析失败", e);
        }
    }).catch(e => {
        if (e.name === 'AbortError') {
            return;
        }
        MessageUtil.error("打开失败", e)
    });
}

async function renderTo(id: string) {
    const recordId = `/${GraphTypeEnum.MIND}/${id}`;
    // 获取数据
    const valueWrap = await utools.db.promises.get(recordId);
    if (!valueWrap) {
        MessageUtil.error("模板不存在，请刷新后重试");
        return;
    }
    const value = valueWrap['value'];
    let optionWrap = value['option'];
    let record = value['record'];
    // 赋值
    option.value = Object.assign(option.value, optionWrap);
    data = record
    // 初始化对象
    mind = new MindElixir({
        ...option.value,
        ...defaultOption
    });
    mind.init(data);
}

function saveAs() {
    download(JSON.stringify({
        record: mind.getData(),
        option: option.value
    }, null, 4), useGlobalStore().title + '.json', 'application/json');
}

function toUndo() {
    if (!mind) {
        return;
    }
    if (!option.value.allowUndo) {
        return;
    }
    mind.undo();
    save(false);
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
        download(
            data2Html(mind.getData()),
            useGlobalStore().title + ".html",
            'text/html')
    } else if (type === ExportTypeEnum.MD) {
        download(
            mind.getDataMd(),
            useGlobalStore().title + ".md",
            'text/html'
        );
    }
}

function switchReadonly() {
    readonly.value = !readonly.value;
    if (readonly.value) {
        mind.disableEdit();
    } else {
        mind.enableEdit();
    }
}

function saveOption(value: MindOption) {
    // 保存设置
    option.value = Object.assign(option.value, value);
    // 重新设置布局
    mind = new MindElixir({
        ...option.value,
        ...defaultOption
    });
    mind.init(data);
    // 保存
    save();
}

/**
 * 保存到模板
 */
function saveToTemplate() {
    saveTemplate(GraphTypeEnum.MIND, {
        record: toRaw(mind.getData()),
        config: {},
        option: toRaw(option.value)
    })
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => {
            if (e === 'cancel') {
                return;
            }
            MessageUtil.error("保存失败", e);
        });
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
        display: flex;
        justify-content: space-between;
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