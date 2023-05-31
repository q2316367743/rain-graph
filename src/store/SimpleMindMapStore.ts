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
        },
        info(id: string): GraphRecord {
            if (id === '0') {
                return {
                    id,
                    name: '新思维导图',
                    createTime: new Date(),
                    updateTime: new Date()
                };
            }else if (id === '-1') {
                return {
                    id,
                    name: '从文件打开',
                    createTime: new Date(),
                    updateTime: new Date()
                }
            }else {
                let record = this.simpleMindMaps.find(e => e.id === id);
                if (record) {
                    return record;
                }
                return {
                    id: '0',
                    name: '未知思维导图',
                    createTime: new Date(),
                    updateTime: new Date()
                }
            }
        }
    }
})