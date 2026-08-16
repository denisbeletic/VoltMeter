<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter()
</script>

<template>
    <button @click="router.back()" class="bg-emerald-600 hover:bg-emerald-500 w-fit rounded-lg font-bold text-white py-1 px-3">Nazad</button>
</template>

<style>

</style>