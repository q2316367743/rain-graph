import BackupSetting from "@/entity/setting/BackupSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { defineStore } from "pinia";
import { toRaw } from "vue";

export function getDefaultBackupSetting(): BackupSetting {
    return {
        localEnable: false,
        localPath: '',
        webDavEnable: false,
        webDavUrl: '',
        webDavUsername: '',
        webDavPassword: ''
    }
}

export const useBackupSettingStore = defineStore('backup-setting', {
    state: () => ({
        instance: getDefaultBackupSetting(),
        rev: undefined as string | undefined
    }),
    actions: {
        init() {
            utools.db.promises.get(LocalNameEnum.SETTING_BACKUP)
            .then(res => {
                if (res) {
                    this.instance = Object.assign(this.instance, res.value);
                    this.rev = res._rev;
                }
            })
        },
        async save(setting: BackupSetting) {
            this.instance = setting;
            let res = await utools.db.promises.put({
                _id: LocalNameEnum.SETTING_BACKUP,
                _rev: this.rev,
                value: toRaw(this.instance)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        }
    }
})