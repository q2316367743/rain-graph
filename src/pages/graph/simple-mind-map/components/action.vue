<template>
    <div class="simple-mind-map-action" :class="show ? 'show' : 'hidden'">
        <div class="op">
            <a-button @click="show = !show" type="text">
                <template #icon>
                    <icon-pen-fill />
                </template>
            </a-button>
        </div>
        <a-button-group type="text" size="mini" v-show="show" class="container">
            <a-button :disabled="index === 0" @click="$emit('back')">
                <div class="icon">
                    <icon-undo />
                </div>
                <div class="name">后退</div>
            </a-button>
            <a-button :disabled="index === len - 1" @click="$emit('forward')">
                <div class="icon">
                    <icon-redo />
                </div>
                <div class="name">前进</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="$emit('add-node')">
                <div class="icon">
                    <icon-unordered-list />
                </div>
                <div class="name">插入同级节点</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="$emit('add-child-node')">
                <div class="icon">
                    <icon-mind-mapping />
                </div>
                <div class="name">插入子节点</div>
            </a-button>
            <a-button :disabled="!hasNode" @click="$emit('remove-node')">
                <div class="icon">
                    <icon-delete />
                </div>
                <div class="name">删除节点</div>
            </a-button>
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
    emits: ['add-child-node', 'add-node', 'remove-node', 'back', 'forward', 'add-link'],
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
}
</style>