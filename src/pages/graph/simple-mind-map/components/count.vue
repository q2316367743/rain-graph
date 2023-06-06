<template>
    <div class="countContainer">
        <div class="item">
            <span class="name">字数</span>
            <span class="value">{{ words }}</span>
        </div>
        <div class="item">
            <span class="name">节点</span>
            <span class="value">{{ num }}</span>
        </div>
    </div>
</template>
  
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import SimpleMindMapWrap from '../SimpleMindMapWrap'

let countEl = document.createElement('div')

// 字数及节点数量统计
export default defineComponent({
    name: 'simple-mind-map-count',
    props: {
        simpleMindMapWrap: {
            type: Object as PropType<SimpleMindMapWrap>,
            required: false,
            default: new SimpleMindMapWrap("", {})
        },
    },
    data() {
        return {
            textStr: '',
            words: 0,
            num: 0
        }
    },
    created() {
        this.simpleMindMapWrap.on('data_change', this.onDataChange)
    },
    beforeDestroy() {
        this.simpleMindMapWrap.off('data_change', this.onDataChange)
    },
    methods: {
        onDataChange(data: any) {
            this.textStr = ''
            this.words = 0
            this.num = 0
            this.walk(data)
            countEl.innerHTML = this.textStr
            this.words = (countEl.textContent || '').length
        },
        walk(data: any) {
            this.num++
            this.textStr += String(data.data.text) || ''
            if (data.children && data.children.length > 0) {
                data.children.forEach((item: any) => {
                    this.walk(item)
                })
            }
        }
    }
})
</script>

<style lang="less" scoped>
.countContainer {
    padding: 0 12px;
    position: absolute;
    left: 1rem;
    bottom: 3rem;
    background-color: var(--color-neutral-2);
    color: var(--color-text-1);
    border-radius: 2px;
    opacity: 0.8;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    display: flex;
    user-select: none;

    .item {
        margin-right: 15px;

        &:last-of-type {
            margin-right: 0;
        }

        .name {
            margin-right: 5px;
        }
    }
}
</style>