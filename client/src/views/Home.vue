<template>
  <div class="home">
    <div>
      <Header />
      <div class="grid-container">
        <div class="mt-20">
          <button class="primary">Add post</button>
        </div>
        <table>
          <tr>
            <th>Namn</th>
            <th>Meddelande</th>
            <th>Ev. Datum</th>
            <th></th>
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
  data: function () {
    return {
      testdata: null
    }
  },
  methods: {
    getBoard: function () {
      // TODO: fix so we get the board
      return null
    }
  },
  created: function () {
    // when component is created we fetch the data needed to view the board
    this.getBoard()
  },
  components: {
    Header
  }
}
</script>
