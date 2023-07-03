<template>
<!-- 减号 -->
  <svg class="svg-node">
    <g transform="translate(0.5,0.5)" style="visibility: visible">
      <polygon
        points="0,9 27,9 27,18 0,18"
        fill="#ffffff"
        stroke="#000000"
        stroke-width="1.3"
        pointer-events="all"
      ></polygon>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: '',
    data: () => ({
      size: 24
    })
})
</script>