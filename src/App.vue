<template>
    <div class="app">
        <!-- 头部 -->
        <div class="app-header">
            <a-button-group type="text" style="margin-left: 7px;">
                <a-dropdown position="bl">
                    <a-button>图</a-button>
                    <template #content>
                        <a-doption @click="$router.push('/home')">全部图</a-doption>
                        <a-dsubmenu>
                            <template #default>新增</template>
                            <template #content>
                                <a-doption @click="$router.push('/mind/0')">思维导图</a-doption>
                                <a-doption @click="$router.push('/flow-chart/0')">流程图</a-doption>
                            </template>
                        </a-dsubmenu>
                        <a-dsubmenu>
                            <template #default>打开</template>
                            <template #content>
                                <a-doption>思维导图</a-doption>
                                <a-doption>流程图</a-doption>
                            </template>
                        </a-dsubmenu>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>编辑</a-button>
                    <template #content>
                        <a-doption disabled>撤销</a-doption>
                        <a-doption @click="save">保存</a-doption>
                        <a-doption>另存为</a-doption>
                        <a-dsubmenu>
                            <template #default>导出</template>
                            <template #content>
                                <a-doption>PNG</a-doption>
                                <a-doption>SVG</a-doption>
                            </template>
                        </a-dsubmenu>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button>帮助</a-button>
                    <template #content>
                        <a-doption>关于</a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
            <div class="title">{{ title }}</div>
        </div>
        <div class="app-container">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useGlobalStore } from "./store/GlobalStore";
import { useSaveEvent } from "./global/BeanFactory";
import { useMindStore } from "./store/MindStore";

export default defineComponent({
    name: '',
    data: () => ({
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark']),
        ...mapState(useGlobalStore, ['title']),
    },
    created() {
        if (this.isDark) {
            // 设置为暗黑主题
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            // 恢复亮色主题
            document.body.removeAttribute('arco-theme');
        }
        // 初始化流程图
        useMindStore().init();
    },
    methods: {
        save() {
            useSaveEvent.emit();
        }
    }
});
</script>
<style lang="less"></style>