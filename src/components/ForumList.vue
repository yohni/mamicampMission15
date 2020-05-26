<template>
  <div>
    <ForumListItem 
      v-for="forum in forums" 
      :key="forum['.key']"
      :forum='forum' />

  </div>
</template>

<script>
import ForumListItem from './ForumLIstItem'
export default {
  components: {
    ForumListItem
  },
  props: {
    forums: {
      required: true,
      type: Array
    }
  }
}
</script>

<style>
</style>