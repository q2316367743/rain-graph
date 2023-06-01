import GraphRecord from "@/entity/GraphRecord";
import { defineStore } from "pinia";
import { getInitList, add, update } from "@/utils/LocalStoreUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import { toRaw } from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export const useEchartStore = defineStore(LocalNameEnum.ECHARTS, {
    state: () => ({
        echarts: new Array<GraphRecord>(),
        echartRev: undefined as string | undefined
    }),
    actions: {
        init() {
            getInitList(LocalNameEnum.ECHARTS).then(echartsWrap => {
                this.echarts = echartsWrap.items;
                this.echartRev = echartsWrap._rev;
            });
        },
        async add(id: string): Promise<string> {
            id = await add(id, this.echarts);
            this.sync();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) {
            update(record.id, this.echarts)
                .then(() => this.sync())
                .catch(e => MessageUtil.error("修改失败", e));
        },
        remove(record: GraphRecord) {
            this.echarts.splice(this.echarts.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.promises.remove(`/${GraphTypeEnum.ECHARTS}/${record.id}`)
                .catch(e => MessageUtil.error("删除失败", e))
                .finally(() => this.sync());
        },
        sync() {
            utools.db.promises.put({
                _id: LocalNameEnum.ECHARTS,
                _rev: this.echartRev,
                value: toRaw(this.echarts)
            }).then(res => {
                if (res.error) {
                    MessageUtil.error(res.message || '新增失败');
                    return;
                }
                this.echartRev = res.rev;
            });
        }
    }
})