<template>
  <div id="app">
    <div class="container">
      <navBar v-if="login" />
      <router-view></router-view>
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
      login: false
    }
  },
  methods: {
    loginChange: function(){
      console.log("inited");
        this.login = true;
    }
  },
  created: function() {
    this.$on("logSuc", function() {
      console.log("it's worked!");
    })
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
