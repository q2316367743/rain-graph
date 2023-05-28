<template>
    <div class="about">
        <div class="logo">
            <a-image src="/logo.png" :preview="false" />
        </div>
        <div class="title">{{ Constant.name }}</div>
        <div class="author">
            <a-link :link="Constant.website" target="_blank" @click="openUrl(Constant.website)">
                {{ Constant.author }}
            </a-link>
        </div>
        <div class="desc">
            支持思维导图、手绘图、BPMN、流程图。<br />
            开通utools会员，数据支持同步。
        </div>
        <div class="action">
            <a-button @click="openUrl(Constant.homepage)">插件主页</a-button>
            <a-button @click="openUrl(Constant.repo)">开源地址</a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Constant from "@/global/Constant";

export default defineComponent({
    name: '',
    data: () => ({
        Constant
    }),
    methods: {
        openUrl(url: string) {
            utools.shellOpenExternal(url);
        }
    }
});
</script>
<style scoped lang="less">
.about {
    position: relative;
    height: 100%;
    width: 100%;
    text-align: center;

    .logo {
        margin-top: 28px;
    }

    .title {
        font-size: 24px;
        background: linear-gradient(60deg, #E21143, #FFB03A);
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bolder;
        margin-top: 28px;
        user-select: none;
    }

    .author {
        margin-top: 14px;
    }


    .desc {
        margin-top: 14px;
        user-select: none;
    }

    .action {
        margin-top: 28px;

        .arco-btn {
            margin: 0 7px;
        }
    }

}
</style>