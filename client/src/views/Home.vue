<template>
  <div class="home">
    <div>
      <Header />
      <div class="grid-container">
        <div class="board__addpost-wrapper">
          <button class="primary" v-on:click="toggleAddPost">Add post</button>
          <div class="board__addpost-dialog" v-show="addPostVisible">
            <label>Name *</label>
            <select v-model="newMessageSelectedEmployee" placeholder="Name">
              <option v-for="employee in employeeList" v-bind:key="employee.firstName" v-bind:value="employee.id">{{employee.firstName}} {{employee.lastName}}</option>
            </select>
            <label>Message text *</label>
            <textarea class="board__messagearea" v-model="newMessage" placeholder=""></textarea>
            <label>Expire date (YYYY-MM-DD) *</label>
            <input v-model="newMessageExpire" type="text" placeholder="YYYY-MM-DD">
            <div class="text-right">
              <button class="primary board__cancelbutton" v-on:click="hideAddPost">Cancel</button>
              <button class="primary" v-on:click="addPost">Save</button>
            </div>
          </div>
        </div>
        <table class="board__table">
          <tr>
            <th>Name</th>
            <th>Message and expire date</th>
          </tr>
          <tr v-for="employee in messageBatch" v-bind:key="employee.id">
            <td>{{employee.firstName}} {{employee.lastName}}</td>
            <td>
              <div class="">
                <div class="grid-x grid-margin-x" v-for="message in employee.messages" v-bind:key="message.id">
                  <div class="cell auto"><span>{{message.message}}</span></div>
                  <div class="cell shrink"><span>{{message.expiresAt}}</span></div>
                  <div class="cell shrink"><button class="board__table-messagebutton" v-on:click="removePost(message.id)"><i class="fa fa-trash"></i></button></div>
                  <div class="cell shrink"><button class="board__table-messagebutton" v-on:click="showEditDialog(message)"><i class="fa fa-pen"></i></button></div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div v-show="editDialogVisible" class="modal">
          <textarea v-model="editedMessageText" placeholder="Message text"></textarea>
          <input v-model="editedMessageExpire" type="text" placeholder="Expire date (YYYY-MM-DD)">
          <button class="primary" v-on:click="editPost">Save</button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
const baseURL = ''

export default {
  name: 'home',
  data: function () {
    return {
      employeeList: null,
      messageBatch: null,
      addPostVisible: false,
      newMessageSelectedEmployee: null,
      newMessage: null,
      newMessageExpire: null,
      editedMessageText: null,
      editedMessageExpire: null,
      editedMessageObject: null,
      editDialogVisible: false
    }
  },
  methods: {
    getEmployees: function () {
      const url = baseURL + '/api/employees'
      this.axios.get(url).then((response) => {
        this.employeeList = response.data
        console.log('Employees fetched')
      })
    },
    getBoard: function () {
      const url = baseURL + '/api/messages/batched'
      this.axios.get(url).then((response) => {
        this.messageBatch = response.data
        console.log('Messages fetched')
      })
    },
    toggleAddPost: function () {
      this.addPostVisible = !this.addPostVisible
    },
    hideAddPost: function () {
      this.addPostVisible = false
    },
    showEditDialog: function (message) {
      this.editDialogVisible = true
      this.editedMessageObject = message
      this.editedMessageText = message.message
      this.editedMessageExpire = message.expiresAt
    },
    addPost: function () {
      let regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
      const url = baseURL + '/api/message'
      if (this.newMessage && this.newMessageSelectedEmployee) {
        console.log('Preparing to add a new post')
        if (regex.test(this.newMessageExpire)) {
          console.log('Seems like we have an expire date that is valid')
          let data = {'employee': this.newMessageSelectedEmployee, 'message': this.newMessage, 'expiresAt': this.newMessageExpire}

          this.axios.post(url, data).then((response) => {
            console.log('Successfully added the post')
            this.getBoard()
          })
        } else {
          console.log('Either no expire date, or none valid, aborting')
        }
      } else {
        console.log('Message empty or no author of the message selected')
      }
    },
    removePost: function (messageID) {
      const url = baseURL + '/api/message/' + messageID
      if (messageID && confirm('Are you sure?')) {
        console.log('Attepting to remove: ' + messageID)
        this.axios.delete(url).then((response) => {
          console.log('Message removed successfully')
          this.getBoard()
        })
      }
    },
    editPost: function () {
      let message = this.editedMessageObject
      const url = baseURL + '/api/message/' + message.id
      if (this.editedMessageText && this.editedMessageExpire) {
        if (this.editedMessageText !== message.message || this.editedMessageExpire !== message.expiresAt) {
          let data = {'employee': message.employee, 'message': this.editedMessageText, 'expiresAt': this.editedMessageExpire}
          console.log('Message seems updated, proceeding with message edit')
          this.axios.put(url, data).then((response) => {
            console.log('Message successfully updated')
            this.getBoard()
            this.editDialogVisible = false
          })
        } else {
          console.log('Message is not updated')
        }
      } else {
        console.log('Edited message is empty')
      }
    }
  },
  created: function () {
    // when component is created we fetch the data needed to view the board
    this.getBoard()
    this.getEmployees()
  },
  components: {
    Header
  }
}
</script>
<style lang="scss">
  @import '@/assets/scss/_board.scss';
</style>
