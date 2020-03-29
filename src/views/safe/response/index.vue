<template>
  <div>
    <el-form ref="config" label-position="top" :model="config" :rules="secureRules" status-icon>
      <melody-card>
        <melody-card-item title="Security headers">
          <!-- Security Header Enable Switch -->
          <el-form-item label="Enable HTTP secure middleware">
            <el-switch @change="switchHttpSecure" v-model="enableHttpSecure"></el-switch>
            <div style="font-size: 12px">
              Security
              headers增强了API中的安全性，并且是可选的。您可以添加AllowedHosts、SSL、HSTS选项和其他安全策略。
            </div>
          </el-form-item>
          <template v-if="enableHttpSecure">
            <!-- Allowed hosts -->
            <div>
              <span class="small_title">1.Allowed hosts</span>
              <el-form-item label="">
                <el-input placeholder="hostname:port" v-model="curHost" @change="addHostHandle">
                  <el-button slot="append" type="primary">Add host</el-button>
                </el-input>
                <div v-if="melody_httpsecure.allowed_hosts">
                  <template v-for="(item, index) in melody_httpsecure.allowed_hosts">
                    <el-tag
                      type="info"
                      :style="index == 0 ? {} : { 'margin-left': '10px' }"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      @close="removeHostHandle(index)"
                    >
                      {{ item }}
                    </el-tag>
                  </template>
                </div>
                <div style="font-size: 12px">
                  允许的完全限定域名列表，以及原始端口。格式:
                  <code>主机名:端口</code
                  >。当列表为空时，接受任何要连接的主机名。例如<code>example\\.com</code>、<code>.*\\.example\\.com</code>都是合法的。
                </div>
              </el-form-item>
            </div>
            <!-- SSL options -->
            <div>
              <span class="small_title">2.SSL Options</span>
              <el-form-item label="">
                <el-row>
                  <el-col :span="16">
                    <el-input
                      clearable
                      :disabled="!melody_httpsecure.ssl_redirect"
                      v-model="melody_httpsecure.ssl_host"
                      placeholder="ssl host domain"
                    >
                      <el-checkbox slot="prepend" v-model="melody_httpsecure.ssl_redirect"
                        >Force SSL</el-checkbox
                      >
                    </el-input>
                  </el-col>
                  <el-col :offset="1" :span="7">
                    <el-input
                      clearable
                      :disabled="!melody_httpsecure.ssl_redirect"
                      v-model="melody_httpsecure.ssl_port"
                      placeholder="port"
                    ></el-input>
                  </el-col>
                  <div style="font-size: 12px">
                    如果<code>Force SSL</code
                    >设置为<code>true</code>，则所有HTTP请求都将重定向到HTTPS。如果用于重定向到https的主机名与当前主机不同，请在输入框指定host和port，否则默认认为https的主机不变。
                  </div>
                </el-row>
              </el-form-item>
              <el-form-item label="SSL Certificate">
                <el-input
                  clearable
                  placeholder="/path/to/cert"
                  v-model="melody_httpsecure.ssl_certificate"
                ></el-input>
                <div style="font-size: 12px">
                  <code>RSA</code>证书的绝对路径，以备您使用。<code
                    >该配置暂未开发完整，配置不会产生效果。</code
                  >
                </div>
              </el-form-item>
              <el-form-item label="SSL Private key">
                <el-input
                  clearable
                  placeholder="/path/to/private/key"
                  v-model="melody_httpsecure.ssl_private_key"
                ></el-input>
                <div style="font-size: 12px">
                  <code>RSA</code>私钥的绝对路径。<code
                    >该配置暂未开发完整，配置不会产生效果。</code
                  >
                </div>
              </el-form-item>
              <el-form-item label="SSL Proxy Headers">
                <table style="text-align: center" class="table table-striped">
                  <tbody>
                    <tr>
                      <th class="proxy_headers_title">SSL Proxy header</th>
                      <th class="proxy_headers_title">Header value</th>
                      <th></th>
                    </tr>
                    <template v-for="(value, name, index) in melody_httpsecure.ssl_proxy_headers">
                      <tr :key="`header_${index}`">
                        <td>{{ name }}</td>
                        <td>{{ value }}</td>
                        <td>
                          <el-button type="text" @click="removeProxyHeaderClickHandle(name)"
                            ><i class="el-icon-close"></i
                          ></el-button>
                        </td>
                      </tr>
                    </template>
                    <tr>
                      <td>
                        <el-input
                          clearable
                          @keyup.enter.native="addProxyHeaderClickHandle"
                          v-model="curProxyHeader.header"
                          placeholder="X-Forwarded-Proto"
                        ></el-input>
                      </td>
                      <td>
                        <el-input
                          clearable
                          @keyup.enter.native="addProxyHeaderClickHandle"
                          v-model="curProxyHeader.value"
                          placeholder="https"
                        ></el-input>
                      </td>
                      <td>
                        <el-button type="text info" @click="addProxyHeaderClickHandle"
                          ><i class="el-icon-plus"></i
                        ></el-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style="font-size: 12px">
                  SSL Proxy
                  Headers是一组键值对，其关联值指示有效的<code>https</code>请求。使用Nginx时很有用，例如：<code
                    >“X-Forwarded-Proto”：“https”</code
                  >
                </div>
              </el-form-item>
            </div>
            <!-- HSTS -->
            <div>
              <span class="small_title">3.HTTP Strict Transport Security (HSTS)</span>
              <el-form-item label="" prop="extra_config.melody_httpsecure.sts_seconds">
                <div style="font-size: 12px">
                  HSTS是一种网络安全策略机制，有助于保护网站免受协议降级攻击和cookie劫持。它允许web服务器声明web浏览器（或其他符合要求的用户代理）只应使用安全的HTTPS连接与之交互，而不应通过不安全的HTTP协议。使用时，与http的传入链接将在访问服务器之前转换为https。语法示例：<code
                    >Strict-Transport-Security: max-age=31536000; includeSubDomains</code
                  >
                </div>
                <el-input v-model="melody_httpsecure.sts_seconds">
                  <span slot="prepend">max-age</span>
                  <span slot="append">seconds</span>
                </el-input>
                <div style="font-size: 12px">
                  严格传输安全标头的最大使用期限。设置为<code>0</code>将禁用HSTS！
                </div>
              </el-form-item>
              <el-form-item label="">
                <el-checkbox
                  label="Include also subdomains"
                  v-model="melody_httpsecure.sts_include_subdomains"
                ></el-checkbox>
                <div style="font-size: 12px">
                  如果将此值设置为true，则<code>includeS ubdomains</code>指令将附加到严格传输安全头
                </div>
              </el-form-item>
            </div>
            <!-- Clickjacking -->
            <div>
              <span class="small_title">4.Clickjacking</span>
              <el-form-item label="">
                <el-checkbox
                  v-model="melody_httpsecure.frame_deny"
                  label="Enable clickjacking protection"
                ></el-checkbox>
                <div style="font-size: 12px">
                  通过添加头<code>X-Frame-Options:DENY</code>，在设置为<code>true</code>时提供服务器端的部分保护，防止点击劫持。
                </div>
              </el-form-item>
              <template v-if="melody_httpsecure.frame_deny">
                <el-form-item label="">
                  <el-input
                    clearable
                    v-model="melody_httpsecure.custom_frame_options_value"
                    placeholder="DENY"
                  >
                    <span slot="prepend">X-Frame-Options:</span>
                  </el-input>
                  <div style="font-size: 12px">
                    或者使用自定义值:
                    <el-tag
                      @click="frameTagClickHandle('DENY')"
                      class="custom_frame_tag"
                      size="small"
                      type="info"
                      ><i class="el-icon-circle-plus"></i> DENY</el-tag
                    >
                    <el-tag
                      @click="frameTagClickHandle('SAMEORIGIN')"
                      class="custom_frame_tag"
                      size="small"
                      type="info"
                      ><i class="el-icon-circle-plus"></i> SAMEORIGIN</el-tag
                    >
                    <el-tag
                      @click="frameTagClickHandle('ALLOW-FROM https://example.com')"
                      class="custom_frame_tag"
                      size="small"
                      type="info"
                      ><i class="el-icon-circle-plus"></i> ALLOW-FROM</el-tag
                    >
                  </div>
                </el-form-item>
              </template>
            </div>
            <!-- HTTP Public Key Pinning (HPKP) -->
            <div>
              <span class="small_title">5.HTTP Public Key Pinning (HPKP)</span>
              <el-form-item label="">
                <el-input
                  clearable
                  v-model="melody_httpsecure.hpkp_public_key"
                  placeholder='pin-sha256="base64=="; max-age=expireTime [; includeSubDomains][; report-uri="reportURI"]'
                >
                  <span slot="prepend">Public-Key-Pins:</span>
                </el-input>
                <div style="font-size: 12px">
                  允许HTTPS网站抵抗攻击者使用错误颁发或其他欺诈性证书进行的模拟。
                </div>
              </el-form-item>
            </div>
            <!-- Sniffing -->
            <div>
              <span class="small_title">6.Sniffing</span>
              <el-form-item label="">
                <el-checkbox
                  v-model="melody_httpsecure.content_type_nosniff"
                  label="MIME-sniffing prevention"
                ></el-checkbox>
                <div style="font-size: 12px">
                  当设置为<code>true</code>时，将阻止Internet
                  Explorer从声明的内容类型之外对响应进行MIME嗅探。下载扩展时，这也适用于Chrome。通过设置<code>X-Content-Type-Options:nosniff</code>实现
                </div>
              </el-form-item>
            </div>
            <!-- Cross-site scripting (XSS) protection -->
            <div>
              <span class="small_title">7.Cross-site scripting (XSS) protection</span>
              <el-form-item label="">
                <el-checkbox
                  v-model="melody_httpsecure.browser_xss_filter"
                  label="Browser cross-site scripting (XSS) filter"
                ></el-checkbox>
                <div style="font-size: 12px">
                  如果设置为<code>true</code>，则会添加<code>X-XSS-Protection:'1; mode=block'</code
                  >到响应头中。
                </div>
              </el-form-item>
              <el-form-item label="">
                <el-input
                  clearable
                  v-model="melody_httpsecure.content_security_policy"
                  placeholder="default-src:'self'"
                >
                  <span slot="prepend">Content-Security-Policy:</span>
                </el-input>
                <div style="font-size: 12px">
                  通过在标题中写入策略来启用内容安全策略（CSP）
                  <a
                    href="https://content-security-policy.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >（参考资料）</a
                  >
                  。
                </div>
              </el-form-item>
            </div>
          </template>
        </melody-card-item>
      </melody-card>
    </el-form>
  </div>
