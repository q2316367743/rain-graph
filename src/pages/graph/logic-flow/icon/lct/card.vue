<template>
    <svg>
        <g transform="translate(0.5,0.5)" style="visibility: visible">
            <polyline points="28,0 7,0 0,7 0,28 28,28 28,0"
                      fill="transparent"
                      stroke="var(--color-text-1)"
                      stroke-width="1.3"
                      stroke-miterlimit="10"
                      pointer-events="all"/>
        </g>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Polyline from "@/pages/graph/logic-flow/node/edge/Polyline";

export default defineComponent({
    name: 'icon-lct-card',
    components: {Polyline},
    data: () => ({
        size: 24
    })
})
</script>
