<script setup>
    // TODO: Uuser registracija, login, brisanje racuna, forma itd...
    import { User } from 'lucide-vue-next';

    const test = () => alert('Button test...');
</script>

<template>
    <header class="flex flex-row items-center justify-between bg-neutral-600 py-4 px-12">
        <div class="text-2xl font-bold">
            <span class="text-white">Volt</span>
            <span class="text-emerald-500">Meter</span>
        </div>
        <button class="border-3 rounded-2xl p-1 border-white hover:bg-neutral-500" @click="test">
            <User size="35" color="white"></User>
        </button>  
    </header>
    <div class="bg-neutral-400 h-1"></div>
</template>

<style scoped>

</style>
