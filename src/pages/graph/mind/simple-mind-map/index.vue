<template>
    <div class="simple-mind-map-wrap" :style="{ height: height + 'px' }">
        <div id="simple-mind-map"></div>
        <simple-mind-map-option class="option" @switch-theme="setTheme" @switch-layout="setLayout" />
        <simple-mind-map-action class="action" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SimpleMindMapWrap from "./SimpleMindMapWrap";
import { mapState } from "pinia";
import { useGlobalStore } from "@/store/GlobalStore";

// 组件
import SimpleMindMapOption from './components/option.vue';
import SimpleMindMapAction from './components/action.vue';
import { useSaveAsEvent, useSaveEvent } from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";

let simpleMindMapWrap = {} as SimpleMindMapWrap;

export default defineComponent({
    name: '',
    components: { SimpleMindMapOption, SimpleMindMapAction },
    props: {
        sourceId: {
            type: String,
            required: false,
            default: '0'
        },
        source_rev: String,
        value: Object
    },
    data: () => ({

    }),
    computed: {
        ...mapState(useGlobalStore, ['height', 'title'])
    },
    created() {
        useSaveEvent.on(() => {
            simpleMindMapWrap.save()
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        });
        useSaveAsEvent.on(() => simpleMindMapWrap.saveAs(this.title));
    },
    mounted() {
        simpleMindMapWrap = new SimpleMindMapWrap(
            "#simple-mind-map", {
        }, this.value ? this.value.record : {
            "data": {
                "text": "思维导图"
            },
            "children": []
        });
        simpleMindMapWrap.init(this.sourceId, this.source_rev);
    },
    methods: {
        setTheme(theme: string) {
            simpleMindMapWrap.setTheme(theme);
        },
        setLayout(layout: string) {
            simpleMindMapWrap.setLayout(layout);
        }
    }
});
</script>
<style lang="less">
.simple-mind-map-wrap {
    position: relative;
    width: 100%;

    .option {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 7px;
        background-color: var(--color-bg-2);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        width: 88px;
    }

    .action {
        position: absolute;
        bottom: 20px;
        left: 10px;
        padding: 7px;
        background-color: var(--color-bg-2);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
    }
}

#simple-mind-map {
    width: 100%;
    height: 100%;
}

#simple-mind-map * {
    margin: 0;
    padding: 0;
}
</style>