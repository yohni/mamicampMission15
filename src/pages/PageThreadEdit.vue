<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Editing 
      <i>{{thread.title}}</i>
    </h1>

    <ThreadEditor
      :title="thread.title"
      :text="text"
      ref="editor"
      @save="save"
      @cancel="cancel" 
    />
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: {
    ThreadEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      saved: false
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },
    text () {
      const post = this.$store.state.posts[this.thread.firstPostId]
      return post ? post.text : null
    },
    hasUnsavedChanges () {
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
    }
  },
  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),
    save ({text, title}) {
      this.updateThread({
        id: this.id,
        title,
        text }).then(thread => {
        this.saved = true
        this.$router.push({name: 'ThreadShow', params: {id: this.id}})
      })
    },
    cancel () {
      this.$router.push({name: 'ThreadShow', params: {id: this.id}})
    }
  },
  created () {
    this.fetchThread({id: this.id})
      .then(thread => this.fetchPost({id: thread.firstPostId}))
      .then(() => { this.asyncDataStatus_fetched() })
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved change will be lost.')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style>
</style>