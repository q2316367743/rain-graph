<template>
    <div class="mind">
        <mind-elixir :source-id="id" :source_rev="_rev" :value="value"
            v-if="engine === MindEngineEnum.MIND_ELIXIR && show" />
        <simple-mind-map :source-id="id" :source_rev="_rev" :value="value"
            v-if="engine === MindEngineEnum.SIMPLE_MIND_MAP && show" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MindEngineEnum from "@/enumeration/MindEngineEnum";

import MessageUtil from "@/utils/MessageUtil";
import { useSettingStore } from "@/store/SettingStore";

import SimpleMindMap from "./simple-mind-map/index.vue";
import MindElixir from './mind-elixir/index.vue';

export default defineComponent({
    name: 'mind',
    components: { MindElixir, SimpleMindMap },
    data: () => ({
        MindEngineEnum,
        id: '0',
        _rev: undefined as string | undefined,
        value: undefined as any,
        engine: MindEngineEnum.MIND_ELIXIR as MindEngineEnum,
        show: false
    }),
    computed: {
        ...mapState(useSettingStore, ['mindEngine'])
    },
    created() {
        this.initData().catch(e => {
            MessageUtil.error("初始化数据失败", e);
            this.engine = this.mindEngine;
            this.id = '0';
        }).finally(() => this.show = true);
    },
    methods: {
        async initData() {
            let id = this.$route.params.id as string;
            this.id = id;
            let temp = undefined as any | undefined;
            if (id === '-1') {
                let path = this.$route.query.path as string;
                let value = await window.preload.openFileToString(path);
                temp = JSON.parse(value);
            } if (id !== '0') {
                let recordWrap = await utools.db.promises.get(`/${GraphTypeEnum.MIND}/${id}`);
                if (recordWrap) {
                    temp = recordWrap.value;
                    // 存在
                    this._rev = recordWrap._rev;
                }
            } else {
                this.engine = this.mindEngine;
                return Promise.resolve();
            }
            if (!temp) {
                return Promise.reject("获取数据失败")
            }
            this.engine = temp.engine;
            if (!this.engine) {
                return Promise.reject("思维导图引擎未知");
            }
            this.value = temp;
        }
    }
});
</script>
<style scoped></style>