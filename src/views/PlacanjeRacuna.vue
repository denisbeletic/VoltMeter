<script setup>
    import Header from '@/components/Header.vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute()
    const router = useRouter()
</script>

<template>
    <Header>
        <template #Slot1>
            <button @click="router.back()" class="bg-emerald-600 hover:bg-emerald-500 w-fit rounded-lg font-bold text-white py-1 px-3">Nazad</button>
        </template>
    </Header>
</template>

<style scoped>

</style>