<template>
  <div>
    <div class='col-large push-top'>
      <h1>{{thread.title}}</h1>
      <PostList :posts="posts" />
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import PostList from '@/components/PostList'
console.log(sourceData)
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      thread: sourceData.threads[this.id]
    }
  },
  components: {
    PostList
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(sourceData.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  }
}
</script>

<style>

</style>