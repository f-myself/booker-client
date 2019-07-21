<template>
  <div id="app">
    <div class="container">
      <navBar @changeRoom="roomHandler" v-if="login" />
      <router-view :room="selectedRoom" @logSuc="loginChange()"></router-view>
    </div>
  </div>
</template>

<script>
import navBar from './components/navBar'

export default {
  name: 'app',
  components: {
    navBar
  },
  data: () => {
    return {
      login: false,
      selectedRoom: "1"
    }
  },
  methods: {
    loginChange: function(){
        this.login = true;
    },
    roomHandler: function(room) {
      this.selectedRoom = room;
    }
  },
  created: function() {
    if (localStorage.getItem("id")){
      this.login = true;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
