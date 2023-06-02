import GraphRecord from "@/entity/GraphRecord";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { getInitList, add, update } from "@/utils/LocalStoreUtil";
import MessageUtil from "@/utils/MessageUtil";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export const useMindStore = defineStore(GraphTypeEnum.MIND, {
    state: () => ({
        // 所有的思维导图
        minds: new Array<GraphRecord>(),
        mindRev: undefined as string | undefined
    }),
    actions: {
        init() {
            getInitList(LocalNameEnum.MIND).then(mindsWrap => {
                this.minds = mindsWrap.items;
                this.mindRev = mindsWrap._rev;
            });
        },
        async addMind(id: string): Promise<string> {
            id = await add(id, this.minds);
            this.syncMind();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) {
            update(record.id, this.minds)
                .then(() => this.syncMind())
                .catch(e => MessageUtil.error("修改失败", e));
        },
        remove(record: GraphRecord) {
            this.minds.splice(this.minds.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.promises.remove(`/${GraphTypeEnum.MIND}/${record.id}`)
                .then(() => this.syncMind())
                .catch(e => MessageUtil.error("删除失败", e));
        },
        syncMind() {
            utools.db.promises.put({
                _id: LocalNameEnum.MIND,
                _rev: this.mindRev,
                value: toRaw(this.minds)
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