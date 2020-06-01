import firebase from 'firebase'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {},

  actions: {
    fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: '😱'}, {root: true}),

    fetchCategories ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'categories', emoji: '🖐'}, {root: true})
    },

    fetchAllCategories ({commit, state}) {
      console.log('🔥', 'all')
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            commit('setItem', {resource: 'categories', id: categoryId, item: category}, {root: true})
          })
          resolve(Object.values(state.items))
        })
      })
    }
  },

  mutations: {

  }
}
