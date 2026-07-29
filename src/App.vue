<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useCounterStore } from "./stores/counter.js"
  
  const counterStore = useCounterStore();
  
  import Header from './components/Header.vue';
</script>

<template>
  <Header></Header>
</template>

<style scoped>

</style>
