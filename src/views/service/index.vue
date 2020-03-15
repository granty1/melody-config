<template>
  <div>
    <el-form :model="config" status-icon label-width="50px">
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- 左侧 -->
        <el-col :span="11" class="container">
          <!-- service name -->
          <el-card class="box-card item">
            <div slot="header" class="clearfix">
              <span>Service Name</span>
            </div>
            <div>
              <el-form-item label="name">
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

          <!-- service name 2 -->
        </el-col>

        <!-- 右侧 -->
        <el-col :span="11" class="container">
          <el-card class="box-card item">
            <div slot="header" class="clearfix">
              <span>HTTP Server settings</span>
            </div>
            <div>
              <el-form-item label="port">
                <el-input
                  @input="save"
                  v-model="config.port"
                  placeholder="8080"
                  autocomplete="off"
                ></el-input>
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
