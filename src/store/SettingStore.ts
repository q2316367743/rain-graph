import Setting from "@/entity/setting";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export function getDefaultSetting(): Setting {
    return {
        defaultView: GraphTypeEnum.MIND
    }
}

export const useSettingStore = defineStore('setting', {
    state: () => ({
        base: getDefaultSetting(),
        base_rev: undefined as string | undefined
    }),
    getters: {
        defaultView: state => state.base.defaultView,
    },
    actions: {
        init() {
            utools.db.promises.get(LocalNameEnum.SETTING_MIND)
                .then(res => {
                    if (res) {
                        this.base = Object.assign(this.base, res.value);
                        this.base_rev = res._rev;
                    }
                })
        },
        async saveBase(setting: Setting): Promise<void> {
            this.base = Object.assign(this.base, setting);
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_MIND,
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