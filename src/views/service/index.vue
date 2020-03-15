<template>
  <div>
    <el-form label-position="top" :model="config" status-icon>
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
              <el-form-item label="Port">
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
              <el-form-item label="HTTP Read Timeout">
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
export default {
  name: 'Service',
  data() {
    return {
      config: this.$ls.get('config'),
    }
  },
  methods: {
    save() {
      this.$ls.set('config', this.config)
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
