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
import defaultSetting from '@/config/defaultSetting'
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
    clrConfig(cfg) {
      if (cfg) {
        if (cfg.endpoints) {
          let cfgEnds = cfg.endpoints
          for (let i in cfgEnds) {
            let endpoint = cfgEnds[i]
            this.clearExtra(endpoint)
            for (let j in endpoint) {
              if (
                !endpoint[j] ||
                JSON.stringify(endpoint[j]) === '{}' ||
                endpoint[j].length === 0
              ) {
                delete endpoint[j]
              }
            }
            if (endpoint['backends']) {
              let backends = endpoint['backends']
              for (let b in backends) {
                let backend = backends[b]
                this.clearExtra(backend)
                for (let c in backend) {
                  if (
                    !backend[c] ||
                    JSON.stringify(backend[c]) === '{}' ||
                    backend[c].length === 0
                  ) {
                    delete backend[c]
                  }
                }
              }
            }
          }
        }
      }
    },
    clearExtra(cfg) {
      if (cfg.extra_config) {
        for (let i in cfg.extra_config) {
          if (cfg.extra_config[i]) {
            if (JSON.stringify(cfg.extra_config[i]) === '{}') {
              delete cfg.extra_config[i]
            } else {
              let f = false
              let extra = cfg.extra_config[i]
              for (let j in extra) {
                if (extra[j] !== '') {
                  f = true
                  break
                }
                if (extra[j] === true) {
                  f = true
                  break
                }
                if (typeof extra[j] == 'object' && JSON.stringify(extra[j]) !== '{}') {
                  f = true
                  break
                }
                if (extra[j].length >= 1) {
                  f = true
                  break
                }
              }
              if (!f) {
                delete cfg.extra_config[i]
              }
            }
          }
        }
      }
    },
    exportConfig() {
      let config = this.$ls.get('config')
      if (config) {
        this.clrConfig(config)
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
          this.$store.commit('updateServiceConfig', {})
          this.$ls.remove('logging')
          this.$ls.remove('safe')

          let config = this.$ls.get('config') === null ? {} : this.$ls.get('config')
          config.version = 1
          config.output_encoding =
            config.output_encoding == undefined ? 'json' : config.output_encoding
          config.disable_rest = config.disable_rest == undefined ? false : config.disable_rest
          config.extra_config = config.extra_config == undefined ? {} : config.extra_config
          this.$store.commit('updateServiceConfig', config)

          let activeCards =
            this.$ls.get('active_cards') === null
              ? defaultSetting.defaultActiveCards
              : this.$ls.get('active_cards')
          this.$store.commit('updateActiveCards', activeCards)

          let availableHosts = []
          this.$store.commit('setAvailableHosts', availableHosts)
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
