<template>
    <div class="simple-mind-map-base-color">
        <div class="baseColor">
            <span class="colorItem" v-for="item in colorList" :style="{ backgroundColor: item }" :key="item"
                @click="clickColorItem(item)"></span>
        </div>
        <div class="moreColor">
            <span>更多颜色</span>
            <input type="color" v-model="selectColor" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { colorList } from '@/global/theme';

export default defineComponent({
    name: 'simple-mind-map-base-color',
    emits: ['update:color', 'change'],
    props: {
        color: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            colorList,
            selectColor: ''
        }
    },
    watch: {
        color() {
            this.selectColor = this.color
        },
        selectColor() {
            this.$emit('update:color', this.selectColor);
            this.$emit('change');
        }
    },
    created() {
        this.selectColor = this.color
    },
    methods: {
        clickColorItem(color: string) {
            this.selectColor = color;
        },

    }
})
</script>

<style lang="less" scoped>
.simple-mind-map-base-color {
    padding: 14px;
    width: 240px;
    background-color: var(--color-bg-1);
    color: var(--color-text-1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

    .colorItem {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 5px;
        margin-bottom: 5px;
        cursor: pointer;
    }
}

.moreColor {
    display: flex;
    align-items: center;

    span {
        margin-right: 5px;
    }
}
</style>