<template>
  <div>
    <el-form
      label-position="top"
      ref="config"
      :model="config"
      :rules="serviceConfigRules"
      status-icon
    >
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- 左侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <!-- Service Name -->
            <melody-card-item title="Service Name">
              <el-form-item label="Name">
                <el-input v-model="config.name" @input="save" placeholder="My Service"></el-input>
                <div class="fs12">
                  友好的名称，标题，日期，版本或任何其他简短描述，可帮助您在打开时识别JSON文件。
                </div>
              </el-form-item>
            </melody-card-item>
            <!-- Available hosts -->
            <melody-card-item title="Available hosts">
              <el-form-item>
                <div class="fs12">
                  在此处添加Melody用于检索数据的所有地址，以及是否由服务发现解决的地址：
                </div>
                <el-radio-group v-model="sdType" size="small">
                  <el-radio-button label="Static address resolution">
                    Static address resolution
                  </el-radio-button>
                  <el-radio-button label="Etcd" :disabled="etcdDisabled">
                    Etcd
                  </el-radio-button>
                  <el-radio-button label="DNS SRV">
                    DNS SRV
                  </el-radio-button>
                  <el-radio-button label="Custom service discovery">
                    Custom service discovery
                  </el-radio-button>
                </el-radio-group>
                <el-input
                  style="margin-top: 10px"
                  v-model="curAddress"
                  placeholder="address"
                  @change="saveAddress"
                >
                  <template slot="prepend">
                    <el-checkbox v-model="disableSanitize">disable sanitize</el-checkbox>
                  </template>
                </el-input>
                <div>
                  <el-tag
                    v-for="(address, index) in addressList"
                    :key="index"
                    closable
                    type="info"
                    :style="index == 0 ? {} : { 'margin-left': '10px' }"
                    @close="handleTagClose(address)"
                  >
                    {{ address }}
                  </el-tag>
                </div>
                <div class="fs12">
                  Melody连接到的地址。一些有效的示例:
                  <code>https://myapi</code>，<code>amqp://host</code>，
                  <code>192.0.2.1:25</code>，<code>my.service.tld</code>。
                </div>
                <div class="fs12">
                  当不需要为协议检查地址字符串时，请选择disable sanitize。
                </div>
              </el-form-item>
            </melody-card-item>
            <!-- Timeouts and TTL -->
            <melody-card-item title="Timeouts and TTL">
              <div class="sf12">
                除非在每个endpoint中明确覆盖，否则以下所有设置将在所有backend中使用
              </div>
              <!-- Backend Timeout -->
              <el-form-item label="Backend Timeout" prop="timeout">
                <el-input v-model="config.timeout" @input="save" placeholder="3000ms"></el-input>
                <div class="fs12">
                  与您的后端的所有连接的默认timeout，包括在整个管道中花费的时间。
                  以后可以在特定endpoint上覆盖此值。
                </div>
              </el-form-item>
              <!-- Default Cache TTL -->
              <el-form-item label="Default Cache TTL" prop="cache_ttl">
                <el-input v-model="config.cache_ttl" @input="save" placeholder="300s"></el-input>
                <div class="fs12">
                  仅适用于GET请求。该服务不会缓存任何内容，但会加快代理的headers进行缓存 (e.g., a
                  Varnish server)。
                </div>
              </el-form-item>
            </melody-card-item>
          </melody-card>

          <melody-card>
            <!-- Cross-origin resource sharing (CORS) -->
            <melody-card-item title="Cross-origin resource sharing (CORS)">
              <el-form-item>
                <el-switch v-model="openCORS" @change="swtichCORS"></el-switch>
              </el-form-item>
              <template v-if="openCORS">
                <el-form-item label="Allowed methods">
                  <el-checkbox-group
                    v-model="melody_cors.allow_methods"
                    size="small"
                    @change="changeCORS"
                  >
                    <el-checkbox label="GET" border></el-checkbox>
                    <el-checkbox label="POST" border></el-checkbox>
                    <el-checkbox label="HEAD" border></el-checkbox>
                    <el-checkbox label="PUT" border></el-checkbox>
                    <el-checkbox label="DELETE" border></el-checkbox>
                    <el-checkbox label="CONNECT" border></el-checkbox>
                    <el-checkbox label="OPTIONS" border></el-checkbox>
                    <el-checkbox label="TRACE" border></el-checkbox>
                    <el-checkbox label="PATCH" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </melody-card-item>
          </melody-card>
        </el-col>

        <!-- 右侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <!-- HTTP Server settings -->
            <melody-card-item title="HTTP Server settings">
              <!-- Port -->
              <el-form-item label="Port" prop="port">
                <el-input
                  @input="save"
                  v-model="config.port"
                  placeholder="8080"
                  autocomplete="off"
                ></el-input>
                <div class="fs12">
                  Melody用来监听连接的端口，默认为<code>8080</code>。
                  也可以在启动时使用标志<code>-p</code>指定该端口。
                </div>
              </el-form-item>
              <!-- Enable HTTPS -->
              <el-form-item label="Enable HTTPS">
                <el-switch @change="swtichEnableHTTPS" v-model="openEnableHTTPS"></el-switch>
              </el-form-item>
              <template v-if="openEnableHTTPS">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="11" class="container">
                    <!-- Public key -->
                    <el-form-item label="Public key">
                      <el-input
                        @input="save"
                        v-model="config.tls.public_key"
                        placeholder="/path/to/cert.pem"
                        autocomplete="off"
                      ></el-input>
                      <div class="fs12">
                        公钥的绝对路径或相对于当前工作目录的相对路径
                      </div>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11" class="container">
                    <!-- Private key -->
                    <el-form-item label="Private key">
                      <el-input
                        @input="save"
                        v-model="config.tls.private_key"
                        placeholder="/path/to/key.pem"
                        autocomplete="off"
                      ></el-input>
                      <div class="fs12">
                        私钥的绝对路径或相对于当前工作目录的相对路径
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="11" class="container">
                  <!-- HTTP Read Timeout -->
                  <el-form-item label="HTTP Read Timeout" prop="read_timeout">
                    <el-input
                      @input="save"
                      v-model="config.read_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      读取整个HTTP请求（包括正文）的最大持续时间。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="container">
                  <!-- HTTP Write Timeout -->
                  <el-form-item label="HTTP Write Timeout" prop="write_timeout">
                    <el-input
                      @input="save"
                      v-model="config.write_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      超时写入响应之前的最大持续时间
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="11" class="container">
                  <!-- HTTP Read Header Timeout -->
                  <el-form-item label="HTTP Read Header Timeout" prop="read_header_timeout">
                    <el-input
                      @input="save"
                      v-model="config.read_header_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      读取header花费的最长时间
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="container">
                  <!-- HTTP Idle Timeout -->
                  <el-form-item label="HTTP Idle Timeout" prop="idle_timeout">
                    <el-input
                      @input="save"
                      v-model="config.idle_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      启用Keepalive时等待下一个请求的最长时间
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </melody-card-item>
            <!-- Options -->
            <melody-card-item title="Options">
              <!-- Output encoding -->
              <el-form-item label="Output encoding">
                <el-select v-model="config.output_encoding" @change="save">
                  <el-option
                    v-for="item in output_encoding"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- Allow non-RESTful resource naming -->
              <el-form-item label="Allow non-RESTful resource naming">
                <el-switch @change="save" v-model="config.disable_rest"></el-switch>
              </el-form-item>
            </melody-card-item>
          </melody-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import MelodyCard from '@/components/MelodyCard'
