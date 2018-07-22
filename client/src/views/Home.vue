<template>
  <div class="home">
    <div>
      <Header />
      <div class="grid-container">
        <table>
          <tr>
            <th>Namn</th>
            <th>Meddelande</th>
            <th>Ev. Datum</th>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'

export default {
  name: 'home',
  components: {
    Header
  }
}
</script>
