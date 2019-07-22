import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/Auth'
import Calendar from '@/components/Calendar'
import EditEvent from '@/components/EditEvent'
import EmployeeList from '@/components/EmployeeList'

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
    },
    {
      path: '/employees',
      name: 'EmployeeList',
      component: EmployeeList
    },
  ]
})
