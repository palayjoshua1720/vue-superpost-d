<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
        aria-hidden="true"
    >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <line x1="7" y1="9" x2="17" y2="9" stroke-linecap="round" />
        <line x1="7" y1="13" x2="13" y2="13" stroke-linecap="round" />
    </svg>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'

defineOptions({
    inheritAttrs: false
})
</script>