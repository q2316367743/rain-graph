import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MessageBoxUtil from "../MessageBoxUtil";

export interface StoreRecordCore {

    /**
     * 记录
     */
    record?: any;

    /**
     * 本身设置
     */
    config: any;

    /**
     * 操作设置
     */
    option?: any;

    /**
     * 额外自定义设置
     */
    [key: string]: any;

}

export interface StoreRecordIndex {

    id: string;

    name: string;

    createTime: Date | string;

}

export interface StoreRecord extends StoreRecordCore {

    /**
     * ID
     */
    id: string;

    /**
     * 恢复值，只有存到记录中才有
     */
    _rev?: string;

    /**
     * 是否有异常
     */
    error: boolean;

    /**
     * 消息
     */
    message: string;

}

export async function getRecord(type: GraphTypeEnum, id: string, path: string = ""): Promise<StoreRecord> {
    if (id === '0') {
        return Promise.resolve({
            config: {},
            id: '0',
            error: false,
            message: ""
        });
    } else if (id === '-1') {
        if (path === '') {
            return Promise.resolve({
                config: {},
                id: '0',
                error: true,
                message: "路径不存在"
            });
        }
        try {
            let valueStr = await window.preload.openFileToString(path);
            let value = JSON.parse(valueStr);
            return Promise.resolve({
                record: value.record,
                config: value.config,
                id: "-1",
                error: false,
                message: ""
            });
        } catch (e: any) {
            return Promise.resolve({
                config: {},
                id: '0',
                error: true,
                message: e.message
            });
        }
    } else {
        let res = await utools.db.promises.get(`/${type}/${id}`);
        if (!res) {
            return Promise.resolve({
                config: {},
                id: '0',
                error: true,
                message: "数据不存在"
            });
        }
        let value = res.value;
        return Promise.resolve({
            record: value.record,
            config: value.config,
            id: id,
            _rev: res._rev,
            error: false,
            message: ""
        });
    }
}

export async function saveTemplate(type: GraphTypeEnum, record: StoreRecordCore) {
    const name = await MessageBoxUtil.prompt("请输入模板名称", "保存模板", {});
    // 插入记录
    const now = new Date();
    const id = now.getTime() + '';
    let recordId = `/${type}/${id}`
    const recordRes = await utools.db.promises.put({
        _id: recordId,
        value: record
    });
    if (recordRes.error) {
        return Promise.reject('保存记录，' + (recordRes.message || "保存模板失败"))
    }
    // 更新模板索引
    let templates = new Array<StoreRecordIndex>();
    let _rev = undefined as string | undefined;
    let key = '/template/' + type;
    let templateWrap = await utools.db.promises.get(key);
    if (templateWrap) {
        _rev = templateWrap._rev;
        templates = templateWrap.value;
    }
    templates.push({
        id,
        name,
        createTime: now
    });
    // 保存模板索引
    const res = await utools.db.promises.put({
        _id: '/template/' + type,
        _rev,
        value: templates
    });
    if (res.error) {
        // 删除记录
        await utools.db.promises.remove(recordId);
        return Promise.reject('保存索引，' + (res.message || "保存模板失败"));
    }
    return Promise.resolve();
}

export async function listTemplate(type: GraphTypeEnum): Promise<Array<StoreRecordIndex>> {
    let templates = new Array<StoreRecordIndex>();
    let key = '/template/' + type;
    let templateWrap = await utools.db.promises.get(key);
    if (templateWrap) {
        templates = templateWrap.value;
    }
    for (let template of templates) {
        template.createTime = new Date(template.createTime);
    }
    // 排序
    templates.sort((a, b) => (b.createTime as Date).getTime() - (a.createTime as Date).getTime())
    return Promise.resolve(templates);
}

export async function removeTemplate(type: GraphTypeEnum, id: string) {
    // 初始化数据
    let templates = new Array<StoreRecordIndex>();
    let _rev = undefined as string | undefined;
    let key = '/template/' + type;
    let templateWrap = await utools.db.promises.get(key);
    if (templateWrap) {
        _rev = templateWrap._rev;
        templates = templateWrap.value;
    }
    // 删除模板
    let index = templates.findIndex(e => e.id === id);
    if (index > -1) {
        templates.splice(index, 1);
    }
    const res = await utools.db.promises.put({
        _id: '/template/' + type,
        _rev,
        value: templates
    });
    if (res.error) {
        // 删除记录
        return Promise.reject('保存索引，' + (res.message || "保存模板失败"));
    }
    // 删除记录
    let recordId = `/${type}/${id}`;
    await utools.db.promises.remove(recordId);
    return Promise.resolve();
}