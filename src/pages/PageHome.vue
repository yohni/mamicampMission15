<template>
  <div v-if="this.asyncDataStatus_ready" class="col-full">
    <h2>Welcome to The category</h2>
    <CategoryList :categories='categories' />
  </div>
</template>

<script>
import CategoryList from '../components/CategoryList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {mapActions} from 'vuex'
export default {
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  computed: {
    categories () {
      return Object.values(this.$store.state.categories.items)
    }
  },
  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums'])
  },
  created () {
    this.fetchAllCategories()
      .then(categories => Promise.all(categories.map(category => this.fetchForums({ids: Object.keys(category.forums)}))))
      .then(() => {
        this.asyncDataStatus_fetched()
      })
  }
}
</script>
