import {useGlobalStore} from "@/store/GlobalStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import GraphRecord from "@/entity/GraphRecord";
import {DiagramSubType, MindMapSubType, WhiteBoardSubType} from "@/enumeration/GraphSubTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MessageUtil from "@/utils/MessageUtil";
import {useSettingStore} from "@/store/setting/SettingStore";
import {useDiagramStore} from "@/store/graph/DiagramStore";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";

export default async function updateTo1_2_0() {
    useGlobalStore().startLoading("（0/10）准备升级到1.2.0，正在数据迁移，请勿退出，以免数据丢失");
    let removeIds = new Array<string>();
    let mindMaps = new Array<GraphRecord>();
    let mindMapTemplates = new Array<GraphRecord>();
    // 简易思维导图
    useGlobalStore().startLoading("（1/10）正在迁移简易思维导图，请勿退出，以免数据丢失");
    removeIds.push(LocalNameEnum.MIND);
    const mindMaps1 = await migrate("local", GraphTypeEnum.MIND, MindMapSubType.MIND_ELIXIR, removeIds);
    useGlobalStore().startLoading("（2/10）正在迁移简易思维导图模板，请勿退出，以免数据丢失");
    removeIds.push(LocalNameEnum.TEMPLATE_MIND);
    const mindMapTemplates1 = await migrate("template", GraphTypeEnum.MIND, MindMapSubType.MIND_ELIXIR, removeIds);
    // 完整思维导图
    useGlobalStore().startLoading("（3/10）正在迁移完整思维导图，请勿退出，以免数据丢失");
    removeIds.push(LocalNameEnum.SIMPLE_MIND_MAP);
    const mindMaps2 = await migrate("local", GraphTypeEnum.SIMPLE_MIND_MAP, MindMapSubType.SIMPLE_MIND_MAP, removeIds);
    useGlobalStore().startLoading("（4/10）正在迁移完整思维导图模板，请勿退出，以免数据丢失");
    removeIds.push(LocalNameEnum.TEMPLATE_SIMPLE_MIND_MAP);
    // 创建新的索引
    const mindMapsTemplate2 = await migrate("template", GraphTypeEnum.SIMPLE_MIND_MAP, MindMapSubType.SIMPLE_MIND_MAP, removeIds);
    useGlobalStore().startLoading("（5/10）正在创建思维导图索引，请勿退出，以免数据丢失");
    mindMaps1.forEach(e => mindMaps.push(e));
    mindMaps2.forEach(e => mindMaps.push(e));
    await utools.db.promises.put({
        _id: LocalNameEnum.MIND_MAP,
        value: mindMaps
    });
    useGlobalStore().startLoading("（6/10）正在创建思维导图索引模板，请勿退出，以免数据丢失");
    mindMapTemplates1.forEach(e => mindMapTemplates.push(e));
    mindMapsTemplate2.forEach(e => mindMapTemplates.push(e));
    await utools.db.promises.put({
        _id: LocalNameEnum.TEMPLATE_MIND_MAP,
        value: mindMapTemplates
    });
    useGlobalStore().startLoading("（7/10）正在删除旧的数据，请勿退出，以免数据丢失");
    for(let id of removeIds) {
        await utools.db.promises.remove(id);
    }
    useGlobalStore().startLoading("（8/10）正在迁移其他数据，请勿退出，以免数据丢失");
    // 流程图
    await updateType("local", GraphTypeEnum.DIAGRAM, DiagramSubType.LOGIC_FLOW);
    // 白板
    await updateType("local", GraphTypeEnum.WHITE_BOARD, WhiteBoardSubType.TINY_WHITEBOARD);
    // 设置
    useGlobalStore().startLoading("（9/10）正在迁移设置，请勿退出，以免数据丢失");
    await updateSetting();
    // 其他图
    useGlobalStore().startLoading("（10/10）迁移完成，正在初始化，请勿退出，以免数据丢失");
    await useDiagramStore().init();
    await useWhiteBoardStore().init();
    // 完成
    useGlobalStore().closeLoading();
    MessageUtil.success("数据迁移完毕，欢迎使用新版本");
}

async function migrate(prefix: string, graphType: GraphTypeEnum, type: string, removeIds: Array<string>): Promise<Array<GraphRecord>> {
    const records = new Array<GraphRecord>();
    const id = '/' + prefix + '/' + graphType;
    // 流程图
    const itemsWrap = await utools.db.promises.get(id);
    if (itemsWrap) {
        const items = itemsWrap.value as GraphRecord[];
        for (const item of items) {
            records.push({
                ...item,
                type
            });
            const recordId = '/' + graphType + '/' + item.id;
            removeIds.push(recordId)
            const record = await utools.db.promises.get(recordId);
            if (record) {
                await utools.db.promises.put({
                    _id: '/' + graphType + '/' + item.id,
                    value: record.value
                })
            }
        }
    }
    return Promise.resolve(records);
}

async function updateType(prefix: string, graphType: GraphTypeEnum, type: string) {
    const id = '/' + prefix + '/' + graphType;
    // 流程图
    const itemsWrap = await utools.db.promises.get(id);
    if (itemsWrap) {
        const items = itemsWrap.value as GraphRecord[];
        for (const item of items) {
            item.type = type;
        }
        await utools.db.promises.put({
            _id: id,
            _rev: itemsWrap._rev,
            value: items
        })
    }
}

async function updateSetting() {
    const base = useSettingStore().base;
    if (base.defaultView === GraphTypeEnum.MIND || base.defaultView === GraphTypeEnum.SIMPLE_MIND_MAP) {
        base.defaultView = GraphTypeEnum.MIND_MAP;
    }
    if (base.showViews.includes(GraphTypeEnum.MIND) || base.showViews.includes(GraphTypeEnum.SIMPLE_MIND_MAP)) {
        base.showViews.push(GraphTypeEnum.MIND_MAP);
    }
    await useSettingStore().saveBase(base);
}
