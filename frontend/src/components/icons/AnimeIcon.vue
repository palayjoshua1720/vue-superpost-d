<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-5 h-5"
    aria-hidden="true"
  >
    <!-- Book outline -->
    <path
      d="M4 6.5V18a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 18V6.5M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5M4 6.5v11.25A2.25 2.25 0 006.25 20h11.5A2.25 2.25 0 0020 17.75V6.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Book pages (center line) -->
    <path
      d="M12 6.5v13"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'

defineOptions({
  inheritAttrs: false
})
</script>