import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import Config from "@/global/Config";
import { useTitle, useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        size: useWindowSize(),
        titleWrap: '',
        typeWrap: undefined as GraphTypeEnum | undefined
    }),
    getters: {
        height: state => state.size.height - 23,
        width: state => state.size.width,
        title: state => state.titleWrap || '临时图',
        type: state => state.typeWrap ? Config.title[state.typeWrap] : undefined
    },
    actions: {
        setTitle(title: string) {
            this.titleWrap = title;
            if (title.trim() !== '') {
                useTitle().value = title;
            } else {
                useTitle().value = '听雨图编辑器';
            }
        },
        setType(type: GraphTypeEnum | undefined) {
            this.typeWrap = type;
        },
        switchDarkColors() {
            this.isDark = !this.isDark;
            if (this.isDark) {
                // 设置为暗黑主题
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                // 恢复亮色主题
                document.body.removeAttribute('arco-theme');
            }
        }
    }
})