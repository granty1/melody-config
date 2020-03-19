<template>
  <div>
    <el-form ref="logging" :model="logging" status-icon>
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- Base Logging -->
        <el-col :span="11" class="container">
          <el-card>
            <el-collapse>
              <el-collapse-item title="Logging" name="1">
                <el-col :span="11">
                  <el-form-item size="small">
                    <span slot="label" class="input-small-style">Level</span>
                    <el-input v-model="logging.base.level"></el-input>
                    <div style="font-size: 12px">
                      友好的名称，标题，日期，版本或任何其他简短描述，可帮助您在打开时识别JSON文件。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-form-item size="small">
                    <span slot="label" class="input-small-style">Prefix</span>
                    <el-input v-model="logging.base.prefix"></el-input>
                    <div style="font-size: 12px">
                      友好的名称，标题，日期，版本或任何其他简短描述，可帮助您在打开时识别JSON文件。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item size="small">
                    <span slot="label" class="input-small-style">Message Format</span>
                    <el-input v-model="logging.base.format"></el-input>
                    <div style="font-size: 12px">
                      友好的名称，标题，日期，版本或任何其他简短描述，可帮助您在打开时识别JSON文件。
                    </div>
                  </el-form-item>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
        <!-- Other config -->
        <el-col :span="11" class="container"></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Logging',
  components: {},
  data() {
    return {
      activeNames: [],
      logging: {
        // base log
        base: {
          prefix: '[Melody]',
        },
      },
    }
  },
}
</script>

<style lang="scss">
.input-small-style {
  font-size: 12px;
  line-height: 30px;
}
</style>
