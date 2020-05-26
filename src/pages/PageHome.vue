<template>
  <div class="col-full">
    <h2>Welcome to The category</h2>
    <CategoryList :categories='categories' />
  </div>
</template>

<script>
import CategoryList from '../components/CategoryList'
export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  }
}
</script>
