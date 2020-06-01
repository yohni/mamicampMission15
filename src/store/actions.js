import firebase from 'firebase'
import {removeEmptyProperties} from '@/utils'

export default {
  createPost ({state, commit}, post) {
    const postId = firebase.database().ref('posts').push().key
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    firebase.database().ref().update(updates)
      .then(() => {
        commit('setItem', {resource: 'posts', item: post, id: postId})
        commit('appendPostToThread', {parentId: post.threadId, childId: postId})
        commit('appendContributorToThread', {parentId: post.threadId, childId: post.userId})
        commit('appendPostToUser', {parentId: post.userId, childId: postId})

        return Promise.resolve(state.posts[postId])
      })
  },

  createThread ({commit, state, dispatch}, {title, text, forumId}) {
    return new Promise((resolve, reject) => {
      const threadId = firebase.database().ref('threads').push().key
      const postId = firebase.database().ref('posts').push().key
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)

      const thread = {userId, publishedAt, title, forumId, firstPostId: postId, posts: {}}
      thread.posts[postId] = postId
      const post = {text, publishedAt, threadId, userId}

      const updates = {}
      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId

      updates[`posts/${postId}`] = post
      updates[`users/${userId}/posts/${postId}`] = postId
      firebase.database().ref().update(updates)
        .then(() => {
          commit('setItem', {resource: 'threads', id: threadId, item: thread})
          commit('appendThreadToForum', {childId: threadId, parentId: forumId})
          commit('appendThreadToUser', {childId: threadId, parentId: userId})

          commit('setItem', {resource: 'posts', item: post, id: postId})
          commit('appendPostToThread', {parentId: post.threadId, childId: postId})
          commit('appendPostToUser', {parentId: post.userId, childId: postId})

          resolve(state.threads[threadId])
        })
    })
  },

  initAuthentication ({dispatch, commit, state}) {
    return new Promise((resolve, reject) => {
      if (state.unsubscribeAuthObserver) {
        state.unsubscribeAuthObserver()
      }
      const unsubscibe = firebase.auth().onAuthStateChanged(user => {
        console.log('👣 the user has changed')
        if (user) {
          dispatch('fetchAuthUser')
            .then(dbUser => {
              resolve(dbUser)
            })
        } else {
          resolve(null)
        }
      })
      commit('setUnsubscribeAuthObserver', unsubscibe)
    })
  },

  registerUserWithEmailAndPassword ({dispatch}, {name, username, email, password, avatar = null}) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        return dispatch('createUser', {id: user.user.uid, email, name, username, password, avatar})
      })
      .then(() => dispatch('fetchAuthUser'))
  },

  signInWithEmailAndPassword (context, {email, password}) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },

  signInWithGoogle ({dispatch}) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
      .then(data => {
        const user = data.user
        firebase.database().ref('users').child(user.uid).once('value', snapshot => {
          if (!snapshot.exists()) {
            return dispatch('createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL})
              .then(() => dispatch('fetchAuthUser'))
          }
        })
      })
  },

  signOut ({commit}) {
    return firebase.auth().signOut()
      .then(() => {
        commit('setAuthId', null)
      })
  },

  createUser ({state, commit}, {id, name, username, email, avatar = null}) {
    return new Promise((resolve, reject) => {
      const registerAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {name, username, usernameLower, email, avatar, registerAt}
      firebase.database().ref('users').child(id).set(user)
        .then(() => {
          commit('setItem', {resource: 'users', id: id, item: user})
          resolve(state.users[id])
        })
    })
  },

  updatePost ({state, commit}, {id, text}) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id]
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = {text, edited}
      firebase.database().ref('posts').child(id).update(updates)
        .then(() => {
          commit('setPost', {
            postId: id,
            post: {...post, text, edited}
          })
          resolve(post)
        })
    })
  },

  updateThread ({state, commit, dispatch}, {title, text, id}) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id]
      const post = state.posts[thread.firstPostId]

      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }

      const updates = {}
      updates[`posts/${thread.firstPostId}/text`] = text
      updates[`posts/${thread.firstPostId}/edited`] = edited
      updates[`threads/${id}/title`] = title

      firebase.database().ref().update(updates)
        .then(() => {
          commit('setThread', {thread: {...thread, title}, threadId: id})
          commit('setPost', {postId: thread.firstPostId, post: {...post, text, edited}})
          resolve(post)
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

  fetchAuthUser ({dispatch, commit}) {
    const userId = firebase.auth().currentUser.uid
    return new Promise((resolve, reject) => {
      firebase.database().ref('users').child(userId).once('value', snapshot => {
        if (snapshot.exists()) {
          return dispatch('fetchUser', {id: userId})
            .then(user => {
              commit('setAuthId', userId)
              resolve(user)
            })
        } else {
          resolve(null)
        }
      })
    })
  },

  fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: '😱'}),

  fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id, emoji: '🤡'}),

  fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id, emoji: '🥶'}),

  fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id, emoji: '🥳'}),

  fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id, emoji: '👻'}),

  fetchItem ({state, commit}, {id, emoji, resource}) {
    console.log('🔥', emoji, id)
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(state[resource][id])
      })
    })
  },

  fetchCategories ({dispatch}, {ids}) {
    return dispatch('fetchItems', {ids, resource: 'categories', emoji: '🖐'})
  },

  fetchForums ({dispatch}, {ids}) {
    return dispatch('fetchItems', {ids, resource: 'forums', emoji: '👨‍👩‍👦‍👦'})
  },

  fetchThreads ({dispatch}, {ids}) {
    return dispatch('fetchItems', {ids, resource: 'threads', emoji: '👫'})
  },

  fetchPosts ({dispatch}, {ids}) {
    return dispatch('fetchItems', {ids, resource: 'posts', emoji: '🥳'})
  },

  fetchUsers ({dispatch}, {ids}) {
    return dispatch('fetchItems', {ids, resource: 'users', emoji: '🧠'})
  },

  fetchItems ({dispatch}, {ids, resource, emoji}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})))
  },

  fetchAllCategories ({commit, state}) {
    console.log('🔥', 'all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('setItem', {resource: 'categories', id: categoryId, item: category})
        })
        resolve(Object.values(state.categories))
      })
    })
  }

}
