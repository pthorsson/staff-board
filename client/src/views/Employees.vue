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
      msg: null
    }
  },
  methods: {
    getEmployees: function () {
      let ws = new WebSocket('ws://localhost:9000/api/employees', {
        format: 'json'
      })
      console.log(ws)
    }
  },
  components: {
    Header
  }
}
</script>
