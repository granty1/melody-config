<template>
  <div>
    <el-form label-position="top" ref="config" :model="config" :rules="loggingRules" status-icon>
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- 左侧 -->
        <el-col :span="11" class="container">
          <!-- Base Logging -->
          <melody-card>
            <melody-card-item title="Logging">
              <el-form-item label="base logger">
                <el-switch @change="switchGologging" v-model="enableGologging"></el-switch>
                <div style="font-size: 12px">
                  Melody提供了比较完善的基础logger。
                </div>
              </el-form-item>
              <template v-if="enableGologging">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="11">
                    <!-- Level -->
                    <el-form-item label="Level">
                      <el-select v-model="melody_gologging.level" placeholder="选择log级别">
                        <el-option
                          v-for="item in logLevels"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                      <div style="font-size: 12px">
                        日志打印的级别。
                      </div>
                    </el-form-item>
                  </el-col>
                  <!-- Prefix -->
                  <el-col :span="11" :offset="2">
                    <el-form-item label="Prefix">
                      <el-input v-model="melody_gologging.prefix"></el-input>
                      <div style="font-size: 12px">
                        在日志行之前添加字符串前缀。
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-around">
                  <!-- Message Format -->
                  <el-col :span="enableCustomFormat ? 11 : 24">
                    <el-form-item label="Message Format">
                      <el-select v-model="melody_gologging.format" placeholder="选择日志格式">
                        <el-option v-for="item in formats" :key="item" :label="item" :value="item">
                        </el-option>
                      </el-select>
                      <div style="font-size: 12px">
                        日志记录、打印的格式。
                      </div>
                    </el-form-item>
                  </el-col>
                  <!-- Custom Format -->
                  <el-col v-if="enableCustomFormat" :span="11" :offset="2">
                    <el-form-item label="Custom log format">
                      <el-input
                        v-model="melody_gologging.custom"
                        placeholder="%{message}"
                      ></el-input>
                      <div style="font-size: 12px">
                        可以使用一些表达式，更多表达式请参考<a
                          target="blank"
                          href="https://github.com/op/go-logging/blob/master/format.go#L156"
                          >go-logging</a
                        >
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- Log Example -->
                <el-row v-if="melody_gologging.format != 'custom'">
                  <el-col :span="24">
                    示例：<code>{{ exampleLog }}</code>
                  </el-col>
                </el-row>
                <!-- Log stash -->
                <el-form-item label="LogStash">
                  <el-switch @change="switchLogStash" v-model="enableLogStash">Enable</el-switch>
                  <div style="font-size: 12px">选择开启是否<code>LogStash</code></div>
                </el-form-item>
                <!-- Writers -->
                <el-form-item label="Writers">
                  <el-checkbox v-model="melody_gologging.syslog">Syslog</el-checkbox>
                  <el-checkbox v-model="melody_gologging.stdout">Stdout</el-checkbox>
                  <div style="font-size: 12px">
                    <code>Syslog</code>将日志写入syslog系统。 <code>Stdout</code>将日志写入控制台。
                  </div>
                </el-form-item>
              </template>
            </melody-card-item>
          </melody-card>
          <!-- Metrics -->
          <melody-card>
            <!-- Metrics -->
            <melody-card-item title="Metrics">
              <!-- metrics enable switch -->
              <el-form-item label="metrics integrate">
                <el-switch @change="switchMetrics" v-model="enableMetrics"></el-switch>
                <div style="font-size: 12px">
                  metrics中间件收集整个melody的运行时数据，监听一个新端口，暴露<code>/__stats/</code>接口。
                </div>
              </el-form-item>

              <template v-if="enableMetrics">
                <!-- metrics config -->
                <el-form-item label="Config">
                  <!-- Disable /__stats/ -->
                  <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="11">
                      <el-checkbox
                        v-model="melody_metrics.endpoint_disabled"
                        label="Disable '/__stats/'"
                      ></el-checkbox>
                    </el-col>
                    <el-col :span="11">
                      <div style="font-size: 12px">
                        metrics将不会暴露<code>/__stats/</code>接口，但是仍然会收集数据。
                      </div>
                    </el-col>
                  </el-row>
                  <!-- Disable proxy -->
                  <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="11">
                      <el-checkbox
                        v-model="melody_metrics.proxy_disabled"
                        label="Disable proxy"
                      ></el-checkbox>
                    </el-col>
                    <el-col :span="11">
                      <div style="font-size: 12px">
                        metrics将跳过代理层中的数据收集。
                      </div>
                    </el-col>
                  </el-row>

                  <!-- Disable router -->
                  <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="11">
                      <el-checkbox
                        v-model="melody_metrics.router_disabled"
                        label="Disable router"
                      ></el-checkbox>
                    </el-col>
                    <el-col :span="11">
                      <div style="font-size: 12px">
                        metrics将跳过路由层中的数据收集。
                      </div>
                    </el-col>
                  </el-row>

                  <!-- Disable backends -->
                  <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="11">
                      <el-checkbox
                        v-model="melody_metrics.backend_disabled"
                        label="Disable backend layer metrics"
                      ></el-checkbox>
                    </el-col>
                    <el-col :span="11">
                      <div style="font-size: 12px">
                        与后端交互时，metrics将不会收集任何数据。
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-row type="flex" class="row-bg" justify="space-around">
                  <!-- Listen address -->
                  <el-col :span="11">
                    <el-form-item label="Listen Address">
                      <el-input
                        placeholder=":8090"
                        v-model="melody_metrics.listen_address"
                      ></el-input>
                      <div style="font-size: 12px">
                        你可以通过<code>{{ melody_metrics.listen_address }}/__stats/</code
                        >访问到metrics收集到的所有数据。
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      label="Collection time"
                      prop="extra_config.melody_metrics.collection_time"
                    >
                      <el-input
                        placeholder="60s"
                        v-model="melody_metrics.collection_time"
                        autocomplete="off"
                      ></el-input>
                      <div style="font-size: 12px">
                        收集的时间窗口。默认为60秒。
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </melody-card-item>
          </melody-card>
          <!-- Opencensus -->
          <melody-card>
            <melody-card-item title="Opencensus">
              <div>集成中~~</div>
            </melody-card-item>
          </melody-card>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="11" class="container">
          <!-- Gelf -->
          <melody-card>
            <melody-card-item title="Gelf">
              <el-form-item label="gelf integrate">
                <el-switch @change="switchGelf" v-model="enableGelf"></el-switch>
                <div style="font-size: 12px">
                  Melody与gelf集成，你可以设置Graylog服务的地址来作为输出。
                </div>
              </el-form-item>
              <template v-if="enableGelf">
                <el-form-item label="Address">
                  <el-input v-model="melody_gelf.addr" placeholder="gelf_server:12201"></el-input>
                  <div style="font-size: 12px">
                    Graylog服务器（或任何接收gelf输入的服务）的地址（包括端口）。
                  </div>
                </el-form-item>
                <el-form-item label="Enable TCP">
                  <el-switch v-model="melody_gelf.enable_tcp"></el-switch>
                  <div style="font-size: 12px">
                    默认情况下使用UDP，但您可以通过将此选项设置为true来启用TCP（不推荐，您的性能可能会受到影响）。
                  </div>
                </el-form-item>
              </template>
            </melody-card-item>
          </melody-card>
          <!-- InfluxDB -->
          <melody-card>
            <melody-card-item title="InfluxDB">
              <el-form-item label="write to influxDB">
                <el-switch @change="switchInfluxDB" v-model="enableInflux"></el-switch>
                <div style="font-size: 12px">
                  允许你将<code>Metrics</code>采集到的数据写到<code>InfluxDB</code>中，以供Melody-Data去做数据分析。
                </div>
              </el-form-item>
              <template v-if="enableInflux">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="11">
                    <el-form-item label="Address" prop="extra_config.melody_influxdb.address">
                      <el-input
                        v-model="melody_influxdb.address"
                        placeholder="influx server address"
                      ></el-input>
                      <div style="font-size: 12px">
                        <code>InfluxDB</code>地址及端口号，请注意务必以<code>http://</code>开头
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="3">
                    <el-form-item label="Database">
                      <el-input v-model="melody_influxdb.db" placeholder="database name"></el-input>
                      <div style="font-size: 12px">
                        指定数据库名，默认使用<code>melody_data</code>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="11">
                    <el-form-item label="Username">
                      <el-input
                        v-model="melody_influxdb.username"
                        placeholder="username"
                      ></el-input>
                      <div style="font-size: 12px">
                        访问<code>InfluxDB</code>的用户名
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="3">
                    <el-form-item label="Password">
                      <el-input
                        v-model="melody_influxdb.password"
                        placeholder="password"
                      ></el-input>
                      <div style="font-size: 12px">
                        访问<code>InfluxDB</code>的密码
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="11">
                    <el-form-item label="TTL" prop="extra_config.melody_influxdb.ttl">
                      <el-input v-model="melody_influxdb.ttl" placeholder="5s"></el-input>
                      <div style="font-size: 12px">
                        将<code>Metrics</code>数据写到<code>InfluxDB</code>的时间窗口
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="3">
                    <el-form-item label="Timeout" prop="extra_config.melody_influxdb.time_out">
                      <el-input v-model="melody_influxdb.time_out" placeholder="5s"></el-input>
                      <div style="font-size: 12px">
                        写数据的时延
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="Buffer Size">
                  <el-input placeholder="1024" v-model="melody_influxdb.buffer_size"></el-input>
                  <div style="font-size: 12px">
                    某次发送失败时，会将失败的数据暂存到缓冲区中，设置为<code>0</code>时将不会暂存。
                  </div>
                </el-form-item>
                <el-form-item label="Melody Data Server">
                  <el-switch v-model="melody_influxdb.data_server_enable"></el-switch>
                  <div style="font-size: 12px">
                    当你需要使用metrics采集到的数据时，你可以通过设置该值为<code>true</code>去开启<code>melody-data</code>，<code>melody-data</code>是一个单独的服务，拥有与influxDB交互的能力。
                  </div>
                </el-form-item>
                <template v-if="melody_influxdb.data_server_enable">
                  <el-form-item label="Melody Data Server Address">
                    <el-input
                      placeholder="melody data server address"
                      v-model="melody_influxdb.data_server_port"
                    ></el-input>
                    <div style="font-size: 12px">
                      <code>melody-data</code>监听的地址，默认使用<code>8080</code>
                    </div>
                  </el-form-item>
                  <el-form-item label="Mehtod Config">
                    <el-checkbox
                      v-model="melody_influxdb.data_server_query_enable"
                      label="Enable query"
                    ></el-checkbox>
                    <div style="font-size: 12px">
                      是否开放接口method:<code>POST</code> url:<code>/query </code>
                      request body:
                      <code
                        >"command": "查询语句" ，"database": "数据库名"， "precision":
                        "精度，默认rfc3339, 可选h, m, s, ms, u or ns"</code
                      >
                    </div>
                  </el-form-item>
                </template>
              </template>
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
import { validTimeDuration } from '@/utils/regxp'
export default {
  name: 'logging',
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  computed: {
    enableCustomFormat() {
      return this.melody_gologging.format == 'custom'
    },
    exampleLog() {
      return this.exampleLogs[this.melody_gologging.format == 'default' ? 0 : 1]
    },
  },
  data() {
    let validMetricsCollectionTime = (rule, value, callback) => {
      return validTimeDuration(value, callback)
    }
    let serviceConfig = this.$store.getters.serviceConfig
    return {
      config: serviceConfig,
      logLevels: ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
      formats: ['default', 'custom', 'logstash'],
      exampleLogs: [
        '[MELODY]2020/03/20 - 14:12:02.770 ▶ DEBUG [name: some message]',
        '{"@timestamp":"2000-03-20T13:24:24.348+00:00", "@version": 1, "level": "DEBUG", "message": "[name: some message]", "module": "MELODY"}',
      ],
      loggingRules: {
        extra_config: {
          melody_metrics: {
            collection_time: [{ validator: validMetricsCollectionTime, trigger: 'blur' }],
          },
          melody_influxdb: {
            address: [{ required: true, message: 'InfluxDB的地址是必须的' }],
            ttl: [
              { required: true, message: '数据写入的时间窗口是必须的', trigger: 'blur' },
              { validator: validMetricsCollectionTime, trigger: 'blur' },
            ],
            time_out: [
              { required: true, message: '数据写入的时延是必须的', trigger: 'blur' },
              { validator: validMetricsCollectionTime, trigger: 'blur' },
            ],
          },
        },
      },
      enableGologging: serviceConfig.extra_config.melody_gologging !== undefined,
      melody_gologging:
        serviceConfig.extra_config.melody_gologging == undefined
          ? {
              prefix: '[MELODY]',
              level: 'DEBUG',
              format: 'default',
            }
          : serviceConfig.extra_config.melody_gologging,
      enableLogStash: serviceConfig.extra_config.melody_logstash !== undefined,
      melody_logstash:
        serviceConfig.extra_config.melody_logstash == undefined
          ? {
              enable: true,
            }
          : serviceConfig.extra_config.melody_logstash,
      enableGelf: serviceConfig.extra_config.melody_gelf !== undefined,
      melody_gelf:
        serviceConfig.extra_config.melody_gelf == undefined
          ? {
              addr: '',
              enable_tcp: false,
            }
          : serviceConfig.extra_config.melody_gelf,
      enableMetrics: serviceConfig.extra_config.melody_metrics !== undefined,
      melody_metrics:
        serviceConfig.extra_config.melody_metrics == undefined
          ? {
              endpoint_disabled: false,
              proxy_disabled: false,
              router_disabled: false,
              backend_disabled: false,
              collection_time: '',
              listen_address: ':8090',
            }
          : serviceConfig.extra_config.melody_metrics,
      enableInflux: serviceConfig.extra_config.melody_influxdb !== undefined,
      melody_influxdb:
        serviceConfig.extra_config.melody_influxdb == undefined
          ? {
              address: 'http://127.0.0.1:8086',
              username: '',
              password: '',
              db: 'melody_data',
              buffer_size: 1024,
              ttl: '5s',
              time_out: '5s',
              data_server_enable: false,
              data_server_port: ':8080',
              data_server_query_enable: true,
            }
          : serviceConfig.extra_config.melody_influxdb,
    }
  },
  methods: {
    switchGologging(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_gologging',
          config: this.melody_gologging,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_gologging' })
        this.$store.commit('removeExtraConfig', { name: 'melody_logstash' })
      }
    },
    switchLogStash(enable) {
      if (enable) {
        this.melody_gologging.format = 'logstash'
        this.$store.commit('setExtraConfig', {
          name: 'melody_logstash',
          config: this.melody_logstash,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_logstash' })
      }
    },
    switchGelf(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_gelf',
          config: this.melody_gelf,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_gelf' })
      }
    },
    switchMetrics(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_metrics',
          config: this.melody_metrics,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_metrics' })
      }
    },
    switchInfluxDB(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_influxdb',
          config: this.melody_influxdb,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_influxdb' })
      }
    },
  },
  watch: {
    config: {
      handler: function() {
        this.$refs.config.validate().catch(err => {
          console.log(err)
        })
        this.$store.commit('updateServiceConfig', this.config)
      },
      deep: true,
    },
    melody_gologging: {
      handler: function() {
        this.$store.commit('setExtraConfig', {
          name: 'melody_gologging',
          config: this.melody_gologging,
        })
      },
      deep: true,
    },
    melody_gelf: {
      handler: function() {
        this.$store.commit('setExtraConfig', {
          name: 'melody_gelf',
          config: this.melody_gelf,
        })
      },
      deep: true,
    },
    melody_metrics: {
      handler: function() {
        this.$refs.config.validate(valid => {
          if (valid) {
            this.$store.commit('setExtraConfig', {
              name: 'melody_metrics',
              config: this.melody_metrics,
            })
          }
        })
      },
      deep: true,
    },
    melody_influxdb: {
      handler: function() {
        this.$refs.config.validate(valid => {
          if (valid) {
            this.$store.commit('setExtraConfig', {
              name: 'melody_influxdb',
              config: this.melody_influxdb,
            })
          }
        })
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss"></style>
