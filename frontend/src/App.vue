<script setup>
  import Header from './components/Header.vue';
</script>

<template>
    <div class="app">
      <Header />
    </div>
    <RouterView />
</template>

<style scoped>
  .app {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }
</style>
