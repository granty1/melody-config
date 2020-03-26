<template>
  <div>
    <el-form label-position="top" ref="config" :model="melody_etcd" :rules="etcdRules" status-icon>
      <el-row type="flex" class="row-bg" justify="space-around">
        <!-- 左侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <!-- Available hosts -->
            <melody-card-item title="Available hosts">
              <div class="fs12">
                在此处添加Melody用于检索数据的所有地址，以及是否由服务发现解决的地址：
              </div>
              <el-radio-group v-model="curSDType" size="small">
                <el-radio-button label="Static address resolution">
                  Static address resolution
                </el-radio-button>
                <el-radio-button label="Etcd" :disabled="!etcdEnable">
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
                style="margin-top: 10px; margin-bottom: 10px;"
                v-model="curAvailableHost"
                placeholder="address"
                @change="saveAvailableHosts"
              >
                <template slot="prepend">
                  <el-checkbox v-model="disableSanitize">disable sanitize</el-checkbox>
                </template>
              </el-input>
              <div>
                <el-tag
                  v-for="(ah, index) in availableHosts"
                  :key="index"
                  closable
                  type="info"
                  :style="index == 0 ? {} : { 'margin-left': '10px' }"
                  @close="handleAvailableHostsTagClose(ah)"
                >
                  {{ ah }}
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
            </melody-card-item>
          </melody-card>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="11" class="container">
          <melody-card>
            <melody-card-item title="Etcd middleware">
              <el-switch v-model="etcdEnable"></el-switch>
              <template v-if="etcdEnable">
                <!-- Available etcd machines -->
                <el-form-item label="Available etcd machines">
                  <el-input
                    v-model="curMachine"
                    placeholder="http://example.com:4001"
                    @change="saveMachine"
                  ></el-input>
                  <div class="fs12">
                    Etcd servers you want Melody to make use of for host resolution
                  </div>
                  <div class="fs12">
                    <code>http(s)://hostname[:port]</code>
                  </div>
                  <el-tag
                    v-for="(machine, index) in melody_etcd.machines"
                    :key="index"
                    closable
                    type="info"
                    :style="index == 0 ? {} : { 'margin-left': '10px' }"
                    @close="handleMachinesTagClose(machine)"
                  >
                    {{ machine }}
                  </el-tag>
                </el-form-item>
                <!-- Dial Timeout -->
                <el-form-item label="Dial Timeout" prop="dial_timeout">
                  <el-input v-model="melody_etcd.dial_timeout" placeholder="5s"></el-input>
                  <div class="fs12">
                    Dial timeout includes name resolution.
                  </div>
                </el-form-item>
                <!-- Dial Keep Alive -->
                <el-form-item label="Dial Keep Alive" prop="dial_keepalive">
                  <el-input v-model="melody_etcd.dial_keepalive" placeholder="30s"></el-input>
                  <div class="fs12">
                    KeepAlive specifies the keep-alive period for an active network connection. If
                    zero, keep-alives are not enabled.
                  </div>
                </el-form-item>
                <!-- Timeout per request -->
                <el-form-item label="Timeout per request" prop="header_timeout">
                  <el-input v-model="melody_etcd.header_timeout" placeholder="1s"></el-input>
                  <div class="fs12">
                    Header sent to determine the maximum timeout per request
                  </div>
                </el-form-item>
                <!-- Certificate -->
                <el-form-item label="Certificate">
                  <el-input v-model="melody_etcd.cert" placeholder="/path/to/file"></el-input>
                  <div class="fs12">
                    Absolute path to the certificate
                  </div>
                </el-form-item>
                <!-- Private key -->
                <el-form-item label="Private key">
                  <el-input v-model="melody_etcd.key" placeholder="/path/to/file"></el-input>
                  <div class="fs12">
                    Absolute path to the private key
                  </div>
                </el-form-item>
                <!-- CA Cert -->
                <el-form-item label="CA Cert">
                  <el-input v-model="melody_etcd.cacert" placeholder="/path/to/file"></el-input>
                  <div class="fs12">
                    Absolute path to the CA Cert
                  </div>
                </el-form-item>
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
  name: 'sd',
  data() {
    let serviceConfig = this.$store.getters.serviceConfig
    let validReadTimeout = (rule, value, callback) => {
      return validTimeDuration(value, callback)
    }
    let etcdInit = {
      machines: ['http://127.0.0.1:2379'],
      dial_timeout: '5s',
      dial_keepalive: '30s',
      header_timeout: '1s',
      cert: '',
      key: '',
      cacert: '',
    }
    return {
      melody_etcd:
        serviceConfig.extra_config.melody_etcd == undefined
          ? etcdInit
          : serviceConfig.extra_config.melody_etcd,
      etcdRules: {
        dial_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
        dial_keepalive: [{ validator: validReadTimeout, trigger: 'blur' }],
        header_timeout: [{ validator: validReadTimeout, trigger: 'blur' }],
      },

      curSDType: 'Static address resolution',
      curAvailableHost: '',
      availableHosts: this.$store.getters.availableHosts,
      disableSanitize: false,

      etcdEnable: serviceConfig.extra_config.melody_etcd !== undefined,
      curMachine: '',
    }
  },
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  methods: {
    saveAvailableHosts(value) {
      if (this.availableHosts.indexOf(this.curSDType.split(' ')[0] + ' - ' + value) == -1) {
        this.availableHosts.push(this.curSDType.split(' ')[0] + ' - ' + value)
        this.$store.commit('setAvailableHosts', this.availableHosts)
        this.curAvailableHost = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    saveMachine(value) {
      if (this.melody_etcd.machines.indexOf(value) == -1) {
        this.melody_etcd.machines.push(value)

        this.curMachine = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    handleAvailableHostsTagClose(value) {
      this.availableHosts.splice(this.availableHosts.indexOf(value), 1)
      this.$store.commit('setAvailableHosts', this.availableHosts)
    },
    handleMachinesTagClose(v) {
      this.melody_etcd.machines.splice(this.melody_etcd.machines.indexOf(v), 1)
    },
  },
  watch: {
    etcdEnable: {
      handler: function(n) {
        if (n) {
          this.$store.commit('setExtraConfig', {
            name: 'melody_etcd',
            config: this.melody_etcd,
          })
        } else {
          this.$store.commit('removeExtraConfig', {
            name: 'melody_etcd',
          })
        }
      },
    },
    melody_etcd: {
      handler: function() {
        if (this.etcdEnable) {
          this.$refs.config.validate().catch(err => {
            console.log(err)
          })
          this.$store.commit('setExtraConfig', {
            name: 'melody_etcd',
            config: this.melody_etcd,
          })
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
