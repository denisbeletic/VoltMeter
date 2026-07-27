<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useCounterStore } from "./stores/counter.js"
  const counterStore = useCounterStore();
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped>

</style>
