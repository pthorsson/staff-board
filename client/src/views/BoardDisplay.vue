<template>
  <div class="home">
    <div>
        <div class="boarddisplay__container">
          <div class="boarddisplay__item" v-for="employee in messageBatch" v-bind:key="employee.id">
            <div class="boarddisplay__item-name">{{employee.firstName}} {{employee.lastName}}</div>
            <div class="boarddisplay__item-content">
              <ul>
                <li v-for="message in employee.messages" v-bind:key="message.id">
                  {{message.message}}
                </li>
              </ul>
            </div>
          </div>
        </div>
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
