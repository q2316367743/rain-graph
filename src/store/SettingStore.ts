import MindSetting from "@/entity/setting/MindSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MindEngineEnum from "@/enumeration/MindEngineEnum";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export function getDefaultMindSetting(): MindSetting {
    return {
        engine: MindEngineEnum.MIND_ELIXIR
    }
}

export const useSettingStore = defineStore('setting', {
    state: () => ({
        mind: getDefaultMindSetting(),
        mind_rev: undefined as string | undefined
    }),
    getters: {
        mindEngine: state => state.mind.engine || MindEngineEnum.MIND_ELIXIR,
    },
    actions: {
        init() {
            utools.db.promises.get(LocalNameEnum.SETTING_MIND)
                .then(res => {
                    if (res) {
                        this.mind = Object.assign(this.mind, res.value);
                        this.mind_rev = res._rev;
                    }
                })
        },
        async saveMind(setting: MindSetting): Promise<void> {
            this.mind = Object.assign(this.mind, setting);
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_MIND,
                _rev: this.mind_rev,
                value: toRaw(this.mind)
            });
            if (res.error) {
                return Promise.reject("保存设置失败");
            }
            this.mind_rev = res.rev;
            return await Promise.resolve();
        }
    }
})