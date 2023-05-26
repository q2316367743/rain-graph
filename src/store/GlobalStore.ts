import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDark: utools.isDarkColors(),
        title: ''
    }),
    actions: {
        setTitle(title: string) {
            this.title = title;
        }
    }
})