import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { getInitList, add } from "@/utils/LocalStoreUtil";
import MessageUtil from "@/utils/MessageUtil";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export const useMindStore = defineStore('mind', {
    state: () => ({
        // 所有的思维导图
        minds: new Array<GraphRecord>(),
        mindRev: undefined as string | undefined
    }),
    actions: {
        init() {
            let mindsWrap = getInitList(LocalNameEnum.MIND);
            this.minds = mindsWrap.items;
            this.mindRev = mindsWrap._rev;
        },
        async addMind(id: string): Promise<string> {
            id = await add(id, this.minds);
            this.syncMind();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) { },
        remove(record: GraphRecord) {
            this.minds.splice(this.minds.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.remove(`/${GraphTypeEnum.MIND}/${record.id}`)
            this.syncMind();
        },
        syncMind() {
            let res = utools.db.put({
                _id: LocalNameEnum.MIND,
                _rev: this.mindRev,
                value: toRaw(this.minds)
            });
            if (res.error) {
                MessageUtil.error(res.message || '新增失败');
                return;
            }
            this.mindRev = res.rev;
        }
    }
})