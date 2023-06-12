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
                <a-button @click="localExecuteWrap">执行备份</a-button>
                <a-button status="success" style="margin-left: 7px;">恢复备份</a-button>
                <a-button status="warning" style="margin-left: 7px;" @click="localBackupRead">管理备份</a-button>
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
        <!-- 文件列表 -->
        <a-drawer title="备份列表" v-model:visible="fileDrawer" :footer="false" :width="350">
            <a-list :bordered="false">
                <a-list-item v-for="backup in backupItems">
                    <a-list-item-meta>
                        <template #title>
                            <a-link>{{ backup.name }}</a-link>
                            <a-tag color="orange" style="margin-left: 7px;">{{ backup.version }}</a-tag>
                        </template>
                    </a-list-item-meta>
                    <template #actions>
                        <a-button type="text" status="danger">删除</a-button>
                    </template>
                </a-list-item>
            </a-list>
        </a-drawer>
    </a-form>
</template>
<script lang="ts">
import { getDefaultBackupSetting } from "@/store/setting/BackupSettingStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useBackupSettingStore } from '@/store/setting/BackupSettingStore';
import { toDateString } from "xe-utils";
import { useGlobalStore } from "@/store/GlobalStore";
import { localExecute } from './BackupFunc';
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";

// 文件夹规则：rain-graph@1.0.0@1635902578251
// 文件名规则：项目名@版本@时间戳

interface BackupItem {
    name: string;
    version: string;
    file: string;
    timestamp: number;
}

export default defineComponent({
    name: 'setting-backup',
    data: () => ({
        setting: getDefaultBackupSetting(),
        init: false,
        fileDrawer: false,
        backupItems: new Array<BackupItem>()
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
        },
        localExecuteWrap() {
            // 查询全部索引文件
            useGlobalStore().startLoading("查询全部索引文件");
            localExecute(this.setting.localPath)
                .then(() => MessageUtil.success("备份完成"))
                .catch(e => MessageUtil.error("备份失败", e))
                .finally(() => useGlobalStore().closeLoading());
        },
        localBackupRead() {
            let backupItems = new Array<BackupItem>();
            this.backupItems = new Array<BackupItem>();
            window.api.backup.listBackup(this.setting.localPath)
                .then(items => {
                    this.fileDrawer = true;
                    for (let item of items) {
                        if (!item.startsWith('rain-graph')) {
                            continue;
                        }
                        let paths = item.split('@');
                        if (paths.length !== 3) {
                            continue;
                        }
                        let date = new Date(parseInt(paths[2]));
                        backupItems.push({
                            name: toDateString(date),
                            version: paths[1],
                            file: item,
                            timestamp: date.getTime()
                        });
                    }
                    this.backupItems = backupItems.sort((a, b) => b.timestamp - a.timestamp);
                })
        }
    }
});
</script>
<style scoped></style>