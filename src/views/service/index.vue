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
          <el-card class="box-card item">
            <div slot="header" class="clearfix">
              <span>Service Name</span>
            </div>
            <div>
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
            </div>
          </el-card>

          <!-- Available hosts -->
          <el-card class="box-card item">
            <div slot="header" class="clearfix">
              <span> Available hosts</span>
            </div>
            <div></div>
          </el-card>
        </el-col>

        <!-- 右侧 -->
        <el-col :span="11" class="container">
          <!-- HTTP Server settings -->
          <el-card class="box-card item">
            <div slot="header" class="clearfix">
              <span>HTTP Server settings</span>
            </div>
            <div>
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
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
let needCheckProps = ['name', 'port', 'read_timeout']
export default {
  name: 'Service',
  data() {
    let validPort = (rule, value, callback) => {
      return 'undefined' === typeof value || '' == value || /^[0-9]*$/.test(value)
        ? callback()
        : callback(new Error('端口号不能包含除数字以为的其他字符'))
    }
    let validReadTimeout = (rule, value, callback) => {
      return 'undefined' === typeof value || '' == value || /^\d+(ns|us|µs|ms|s|m|h)$/.test(value)
        ? callback()
        : callback(new Error('必须以ns、us或µs、ms、s、m、h时间单位结尾，例如300ms'))
    }
    return {
      config: this.$ls.get('config'),
      serviceConfigRules: {
        port: [{ validator: validPort, trigger: 'blur' }],
        read_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
      },
    }
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
