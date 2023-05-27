import { useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        title: '',
        size: useWindowSize()
    }),
    getters: {
        height: state => state.size.height - 23,
        width: state => state.size.width,
    },
    actions: {
        setTitle(title: string) {
            this.title = title;
        }
    }
})