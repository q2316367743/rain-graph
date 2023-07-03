import GraphRecord from "@/entity/GraphRecord";
import {defineStore} from "pinia";
import {add, getInitList, update} from "@/utils/LocalStoreUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import {toRaw} from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {DiagramSubType} from "@/enumeration/GraphSubTypeEnum";

export const useDiagramStore = defineStore(LocalNameEnum.DIAGRAM, {
    state: () => ({
        diagrams: new Array<GraphRecord>(),
        diagramRev: undefined as string | undefined
    }),
    actions: {
        async init() {
            const diagramsWrap = await getInitList(LocalNameEnum.DIAGRAM)
            this.diagrams = diagramsWrap.items;
            this.diagramRev = diagramsWrap._rev;
        },
        async add(id: string): Promise<string> {
            id = await add(id, this.diagrams, DiagramSubType.LOGIC_FLOW);
            this.sync();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) {
            update(record.id, this.diagrams)
                .then(() => this.sync())
                .catch(e => MessageUtil.error("修改失败", e));
        },
        remove(record: GraphRecord) {
            this.diagrams.splice(this.diagrams.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.promises.remove(`/${GraphTypeEnum.DIAGRAM}/${record.id}`)
                .catch(e => MessageUtil.error("删除失败", e))
                .finally(() => this.sync());
        },
        sync() {
            utools.db.promises.put({
                _id: LocalNameEnum.DIAGRAM,
                _rev: this.diagramRev,
                value: toRaw(this.diagrams)
            }).then(res => {
                if (res.error) {
                    MessageUtil.error(res.message || '新增失败');
                    return;
                }
                this.diagramRev = res.rev;
            });
        }
    }
})
