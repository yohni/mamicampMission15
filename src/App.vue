<template>
  <div id="app">
    <TheNavBar />
    <div class="container push-top">
      <router-view/>
    </div>
  </div>
</template>

<script>
import TheNavBar from './components/TheNavBar'
export default {
  name: 'app',
  components: {
    TheNavBar
  }
}
</script>

<style>
@import './assets/css/style.css';
</style>
