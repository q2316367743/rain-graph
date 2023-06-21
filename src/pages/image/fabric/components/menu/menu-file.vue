<template>
    <a-dropdown>
        <a-button>文件</a-button>
        <template #content>
            <a-doption @click="open" :disabled="isNotVip">打开</a-doption>
            <a-doption @click="saveAs" :disabled="isNotVip">另存为</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import FabricWrap from "@/pages/image/fabric/FabricWrap";
import MoreBackground from "@/pages/image/fabric/components/menu/menu-more/more-background.vue";
import {download} from "@/utils/BrowserUtil";
import {useFileSystemAccess} from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";
import {mapState} from "pinia";
import {useVipStore} from "@/store/VipStore";

export default defineComponent({
    name: 'fabric-menu-file',
    components: {MoreBackground},
    props: {
        instance: {
            type: Object,
            required: false,
            default: new FabricWrap()
        },
    },
    data: () => ({
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
        ...mapState(useVipStore, ['isNotVip'])
    },
    methods: {
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let content = this.fileSystem.data || '';
                try {
                    let json = JSON.parse(content);
                    this.instance.canvas.loadFromJSON(json, () => {
                    });
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
        saveAs() {
            download(JSON.stringify(this.instance.canvas.toJSON()),
                "听雨图片编辑器.json", "application/json")
        }
    }
});
</script>
<style scoped>

</style>