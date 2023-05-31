<template>
    <div class="simple-mind-map-action" :class="show ? 'show' : 'hidden'">
        <a-button-group type="text" size="mini" class="container">
            <a-button :disabled="!hasNode">
                <div class="icon">
                    <icon-image />
                </div>
                <div class="name">图片</div>
            </a-button>
            <a-button :disabled="!hasNode">
                <div class="icon">
                    <icon-robot />
                </div>
                <div class="name">图标</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="openLink">
                <div class="icon">
                    <icon-link />
                </div>
                <div class="name">超链接</div>
            </a-button>
            <a-button :disabled="!hasNode">
                <div class="icon">
                    <icon-edit />
                </div>
                <div class="name">备注</div>
            </a-button>
            <a-button :disabled="!hasNode">
                <div class="icon">
                    <icon-tag />
                </div>
                <div class="name">标签</div>
            </a-button>
            <a-button :disabled="!hasNode">
                <div class="icon">
                    <icon-apps />
                </div>
                <div class="name">概要</div>
            </a-button>
            <a-button :disabled="!hasNode">
                <div class="icon">
                    <icon-oblique-line />
                </div>
                <div class="name">关联线</div>
            </a-button>
        </a-button-group>
        <div class="op">
            <a-button @click="show = !show" type="text">
                <template #icon>
                    <icon-pen-fill />
                </template>
            </a-button>
        </div>
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
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'simple-mind-map-action',
    props: {
        index: {
            type: Number,
            required: false,
            default: 0
        },
        len: {
            type: Number,
            required: false,
            default: 0
        },
        hasNode: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ['add-link'],
    data: () => ({
        show: false,
        link: {
            dialog: false,
            record: {
                name: '',
                href: ''
            }
        }

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
            this.$emit('add-link', this.link.record.name, this.link.record.href);
            this.link.dialog = false;
        }
    }
});
</script>
<style scoped lang="less">
.simple-mind-map-action {
    .arco-btn {
        flex-direction: column;
        height: 50px;
    }
    .op {
        text-align: center;
        align-items: center;
    }
}
</style>