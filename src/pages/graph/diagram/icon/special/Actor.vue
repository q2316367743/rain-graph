<template>
  <svg>
    <g transform="translate(0.5,0.5)" style="visibility: visible">
      <ellipse
        cx="15.75"
        cy="4.73"
        rx="3.375"
        ry="3.375"
        fill="#var(--color-bg-1)"
        stroke="var(--color-text-1)"
        stroke-width="1.3"
        pointer-events="all"
      ></ellipse>
      <path
        d="M 15.75 8.1 L 15.75 19.35 M 15.75 10.35 L 9 10.35 M 15.75 10.35 L 22.5 10.35 M 15.75 19.35 L 9 28.35 M 15.75 19.35 L 22.5 28.35"
        fill="none"
        stroke="var(--color-text-1)"
        stroke-width="9.3"
        stroke-miterlimit="10"
        pointer-events="stroke"
        visibility="hidden"
      ></path>
      <path
        d="M 15.75 8.1 L 15.75 19.35 M 15.75 10.35 L 9 10.35 M 15.75 10.35 L 22.5 10.35 M 15.75 19.35 L 9 28.35 M 15.75 19.35 L 22.5 28.35"
        fill="none"
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
    name: '',
})
</script>
