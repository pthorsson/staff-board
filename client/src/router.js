import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Employees from './views/Employees.vue'
/*
import VueNativeSock from 'vue-native-websocket'
import axios from 'axios'
import VueAxios from 'vue-axios'
*/

Vue.use(Router)
/*
Vue.use(VueNativeSock, 'http://localhost:9000', {
  reconnection: false, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
  format: 'json'
})
Vue.use(VueAxios, axios)
*/

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
