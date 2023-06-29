import DiagramSetting from "@/entity/setting/DiagramSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {defineStore} from "pinia";
import {toRaw} from "vue";


export function getDefaultDiagramSetting(): DiagramSetting {
    return {
        background: {
            backgroundImage: 'var(--color-bg-1)',
            backgroundRepeat: 'no-repeat'
        },
        grid: {
            size: 10,
            type: 'dot',
        },
        keyboard: {
            enabled: true,
        },
        edgeType: 'polyline',
        snapline: true,
        history: true,
        partial: false,
        overlapMode: 1,
        animation: true
    }
}

export const useDiagramSettingStore = defineStore('setting-diagram', {
    state: () => ({
        diagramSetting: getDefaultDiagramSetting(),
        _rev: undefined as string | undefined,
        lock: false
    }),
    actions: {
        async init() {
            const settingWrap = await utools.db.promises.get(LocalNameEnum.SETTING_DIAGRAM)
            if (!settingWrap) {
                return;
            }
            this._rev = settingWrap._rev;
            this.diagramSetting = Object.assign(this.diagramSetting, settingWrap.value);
        },
        async save(setting: DiagramSetting) {
            if (this.lock) {
                return;
            }
            this.lock = true;
            this.diagramSetting = setting;
            let res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_DIAGRAM,
                _rev: this._rev,
                value: toRaw(this.diagramSetting)
            });
            if (res.error) {
                this.lock = false;
                return Promise.reject(res.message);
            }
            this._rev = res.rev;
            this.lock = false;
        }
    }
})
