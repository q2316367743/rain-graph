import MindSetting from "@/entity/setting/MindSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MindEngineEnum from "@/enumeration/MindEngineEnum";
import { defineStore } from "pinia";

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
        }
    }
})