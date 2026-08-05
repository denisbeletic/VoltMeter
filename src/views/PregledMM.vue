<script setup>
    // TODO: Napraviti pregled pojedinog mm-a, doraditi firebase
    import Header from '@/components/Header.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute()

</script>

<template>
    <Header></Header>
    <br>
    <br>
    <br>
    <h1 class="mx-2 my-2">{{ route.params.mm_uid }}</h1>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/unosocitanja`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na očitanja</RouterLink>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/urediuredaje`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na uređaje</RouterLink>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/pregledracuna`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na račune</RouterLink>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/analitika`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na analitiku</RouterLink>
</template>

<style scoped>

</style>
