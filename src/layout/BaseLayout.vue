<template>
  <div>
    <!-- 头部 -->
    <header class="navbar">
      <el-row>
        <!-- header logo -->
        <el-col :span="5">
          <!-- <router-link :to="{ name: 'dashboard' }"> -->
          <img @click="setCollapse" class="navbar-logo" src="../assets/img/melodylogo.png" alt />
          <span class="myhidden">Melody Configer</span>
          <!-- </router-link> -->
        </el-col>
        <!-- header mid -->
        <el-col class="navbar-list" :span="14">
          <div>
            <span @click="goto('https://granty1.github.io/melody-web/')">特性</span>
            <span @click="goto('https://github.com/granty1/melody/releases/tag/v1.0.0')">下载</span>
            <span @click="goto('https://granty1.github.io/melody-docs/')">功能文档</span>
          </div>
        </el-col>
        <!-- header right -->
        <el-col :span="5">
          <el-button
            @click="exportConfig"
            class="save_button"
            type="text"
            icon="el-icon-download"
            size="small"
          >
            <span>保存配置</span>
          </el-button>

          <el-button
            @click="clearCache"
            class="save_button"
            type="text"
            icon="el-icon-refresh"
            size="small"
          >
            <span>清除缓存</span>
          </el-button>
        </el-col>
      </el-row>
    </header>
    <!-- 主体部分 -->
    <router-view class="main" />
    <!-- 尾部 -->
    <div class="footer">MIT Licensed | Copyright © 2020 ❤️ Melody-Team</div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { Loading } from 'element-ui'
export default {
  name: 'BaseLayout',
  data() {
    return {
      isCollapse: this.$store.getters.isCollapse,
    }
  },
  methods: {
    goto(url) {
      window.location.href = url
    },
    exportConfig() {
      let config = this.$ls.get('config')
      if (config) {
        let loadingInstance = Loading.service({
          fullscreen: true,
          spinner: 'el-icon-loading',
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.8)',
        })
        let data = JSON.stringify(config, null, 4)
        let blob = new Blob([data], { type: '' })
        setTimeout(() => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
            FileSaver.saveAs(blob, 'melody.json')
          })
        }, 2500)
      }
    },
    clearCache() {
      this.$confirm('此操作将清除所有配置缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.commit('updateServiceConfig', { version: 1 })
          this.$ls.remove('logging')
          this.$ls.remove('safe')
          this.$router.push('/')

          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    setCollapse() {
      this.$store.commit('setIsCollapse', !this.isCollapse)
      this.isCollapse = this.$store.getters.isCollapse
    },
  },
}
</script>

<style scoped>
.navbar {
  height: 3rem;
  background-color: #fff;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  padding: 0.2rem 1rem 1rem;
  line-height: 2rem;
}

.navbar-logo {
  height: 2.2rem;
  min-width: 2.2rem;
  margin-right: 0.8rem;
  vertical-align: top;
  cursor: pointer;
}

a span {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.navbar-list span {
  margin-right: 1.3rem;
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;
}

.footer {
  padding: 2.5rem;
  border-top: 1px solid #eaecef;
  text-align: center;
  color: #4e6e8e;
}

.main {
  min-height: 700px;
}

.save_button {
  float: right;
  color: #2c3e50;
  font-weight: 200;
  margin-left: 1rem;
}

@media screen and (orientation: portrait) {
  .myhidden {
    display: none;
  }

  .navbar-list span {
    font-size: 0.8rem;
  }

  .save_button {
    color: #000;
    margin-left: 0.3rem;
    font-size: 20px;
    vertical-align: middle;
  }

  .save_button span {
    display: none;
  }
}
</style>
