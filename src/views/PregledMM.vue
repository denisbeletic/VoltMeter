<script setup>
    import Header from '@/components/Header.vue';

    defineProps(['mm_uid'])
</script>

<template>
    <Header></Header>
    <br>
    <br>
    <br>
    <h1 class="mx-2 my-2">{{ mm_uid }}</h1>
</template>

<style scoped>

</style>
