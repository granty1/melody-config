<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { welcomeTitle, welcome } from './utils/util'
export default {
  mounted() {
    this.$notify({
      title: welcomeTitle(),
      message: welcome(),
      iconClass: 'el-icon-check',
      duration: 3000,
    })
    let config = this.$ls.get('config') === null ? {} : this.$ls.get('config')
    config.version = 1
    this.$store.commit('updateServiceConfig', config)

    let activeCards = this.$ls.get('active_cards') === null ? [] : this.$ls.get('active_cards')
    this.$store.commit('updateActiveCards', activeCards)
  },
}
</script>

<style lang="scss">
@import './style/base.css';
@import './style/melody_eleme.css';
</style>
