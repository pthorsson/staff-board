<template>
  <div class="employees">
    <Header />
    <div class="grid-container">
      <span>innehåll på employees-sidan</span>
      <button v-on:click="getEmployees">Hämta</button>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'

export default {
  name: 'employees',
  data: function () {
    return {
      testdata: null
    }
  },
  methods: {
    getEmployees: function () {
      // TODO: fix so we get the employeelist
      return null
    }
  },
  created: function () {
    // when component is created we fetch the data needed to view employees
    this.getEmployees()
  },
  components: {
    Header
  }
}
</script>
