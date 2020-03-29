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
    config.output_encoding = config.output_encoding == undefined ? 'json' : config.output_encoding
    config.disable_rest = config.disable_rest == undefined ? false : config.disable_rest
    config.extra_config = config.extra_config == undefined ? {} : config.extra_config
    this.$store.commit('updateServiceConfig', config)

    let activeCards =
      this.$ls.get('active_cards') === null
        ? defaultSetting.defaultActiveCards
        : this.$ls.get('active_cards')
    this.$store.commit('updateActiveCards', activeCards)

    let availableHosts =
      this.$ls.get('availableHosts') === null ? [] : this.$ls.get('availableHosts')
    this.$store.commit('setAvailableHosts', availableHosts)
  },
}
</script>

<style lang="scss">
@import './style/base.css';
@import './style/melody_eleme.css';
</style>
