<template>
    <a-dropdown>
        <a-button>文件</a-button>
        <template #content>
            <a-doption @click="toHome">返回文件列表</a-doption>
            <a-doption @click="open">打开</a-doption>
            <a-doption @click="$emit('save')">保存</a-doption>
            <a-doption @click="saveAs">另存为</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { mapState } from "pinia";
import { useFileSystemAccess } from "@vueuse/core";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { download } from "@/utils/BrowserUtil";
import { useGlobalStore } from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";


export default defineComponent({
    name: 'menu-file',
    emits: ['save'],
    props: {
        lf: {
            type: Object,
            required: false,
            default: {}
        },
        config: {
            type: Object,
            required: false,
            default: {}
        },
    },
    data: () => ({
        GraphTypeEnum,
        fileSystem: useFileSystemAccess({
            dataType: 'Text',
            types: [{
                description: 'json',
                accept: {
                    'application/json': ['.json'],
                },
            }]
        })
    }),
    computed: {
        ...mapState(useGlobalStore, ['title']),
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.DIAGRAM
                }
            })
        },
        saveAs() {
            download(JSON.stringify({
                config: toRaw(this.config),
                record: this.lf.getGraphRawData(),
                editConfig: this.lf.getEditConfig()
            }), this.title + '.json', 'text/json');
        },
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let content = this.fileSystem.data || '';
                try {
                    let json = JSON.parse(content);
                    let config = json['config'] || {};
                    let data = json['record'];
                    let editConfig = json['editConfig'] || {};
                    this.lf.updateEditConfig({
                        ...config,
                        ...editConfig
                    });
                    this.lf.renderRawData(data);
                } catch (e) {
                    MessageUtil.error("文件解析失败", e);
                }
            }).catch(e => {
                if (e.name === 'AbortError') {
                    return;
                }
                MessageUtil.error("打开失败", e)
            });
        },
    }
});
</script>
<style scoped lang="less"></style>