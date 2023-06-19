import Constant from "@/global/Constant";
import { defineStore } from "pinia";

export const useVipStore = defineStore('vip', {
    state: () => ({
        // TODO: 此处默认为false
        isVip: true
    }),
    getters: {
        isNotVip: state => !state.isVip
    },
    actions: {
        async init() {
            const payments = await utools.fetchUserPayments();
            for (let payment of payments) {
                if (payment.goods_id === Constant.goodsId) {
                    this.isVip = true;
                    return Promise.resolve();
                }
            }
        }
    }
});