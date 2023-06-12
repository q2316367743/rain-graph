import Constant from "@/global/Constant";
import { defineStore } from "pinia";

export const useVipStore = defineStore('vip', {
    state: () => ({
        isVip: false
    }),
    getters: {
        isNotVip: (state) => !state.isVip,
    },
    actions: {
        init() {
            utools.fetchUserPayments()
                .then(goods => {
                    for (let good of goods) {
                        if (good.goods_id === Constant.goodsId) {
                            this.isVip = true;
                            return;
                        }
                    }
                })
        }
    }
})