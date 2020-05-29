<template>
  <div v-if="forum" class="forum-wrapper">
    <div class="col-full push-top">

      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link
           class="btn-green btn-small" 
          :to="{name: 'ThreadCreate', params: {forumId: forum['.key']}}"
        >Start a thread</router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads='threads' />
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import ThreadList from '@/components/ThreadList'
export default {
  components: {
    ThreadList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums[this.id]
    },

    threads () {
      const temp = Object.values(this.$store.state.threads)
        .filter(thread => thread.forumId === this.id)
      return temp
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUser'])
  },
  created () {
    this.fetchForum({id: this.id})
      .then(forum => {
        this.fetchThreads({ids: forum.threads})
          .then(threads => {
            threads.forEach(thread => this.fetchUser({id: thread.userId}))
          })
      })
  }
}
</script>

<style scoped>
.forum-wrapper{
  width: 100%;
}
</style>