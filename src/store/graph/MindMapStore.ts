import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {add, getInitList, update} from "@/utils/LocalStoreUtil";
import MessageUtil from "@/utils/MessageUtil";
import {defineStore} from "pinia";
import {toRaw} from "vue";
import {MindMapSubType} from "@/enumeration/GraphSubTypeEnum";

export const useMindMapStore = defineStore(GraphTypeEnum.MIND_MAP, {
    state: () => ({
        // 所有的思维导图
        mindMaps: new Array<GraphRecord>(),
        mindMapRev: undefined as string | undefined
    }),
    actions: {
        async init() {
            const mindMapsWrap = await getInitList(LocalNameEnum.MIND_MAP)
            this.mindMaps = mindMapsWrap.items;
            this.mindMapRev = mindMapsWrap._rev;
        },
        async add(id: string, type: MindMapSubType): Promise<string> {
            id = await add(id, this.mindMaps, type);
            this.syncMind();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) {
            update(record.id, this.mindMaps)
                .then(() => this.syncMind())
                .catch(e => MessageUtil.error("修改失败", e));
        },
        remove(record: GraphRecord) {
            this.mindMaps.splice(this.mindMaps.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.promises.remove(`/${GraphTypeEnum.MIND_MAP}/${record.id}`)
                .then(() => this.syncMind())
                .catch(e => MessageUtil.error("删除失败", e));
        },
        syncMind() {
            utools.db.promises.put({
                _id: LocalNameEnum.MIND_MAP,
                _rev: this.mindMapRev,
                value: toRaw(this.mindMaps)
            }).then(res => {
                if (res.error) {
                    MessageUtil.error(res.message || '新增失败');
                    return;
                }
                this.mindMapRev = res.rev;
            });
        }
    }
})
