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
    <!-- AI brain outline -->
    <ellipse cx="12" cy="12" rx="8" ry="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <!-- AI circuit lines -->
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.2" fill="white"/>
    <line x1="12" y1="4.5" x2="12" y2="9.5" stroke="currentColor" stroke-width="1"/>
    <line x1="12" y1="14.5" x2="12" y2="19.5" stroke="currentColor" stroke-width="1"/>
    <line x1="4.5" y1="12" x2="9.5" y2="12" stroke="currentColor" stroke-width="1"/>
    <line x1="14.5" y1="12" x2="19.5" y2="12" stroke="currentColor" stroke-width="1"/>
    <!-- Small nodes -->
    <circle cx="12" cy="4.5" r="0.7" fill="currentColor"/>
    <circle cx="12" cy="19.5" r="0.7" fill="currentColor"/>
    <circle cx="4.5" cy="12" r="0.7" fill="currentColor"/>
    <circle cx="19.5" cy="12" r="0.7" fill="currentColor"/>
  </svg>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'

defineOptions({
  inheritAttrs: false
})
</script>