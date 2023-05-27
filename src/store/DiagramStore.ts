import GraphRecord from "@/entity/GraphRecord";
import { defineStore } from "pinia";
import { getInitList, add } from "@/utils/LocalStoreUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import { toRaw } from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export const useDiagramStore = defineStore('diagram', {
    state: () => ({
        diagrams: new Array<GraphRecord>(),
        diagramRev: undefined as string | undefined
    }),
    actions: {
        init() {
            let diagramsWrap = getInitList(LocalNameEnum.DIAGRAM);
            this.diagrams = diagramsWrap.items;
            this.diagramRev = diagramsWrap._rev;
        },
        async add(id: string): Promise<string> {
            id = await add(id, this.diagrams);
            this.sync();
            return Promise.resolve(id);
        },
        update() { },
        remove(record: GraphRecord) {
            this.diagrams.splice(this.diagrams.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.remove(`/${GraphTypeEnum.DIAGRAM}/${record.id}`)
            this.sync();
        },
        sync() {
            let res = utools.db.put({
                _id: LocalNameEnum.DIAGRAM,
                _rev: this.diagramRev,
                value: toRaw(this.diagrams)
            });
            if (res.error) {
                MessageUtil.error(res.message || '新增失败');
                return;
            }
            this.diagramRev = res.rev;
        }
    }
})