<template>
  <div id="app">
    <router-view />
  </div>
</template>

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
  font-family: Consolas, Menlo, Courier, monospace;
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
</style>
