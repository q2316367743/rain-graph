<template>
    <a-dropdown>
        <a-button>文件</a-button>
        <template #content>
            <a-doption @click="toHome">返回列表</a-doption>
            <a-doption @click="open" :disabled="!fileSystem.isSupported || isNotVip">打开</a-doption>
            <a-doption @click="save">保存</a-doption>
            <a-doption @click="saveAs" :disabled="isNotVip">另存为</a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
import { mapState } from "pinia";
import { PropType, defineComponent } from "vue";
import { useFileSystemAccess } from '@vueuse/core'
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import SimpleMindMapWrap from "../../SimpleMindMapWrap";
import MessageUtil from "@/utils/MessageUtil";
import { useGlobalStore } from "@/store/GlobalStore";
import { useSaveEvent } from "@/global/BeanFactory";
import { useVipStore } from "@/store/VipStore";

export default defineComponent({
    name: 'menu-file',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({
        fileSystem: useFileSystemAccess({
            dataType: 'Text',
            types: [{
                description: 'json',
                accept: {
                    'application/json': ['.json', '.ssm'],
                },
            }]
        })
    }),
    computed: {
        ...mapState(useGlobalStore, ['title']),
        ...mapState(useVipStore, ['isNotVip'])
    },
    created() {
        useSaveEvent.on(() => this.save());
    },
    methods: {
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.SIMPLE_MIND_MAP
                }
            })
        },
        save() {
            this.simpleMindMapWrap.save()
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        },
        saveAs() {
            this.simpleMindMapWrap.saveAs(this.title)
        },
        open() {
            let res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                let content = this.fileSystem.data || '';
                try {
                    let json = JSON.parse(content);
                    let config = json['config'];
                    let data = json['record'];
                    this.simpleMindMapWrap.setConfig(config);
                    this.simpleMindMapWrap.setData(data);
                } catch (e) {
                    MessageUtil.error("文件解析失败", e);
                }
            }).catch(e => {
                if (e.name === 'AbortError') {
                    return;
                }
                MessageUtil.error("打开失败", e)
            });
        }
    }
});
</script>
<style scoped></style>