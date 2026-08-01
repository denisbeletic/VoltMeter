<script setup>
    // TODO: Ubacivanje MM-a, povezati spremljena MM sa Firebase-om
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { User, Zap } from 'lucide-vue-next';

    const user = watchAuthStateChange()
</script>

<template>
    <header class="flex flex-row items-center justify-between bg-neutral-600 py-4 px-12 fixed w-full">
        <div class="flex flex-row items-center gap-5">
            <RouterLink to="/" class="flex flex-row items-center justify-center text-2xl font-bold hover:bg-neutral-500 rounded-2xl py-1 px-2">
                <span class="text-white">Volt</span>
                <span class="text-emerald-500">Meter</span>
                <Zap color="yellow" fill="yellow" class="ml-1"></Zap>
            </RouterLink>
            <slot name="Slot1"></slot>  <!-- TODO: implementiraj tipke na ovim slotovima -->
            <slot name="Slot2"></slot>
        </div>
        <div class="flex flex-row items-center gap-10">
            <span v-if="user" class="text-emerald-600"> Prijavljen korisnik: <b>{{ user.email }}</b> </span>
            <RouterLink to="/login" class="border-3 rounded-2xl p-1 border-white hover:bg-neutral-500">
                <User size="35" color="white"></User>
            </RouterLink>
        </div>
    </header>
    <div class="bg-neutral-400 h-1"></div>
</template>

<style scoped>

</style>