<template>
  <div class="forum-listing">
    <div class="forum-details">
      <router-link 
        :to="{name: 'Forum', params: {id: forum['.key']}}"
        class="text-xlarge"
      >
        {{forum.name}}
      </router-link>
      <p>{{forum.description}}</p>
    </div>

    <div class="threads-count">
      <p>
        <span class="count">{{threadCount}}</span> 
        {{threadCount === 1 ? 'thread' : 'threads'}}
      </p>
    </div>

    <!-- <div class="last-thread">
    </div> -->
  </div>
</template>

<script>
import {countObjectProperties} from '@/utils'
export default {
  props: {
    forum: {
      required: true,
      type: Object
    }
  },
  computed: {
    threadCount () {
      return countObjectProperties(this.forum.threads)
    }
  }
}
</script>

<style>
</style>