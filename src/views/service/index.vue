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
                    type="success"
                    style="display: block;margin: 10px 0;line-height: 30px;"
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
              <el-form-item label="Backend Timeout" prop="timeout">
                <el-input v-model="config.timeout" @input="save" placeholder="3000ms"></el-input>
                <div class="fs12">
                  友好的名称，标题，日期，版本或任何其他简短描述，可帮助您在打开时识别JSON文件。
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
                <div class="fs12">
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
                <div class="fs12">
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

let needCheckProps = ['name', 'port', 'read_timeout', 'timeout']

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
    return {
      config: this.$ls.get('config'),
      serviceConfigRules: {
        port: [{ validator: validPort, trigger: 'blur' }],
        read_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
        timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
      },
      sdType: 'Static address resolution',
      etcdDisabled: true,
      disableSanitize: false,
      addressList: this.$store.getters.addressList,
      curAddress: '',
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
      this.$store.commit('removeUselessPropsAtServiceConfigLevel', needCheckProps)
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
