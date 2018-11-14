<template>
  <div class="employees">
    <Header />
    <div class="grid-container">
      <div class="mt-20">
        <button class="primary" v-on:click="showEmployeeAdd">Add Employee</button>
        <div v-show="employeeAddVisible" class="mt-20">
          <input v-model="fName" type="text" placeholder="Firstname (required)">
          <input v-model="lName" type="text" placeholder="Lastname (required)">
          <button class="primary" v-on:click="addEmployee">Save</button>
          <span>{{infoText}}</span>
        </div>
        <table class="mt-20">
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employeeList" v-bind:key="employee.id">
              <td>{{employee.firstName}}</td>
              <td>{{employee.lastName}}</td>
              <td><button class="" v-on:click="showEditEmployee(employee)"><i class="fa fa-pen"></i></button></td>
              <td><button class="" v-on:click="removeEmployee(employee.id)"><i class="fa fa-trash"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-show="editDialogVisible" class="modal">
      <input v-model="editedFirstName" type="text" placeholder="Firstname (required)">
      <input v-model="editedLastName" type="text" placeholder="Lastname (required)">
      <button class="primary" v-on:click="editEmployee">Save</button>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
const baseURL = ''

export default {
  name: 'employees',
  data: function () {
    return {
      infoText: null,
      employeeList: null,
      fName: null,
      lName: null,
      employeeAddVisible: false,
      editedEmployee: null,
      editedFirstName: null,
      editedLastName: null,
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
    addEmployee: function () {
      const url = baseURL + '/api/employee'
      if (this.fName && this.lName) {
        console.log('Name checks out, proceeding with save')
        const data = {'firstName': this.fName, 'lastName': this.lName}
        this.axios.post(url, data).then((response) => {
          console.log('Saved successfully')
          this.getEmployees()
          this.employeeAddVisible = false
        })
      } else {
        console.log('Error fill in the name please')
      }
    },
    showEmployeeAdd: function () {
      this.employeeAddVisible = true
    },
    removeEmployee: function (employeeID) {
      const url = baseURL + '/api/employee/' + employeeID
      if (employeeID && confirm('Are you sure?')) {
        console.log('Attepting to remove: ' + employeeID)
        this.axios.delete(url).then((response) => {
          console.log('Employee removed successfully')
          this.getEmployees()
        })
      }
    },
    showEditEmployee: function (employee) {
      this.editDialogVisible = true
      this.editedEmployee = employee
      this.editedFirstName = employee.firstName
      this.editedLastName = employee.lastName
    },
    editEmployee: function () {
      let employee = this.editedEmployee
      const url = baseURL + '/api/employee/' + employee.id
      if (this.editedFirstName && this.editedLastName) {
        if (this.editedFirstName !== employee.firstName || this.editedLastName !== employee.lastName) {
          let data = {'firstName': this.editedFirstName, 'lastName': this.editedLastName}
          console.log('Name seems updated, proceeding with employee edit')
          this.axios.put(url, data).then((response) => {
            console.log('Employee successfully updated')
            this.getEmployees()
            this.editDialogVisible = false
          })
        } else {
          console.log('Edited name is not updated')
        }
      } else {
        console.log('Edited name is empty')
      }
    }
  },
  created: function () {
    this.getEmployees()
  },
  components: {
    Header
  }
}
</script>
