<template>
    <a-form :model="setting" class="setting-backup" layout="vertical">
        <a-divider>本地备份</a-divider>
        <a-form-item label="地址">
            <a-input v-model="setting.localPath" style="width: 300px;" :disabled="isWeb">
                <template #append>
                    <a-button type="text" :disabled="isWeb" @click="chooseFile">
                        <template #icon><icon-file /></template>
                    </a-button>
                </template>
            </a-input>
        </a-form-item>
        <a-form-item label="操作">
            <a-button-group type="primary" :disabled="isWeb">
                <a-button>执行备份</a-button>
                <a-button status="success" style="margin-left: 7px;">恢复备份</a-button>
                <a-button status="warning" style="margin-left: 7px;">管理备份</a-button>
            </a-button-group>
        </a-form-item>
        <a-divider>WebDAV备份</a-divider>
        <a-form-item label="链接地址">
            <a-input v-model="setting.webDavUrl" style="width: 300px;" placeholder="http(s)://xxx.xx/dav" />
        </a-form-item>
        <a-form-item label="用户名">
            <a-input v-model="setting.webDavUsername" style="width: 300px;" />
        </a-form-item>
        <a-form-item label="密码">
            <a-input-password v-model="setting.webDavPassword" style="width: 300px;" />
        </a-form-item>
        <a-form-item label="操作">
            <a-button-group type="primary">
                <a-button>执行备份</a-button>
                <a-button status="success" style="margin-left: 7px;">恢复备份</a-button>
                <a-button status="warning" style="margin-left: 7px;">管理备份</a-button>
            </a-button-group>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { getDefaultBackupSetting } from "@/store/setting/BackupSettingStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { useBackupSettingStore } from '@/store/setting/BackupSettingStore';

export default defineComponent({
    name: 'setting-backup',
    data: () => ({
        setting: getDefaultBackupSetting(),
        init: false
    }),
    computed: {
        ...mapState(useBackupSettingStore, ['instance']),
        isWeb() {
            return typeof utools.getUser === 'undefined'
        }
    },
    watch: {
        setting: {
            handler() {
                if (!this.init) {
                    return;
                }
                useBackupSettingStore().save(this.setting);
            },
            deep: true
        }
    },
    created() {
        this.setting = this.instance;
        this.$nextTick(() => this.init = true);
    },
    methods: {
        chooseFile() {
            let paths = utools.showOpenDialog({
                defaultPath: utools.getPath("documents"),
                title: "选择备份目录",
                properties: ["openDirectory", "createDirectory"],
                buttonLabel: "选择"
            });
            if (!paths || paths.length === 0) {
                return;
            }
            this.setting.localPath = paths[0];
        }
    }
});
</script>
<style scoped></style>