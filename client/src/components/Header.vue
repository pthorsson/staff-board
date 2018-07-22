<template>
  <div class="header grid-container">
    <h1 class="header__title">Staff Board</h1>
    <nav class="header__nav">
      <router-link :to="{ name: 'home' }">Board</router-link>
      <router-link :to="{ name: 'employees' }">Employees</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss">
  @import '@/assets/scss/_header.scss';
</style>
