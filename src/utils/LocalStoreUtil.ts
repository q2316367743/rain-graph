import GraphRecord from "@/entity/GraphRecord";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "./MessageBoxUtil";
import { useGlobalStore } from "@/store/GlobalStore";
import MessageUtil from "./MessageUtil";

export async function getInitList(name: LocalNameEnum): Promise<{
    items: Array<GraphRecord>;
    _rev?: string
}> {

    let mindsWrap = await utools.db.promises.get(name);
    if (mindsWrap) {
        return Promise.resolve({
            items: mindsWrap.value,
            _rev: mindsWrap._rev
        })
    }
    return Promise.resolve({ items: [] });
}

export async function add(id: string, items: Array<GraphRecord>): Promise<string> {
    let now = new Date();
    if (id === '0' || id === '-1') {
        // 新的ID
        id = now.getTime() + '';
        let name = await MessageBoxUtil.prompt(
            "请输入图名称",
            "新增图",
            {});
        useGlobalStore().setTitle(name);
        items.push({
            id,
            name,
            createTime: now,
            updateTime: now
        })
    } else {
        for (let mind of items) {
            if (mind.id === id) {
                mind.updateTime = now;
            }
        }
    }
    return Promise.resolve(id);
}

export async function update(id: string, items: Array<GraphRecord>): Promise<void> {
    let index = items.findIndex(e => e.id === id);
    if (index === -1) {
        MessageUtil.error(`ID【${id}】未找到，无法更新`);
        return Promise.reject();
    }
    let item = items[index];
    let name = await MessageBoxUtil.prompt(
        "请输入图名称",
        "新增图",
        {
            inputValue: item.name,
            confirmButtonText: '修改'
        });
    item.name = name;
    return Promise.resolve();

}