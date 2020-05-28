import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'
import {countObjectProperties} from '@/utils'

Vue.use(Vuex)

const makeAppendChildtoParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },

  getters: {
    authUser (state) {
      return state.users[state.authId]
    },
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },

  actions: {
    createPost ({state, commit}, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', {post, postId})
      commit('appendPostToThread', {parentId: post.threadId, childId: postId})
      commit('appendPostToUser', {parentId: post.userId, childId: postId})

      return Promise.resolve(state.posts[postId])
    },
    createUser ({commit}, user) {
      commit('setUser', {userId: user['.key'], user})
    },
    createThread ({commit, state, dispatch}, {title, text, forumId}) {
      return new Promise((resolve, reject) => {
        const threadId = 'greatThread' + Math.random()
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = {'.key': threadId, userId, publishedAt, title, forumId}
        commit('setThread', {threadId, thread})
        commit('appendThreadToForum', {childId: threadId, parentId: forumId})
        commit('appendThreadToUser', {childId: threadId, parentId: userId})

        dispatch('createPost', {text, threadId})
          .then(post => {
            commit('setThread', {threadId, thread: {...thread, firstPostId: post['.key']}})
          })

        resolve(state.threads[threadId])
      })
    },

    updatePost ({state, commit}, {id, text}) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id]
        commit('setPost', {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId
            }
          }
        })
        resolve(post)
      })
    },

    updateThread ({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]

        const newThread = {...thread, title}
        commit('setThread', {thread: newThread, threadId: id})
        dispatch('updatePost', {id: thread.firstPostId, text})
          .then(() => {
            resolve(newThread)
          })
      })
    }
  },

  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },
    setUser (state, {user, userId}) {
      Vue.set(state.users, userId, user)
    },
    setThread (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },
    appendPostToThread: makeAppendChildtoParentMutation({parent: 'threads', child: 'posts'}),
    appendPostToUser: makeAppendChildtoParentMutation({parent: 'users', child: 'posts'}),
    appendThreadToForum: makeAppendChildtoParentMutation({parent: 'forums', child: 'threads'}),
    appendThreadToUser: makeAppendChildtoParentMutation({parent: 'users', child: 'threads'})
  }
})
