<template>
  <div>
    <h1>Welcome to The Forum</h1>
  </div>
</template>

<script>
import sourceData from '@/data'

console.log(sourceData)
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
