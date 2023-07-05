<template>
    <div class="fabric-wb-operate-iconfont">
        <div class="search">
            <a-input v-model.trim="keyword" placeholder="请输入图标名称" allow-clear/>
        </div>
        <div class="container">
            <a-scrollbar style="height: 356px;overflow: auto">
                <a-divider v-if="arrowResultIcons.length > 0">方向指示类图标</a-divider>
                <div class="icon-items">
                    <div v-for="icon in arrowResultIcons" class="icon-item">
                        <a-tooltip :content="icon.item">
                            <component :is="icon.item"/>
                        </a-tooltip>
                    </div>
                </div>
                <a-divider v-if="messageResultIcons.length > 0">提示建议类图标</a-divider>
                <div class="icon-items">
                    <div v-for="icon in messageResultIcons" class="icon-item">
                        <a-tooltip :content="icon.item">
                            <component :is="icon.item"/>
                        </a-tooltip>
                    </div>
                </div>
                <a-divider v-if="interactiveResultIcons.length>0">交互按钮类图标</a-divider>
                <div class="icon-items">
                    <div v-for="icon in interactiveResultIcons" class="icon-item">
                        <a-tooltip :content="icon.item">
                            <component :is="icon.item"/>
                        </a-tooltip>
                    </div>
                </div>
                <a-divider v-if="mediaResultIcons.length > 0">影音类图标</a-divider>
                <div class="icon-items">
                    <div v-for="icon in mediaResultIcons" class="icon-item">
                        <a-tooltip :content="icon.item">
                            <component :is="icon.item"/>
                        </a-tooltip>
                    </div>
                </div>
                <a-divider v-if="brandResultIcons.length > 0">商标类图标</a-divider>
                <div class="icon-items">
                    <div v-for="icon in brandResultIcons" class="icon-item">
                        <a-tooltip :content="icon.item">
                            <component :is="icon.item"/>
                        </a-tooltip>
                    </div>
                </div>
                <a-divider v-if="commonResultIcons.length > 0">通用类图标</a-divider>
                <div class="icon-items">
                    <div v-for="icon in commonResultIcons" class="icon-item">
                        <a-tooltip :content="icon.item">
                            <component :is="icon.item"/>
                        </a-tooltip>
                    </div>
                </div>
            </a-scrollbar>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useFuse} from "@vueuse/integrations/useFuse";

import {arrowIcons, messageIcons, interactiveIcons, mediaIcons, brandIcons, commonIcons} from './constants';

const keyword = ref('');

const {results: arrowResultIcons} = useFuse(keyword, arrowIcons, {
    matchAllWhenSearchEmpty: true
})
const {results: messageResultIcons} = useFuse(keyword, messageIcons, {
    matchAllWhenSearchEmpty: true
})
const {results: interactiveResultIcons} = useFuse(keyword, interactiveIcons, {
    matchAllWhenSearchEmpty: true
})
const {results: mediaResultIcons} = useFuse(keyword, mediaIcons, {
    matchAllWhenSearchEmpty: true
})
const {results: brandResultIcons} = useFuse(keyword, brandIcons, {
    matchAllWhenSearchEmpty: true
})
const {results: commonResultIcons} = useFuse(keyword, commonIcons, {
    matchAllWhenSearchEmpty: true
})

</script>
<style scoped lang="less">
.fabric-wb-operate-iconfont {
    position: relative;
    width: 301px;
    height: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: 1px solid var(--color-neutral-3);
    background-color: var(--color-bg-1);

    .search {
        padding: 4px;
    }

    .container {
        position: absolute;
        top: 40px;
        left: 7px;
        right: 4px;
        bottom: 4px;

        .icon-items {
            display: flex;
            flex-wrap: wrap;

            .icon-item {
                padding: 16px;
                border: 1px solid var(--color-neutral-3);
                height: 16px;
                width: 16px;
                margin: 4px;
                cursor: pointer;
            }
        }
    }
}
</style>
