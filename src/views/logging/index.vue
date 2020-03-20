<template>
  <div>
    <el-form label-position="top" ref="logging" :model="logging" status-icon>
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- 左侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <!-- Base Logging -->
            <melody-card-item title="Logging">
              <el-form-item label="melody logger">
                <el-switch
                  @change="baseLogerEnableHandle"
                  v-model="logging.baseLoggerEnable"
                ></el-switch>
                <div style="font-size: 12px">
                  Melody提供了比较完善的logger。
                </div>
              </el-form-item>
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="11">
                  <!-- Level -->
                  <el-form-item label="Level">
                    <el-select
                      :disabled="!logging.baseLoggerEnable"
                      v-model="logging.base.level"
                      @change="updateLogging"
                      placeholder="选择log级别"
                    >
                      <el-option v-for="item in logLevels" :key="item" :label="item" :value="item">
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
                    <el-input
                      :disabled="!logging.baseLoggerEnable"
                      v-model="logging.base.prefix"
                      @input="updateLogging"
                    ></el-input>
                    <div style="font-size: 12px">
                      在日志行之前添加字符串前缀。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-around">
                <!-- Message Format -->
                <el-col :span="logging.enableCustomFormat ? 11 : 24">
                  <el-form-item label="Message Format">
                    <el-select
                      @change="messageFormatHandle"
                      :disabled="!logging.baseLoggerEnable"
                      v-model="logging.base.format"
                      placeholder="选择日志格式"
                    >
                      <el-option v-for="item in formats" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div style="font-size: 12px">
                      日志记录、打印的格式。
                    </div>
                  </el-form-item>
                </el-col>
                <!-- Custom Format -->
                <el-col v-if="logging.enableCustomFormat" :span="11" :offset="2">
                  <el-form-item label="Custom log format">
                    <el-input
                      @input="updateLogging"
                      v-model="logging.base.custom"
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
              <el-row v-if="logging.base.format != 'custom'">
                <el-col :span="24">
                  示例：<code>{{ logging.exampleLog }}</code>
                </el-col>
              </el-row>
              <!-- Log stash -->
              <el-form-item label="LogStash">
                <el-switch
                  :disabled="!logging.baseLoggerEnable"
                  @change="enableLogStash"
                  v-model="logging.logstashEnable"
                  >Enable</el-switch
                >
                <div style="font-size: 12px">选择开启是否<code>LogStash</code></div>
              </el-form-item>
              <!-- Writers -->
              <el-form-item label="Writers">
                <el-checkbox
                  @change="updateLogging"
                  :disabled="!logging.baseLoggerEnable"
                  v-model="logging.base.syslog"
                  >Syslog</el-checkbox
                >
                <el-checkbox
                  @change="updateLogging"
                  :disabled="!logging.baseLoggerEnable"
                  v-model="logging.base.stdout"
                  >Stdout</el-checkbox
                >
                <div style="font-size: 12px">
                  <code>Syslog</code>将日志写入syslog系统。 <code>Stdout</code>将日志写入控制台。
                </div>
              </el-form-item>
            </melody-card-item>
          </melody-card>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <!-- Gelf -->
            <melody-card-item title="Gelf">
              <div>展开</div>
            </melody-card-item>
          </melody-card>

          <melody-card>
            <!-- Metrics -->
            <melody-card-item title="Metrics">
              <div>展开</div>
            </melody-card-item>
          </melody-card>

          <melody-card>
            <!-- Opencensus -->
            <melody-card-item title="Opencensus">
              <div>展开</div>
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
export default {
  name: 'logging',
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  mounted() {
    let loggingConfig = this.$store.getters.loggingConfig
    if (loggingConfig && loggingConfig.base != null) {
      this.logging = loggingConfig
    }
  },
  data() {
    return {
      logLevels: ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
      formats: ['default', 'custom', 'logstash'],
      exampleLogs: [
        '[MELODY]2020/03/20 - 14:12:02.770 ▶ DEBUG [name: some message]',
        '{"@timestamp":"2000-03-20T13:24:24.348+00:00", "@version": 1, "level": "DEBUG", "message": "[name: some message]", "module": "MELODY"}',
      ],
      logging: {
        // base log
        base: {
          prefix: '[MELODY]',
          level: 'DEBUG',
          format: 'default',
        },
        logstashEnable: false,
        baseLoggerEnable: false,
        enableCustomFormat: false,
        exampleLog: '',
      },
    }
  },
  methods: {
    enableLogStash(value) {
      if (value) {
        this.logging.base.format = 'logstash'
        this.logging.enableCustomFormat = false
        this.logging.exampleLog = this.exampleLogs[1]
        this.$store.dispatch('updateLogStash', true)
      } else {
        this.$store.dispatch('updateLogStash', false)
      }
      this.updateLogging()
    },
    messageFormatHandle(value) {
      switch (value) {
        case this.formats[0]:
          this.logging.exampleLog = this.exampleLogs[0]
          break
        case this.formats[1]:
          this.logging.enableCustomFormat = true
          break
        case this.formats[2]:
          this.logging.exampleLog = this.exampleLogs[1]
          break
        default:
          break
      }
      this.logging.enableCustomFormat = value == 'custom' ? true : false
      this.updateLogging()
    },
    baseLogerEnableHandle(enable) {
      if (enable) {
        this.updateLogging()
      } else {
        this.$store.dispatch('removeBaseLogging')
        this.$ls.remove('logging')
      }
    },
    updateLogging() {
      this.$store.dispatch('updateLogging', this.logging)
    },
  },
}
</script>

<style lang="scss"></style>
