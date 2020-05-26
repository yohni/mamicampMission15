<template>
  <span :title="timestamp | humanFriendlyDate" >{{timestamp | diffforHumans}}</span>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  filters: {
    humanFriendlyDate (date) {
      return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    diffforHumans (date) {
      return moment.unix(date).fromNow()
    }
  }
}
</script>

<style>

</style>