<script setup>
    import Header from '@/components/Header.vue';
    import { RouterLink, RouterView } from 'vue-router';
    import { useCounterStore } from '@/stores/counter';
  
    const counterStore = useCounterStore();
</script>

<template>
    <Header>
        <template #Slot1>
            <RouterLink to="/kreirajmm" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-1 px-2">+ Dodaj novo MM</RouterLink>
        </template>
    </Header>
</template>

<style scoped>

</style>
