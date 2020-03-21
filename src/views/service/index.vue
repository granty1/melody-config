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
          <!-- Service Name -->
          <melody-card>
            <melody-card-item title="Service Name">
              <el-form-item label="Name">
                <el-input
                  v-model="config.name"
                  @input="save"
                  placeholder="请输入您的Service Name"
                ></el-input>
                <div style="font-size: 12px">
                  友好的名称，标题，日期，版本或任何其他简短描述，可帮助您在打开时识别JSON文件。
                </div>
              </el-form-item>
            </melody-card-item>
            <!-- Available hosts -->
            <melody-card-item title="Available hosts">
              <el-form-item label="address">
                <el-input
                  v-model="config.address"
                  @input="save"
                  placeholder="请输入您的Available hosts"
                ></el-input>
                <div style="font-size: 12px">
                  The address where KrakenD connects to. Some valid examples can be https://myapi,
                  amqp://host, 192.0.2.1:25, my.service.tld.
                </div>
              </el-form-item>
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
                <div style="font-size: 12px">
                  Melody用来监听连接的端口，默认为<code>8080</code>。
                  也可以在启动时使用标志<code>-p</code>指定该端口。
                </div>
              </el-form-item>
              <!-- HTTP Read Timeout -->
              <el-form-item label="HTTP Read Timeout" prop="read_timeout">
                <el-input
                  @input="save"
                  v-model="config.read_timeout"
                  placeholder="0s"
                  autocomplete="off"
                ></el-input>
                <div style="font-size: 12px">
                  读取整个HTTP请求（包括正文）的最大持续时间。
                </div>
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

let needCheckProps = ['name', 'port', 'read_timeout']

export default {
  name: 'Service',
  data() {
    let validPort = (rule, value, callback) => {
      return validNumber(value, callback)
    }
    let validReadTimeout = (rule, value, callback) => {
      return validTimeDuration(value, callback)
    }
    return {
      config: this.$ls.get('config'),
      serviceConfigRules: {
        port: [{ validator: validPort, trigger: 'blur' }],
        read_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
      },
    }
  },
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  methods: {
    save() {
      this.$refs.config.validate(valid => {
        if (valid) {
          this.$store.commit('updateServiceConfig', this.config)
        } else {
          return false
        }
      })
      this.$store.commit('removeUselessPropsAtServiceConfigLevel', needCheckProps)
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
