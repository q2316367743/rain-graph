<template>
    <div class="more-vip">
        <a-page-header title="高级版" :show-back="false">
            <template #extra>
                <a-tag color="green" v-if="isVip">已开通</a-tag>
                <a-button type="primary" v-else @click="agreement = true">立即开通</a-button>
            </template>
        </a-page-header>
        <div class="container">
            <a-table :data="data" :columns="columns" :pagination="false" :scroll="scroll" :scrollbar="true" />
        </div>
        <a-modal v-model:visible="agreement" title="用户协议">
            <a-typography>
                <a-typography-paragraph>1、本插件的订阅服务仅包括插件功能和售后服务费。</a-typography-paragraph>
                <a-typography-paragraph>2、本服务为数字产品，请通过免费版本进行充分测试后购买，完成购买后，恕不接受退款请求。</a-typography-paragraph>
                <a-typography-paragraph>3、本插件为永久授权。</a-typography-paragraph>
                <a-typography-paragraph>4、本插件数据完全托管于 utools 平台，如需进行多设备数据同步，请开通 utools 会员服务。</a-typography-paragraph>
                <a-typography-paragraph>5、本插件接受任何使用建议和反馈，但最终是否接受相关建议进行调整修改，将由插件作者决定。</a-typography-paragraph>
            </a-typography>
            <template #footer>
                <!-- <a-button disabled>【阅读】兑换</a-button> -->
                <!-- <a-button type="dashed" disabled>激活码激活</a-button> -->
                <a-button type="primary" @click="payment">开通</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { useVipStore } from "@/store/VipStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import Constant from '@/global/Constant';
import { data, columns } from './constant';
import { useGlobalStore } from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'more-vip',
    data: () => ({
        agreement: false,
        data, columns
    }),
    computed: {
        ...mapState(useVipStore, ['isVip']),
        ...mapState(useGlobalStore, ['height']),
        scroll() {
            return {
                y: this.height - 64 - 7 - 41
            }
        }
    },
    methods: {
        payment() {
            utools.openPayment({
                goodsId: Constant.goodsId
            }, () => {
                // 支付成功，刷新状态
                useVipStore().init();
                MessageUtil.success("支付成功")
            })
        }
    }
});
</script>
<style lang="less">
.more-vip {
    position: relative;
    height: 100%;
    widows: 100%;

    .container {
        position: absolute;
        top: 64px;
        left: 7px;
        right: 7px;
        bottom: 7px;
    }
}
</style>