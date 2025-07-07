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
        <!-- Open book icon for manga -->
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.5 6.5c0-1.1.9-2 2-2 2.5 0 5.5 1 6.5 2.5C13 5.5 16 4.5 18.5 4.5c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2-2.5 0-5.5-1-6.5-2.5C11 19.5 8 20.5 5.5 20.5c-1.1 0-2-.9-2-2v-11z"
        />
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.5v11"
        />
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 9.5h2"
        />
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.5 9.5h2"
        />
    </svg>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'

defineOptions({
    inheritAttrs: false
})
</script>