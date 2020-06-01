<template>
  <div v-if="asyncDataStatus_ready" class='col-large push-top'>
    <h1>{{thread.title}}</h1>
    <router-link 
      class="btn-green btn-small"
      :to="{name: 'ThreadEdit', params: this.id}"
      tag="button"
    >
      Edit Thread
    </router-link>
    <p>
      By <a href="#" class="link-unstyled">{{user.name}}</a>, <AppDate :timestamp='thread.publishedAt'/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{replyCount}} replies by {{contributorCount}} contributors</span>
    </p>
    <PostList :posts="posts" />
    <PostEditor 
      v-if="authUser"
      :threadId="id" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'Login', query: {redirectTo: $route.path}}" >Login</router-link> or 
      <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}" >Register</router-link> to post a reply
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import {countObjectProperties} from '@/utils'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      newPostText: ''
    }
  },
  mixins: [asyncDataStatus],
  components: {
    PostList,
    PostEditor
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser'
    }),
    thread () {
      return this.$store.state.threads[this.id]
    },
    user () {
      return this.$store.state.users[this.thread.userId]
    },
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts)
        .filter(post => postIds.includes(post['.key']))
    },
    replyCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
    },
    contributorCount () {
      return countObjectProperties(this.thread.contributors)
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts'])
  },
  created () {
    // fetch thread
    this.fetchThread({id: this.id})
      .then(thread => {
        // fetch user
        this.fetchUser({id: thread.userId})

        // fetch post
        return this.fetchPosts({ids: Object.keys(thread.posts)})
      })
      .then(posts => {
        return Promise.all(
          posts.map(post => {
          // fetch user
            this.fetchUser({id: post.userId})
          })
        )
      })
      .then(() => { this.asyncDataStatus_fetched() })
  }
}
</script>

<style>

</style>