import MelodyCardItem from '@/components/MelodyCardItem'
import { validTimeDuration, validNumber } from '@/utils/regxp'

export default {
  name: 'Service',
  mounted() {},
  data() {
    let validPort = (rule, value, callback) => {
      return validNumber(value, callback)
    }
    let validReadTimeout = (rule, value, callback) => {
      return validTimeDuration(value, callback)
    }

    let serviceConfig = this.$store.getters.serviceConfig
    return {
      config: serviceConfig,
      serviceConfigRules: {
        port: [{ validator: validPort, trigger: 'blur' }],
        read_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
        timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
        cache_ttl: [{ validator: validReadTimeout, trigger: 'blur' }],
        write_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
        idle_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
        read_header_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
      },
      sdType: 'Static address resolution',
      etcdDisabled: true,
      disableSanitize: false,
      addressList: this.$store.getters.addressList,
      curAddress: '',
      output_encoding: [
        { value: 'json', label: 'JSON' },
        { value: 'string', label: 'String(text/plain)' },
        { value: 'no-op', label: 'No-op(just proxy)' },
      ],
      openEnableHTTPS: serviceConfig.tls !== undefined,
      tls:
        serviceConfig.tls == undefined
          ? {
              public_key: '',
              private_key: '',
            }
          : serviceConfig.tls,
      openCORS: serviceConfig.extra_config.melody_cors !== undefined,
      melody_cors:
        serviceConfig.extra_config.melody_cors == undefined
          ? {
              allow_origins: ['*'],
              expose_headers: ['Content-Length'],
              max_age: '12h',
              allow_methods: ['GET'],
            }
          : serviceConfig.extra_config.melody_cors,
    }
  },
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  methods: {
    save() {
      this.$refs.config.validate().catch(err => {
        console.log(err)
      })
      this.$store.commit('updateServiceConfig', this.config)
      this.$store.commit('removeUselessPropsAtServiceConfigLevel')
    },
    saveAddress(value) {
      if (this.addressList.indexOf(this.sdType.split(' ')[0] + ' - ' + value) == -1) {
        this.addressList.push(this.sdType.split(' ')[0] + ' - ' + value)
        this.$store.commit('setAddressList', this.addressList)
        this.curAddress = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    handleTagClose(value) {
      this.addressList.splice(this.addressList.indexOf(value), 1)
      this.$store.commit('setAddressList', this.addressList)
    },
    swtichEnableHTTPS(enable) {
      if (enable) {
        this.config.tls = this.tls
      } else {
        delete this.config.tls
      }
      this.$store.commit('updateServiceConfig', this.config)
    },
    swtichCORS(enable) {
      if (enable) {
        this.$store.commit('addExtraConfig', { name: 'melody_cors', config: this.melody_cors })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_cors' })
      }
    },
    changeCORS() {
      this.$store.commit('addExtraConfig', { name: 'melody_cors', config: this.melody_cors })
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.config.validate(valid => {
      if (valid) {
        next()
      } else {
        this.$alert('填写正确的内容哟yoooooo', '发生错误啦', {
          confirmButtonText: '好滴',
        })
      }
    })
  },
}
</script>

<style lang="scss" scoped></style>
