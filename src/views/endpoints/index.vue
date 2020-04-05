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
                <div class="fs12">
                  这是您的客户端将连接到的URI。必须以斜线开头。同时你也可以使用{parameters}的形式传递参数。
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
                <div class="fs12">
                  HTTP请求方法
                </div>
              </el-form-item>
              <el-form-item label="Output" style="float:left;margin-left:20px">
                <el-select v-model="curendpoint.output_encoding" placeholder="请选择">
                  <el-option
                    v-for="item in outputs"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <div class="fs12">
                  请求数据的编码格式
                </div>
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
                      >{{ item }}</el-tag
                    >
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
                      >{{ item }}</el-tag
                    >
                  </template>
                </div>
                <div style="font-size: 12px">
                  允许头文件从客户端传递到每个后端。这些标头不是附加的，而是设置后的替换。只有在需要自定义标头返回时才使用，但要确保声明所有需要的标头(包括Content-Type)。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="Concurrent Calls">
                <el-input
                  placeholder="输入并发数"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.concurrent_calls"
                ></el-input>
                <div class="fs12">
                  要发送到后端以处理相同请求的并行请求。最快的请求被接受，其余的被丢弃。这个值应该在1和3之间(如果后端能够支持非常高的负载，则更高)
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Custom combiner">
                <el-input
                  placeholder="combiner name"
                  suffix-icon="el-icon-edit"
                  v-model="melody_proxy.combiner"
                ></el-input>
                <div class="fs12">
                  如果您有一个自定义组合器，请在这里配置它，以便使用您的自定义配置修改代理管道(指定合并后端响应的组合器。)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <melody-card-item title="Timeout and Cache TTL">
          <div class="fs12">
            下面的所有设置都是在服务配置中定义的，在这里设置一个或多个值意味着仅覆盖此特定端点的设置。
            <br />Valid time units are: ns, us, (or µs), ms, s, m, h E.g: 1s
          </div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="timeout">
                <el-input
                  placeholder="timeout"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.timeout"
                ></el-input>
                <div class="fs12">
                  等待最慢响应的时间最长。通常以毫秒为单位。
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="cache_ttl">
                <el-input
                  placeholder="cache_ttl"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.cache_ttl"
                ></el-input>
                <div class="fs12">
                  代理可以将请求缓存到此端点的时间。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <melody-card-item title="Rate limit">
          <el-row>
            <el-col :span="24">
              <el-form-item label="API Rate limit"
                ><br />
                <el-switch @change="switchRateLimit" v-model="enableRateLimit"></el-switch>
                <span style="margin-left:20px"
                  >Enable rate limiting for {{ curendpoint.endpoint }}</span
                >
                <p>限制此端点可以接收的请求数量。</p>
                <template v-if="enableRateLimit">
                  <el-row>
                    <el-form-item label="Rate limit">
                      <el-input
                        placeholder="0"
                        suffix-icon="el-icon-edit"
                        v-model="melody_ratelimit_router.maxRate"
                      ></el-input>
                      <div class="fs12">
                        要让此端点处理的每秒最大请求。不设置缺省限制,则至少设置为0。
                      </div>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-switch v-model="enableClientRateLimit"></el-switch>
                      <span style="margin-left:20px">Enable client rate limiting</span>
                      <template v-if="enableClientRateLimit">
                        <el-row>
                          <el-form-item label="Client Rate limit">
                            <el-input
                              placeholder="0"
                              suffix-icon="el-icon-edit"
                              v-model="melody_ratelimit_router.clientMaxRate"
                            ></el-input>
                            <div class="fs12">
                              您希望允许每个不同API用户每秒的最大请求数。该值将作为所有端点的默认值使用，除非在每个端点中覆盖该值。使用0没有限制。
                            </div>
                          </el-form-item>
                          <el-radio
                            v-model="melody_ratelimit_router.strategy"
                            label="ip"
                            @change="setStrategyKey"
                            >根据IP识别客户端</el-radio
                          ><br />
                          <el-radio
                            v-model="melody_ratelimit_router.strategy"
                            label="header"
                            @change="setStrategyKey"
                            >根据Header识别客户端</el-radio
                          >
                          <template
                            v-if="
                              melody_ratelimit_router.strategy &&
                                melody_ratelimit_router.strategy === 'header'
                            "
                          >
                            <el-input
                              placeholder="key"
                              suffix-icon="el-icon-edit"
                              v-model="melody_ratelimit_router.key"
                            ></el-input>
                          </template>
                        </el-row>
                      </template>
                    </el-col>
                  </el-row>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <melody-card-item title="JWT validation">
          <el-row>
            开发中~
          </el-row>
        </melody-card-item>
        <melody-card-item title="JWT signing">
          <el-row>
            开发中~
          </el-row>
        </melody-card-item>
        <melody-card-item title="Backend API calls (where the data comes from)">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Backend API calls"
                ><br />
                <el-switch
                  v-model="melody_proxy.sequential"
                  @change="switchSequential"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
                <span style="margin-left:20px">启用 sequential proxy(顺序代理)</span>
                <div class="fs12">
                  当启用顺序代理时，后端调用可以使用前一次调用的数据。以前调用的数据在{resp0_XXXX}这样的变量中可用，其中0是后端索引，XXXX是属性。E。g:
                  {resp1_hotel_id}从第二个后端调用中获取字段hotel_id(索引从0开始)。将此变量注入所需的后端端点。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <melody-card-item title="Static Response">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Backend API calls">
                <br />
                <p>
                  当后端失败时，您仍然可以将下面提供的静态数据返回给用户。数据与任何现有的部分响应合并。如果您仍然没有后端，并且希望拥有这些数据，请添加一个无法解析的伪数据。
                </p>
                <el-row style="margin-top:20px"
                  ><el-col :span="4">
                    <el-form-item label="Strategy">
                      <el-select v-model="resstatic.Strategy" placeholder="请选择">
                        <el-option
                          v-for="item in StaticResponseS"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item> </el-col
                ></el-row>
                <el-row :gutter="20" style="margin-top:20px">
                  <el-col :span="12">
                    <el-form-item label="Response">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="resData"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
      </melody-card>
      <el-button type="primary" icon="el-icon-plus" @click="addBackendHandle"
        >Add backend query</el-button
      >
      <div v-if="curendpoint.backends" style="margin-top:20px">
        <template v-for="(backend, i) in curendpoint.backends">
          <el-card :key="i" style="margin-top:20px">
            <div slot="header">
              <span>{{ backend.url_pattern }}</span>
              <i
                class="el-icon-close"
                style="float: right; padding: 3px 4px; margin-left:10px; cursor:pointer"
                @click="delBackend(i)"
              ></i>
              <i
                class="el-icon-minus"
                style="float: right; padding: 3px 4px; margin-left:10px; cursor:pointer"
                @click="smallBackend(i)"
              ></i>
            </div>
            <div class="myhidden" :data-acback="i">
              <p class="fs12">availableHosts（可选的主机）</p>
              <el-row>
                <el-form-item label="">
                  <template>
                    <el-checkbox-group v-model="backend.host">
                      <el-checkbox
                        v-for="(j, index) in availableHosts"
                        :key="index"
                        :label="splitHost(j)"
                      ></el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <div class="fs12">所有的后端可以用来满足这个请求，平衡使用轮询。</div>
                </el-form-item> </el-row
              ><br />
              <el-row :gutter="24">
                <el-col :span="16">
                  <el-form-item label="Backend endpoint">
                    <el-input
                      placeholder="输入地址"
                      suffix-icon="el-icon-edit"
                      v-model="backend.url_pattern"
                    ></el-input>
                    <div class="fs12">
                      这是您要查询的后端服务器的端点。必须以斜线开头。同时你也可以使用{parameters}的形式传递参数。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="HTTP Verb" style="float:left">
                    <el-select v-model="backend.method" placeholder="请选择">
                      <el-option
                        v-for="item in methods"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                    <div class="fs12">
                      HTTP请求方法
                    </div>
                  </el-form-item>
                  <el-form-item label="encoding" style="float:left;margin-left:20px">
                    <el-select v-model="backend.encoding" placeholder="请选择">
                      <el-option
                        v-for="item in outputs"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                    <div class="fs12">
                      请求数据的编码格式
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="黑名单">
                    <el-input
                      clearable
                      placeholder="Blacklist"
                      @keyup.enter.native="addBackendBlacklist(backend)"
                      v-model="black"
                    >
                      <el-button slot="append" @click="addBackendBlacklist(backend)" type="primary"
                        >Add Blacklist</el-button
                      >
                    </el-input>
                    <div v-if="backend.blacklist">
                      <template v-for="(item, index) in backend.blacklist">
                        <el-tag
                          type="info"
                          :style="index == 0 ? {} : { 'margin-left': '10px' }"
                          :key="index"
                          closable
                          :disable-transitions="false"
                          @close="removeBackendBlacklist(backend, index)"
                          >{{ item }}</el-tag
                        >
                      </template>
                    </div>
                    <div style="font-size: 12px">
                      <p>您不会从响应中选择的属性。</p>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="白名单">
                    <el-input
                      clearable
                      placeholder="Whitelist"
                      @keyup.enter.native="addBackendWhitelist(backend)"
                      v-model="white"
                    >
                      <el-button slot="append" @click="addBackendWhitelist(backend)" type="primary"
                        >Add whitelist</el-button
                      >
                    </el-input>
                    <div v-if="backend.whitelist">
                      <template v-for="(item, index) in backend.whitelist">
                        <el-tag
                          type="info"
                          :style="index == 0 ? {} : { 'margin-left': '10px' }"
                          :key="index"
                          closable
                          :disable-transitions="false"
                          @close="removeBackendWhitelist(backend, index)"
                          >{{ item }}</el-tag
                        >
                      </template>
                    </div>
                    <div style="font-size: 12px">
                      您将从响应中选择的属性。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="16">
                  <el-form-item label="Capturing group">
                    <el-input
                      placeholder="my-group"
                      suffix-icon="el-icon-edit"
                      v-model="backend.group"
                    ></el-input>
                    <div class="fs12">
                      只有在希望捕获所有响应并将其封装在属性名中时才填充。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <p class="fs12">Renaming</p>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="">
                    <el-input
                      placeholder="Original object"
                      suffix-icon="el-icon-edit"
                      v-model="back.o"
                    ></el-input>
                    <div class="fs12">
                      Original object
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="">
                    <el-input
                      placeholder="Renamed object"
                      suffix-icon="el-icon-edit"
                      v-model="back.r"
                    ></el-input>
                    <div class="fs12">
                      Renamed object
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="">
                    <el-button type="primary" @click="addMapping(backend)">添加</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-if="backend.mapping">
                <template v-for="(item, index) in backend.mapping">
                  <el-tag
                    type="info"
                    :style="index == 0 ? {} : { 'margin-left': '10px' }"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="removeMapping(backend, index)"
                    >{{ index }} -> {{ item }}</el-tag
                  >
                </template>
              </div>
            </div>
          </el-card>
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
  mounted: function() {
    if (this.curendpoint['extra_config'] === undefined) {
      this.curendpoint['extra_config'] = {}
    }
    if (this.curendpoint['extra_config'] !== undefined) {
      if (this.melody_proxy !== undefined) {
        if (this.melody_proxy['static'] !== undefined) {
          this.resstatic = this.melody_proxy['static']
        }
      }
    }
  },
  data() {
    let serviceConfig = this.$store.getters.serviceConfig
    let cp = serviceConfig.endpoints[this.$route.params.url * 1]
    return {
      config: serviceConfig,
      endpoints: serviceConfig.endpoints,
      curendpoint: serviceConfig.endpoints[this.$route.params.url * 1],
      isEndpointsNone: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      outputs: ['JSON', 'Negotiate content', 'String(text/plain)', 'No-op'],
      StaticResponseS: ['Always', 'Success', 'Errored', 'Incomplete'],
      endCfg: {
        curParameter: '',
        curHeader: '',
      },
      textarea: '',
      enableRateLimit: false,
      enableClientRateLimit: false,
      enableStaticResponse: false,
      resstatic: {
        data: {},
        Strategy: '',
      },
      resData: '',
      melody_proxy:
        cp.extra_config.melody_proxy === undefined
          ? {
              sequential: false,
              static: {
                data: {},
                Strategy: '',
              },
            }
          : cp.extra_config.melody_proxy,
      melody_ratelimit_router:
        cp.extra_config.melody_ratelimit_router === undefined
          ? {
              maxRate: 0,
            }
          : cp.extra_config.melody_ratelimit_router,

      availableHosts: this.$store.getters.availableHosts,
      checkHosts: [],
      black: '',
      white: '',
      back: {
        o: '',
        r: '',
      },
    }
  },
  methods: {
    smallBackend(i) {
      var backArr = document.querySelectorAll('[data-acback]')
      backArr[i].classList.toggle('myhidden')
    },
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

    setExtraConfig(name, config) {
      this.curendpoint.extra_config[name] = config
    },
    removeExtraConfig(name) {
      delete this.curendpoint.extra_config[name]
    },
    switchRateLimit(enable) {
      if (enable) {
        this.curendpoint.extra_config['melody_ratelimit_router'] = JSON.parse(
          JSON.stringify(this.melody_ratelimit_router)
        )
      } else {
        delete this.curendpoint.extra_config['melody_ratelimit_router']
      }
    },
    switchSequential(enable) {
      if (this.melody_proxy.sequential !== undefined) {
        this.melody_proxy.sequential = enable
      }
    },
    switchStaticResponse(enable) {
      if (enable) {
        this.melody_proxy['static'] = JSON.parse(JSON.stringify(this.resstatic))
      } else {
        delete this.melody_proxy['static']
      }
    },
    setStrategyKey() {
      if (this.melody_ratelimit_router.strategy !== undefined) {
        if (
          this.melody_ratelimit_router['key'] !== undefined &&
          this.melody_ratelimit_router.strategy === 'ip'
        ) {
          delete this.melody_ratelimit_router['key']
        }
      }
    },
    addBackendWhitelist(backend) {
      if (backend != undefined) {
        if (this.white && backend.whitelist.indexOf(this.white) == -1) {
          backend.whitelist.push(this.white)
        }
      }
    },
    addBackendBlacklist(backend) {
      console.log(backend)
      if (backend != undefined) {
        if (this.black && backend.blacklist.indexOf(this.black) == -1) {
          backend.blacklist.push(this.black)
        }
      }
    },
    removeBackendWhitelist(backend, index) {
      backend.whitelist.splice(index, 1)
    },
    removeBackendBlacklist(backend, index) {
      backend.blacklist.splice(index, 1)
    },
    addMapping(backend) {
      backend.mapping[this.back.o] = this.back.r + ''
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    removeMapping(backend, index) {
      delete backend.mapping[index]
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    reSetcheckHosts(backend) {
      backend.host = this.checkHosts
    },
    splitHost(j) {
      let c = j.split(' - ')
      return c[1]
    },
    delBackend(i) {
      this.curendpoint.backends.splice(i, 1)
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
    resData: {
      handler: function() {
        if (this.melody_proxy.static.data !== undefined) {
          let obj = eval('(' + this.resData + ')')
          this.melody_proxy.static.data = obj
        }
      },
      deep: true,
    },
    resstatic: {
      handler: function() {
        if (this.melody_proxy !== undefined) {
          this.melody_proxy['static'] = JSON.parse(JSON.stringify(this.resstatic))
        }
      },
      deep: true,
    },
    melody_proxy: {
      handler: function() {
        this.curendpoint.extra_config['melody_proxy'] = JSON.parse(
          JSON.stringify(this.melody_proxy)
        )
      },
      deep: true,
    },
    melody_ratelimit_router: {
      handler: function() {
        this.curendpoint.extra_config['melody_ratelimit_router'] = JSON.parse(
          JSON.stringify(this.melody_ratelimit_router)
        )
      },
      deep: true,
    },
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
          if (this.curendpoint.extra_config['melody_proxy'] !== undefined) {
            this.melody_proxy = JSON.parse(
              JSON.stringify(this.curendpoint.extra_config['melody_proxy'])
            )
            if (this.melody_proxy['static'] != undefined) {
              this.resstatic = this.melody_proxy['static']
              this.resData = JSON.stringify(this.resstatic.data)
            }
            if (this.resstatic && this.resstatic != undefined) {
              if (this.resstatic['data'] || this.resstatic['Strategy']) {
                this.enableStaticResponse = true
              }
            }
            this.enableStaticResponse = false
          } else {
            this.melody_proxy = {
              sequential: false,
              static: {
                data: {},
                Strategy: '',
              },
            }
          }
          if (this.curendpoint.extra_config['melody_ratelimit_router'] !== undefined) {
            this.enableRateLimit = true
            this.melody_ratelimit_router = JSON.parse(
              JSON.stringify(this.curendpoint.extra_config['melody_ratelimit_router'])
            )
            if (this.melody_ratelimit_router['strategy'] !== undefined) {
              this.enableClientRateLimit = true
            } else {
              this.enableClientRateLimit = false
            }
          } else {
            this.enableRateLimit = false
            this.enableClientRateLimit = false
          }
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
.el-icon-close:hover {
  background-color: red;
  color: white;
}
.el-icon-minus:hover {
  background-color: #d8d6d6;
}
</style>
