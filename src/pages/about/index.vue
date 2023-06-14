<template>
    <div class="about">
        <div class="container">
            <div class="logo">
                <img src="/logo.png" />
            </div>
            <div class="title">{{ Constant.name }} <span class="version">{{ Constant.version }}</span></div>
            <div class="author">
                <a-link :link="Constant.website" target="_blank" @click="openUrl(Constant.website)">
                    {{ Constant.author }}
                </a-link>
            </div>
            <div class="desc">
                <p>支持思维导图、手绘图、BPMN、流程图。</p>
                <p>开通utools会员，数据可同步。</p>
            </div>
            <div class="action">
                <a-button @click="openUrl(Constant.homepage)">插件主页</a-button>
                <a-button @click="openUrl(Constant.repo)">开源地址</a-button>
                <a-button @click="openUrl(Constant.online)">在线地址</a-button>
                <a-button @click="openPrivacy">隐私声明</a-button>
            </div>
        </div>
        <a-modal title="隐私声明" v-model:visible="privacyDialog">
            <p>一、我们可能收集您的信息</p>
            <p>我们提供服务时，会收集您的各个功能使用的时间，除此之外，我们不会收集您的其他信息。</p>
            <p>如果您不想让我们收集您各功能使用的时间数据，您可以点击右下角进行关闭。</p>
            <p>二、数据存储</p>
            <p>utools版本存放在utools提供的db中，可以在账号与数据中点击插件右侧查看存储的文档数据中查看</p>
            <template #footer>
                <a-switch v-model="privacy" :loading="privacyLoading" @change="change">
                    <template #checked>启用</template>
                    <template #unchecked>禁用</template>
                </a-switch>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Constant from "@/global/Constant";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: '',
    data: () => ({
        Constant,
        privacy: false,
        privacyDialog: false,
        rev: undefined as string | undefined,
        privacyLoading: false
    }),
    methods: {
        openUrl(url: string) {
            utools.shellOpenExternal(url);
        },
        openPrivacy() {
            utools.db.promises.get(LocalNameEnum.PRIVACY)
                .then(privacy => {
                    this.privacyDialog = true;
                    if (privacy) {
                        this.privacy = privacy.value;
                        this.rev = privacy._rev;
                    } else {
                        this.privacy = true;
                    }
                })
        },
        change(newValue: boolean) {
            if (!newValue) {
                MessageBoxUtil.confirm("数据的收集有利于插件的更好发展，并且我们只收集您的功能使用情况，不会收集您的隐私数据，确认关闭？", "提示", {
                    confirmButtonText: "关闭",
                    cancelButtonText: "取消"
                }).then(() => {
                    this.privacyLoading = true;
                    utools.db.promises.put({
                        _id: LocalNameEnum.PRIVACY,
                        _rev: this.rev,
                        value: false
                    }).then(res => {
                        if (res.error) {
                            MessageUtil.error("更新错误，请刷新后重试", res.message);
                        }
                        this.rev = res.rev;
                    }).finally(() => this.privacyLoading = false);
                }).catch(() => this.privacy = true);
            } else {
                this.privacyLoading = true;
                utools.db.promises.put({
                    _id: LocalNameEnum.PRIVACY,
                    _rev: this.rev,
                    value: true
                }).then(res => {
                    if (res.error) {
                        MessageUtil.error("更新错误，请刷新后重试", res.message);
                    }
                    this.rev = res.rev;
                }).finally(() => this.privacyLoading = false);
            }
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
    display: flex;
    justify-content: center;
    flex-direction: column;

    .logo {
        height: 200px;
    }

    .title {
        font-size: 2em;
        background: linear-gradient(60deg, #E21143, #FFB03A);
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bolder;
        margin-top: 28px;
        user-select: none;

        .version {
            font-size: 0.5em;
        }
    }

    .author {
        margin-top: 14px;
    }


    .desc {
        margin-top: 28px;
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