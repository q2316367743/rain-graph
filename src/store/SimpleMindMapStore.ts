import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { getInitList, add } from "@/utils/LocalStoreUtil";
import MessageUtil from "@/utils/MessageUtil";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export const useSimpleMindMapStore = defineStore('simple-mind-map', {
    state: () => ({
        // 所有的思维导图
        simpleMindMaps: new Array<GraphRecord>(),
        mindRev: undefined as string | undefined
    }),
    actions: {
        init() {
            let simpleMindMapsWrap = getInitList(LocalNameEnum.SIMPLE_MIND_MAP);
            this.simpleMindMaps = simpleMindMapsWrap.items;
            this.mindRev = simpleMindMapsWrap._rev;
        },
        async addMind(id: string): Promise<string> {
            id = await add(id, this.simpleMindMaps);
            this.syncMind();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) { },
        remove(record: GraphRecord) {
            this.simpleMindMaps.splice(this.simpleMindMaps.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.remove(`/${GraphTypeEnum.SIMPLE_MIND_MAP}/${record.id}`)
            this.syncMind();
        },
        syncMind() {
            let res = utools.db.put({
                _id: LocalNameEnum.SIMPLE_MIND_MAP,
                _rev: this.mindRev,
                value: toRaw(this.simpleMindMaps)
            });
            if (res.error) {
                MessageUtil.error(res.message || '新增失败');
                return;
            }
            this.mindRev = res.rev;
        }
    }
})