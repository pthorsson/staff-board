<template>
  <div class="employees">
    <Header />
    <div class="grid-container">
      <div class="mt-20">
        <button class="primary" v-on:click="showEmployeeAdd">Add Employee</button>
        <div v-show="employeeAddIsVisible" class="mt-20">
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employeeList">
              <td>{{employee.firstName}}</td>
              <td>{{employee.lastName}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
const baseURL = 'http://lvh.me:9000'

export default {
  name: 'employees',
  data: function () {
    return {
      infoText: null,
      employeeList: null,
      fName: null,
      lName: null,
      employeeAddIsVisible: false
    }
  },
  methods: {
    getEmployees: function () {
      const url = baseURL + '/api/employees'
      this.axios.get(url).then((response) => {
        this.employeeList = response.data
        console.log("Employees collected")
      })
    },
    addEmployee: function () {
      const url = baseURL + '/api/employee'
      if (this.fName && this.lName) {
        console.log("Names check out, proceeding with save")
        const data = {'firstName': this.fName, 'lastName': this.lName}
        console.log(data)
        this.axios.post(url, data).then((response) => {
          this.infoText = "Saved Successfully"
        })
        this.employeeAddIsVisible = false
      } else {
        this.infoText = "Uh, fill out the name correctly please?!"
      }
    },
    showEmployeeAdd: function() {
      this.employeeAddIsVisible = true
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
