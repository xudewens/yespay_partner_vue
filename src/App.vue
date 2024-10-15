
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      isMobile: false
    }
  },
  mounted() {
    const mediaQuery = window.matchMedia('(max-width: 800px)')
    this.isMobile = mediaQuery.matches
    this.$store.dispatch('app/updateIsMobile', mediaQuery.matches)

    console.log('%c [  ]-23', 'font-size:13px; background:pink; color:#bf2c9f;', this.$store)
    mediaQuery.addEventListener('change', this.handleMediaQueryChange)

    console.log('%c [  ]-21', 'font-size:13px; background:pink; color:#bf2c9f;', this.isMobile)
  },
  beforeDestroy() {
    const mediaQuery = window.matchMedia('(max-width: 800px)')
    mediaQuery.removeEventListener('change', this.handleMediaQueryChange)
  },
  methods: {

    handleMediaQueryChange(event) {
      this.isMobile = event.matches
      // 更新 Vuex 中的状态
      this.$store.dispatch('app/updateIsMobile', event.matches)
    }
  },
  provide() {
    return {
      isMobile: this.isMobile
    }
  }
}
</script>

<style scoped>
 ::v-deep .el-radio__label {
  font-size: 12px !important;
 }
 ::v-deep  .el-table {
  font-size: 12px !important;
 }
</style>
<style>
 tbody tr td{
  padding: 2px 0 !important;
 }
 .pagination {
  margin-top: 5px !important ;
 }
</style>

