import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/Auth'
import Calendar from '@/components/Calendar'
import EditEvent from '@/components/EditEvent'
import EmployeeList from '@/components/EmployeeList'
import Error404 from '@/components/Error404'

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
    {
      path: '*',
      name: 'Error404',
      component: Error404
    },
  ]
})
