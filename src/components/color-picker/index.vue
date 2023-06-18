<template>
    <a-trigger placement="bottom" trigger="hover">
        <span class="block" :style="{ backgroundColor: sourceColor }"></span>
        <template #content>
            <div class="simple-mind-map-base-color">
                <div class="baseColor">
                    <span class="colorItem" v-for="item in colorList" :style="{ backgroundColor: item }" :key="item"
                        @click="updateColor(item)"></span>
                </div>
                <div class="moreColor">
                    <span>更多颜色</span>
                    <input type="color" v-model="sourceColor" />
                </div>
            </div>
        </template>
    </a-trigger>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'color-picker',
    emits: ['update:color', 'change'],
    props: {
        color: {
            type: String,
            default: ''
        }
    },
    watch: {
        color(newValue) {
            this.sourceColor = newValue;
        },
        sourceColor(newValue) {
            this.$emit('update:color', newValue);
            this.$emit('change', newValue);
        }
    },
    created() {
        this.sourceColor = this.color;
    },
    data: () => ({
        sourceColor: '#ffffff',
        colorList: [
            'var(--color-bg-1)',
            '#999999',
            '#FFFFFF',
            '#F44E3B',
            '#FE9200',
            '#FCDC00',
            '#DBDF00',
            '#A4DD00',
            '#68CCCA',
            '#73D8FF',
            '#AEA1FF',
            '#FDA1FF',
            '#333333',
            '#808080',
            '#cccccc',
            '#D33115',
            '#E27300',
            '#FCC400',
            '#B0BC00',
            '#68BC00',
            '#16A5A5',
            '#009CE0',
            '#7B64FF',
            '#FA28FF',
            '#000000',
            '#666666',
            '#B3B3B3',
            '#9F0500',
            '#C45100',
            '#FB9E00',
            '#808900',
            '#194D33',
            '#0C797D',
            '#0062B1',
            '#653294',
            '#AB149E'
        ]
    }),
    methods: {
        updateColor(color: string) {
            this.sourceColor = color;
        }
    }
});
</script>
<style scoped lang="less">
.block {
    display: block;
    width: 30px;
    height: 30px;
    border: 1px solid var(--color-neutral-3);
    border-radius: 4px;
    cursor: pointer;
}

.simple-mind-map-base-color {
    padding: 14px;
    width: 240px;
    background-color: var(--color-neutral-2);
    color: var(--color-text-1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 2px;

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