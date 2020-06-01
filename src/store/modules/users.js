import Vue from 'vue'
import firebase from 'firebase'
import {countObjectProperties, removeEmptyProperties} from '@/utils'
import {makeAppendChildtoParentMutation} from '@/store/assetsHelper'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {
    userPosts: (state, getters, rootState) => id => {
      const user = state.items[id]
      if (user.posts) {
        return Object.values(rootState.posts.items)
          .filter(post => post.userId === user['.key'])
      } else {
        return []
      }
    },
    userThreadsCount: state => id => countObjectProperties(state.items[id].threads),
    userPostsCount: state => id => countObjectProperties(state.items[id].posts)
  },

  actions: {
    createUser ({state, commit}, {id, name, username, email, avatar = null}) {
      return new Promise((resolve, reject) => {
        const registerAt = Math.floor(Date.now() / 1000)
        const usernameLower = username.toLowerCase()
        email = email.toLowerCase()
        const user = {name, username, usernameLower, email, avatar, registerAt}
        firebase.database().ref('users').child(id).set(user)
          .then(() => {
            commit('setItem', {resource: 'users', id: id, item: user}, {root: true})
            resolve(state.items[id])
          })
      })
    },

    updateUser ({commit}, user) {
      const updates = {
        avatar: user.avatar,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        email: user.email,
        location: user.location
      }
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user['.key']).update(removeEmptyProperties(updates))
          .then(() => {
            commit('setUser', {userId: user['.key'], user})
            resolve(user)
          })
      })
    },

    fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id, emoji: '👻'}, {root: true}),

    fetchUsers ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'users', emoji: '🧠'}, {root: true})
    },

    registerUserWithEmailAndPassword ({dispatch}, {name, username, email, password, avatar = null}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          return dispatch('createUser', {id: user.user.uid, email, name, username, password, avatar})
        })
        .then(() => dispatch('auth/fetchAuthUser'))
    }
  },

  mutations: {
    setUser (state, {user, userId}) {
      Vue.set(state.items, userId, user)
    },

    appendPostToUser: makeAppendChildtoParentMutation({parent: 'users', child: 'posts'}),

    appendThreadToUser: makeAppendChildtoParentMutation({parent: 'users', child: 'threads'})
  }
}
