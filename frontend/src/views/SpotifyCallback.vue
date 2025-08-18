<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
        localStorage.setItem('spotify_access_token', accessToken);
        window.location.href = '/'; // redirect to main page
    }
});
</script>

<template>
    <div>Logging in...</div>
</template>
