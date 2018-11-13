<template>
  <div class="home">
    <div>
        <table class="mt-20">
          <tr v-for="employee in messageBatch" v-bind:key="employee.id">
            <td>{{employee.firstName}} {{employee.lastName}}</td>
            <td>
              <ul class="boarddisplay__messagelist">
                <li v-for="message in employee.messages" v-bind:key="message.id">
                  {{message.message}}
                </li>
              </ul>
            </td>
          </tr>
        </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'boardDisplay',
  data: function () {
    return {
      messageBatch: null,
      socketConnected: false
    }
  },
  sockets: {
    connect (data) {
      this.socketConnected = true
      this.messageBatch = data
      console.log('socket connected')
    },
    disconnect () {
      this.socketConnected = false
      console.log('socket disconnected')
    },
    state (data) {
      this.messageBatch = data
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/scss/_boarddisplay.scss';
</style>
