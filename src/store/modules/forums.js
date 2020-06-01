import {makeAppendChildtoParentMutation} from '@/store/assetsHelper'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {},

  actions: {
    fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id, emoji: '🤡'}, {root: true}),

    fetchForums ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'forums', emoji: '👨‍👩‍👦‍👦'}, {root: true})
    }
  },

  mutations: {
    appendThreadToForum: makeAppendChildtoParentMutation({parent: 'forums', child: 'threads'})
  }
}
