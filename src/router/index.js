import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Auth from '@/components/Auth'
import Calendar from '@/components/Calendar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    }
  ]
})
