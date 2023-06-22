<template>
    <svg>
        <g transform="translate(0.5,0.5)" style="visibility: visible">
            <path
                    d="M 22.68 1.35 L 9.18 1.35 L 9.18 28.35 L 22.68 28.35"
                    fill="transparent"
                    stroke="var(--color-text-1)"
                    stroke-width="1.3"
                    stroke-miterlimit="10"
                    pointer-events="all"
            ></path>
        </g>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'icon-lct-comment',
    data: () => ({
        size: 24
    })
})
</script>
