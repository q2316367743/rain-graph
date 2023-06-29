import GraphRecord from "@/entity/GraphRecord";
import {defineStore} from "pinia";
import {add, getInitList, update} from "@/utils/LocalStoreUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import {toRaw} from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export const useWhiteBoardStore = defineStore(LocalNameEnum.WHITE_BOARD, {
    state: () => ({
        whiteBoards: new Array<GraphRecord>(),
        whiteBoardRev: undefined as string | undefined
    }),
    actions: {
        async init() {
            const whiteBoardsWrap = await getInitList(LocalNameEnum.WHITE_BOARD)
            this.whiteBoards = whiteBoardsWrap.items;
            this.whiteBoardRev = whiteBoardsWrap._rev;
        },
        async add(id: string): Promise<string> {
            id = await add(id, this.whiteBoards);
            this.sync();
            return Promise.resolve(id);
        },
        update(record: GraphRecord) {
            update(record.id, this.whiteBoards)
                .then(() => this.sync())
                .catch(e => MessageUtil.error("修改失败", e));
        },
        remove(record: GraphRecord) {
            this.whiteBoards.splice(this.whiteBoards.findIndex(e => e.id === record.id), 1);
            // 删除记录
            utools.db.promises.remove(`/${GraphTypeEnum.WHITE_BOARD}/${record.id}`)
                .catch(e => MessageUtil.error("删除失败", e))
                .finally(() => this.sync());
        },
        sync() {
            utools.db.promises.put({
                _id: LocalNameEnum.WHITE_BOARD,
                _rev: this.whiteBoardRev,
                value: toRaw(this.whiteBoards)
            }).then(res => {
                if (res.error) {
                    MessageUtil.error(res.message || '新增失败');
                    return;
                }
                this.whiteBoardRev = res.rev;
            });
        }
    }
})
