<template>
  <div id="app">
    <div class="container">
      <navBar />
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
