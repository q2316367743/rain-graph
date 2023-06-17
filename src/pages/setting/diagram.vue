<template>
    <a-form :model="setting" class="setting-diagram" layout="vertical">
        <a-divider>背景</a-divider>
        <a-form-item label="背景">
            <a-switch v-model="background" />
        </a-form-item>
        <a-form-item label="背景图" v-if="background">
            <a-select v-model="backgroundImage" allow-create allow-clear style="width: 250px;">
                <a-option value="var(--color-bg-1)">自适应背景颜色</a-option>
                <a-option value="rgb(var(--arcoblue-6))">主色</a-option>
                <a-option value="rgb(var(--green-6))">成功色</a-option>
                <a-option value="rgb(var(--orange-6))">警示色</a-option>
                <a-option value="rgb(var(--red-6))">错误色</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="背景图重复" v-if="background">
            <a-select v-model="backgroundRepeat" style="width: 400px;">
                <a-option value="repeat">背景图像将在垂直方向和水平方向重复。</a-option>
                <a-option value="repeat-x">背景图像将在水平方向重复。</a-option>
                <a-option value="repeat-y">背景图像将在垂直方向重复。</a-option>
                <a-option value="no-repeat">背景图像将仅显示一次。</a-option>
                <a-option value="inherit">规定应该从父元素继承 background-repeat 属性的设置。</a-option>
            </a-select>
        </a-form-item>
        <a-divider>网格</a-divider>
        <a-form-item label="网格">
            <a-switch v-model="grid" />
        </a-form-item>
        <a-form-item label="网格格子间距" v-if="grid">
            <a-input-number v-model="size" :min="0" style="width: 150px;" />
        </a-form-item>
        <a-form-item label="网格是否可见" v-if="grid">
            <a-switch v-model="visible" />
        </a-form-item>
        <a-form-item label="网格类型" v-if="grid">
            <a-select v-model="type" style="width: 100px;">
                <a-option value="dot">点状图</a-option>
                <a-option value="mesh">网格</a-option>
            </a-select>
        </a-form-item>
        <a-divider>其他</a-divider>
        <a-form-item label="默认边类型">
            <a-select v-model="setting.edgeType" style="width: 100px;">
                <a-option value="polyline">折线</a-option>
                <a-option value="line">直线</a-option>
                <a-option value="bezier">曲线</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="是否开启对齐线">
            <a-switch v-model="setting.snapline" />
        </a-form-item>
        <a-form-item label="是否开启历史记录功能">
            <a-switch v-model="setting.history" />
        </a-form-item>
        <a-form-item label="是否开启局部渲染">
            <a-switch v-model="setting.partial" />
        </a-form-item>
        <a-form-item label="重叠模式">
            <a-select v-model="setting.overlapMode">
                <a-option :value="0">表示节点在上，边在下，点击元素时选择元素显示在最顶部。</a-option>
                <a-option :value="1">表示安装元素创建顺序排序，点击元素也不会将其置顶。要置顶需要调用置顶API。</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="是否开启动画">
            <a-switch v-model="setting.animation" />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="save">保存设置</a-button>
            <template #help>记得保存哦</template>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { getDefaultDiagramSetting, useDiagramSettingStore } from "@/store/setting/DiagramSettingStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import DiagramSetting from '@/entity/setting/DiagramSetting';
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'setting-diagram',
    data: () => ({
        background: false,
        backgroundImage: '',
        backgroundRepeat: '',
        setting: getDefaultDiagramSetting(),
        grid: false,
        size: 20,
        visible: true,
        type: 'dot',
    }),
    computed: {
        ...mapState(useDiagramSettingStore, ['diagramSetting'])
    },
    created() {
        this.backgroundImage = '';
        this.backgroundRepeat = '';
        this.setting = Object.assign(this.setting, this.diagramSetting);
        if (typeof this.setting.background === 'boolean') {
            this.background = this.setting.background;
        } else {
            this.background = true;
            if (this.setting.background) {
                this.backgroundImage = this.setting.background.backgroundImage || '';
                this.backgroundRepeat = this.setting.background.backgroundRepeat || '';
            }
        }
        this.size = 0;
        this.visible = true;
        this.type = 'dot';
        if (typeof this.setting.grid === 'boolean') {
            this.grid = this.setting.grid;
        } else {
            this.grid = true;
            if (this.setting.grid) {
                this.size = this.setting.grid.size || 20;
                this.visible = this.setting.grid.visible || true;
                this.type = this.setting.grid.type || 'dot';
            }
        }
    },
    methods: {
        save() {
            if (this.background) {
                this.setting.background = {
                    backgroundImage: this.backgroundImage,
                    backgroundRepeat: this.backgroundRepeat
                };
            } else {
                this.setting.background = false;
            }
            if (this.grid) {
                this.setting.grid = {
                    size: this.size,
                    visible: this.visible,
                    type: this.type
                };
            } else {
                this.setting.grid = false;
            }
            useDiagramSettingStore().save(this.setting as DiagramSetting)
                .then(() => MessageUtil.success("保存成功"))
                .catch(e => MessageUtil.error("保存失败", e));
        }
    }
});
</script>
<style scoped></style>