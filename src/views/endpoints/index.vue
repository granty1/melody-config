<template>
  <div>
    <p v-bind:class="{ myhidden: !isEndpointsNone }">还没有endpoint哦！</p>
    <el-form v-bind:class="{ myhidden: isEndpointsNone }">
      <melody-card>
        <melody-card-item title="Endpoint Config">
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="Name">
                <el-input
                  placeholder="输入后端地址"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.endpoint"
                ></el-input>
                <div style="font-size: 12px">
                  <p>
                    这是您的客户端将连接到的URI。必须以斜线开头。同时你也可以使用{parameters}的形式传递参数。
                  </p>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Method" style="float:left">
                <el-select v-model="curendpoint.method" placeholder="请选择">
                  <el-option
                    v-for="item in methods"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <div style="font-size: 12px"><p>HTTP请求方法</p></div>
              </el-form-item>
              <el-form-item label="Output" style="float:left;margin-left:20px">
                <el-select v-model="curendpoint.output" placeholder="请选择">
                  <el-option
                    v-for="item in outputs"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <div style="font-size: 12px"><p>HTTP请求方法</p></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="Recognized query string parameters (?param=value)">
                <el-input
                  clearable
                  placeholder="parameter_name"
                  @keyup.enter.native="addParameterHandle"
                  v-model="endCfg.curParameter"
                >
                  <el-button slot="append" @click="addParameterHandle" type="primary"
                    >Add parameter</el-button
                  >
                </el-input>
                <div v-if="curendpoint.querystring_params">
                  <template v-for="(item, index) in curendpoint.querystring_params">
                    <el-tag
                      type="info"
                      :style="index == 0 ? {} : { 'margin-left': '10px' }"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      @close="removeParameterHandle(index)"
                    >
                      {{ item }}
                    </el-tag>
                  </template>
                </div>
                <div style="font-size: 12px">
                  <p>查询要传递到后端的字符串参数。只写参数的名称，没有问号或相等的符号。</p>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Headers passing to backend">
                <el-input
                  clearable
                  placeholder="header_name"
                  @keyup.enter.native="addHeaderHandle"
                  v-model="endCfg.curHeader"
                >
                  <el-button slot="append" @click="addHeaderHandle" type="primary"
                    >Add Header</el-button
                  >
                </el-input>
                <div v-if="curendpoint.headers_to_pass">
                  <template v-for="(item, index) in curendpoint.headers_to_pass">
                    <el-tag
                      type="info"
                      :style="index == 0 ? {} : { 'margin-left': '10px' }"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      @close="removeHeaderHandle(index)"
                    >
                      {{ item }}
                    </el-tag>
                  </template>
                </div>
                <div style="font-size: 12px">
                  允许头文件从客户端传递到每个后端。这些标头不是附加的，而是设置后的替换。只有在需要自定义标头返回时才使用，但要确保声明所有需要的标头(包括Content-Type)。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
      </melody-card>
      <el-button type="primary" icon="el-icon-plus" @click="addBackendHandle"
        >Add backend query</el-button
      >
      <el-button type="info" icon="el-icon-plus">Add static response</el-button>
      <div v-if="curendpoint.backends" style="margin-top:20px">
        <template v-for="(backend, index) in curendpoint.backends">
          <melody-card :key="index">
            <melody-card-item :title="backend.url_pattern">
              <el-form>
                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" circle></el-button>
              </el-form>
            </melody-card-item>
          </melody-card>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
import MelodyCard from '@/components/MelodyCard'
import MelodyCardItem from '@/components/MelodyCardItem'
import Backend from '@/utils/config/Backend.js'
export default {
  name: 'endpoint',
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  data() {
    let serviceConfig = this.$store.getters.serviceConfig

    return {
      config: serviceConfig,
      endpoints: serviceConfig.endpoints,
      curendpoint: serviceConfig.endpoints[this.$route.params.url * 1],
      isEndpointsNone: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      outputs: ['JSON', 'Negotiate content', 'String(text/plain)', 'No-op'],
      endCfg: {
        curParameter: '',
        curHeader: '',
      },
    }
  },
  methods: {
    addParameterHandle() {
      if (this.curendpoint['querystring_params'] === undefined) {
        this.curendpoint['querystring_params'] = []
      }

      if (
        this.endCfg.curParameter &&
        this.curendpoint['querystring_params'].indexOf(this.endCfg.curParameter) == -1
      ) {
        this.curendpoint['querystring_params'].push(this.endCfg.curParameter)
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeParameterHandle(index) {
      this.curendpoint['querystring_params'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addHeaderHandle() {
      if (this.curendpoint['headers_to_pass'] === undefined) {
        this.curendpoint['headers_to_pass'] = []
      }

      if (
        this.endCfg.curHeader &&
        this.curendpoint['headers_to_pass'].indexOf(this.endCfg.curHeader) == -1
      ) {
        this.curendpoint['headers_to_pass'].push(this.endCfg.curHeader)
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeHeaderHandle(index) {
      this.curendpoint['headers_to_pass'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addBackendHandle() {
      let backend = new Backend()
      this.curendpoint.backends.push(backend)
    },
    clearCacheHandle() {
      this.endCfg.curParameter = ''
      this.endCfg.curHeader = ''
      this.curendpoint.headers_to_pass = []
      this.curendpoint.querystring_params = []
    },
  },
  computed: {
    urlParam() {
      return this.$route.params.url
    },
    serviceCfg() {
      return this.$store.getters.serviceConfig
    },
  },
  watch: {
    serviceCfg: {
      handler: function(newVal) {
        if (newVal.endpoints === [] || newVal.endpoints === undefined) {
          this.clearCacheHandle()
          this.isEndpointsNone = true
          this.$router.push('/')
        } else {
          this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
          this.isEndpointsNone = false
        }
      },
      deep: true,
    },
    urlParam: {
      handler: function(newVal) {
        if (newVal != undefined) {
          this.curendpoint = this.endpoints[newVal * 1]
        }
      },
      deep: true,
    },
    curendpoint: {
      handler: function() {
        this.config = this.$store.getters.serviceConfig
        this.endpoints = this.config.endpoints || []
        this.curendpoint = this.endpoints[this.$route.params.url * 1]
        this.$store.commit('updateServiceConfig', this.config)
      },
      deep: true,
    },
    config: {
      handler: function() {
        this.$store.commit('updateServiceConfig', this.config)
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.myhidden {
  display: none;
}
</style>
