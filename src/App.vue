<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { welcomeTitle, welcome } from './utils/util'
import defaultSetting from '@/config/defaultSetting'
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

    let activeCards =
      this.$ls.get('active_cards') === null
        ? defaultSetting.defaultActiveCards
        : this.$ls.get('active_cards')
    this.$store.commit('updateActiveCards', activeCards)

    let loggingConfig = this.$ls.get('logging') === null ? {} : this.$ls.get('logging')
    this.$store.dispatch('updateBaseLogger', { logging: loggingConfig, add: true })

    let addressList = this.$ls.get('addressList') === null ? [] : this.$ls.get('addressList')
    this.$store.commit('setAddressList', addressList)
  },
}
</script>

<style lang="scss">
@import './style/base.css';
@import './style/melody_eleme.css';
</style>
