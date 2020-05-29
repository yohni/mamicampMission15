<template>
  <div class="col-full">
    <h2>Welcome to The category</h2>
    <CategoryList :categories='categories' />
  </div>
</template>

<script>
import CategoryList from '../components/CategoryList'
import {mapActions} from 'vuex'
export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  created () {
    this.fetchAllCategories()
      .then(categories => {
        categories.forEach(category => this.fetchForums({ids: Object.keys(category.forums)}))
      })
  }
}
</script>
