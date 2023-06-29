import Setting from "@/entity/setting";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {toRaw} from "vue";
import {MindMapSubType} from "@/enumeration/GraphSubTypeEnum";

export function getDefaultSetting(): Setting {
    return {
        defaultView: GraphTypeEnum.MIND_MAP,
        showViews: [GraphTypeEnum.MIND_MAP, GraphTypeEnum.DIAGRAM, GraphTypeEnum.WHITE_BOARD],
        drauuAppendToDiagram: true,
        mindMapType: MindMapSubType.SIMPLE_MIND_MAP
    }
}

export const useSettingStore = defineStore('setting', {
    state: () => ({
        base: getDefaultSetting(),
        base_rev: undefined as string | undefined
    }),
    getters: {
        defaultView: state => state.base.defaultView || GraphTypeEnum.MIND_MAP,
        showViews: state => state.base.showViews,
        drauuAppendToDiagram: state => state.base.drauuAppendToDiagram,
        mindMapType: state => state.base.mindMapType
    },
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.SETTING_BASE)
            if (res) {
                this.base = Object.assign(this.base, res.value);
                this.base_rev = res._rev;
            }
        },
        async saveBase(setting: Setting): Promise<void> {
            this.base = Object.assign(this.base, setting);
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_BASE,
                _rev: this.base_rev,
                value: toRaw(this.base)
            });
            if (res.error) {
                return Promise.reject("保存设置失败");
            }
            this.base_rev = res.rev;
            return await Promise.resolve();
        }
    }
})
