import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Employees from './views/Employees.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Router)
Vue.use(VueAxios, axios)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/employees',
      name: 'employees',
      component: Employees
    }
  ]
})
