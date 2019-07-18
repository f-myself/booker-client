import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Auth from '@/components/Auth'
import Calendar from '@/components/Calendar'
import EditEvent from '@/components/EditEvent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/calendar/:id',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/edit/:id',
      name: 'EditEvent',
      component: EditEvent
    }
  ]
})
