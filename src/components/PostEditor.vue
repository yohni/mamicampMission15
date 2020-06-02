<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea 
        name 
        id 
        cols="30" 
        rows="10" 
        class="form-input" 
        @blur="$v.text.$touch()"
        v-model="text"></textarea>
      <template v-if="$v.text.$error">
        <span v-if="!$v.text.required" class="form-error">This field is required</span>
        <span v-else-if="!$v.text.minLength" class="form-error">Minimum 10 characters</span>
      </template>
    </div>
    <div class="form-actions">
      <button v-if="isUpdate" @click="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit post'}}</button>
    </div>
  </form>
</template>

<script>
import {mapActions} from 'vuex'
import {required, minLength} from 'vuelidate/lib/validators'
export default {
  props: {
    threadId: {
      required: false
    },
    post: {
      type: Object
    }
  },
  data () {
    return {
      text: this.post ? this.post.text : ''
    }
  },
  validations: {
    text: {
      required,
      minLength: minLength(10)
    }
  },
  computed: {
    isUpdate () {
      return !!this.post
    }
  },
  methods: {
    ...mapActions('posts', ['updatePost', 'createPost']),
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.persist()
        .then(post => {
          this.$emit('save', {post})
        })
    },
    create () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }
      this.text = ''
      return this.createPost(post)
    },
    update () {
      const payload = {
        id: this.post['.key'],
        text: this.text
      }
      return this.updatePost(payload)
    },
    persist () {
      return this.isUpdate ? this.update() : this.create()
    }
  }
}
</script>

<style>
</style>