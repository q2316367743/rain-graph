<template>
    <div class="fabric-wb-menu-file">
        <a-button-group type="text">
            <a-tooltip content="返回文件列表">
                <a-button @click="toHome()">
                    <template #icon>
                        <icon-left/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-dropdown position="bl">
                <a-button>
                    <template #icon>
                        <icon-menu/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption @click="save()">保存</a-doption>
                    <a-doption :disabled="isNotVip" @click="open()">打开</a-doption>
                    <a-doption :disabled="isNotVip" @click="instance.saveAs()">另存为</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import FabricWbWrap from "@/pages/graph/fabric-wb/core/FabricWbWrap";
import {useFileSystemAccess} from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";
import {mapState} from "pinia";
import {useVipStore} from "@/store/VipStore";

export default defineComponent({
    name: 'fabric-wb-menu',
    props: {
        instance: {
            type: Object as PropType<FabricWbWrap>,
            required: true,
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
        toHome() {
            this.$router.push({
                path: '/home',
                query: {
                    name: GraphTypeEnum.WHITE_BOARD
                }
            })
        },
        open() {
            const res = this.fileSystem.open() as Promise<void>;
            res.then(() => {
                const json = this.fileSystem.data as string;
                this.instance.open(JSON.parse(json), () => console.debug("打开成功"));
            })
        },
        save() {
            this.instance.save(true)
                    .then(() => MessageUtil.success("保存成功"))
                    .catch(e => MessageUtil.error("保存失败"));
        }
    }
});
</script>
<style scoped lang="less">
.fabric-wb-menu-file {
    position: absolute;
    top: 7px;
    left: 14px;
    background-color: var(--color-neutral-2);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-neutral-3);
}
</style>
