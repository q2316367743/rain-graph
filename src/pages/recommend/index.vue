<template>
    <div class="recommend">
        <a-scrollbar style="height:100%;overflow: auto;">
            <div class="recommend-wrapper">
                <a-list :bordered="false">
                    <template #header>
                        付费项目
                    </template>
                    <a-list-item action-layout="vertical">
                        <template #actions>
                            <a-link target="_blank"
                                @click="openLink('https://www.yuque.com/baozhiyige-tewwf/gfbte7')">官网</a-link>
                        </template>
                        <template #extra>
                            <a-link @click="toApp('阅读')" style="margin-top: 40px;">立即使用</a-link>
                        </template>
                        <a-list-item-meta title="阅读" description="阅读小说、看视频、看资源、看订阅，一网打尽。">
                            <template #avatar>
                                <a-avatar shape="square">
                                    <img alt="阅读" src="/read.png" />
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
                <a-list :bordered="false">
                    <template #header>
                        开源项目
                    </template>
                    <!-- es-client -->
                    <a-list-item action-layout="vertical">
                        <template #actions>
                            <a-link target="_blank" @click="openLink('http://es-client.esion.xyz')">官网</a-link>
                            <a-link target="_blank"
                                @click="openLink('https://gitee.com/qiaoshengda/es-client')">Gitee仓库</a-link>
                            <a-link target="_blank"
                                @click="openLink('https://github.com/q2316367743/es-client')">GitHub仓库</a-link>
                        </template>
                        <template #extra>
                            <a-link @click="toApp('es-client')" style="margin-top: 40px;">立即使用</a-link>
                        </template>
                        <a-list-item-meta description="es-client是一款elasticsearch客户端，界面美观，可以实现链接管理，索引管理，基础搜索，高级搜索等功能">
                            <template #title>
                                <div style="display: flex;">
                                    <b>es-client</b>
                                    <a-image src='https://gitee.com/qiaoshengda/es-client/badge/star.svg?theme=white'
                                        alt='gitee star' />
                                    <a-image src="https://img.shields.io/github/stars/q2316367743/es-client?style=social"
                                        alt="github star" />
                                </div>
                            </template>
                            <template #avatar>
                                <a-avatar shape="square">
                                    <img alt="es-client" src="/es-client.png" />
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                    <!-- 听雨HTML转Markdown -->
                    <a-list-item action-layout="vertical">
                        <template #actions>
                            <a-link target="_blank"
                                @click="openLink('https://gitee.com/qiaoshengda/rain-html-to-markdown')">Gitee仓库</a-link>
                        </template>
                        <template #extra>
                            <a-link @click="toApp('听雨html转markdown')" style="margin-top: 40px;">立即使用</a-link>
                        </template>
                        <a-list-item-meta title="听雨HTML转Markdown" description="Html转Markdown">
                            <template #avatar>
                                <a-avatar shape="square">
                                    <img alt="es-client" src="/rain-html-to-markdown.png" />
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                    <!-- 孤岛 -->
                    <a-list-item action-layout="vertical">
                        <template #actions>
                            <a-link target="_blank"
                                @click="openLink('https://gitee.com/qiaoshengda/isolated-island')">Gitee仓库</a-link>
                        </template>
                        <template #extra>
                            <a-link @click="toApp('孤岛')" style="margin-top: 40px;">立即使用</a-link>
                        </template>
                        <a-list-item-meta description="一个人的朋友圈" title="孤岛">
                            <template #avatar>
                                <a-avatar shape="square">
                                    <img alt="es-client" src="/isolated-island.png" />
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                    <!-- 听雨API -->
                    <a-list-item action-layout="vertical">
                        <template #actions>
                            <a-link target="_blank"
                                @click="openLink('https://gitee.com/qiaoshengda/file-api')">Gitee仓库</a-link>
                        </template>
                        <template #extra>
                            <a-link @click="toApp('听雨API')" style="margin-top: 40px;">立即使用</a-link>
                        </template>
                        <a-list-item-meta title="听雨API" description="http请求工具，简易postman">
                            <template #avatar>
                                <a-avatar shape="square">
                                    <img alt="es-client" src="/rain-api.png" />
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                    <!-- 听雨文件浏览器 -->
                    <a-list-item action-layout="vertical">
                        <template #actions>
                            <a-link target="_blank"
                                @click="openLink('https://gitee.com/qiaoshengda/file-rain-browser')">Gitee仓库</a-link>
                        </template>
                        <template #extra>
                            <a-link @click="toApp('听雨文件浏览器')" style="margin-top: 40px;">立即使用</a-link>
                        </template>
                        <a-list-item-meta title="听雨文件浏览器" description="在线管理webdav、alist等网络存储">
                            <template #avatar>
                                <a-avatar shape="square">
                                    <img alt="es-client" src="/rain-file-browser.png" />
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </div>
        </a-scrollbar>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'setting-recommend',
    data: () => ({
    }),
    methods: {
        openLink(url: string) {
            utools.shellOpenExternal(url);
        },
        toApp(name: string) {
            utools.redirect(name, '');
        }
    }
});
</script>
<style lang="less">
.recommend {
    &>.arco-scrollbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .scrollbar {
            overflow: auto;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

        }
    }

    .arco-image {
        margin-left: 1em;
    }
}
</style>