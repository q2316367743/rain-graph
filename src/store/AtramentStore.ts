import GraphRecord from "@/entity/GraphRecord";
import { defineStore } from "pinia";
import { getInitList, add } from "@/utils/LocalStoreUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import { toRaw } from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export const useAtramentStore = defineStore('atrament', {
    state: () => ({
        atraments: new Array<GraphRecord>(),
        mindRev: undefined as string | undefined
    }),
    actions: {
        init() {
            let atramentsWrap = getInitList(LocalNameEnum.ATRAMENT);
            this.atraments = atramentsWrap.items;
            this.mindRev = atramentsWrap._rev;
        },
        async add(id: string): Promise<string> {
            id = await add(id, this.atraments);
            this.sync();
            return Promise.resolve(id);
        },
        updateMind() { },
        remove(record: GraphRecord) {
            this.atraments.splice(this.atraments.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.remove(`/${GraphTypeEnum.ATRAMENT}/${record.id}`)
            this.sync();
        },
        sync() {
            let res = utools.db.put({
                _id: LocalNameEnum.ATRAMENT,
                _rev: this.mindRev,
                value: toRaw(this.atraments)
            });
            if (res.error) {
                MessageUtil.error(res.message || '新增失败');
                return;
            }
            this.mindRev = res.rev;
        }
    }
})