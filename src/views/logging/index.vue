<template>
  <div>
    <el-form ref="logging" :model="logging" status-icon>
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- Base Logging -->
        <el-col :span="11" class="container">
          <el-card>
            <el-collapse :value="['logging']">
              <el-collapse-item title="Logging" name="logging">
                <el-col :span="11">
                  <el-form-item size="small">
                    <span slot="label" class="input-small-style">Level</span>
                    <el-input v-model="logging.base.level"></el-input>
                    <div style="font-size: 12px">
                      选择日志打印的级别。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-form-item size="small">
                    <span slot="label" class="input-small-style">Prefix</span>
                    <el-input v-model="logging.base.prefix"></el-input>
                    <div style="font-size: 12px">
                      在日志行之前添加字符串前缀。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item size="small">
                    <span slot="label" class="input-small-style">Message Format</span>
                    <el-input v-model="logging.base.format"></el-input>
                    <div style="font-size: 12px">
                      日志记录、打印的格式。
                    </div>
                  </el-form-item>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
        <!-- Other config -->
        <el-col :span="11" class="container">
          <!-- Gelf -->
          <el-card>
            <el-collapse :value="activeList" @change="modifyActiveCards('gelf')">
              <el-collapse-item title="Gelf" name="gelf">展开</el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- Metrics -->
          <el-card style="margin-top: 10px">
            <el-collapse :value="activeList" @change="modifyActiveCards('metrics')">
              <el-collapse-item title="Metrics" name="metrics">展开</el-collapse-item>
            </el-collapse>
          </el-card>

          <el-card style="margin-top: 10px">
            <el-collapse :value="activeList" @change="modifyActiveCards('opencensus')">
              <el-collapse-item title="Opencensus" name="opencensus">展开</el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { modifyActiveCards } from '@/utils/active_cards'
export default {
  name: 'logging',
  components: {},
  computed: {
    activeList() {
      return this.$ls.get('active_cards')
    },
    modifyActiveCards() {
      return modifyActiveCards
    },
  },
  data() {
    return {
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
