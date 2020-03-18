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
    this.$ls.set('config', config)
  },
}
</script>

<style>
#app {
  font-family: Comic Sans MS, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2c3e50;
}

a {
  text-decoration: none;
}

.item {
  margin-bottom: 18px;
}

.container {
  display: flex;
  flex-direction: column;
  /* font-family: Consolas, Menlo, Courier, monospace; */
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.row-bg {
  padding: 10px 0;
}

.box-card {
  width: 100%;
}

code {
  padding: 2px 4px;
  font-size: 90%;
  color: #2752a3;
  background-color: #f9f2f4;
  border-radius: 4px;
}

.pointer {
  cursor: pointer;
}
</style>
