<template>
  <div class="home">
    <div>
      <div class="grid-container">
        <table class="mt-20">
          <tr>
            <th>Name</th>
            <th>Message and expire date</th>
          </tr>
          <tr v-for="employee in messageBatch" v-bind:key="employee.id">
            <td>{{employee.firstName}} {{employee.lastName}}</td>
            <td>
              <ul>
                <li v-for="message in employee.messages" v-bind:key="message.id">
                  {{message.message}} - Expires: {{message.expiresAt}}
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const baseURL = 'http://localhost:9000'

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
