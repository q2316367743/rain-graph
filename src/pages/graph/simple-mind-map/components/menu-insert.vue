<template>
    <a-dropdown>
        <a-button>插入</a-button>
        <template #content>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-image /></template>
                图片
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-robot /></template>
                图标
            </a-doption>
            <a-doption :disabled="!hasNode" @click="openLink">
                <template #icon><icon-link /></template>
                超链接
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-edit /></template>
                备注
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-tag /></template>
                标签
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-apps /></template>
                概要
            </a-doption>
            <a-doption :disabled="!hasNode">
                <template #icon><icon-oblique-line /></template>
                关联线
            </a-doption>
        </template>
    </a-dropdown>
    <!-- 超链接 -->
    <a-modal v-model:visible="link.dialog" title="添加超链接" ok-text="添加" @ok="addLink">
        <a-form :model="link.record">
            <a-form-item label="名称">
                <a-input v-model="link.record.name" />
            </a-form-item>
            <a-form-item label="链接地址">
                <a-input v-model="link.record.href" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import SimpleMindMapWrap from "../SimpleMindMapWrap";

export default defineComponent({
    name: 'menu-insert',
    props: {
        hasNode: {
            type: Boolean,
            required: false,
            default: false
        },
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        }
    },
    data: () => ({
        link: {
            dialog: false,
            record: {
                name: '',
                href: ''
            }
        },
    }),
    methods: {
        openLink() {
            this.link = {
                dialog: true,
                record: {
                    name: '',
                    href: ''
                }
            };
        },
        addLink() {
            this.simpleMindMapWrap.addLink(this.link.record.name, this.link.record.href);
            this.link.dialog = false;
        },
    }
});
</script>
<style scoped></style>