import SimpleMindMapSetting from "@/entity/setting/SimpleMindMapSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {toRaw} from "vue";

export function getDefaultSimpleMindMapSetting(): SimpleMindMapSetting {
    return {
        display: 'mind'
    }
}

export const useSimpleMindMapSettingStore = defineStore('simple-mind-elixir-map-setting', {
    state: () => ({
        simpleMindMapSetting: getDefaultSimpleMindMapSetting(),
        _rev: undefined as string | undefined
    }),
    getters: {
        display: state => state.simpleMindMapSetting.display || 'mind'
    },
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.SETTING_SIMPLE_MIND_MAP)
            if (res) {
                this.simpleMindMapSetting = Object.assign(this.simpleMindMapSetting, res.value);
                this._rev = res._rev;
            }
        },
        async saveBase(setting: SimpleMindMapSetting): Promise<void> {
            this.simpleMindMapSetting = Object.assign(this.simpleMindMapSetting, setting);
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_SIMPLE_MIND_MAP,
                _rev: this._rev,
                value: toRaw(this.simpleMindMapSetting)
            });
            if (res.error) {
                return Promise.reject("保存设置失败");
            }
            this._rev = res.rev;
            return await Promise.resolve();
        }
    }
});
