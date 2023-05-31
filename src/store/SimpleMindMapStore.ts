import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { getInitList, add, update } from "@/utils/LocalStoreUtil";
import MessageUtil from "@/utils/MessageUtil";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export const useSimpleMindMapStore = defineStore(GraphTypeEnum.SIMPLE_MIND_MAP, {
    state: () => ({
        // 所有的思维导图
        simpleMindMaps: new Array<GraphRecord>(),
        mindRev: undefined as string | undefined
    }),
    actions: {
        init() {
            getInitList(LocalNameEnum.SIMPLE_MIND_MAP).then(simpleMindMapsWrap => {
                this.simpleMindMaps = simpleMindMapsWrap.items;
                this.mindRev = simpleMindMapsWrap._rev;
            });
        },
        async addMind(id: string): Promise<string> {
            id = await add(id, this.simpleMindMaps);
            this.syncMind();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) {
            update(record.id, this.simpleMindMaps)
                .then(() => this.syncMind())
                .catch(e => MessageUtil.error("修改失败", e));
        },
        remove(record: GraphRecord) {
            this.simpleMindMaps.splice(this.simpleMindMaps.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.promises.remove(`/${GraphTypeEnum.SIMPLE_MIND_MAP}/${record.id}`)
                .then(() => this.syncMind())
                .catch(e => MessageUtil.error("删除失败", e));
        },
        syncMind() {
            utools.db.promises.put({
                _id: LocalNameEnum.SIMPLE_MIND_MAP,
                _rev: this.mindRev,
                value: toRaw(this.simpleMindMaps)
            }).then(res => {
                if (res.error) {
                    MessageUtil.error(res.message || '新增失败');
                    return;
                }
                this.mindRev = res.rev;

            });
        }
    }
})