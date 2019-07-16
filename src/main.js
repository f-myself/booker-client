// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faUserSecret, faUser, faCalendarAlt)

Vue.use(BootstrapVue)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  
  let id = localStorage.getItem("id");
  let token = localStorage.getItem("token");
  let login = localStorage.getItem("login");

  if(id && token && login){
    to.meta.login = true
    next()
  }else{
    if(to.path != '/'){
      to.meta.login = false	
      next('/')
    }else{
      next()
    }
  }

  if (to.meta.login && to.path == '/'){
    next('/calendar/1')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
