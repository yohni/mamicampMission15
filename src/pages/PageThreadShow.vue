<template>
  <div v-if="thread && user" class='col-large push-top'>
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
    <PostEditor :threadId="id" />
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import {countObjectProperties} from '@/utils'
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
  components: {
    PostList,
    PostEditor
  },
  computed: {
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
        this.fetchPosts({ids: Object.keys(thread.posts)})
          .then(posts => {
            posts.forEach(post => {
              // fetch user
              this.fetchUser({id: post.userId})
            })
          })
      })
  }
}
</script>

<style>

</style>