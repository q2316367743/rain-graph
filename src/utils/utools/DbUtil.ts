import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export interface StoreRecord {

    /**
     * 记录
     */
    record: any;

    /**
     * 本身设置
     */
    config: any;

    /**
     * 操作设置
     */
    option?: any;

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
            record: {},
            config: {},
            id: '0',
            error: false,
            message: ""
        });
    } else if (id === '-1') {
        if (path === '') {
            return Promise.resolve({
                record: {},
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
                record: {},
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
                record: {},
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