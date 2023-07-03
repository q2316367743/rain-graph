<template>
  <svg>
    <g transform="translate(0.5,0.5)" style="visibility: visible">
      <rect
        x="2.38"
        y="1.36"
        width="27.2"
        height="27.2"
        fill="#ffffff"
        stroke="#000000"
        stroke-width="1.3"
        pointer-events="all"
      ></rect>
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
<style scoped>
.svg-node {
  left: 1px;
  top: 1px;
  width: 32px;
  height: 30px;
  display: block;
  position: relative;
  overflow: hidden;
}
</style>