</template>
<script>
import MelodyCard from '@/components/MelodyCard'
import MelodyCardItem from '@/components/MelodyCardItem'
import { validNumber } from '@/utils/regxp'
export default {
  name: 'ResponseHeaderConfig',
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  data() {
    let validSeconds = (rule, value, callback) => {
      return validNumber(value, callback)
    }
    let serviceConfig = this.$store.getters.serviceConfig
    return {
      secureRules: {
        extra_config: {
          melody_httpsecure: {
            sts_seconds: [{ validator: validSeconds, trigger: 'blur' }],
          },
        },
      },
      config: serviceConfig,
      enableHttpSecure: serviceConfig.extra_config.melody_httpsecure !== undefined,
      melody_httpsecure:
        serviceConfig.extra_config.melody_httpsecure == undefined
          ? {
              allowed_hosts: [],
              ssl_redirect: false,
              ssl_host: '',
              ssl_port: '',
              ssl_certificate: '',
              ssl_private_key: '',
              ssl_proxy_headers: {},
              sts_seconds: 0,
              sts_include_subdomains: false,
              frame_deny: false,
              custom_frame_options_value: '',
              hpkp_public_key: '',
              content_type_nosniff: false,
              browser_xss_filter: false,
              content_security_policy: '',
            }
          : serviceConfig.extra_config.melody_httpsecure,
      curProxyHeader: {
        header: '',
        value: '',
      },
      curHost: '',
    }
  },
  methods: {
    switchHttpSecure(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_httpsecure',
          config: this.melody_httpsecure,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_httpsecure' })
      }
    },
    addHostHandle(value) {
      let array = this.melody_httpsecure.allowed_hosts
      if (array.indexOf(value) == -1) {
        array.push(value)
        this.melody_httpsecure.allowed_hosts = array
      }
    },
    removeHostHandle(index) {
      this.melody_httpsecure.allowed_hosts.splice(index, 1)
    },
    addProxyHeaderClickHandle() {
      if (this.curProxyHeader.header && this.curProxyHeader.value) {
        let obj = {}
        obj[this.curProxyHeader.header] = this.curProxyHeader.value
        this.melody_httpsecure.ssl_proxy_headers = Object.assign(
          {},
          this.melody_httpsecure.ssl_proxy_headers,
          obj
        )
      }
    },
    removeProxyHeaderClickHandle(key) {
      this.$delete(this.melody_httpsecure.ssl_proxy_headers, key)
    },
    frameTagClickHandle(value) {
      this.melody_httpsecure.custom_frame_options_value = value
    },
  },
  watch: {
    config: {
      handler: function() {
        this.$refs.config.validate().catch(err => {
          console.log(err)
        })
        this.$store.commit('updateServiceConfig', this.config)
        this.$store.commit('removeUselessPropsAtServiceConfigLevel')
      },
      deep: true,
    },
    melody_httpsecure: {
      handler: function() {
        this.$refs.config.validate(valid => {
          if (valid) {
            this.$store.commit('setExtraConfig', {
              name: 'melody_httpsecure',
              config: this.melody_httpsecure,
            })
          }
        })
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss">
.small_title {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 10px;
}
.proxy_headers_title {
  font-weight: 200;
  font-size: 12px;
  background: #f0f8ff;
}
.custom_frame_tag {
  margin-left: 10px;
  cursor: pointer;
}
</style>
