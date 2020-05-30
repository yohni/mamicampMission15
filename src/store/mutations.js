import Vue from 'vue'

const makeAppendChildtoParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default {
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },
  setUser (state, {user, userId}) {
    Vue.set(state.users, userId, user)
  },
  setThread (state, {thread, threadId}) {
    Vue.set(state.threads, threadId, thread)
  },
  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },
  setAuthId (state, id) {
    state.authId = id
  },

  appendPostToThread: makeAppendChildtoParentMutation({parent: 'threads', child: 'posts'}),
  appendContributorToThread: makeAppendChildtoParentMutation({parent: 'threads', child: 'contributors'}),
  appendPostToUser: makeAppendChildtoParentMutation({parent: 'users', child: 'posts'}),
  appendThreadToForum: makeAppendChildtoParentMutation({parent: 'forums', child: 'threads'}),
  appendThreadToUser: makeAppendChildtoParentMutation({parent: 'users', child: 'threads'})
}
