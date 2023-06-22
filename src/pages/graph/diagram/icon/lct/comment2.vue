<template>
    <svg>
        <g transform="translate(0.5,0.5)" style="visibility: visible">
            <path
                    d="M 15 0 L 7 0 L 7 28 L 15 28"
                    fill="transparent"
                    stroke="var(--color-text-1)"
                    stroke-width="1.3"
                    stroke-miterlimit="10"
                    pointer-events="all"
            ></path>
            <path
                    d="M 7 15 L 0 15"
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
