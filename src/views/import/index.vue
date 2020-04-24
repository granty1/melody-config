<template>
  <div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <!-- 预览 -->
      <el-col :span="11" class="container">
        <el-card class="box-card item">
          <div slot="header" class="clearfix">
            <span>预览melody.json</span>
          </div>
          <json-viewer
            :value="melodyJSON"
            :expand-depth="2"
            theme="my-awesome-json-theme"
          ></json-viewer>
        </el-card>
      </el-col>
      <!-- 导入 -->
      <el-col :span="11" class="container">
        <el-card class="box-card item">
          <div slot="header" class="clearfix">
            <span>导入melody.json</span>
          </div>
          <div class="center">
            <el-upload
              drag
              :multiple="false"
              :show-file-list="false"
              :auto-upload="false"
              accept=".json"
              action=""
              :on-change="loadJsonFile"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EndpointConfig from '@/utils/config/EndpointConfig.js'
import Backend from '@/utils/config/Backend.js'
export default {
  name: 'Import',
  data() {
    return {
      melodyJSON: '',
    }
  },
  methods: {
    loadJsonFile(file) {
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = () => {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        if (this.$ls.get('config')) {
          this.$confirm('导入会覆盖已存在的配置，是否继续？').then(() => {
            this.melodyJSON = JSON.parse(reader.result)
            this.parseHostInJSON(this.melodyJSON)
            this.copyEndCfg(this.melodyJSON)
            this.$store.commit('updateServiceConfig', this.melodyJSON)
          })
        } else {
          this.melodyJSON = JSON.parse(reader.result)
          this.$store.commit('updateServiceConfig', this.melodyJSON)
        }
      }
    },
    copyEndCfg(melodyJSON) {
      let endCfg = melodyJSON.endpoints
      let endpointTemp = new EndpointConfig()
      let backendTemp = new Backend()
      for (let i in endCfg) {
        let endpoint = endCfg[i]
        this.setExtra(endpointTemp, endpoint)
        let backCfg = endpoint.backends
        for (let m in backCfg) {
          let backend = backCfg[m]
          this.setExtra(backendTemp, backend)
        }
      }
    },
    setExtra(endpointTemp, endpoint) {
      for (let j in endpointTemp) {
        if (j === 'extra_config') {
          if (endpoint['extra_config'] === undefined) {
            endpoint['extra_config'] = {}
          }
          for (let m in endpointTemp[j]) {
            let extra_config = endpointTemp[j][m]
            if (endpoint['extra_config'][m] === undefined) {
              endpoint['extra_config'][m] = extra_config
            }
          }
        } else {
          if (endpoint[j] === undefined) {
            endpoint[j] = endpointTemp[j]
          }
        }
      }
    },
    parseHostInJSON(melodyJSON) {
      let endCfg = melodyJSON.endpoints
      let sdHost = []
      for (let v in endCfg) {
        let endCfgitem = endCfg[v]
        for (let ev in endCfgitem) {
          if (ev === 'backends') {
            let backendcfgs = endCfgitem[ev]
            for (let bv in backendcfgs) {
              let backCfg = backendcfgs[bv]
              for (let hosti in backCfg.host) {
                let temp = ''
                if (backCfg.sd === undefined || backCfg.sd === '') {
                  temp = 'static - ' + backCfg.host[hosti]
                } else {
                  temp = backCfg.sd + ' - ' + backCfg.host[hosti]
                }
                if (sdHost.indexOf(temp) === -1) {
                  sdHost.push(temp)
                }
              }
            }
          }
        }
      }

      this.$store.commit('setAvailableHosts', sdHost)
    },
  },
  mounted() {
    if (this.$ls.get('config')) {
      this.melodyJSON = this.$ls.get('config')
    } else {
      this.melodyJSON = '暂无配置'
    }
  },
}
</script>

<style lang="scss">
.center {
  display: flex;
  justify-content: center;
  justify-items: center;
}
// values are default one from jv-light template
.my-awesome-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 16px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #111111;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
