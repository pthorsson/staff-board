import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Employees from './views/Employees.vue'
import BoardDisplay from './views/BoardDisplay.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSocketio from 'vue-socket.io'

Vue.use(Router)
Vue.use(VueAxios, axios)
Vue.use(VueSocketio, '/')

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
    },
    {
      path: '/boarddisplay',
      name: 'boarddisplay',
      component: BoardDisplay
    }
  ]
})
