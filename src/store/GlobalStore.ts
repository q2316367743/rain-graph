import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import Config from "@/global/Config";
import { useTitle, useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        size: useWindowSize(),
        titleWrap: '',
        typeWrap: undefined as GraphTypeEnum | undefined,
        env: window.rain.env,
        loading: false,
        loadingText: ''
    }),
    getters: {
        height: state => state.size.height,
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
        },
        startLoading(text?: string) { // 加载中.. 可以加载完成后自动关闭页面.. 不要忘
            this.loading = true;
            this.loadingText = text || '加载中...';
        },
        closeLoading() {
            this.loading = false;
        }
    }
})