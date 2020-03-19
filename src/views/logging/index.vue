<template>
  <div>
    <el-form ref="logging" :model="logging" status-icon>
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- 左侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <!-- Base Logging -->
            <melody-card-item title="Logging">
              <!-- Level -->
              <el-col :span="11">
                <el-form-item label="Level">
                  <el-select v-model="logging.base.prefix">
                    <el-option
                      v-for="item in logLevels"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div style="font-size: 12px">
                    选择日志打印的级别。
                  </div>
                </el-form-item>
              </el-col>

              <!-- Prefix -->
              <el-col :span="11" :offset="2">
                <el-form-item label="Prefix">
                  <el-input v-model="logging.base.prefix"></el-input>
                  <div style="font-size: 12px">
                    在日志行之前添加字符串前缀。
                  </div>
                </el-form-item>
              </el-col>

              <!-- Message Format -->
              <el-form-item label="Message Format">
                <el-input v-model="logging.base.format"></el-input>
                <div style="font-size: 12px">
                  日志记录、打印的格式。
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

            <melody-card-item title="Gelf2">
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
  data() {
    return {
      logging: {
        // base log
        base: {
          prefix: '[Melody]',
        },
      },
      logLevels: ['DEBUG', 'ERROR'],
    }
  },
}
</script>

<style lang="scss"></style>
