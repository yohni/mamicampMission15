<template>
  <div class="flex-grid">
    <UserProfileCard 
      v-if="!editProfile"
      :user="user" 
      :userThreadCount="userThreadCount" 
      :userPostCount="userPostCount" 
    />
    <UserProfileCardEditor
      v-else
      :user="user" 
      :userThreadCount="userThreadCount" 
      :userPostCount="userPostCount" 
    />
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{user.username}}'s recent activity</span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <PostList :posts="userPosts" />
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import {mapGetters} from 'vuex'
import {countObjectProperties} from '@/utils'
export default {
  props: {
    editProfile: {
      required: true,
      type: Boolean
    }
  },
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  computed: {
    ...mapGetters({
      user: 'authUser'
    }),
    userThreadCount () {
      return this.user.threads
        ? Object.keys(this.user.threads).length
        : 0
    },
    userPostCount () {
      return countObjectProperties(this.user.posts)
    },
    userPosts () {
      if (this.user.posts) {
        return Object.values(this.$store.state.posts)
          .filter(post => post.userId === this.user['.key'])
      }
      return []
    }
  }
}
</script>

<style>
</style>