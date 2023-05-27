import { useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        titleWrap: '',
        size: useWindowSize()
    }),
    getters: {
        height: state => state.size.height - 23,
        width: state => state.size.width,
        title: state => state.titleWrap || '临时图'
    },
    actions: {
        setTitle(title: string) {
            this.titleWrap = title;
        }
    }
})