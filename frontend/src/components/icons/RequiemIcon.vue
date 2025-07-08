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
        <!-- Musical note -->
        <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <!-- Note head -->
        <circle cx="9" cy="18" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <!-- Eighth note flag -->
        <path d="M9 16l2-2" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <!-- Additional musical elements -->
        <path d="M21 3l-2 2" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <path d="M19 5l-2 2" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'

defineOptions({
    inheritAttrs: false
})
</script> 