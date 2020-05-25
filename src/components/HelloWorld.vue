<template>
  <div class="col-full">
    <h2>Welcome to The Forum</h2>
    <ThreadList :threads='threads' />
  </div>
</template>

<script>
import sourceData from '@/data'
import ThreadList from './ThreadList'

export default {
  name: 'HelloWorld',
  components: {
    ThreadList
  },
  data () {
    return {
      threads: Object.values(sourceData.threads),
      users: sourceData.users,
      posts: sourceData.posts
    }
  }
}
</script>
