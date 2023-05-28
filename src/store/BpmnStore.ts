import GraphRecord from "@/entity/GraphRecord";
import { defineStore } from "pinia";
import { getInitList, add } from "@/utils/LocalStoreUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import { toRaw } from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export const useBpmnStore = defineStore('bpmn', {
    state: () => ({
        bpmns: new Array<GraphRecord>(),
        bpmnRev: undefined as string | undefined
    }),
    actions: {
        init() {
            let bpmnsWrap = getInitList(LocalNameEnum.BPMN);
            this.bpmns = bpmnsWrap.items;
            this.bpmnRev = bpmnsWrap._rev;
        },
        async add(id: string): Promise<string> {
            id = await add(id, this.bpmns);
            this.sync();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) { },
        remove(record: GraphRecord) {
            this.bpmns.splice(this.bpmns.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.remove(`/${GraphTypeEnum.BPMN}/${record.id}`)
            this.sync();
        },
        sync() {
            let res = utools.db.put({
                _id: LocalNameEnum.BPMN,
                _rev: this.bpmnRev,
                value: toRaw(this.bpmns)
            });
            if (res.error) {
                MessageUtil.error(res.message || '新增失败');
                return;
            }
            this.bpmnRev = res.rev;
        }
    }
})