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
                <el-input v-model="config.name" placeholder="My Service"></el-input>
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
                <el-radio-group v-model="curSDType" size="small">
                  <el-radio-button label="static address resolution">
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
                  style="margin-top: 10px; margin-bottom: 10px;"
                  v-model="curAvailableHost"
                  placeholder="address"
                  @keyup.enter.native="saveAvailableHosts"
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
              </el-form-item>
            </melody-card-item>
            <!-- Timeouts and TTL -->
            <melody-card-item title="Timeouts and TTL">
              <div class="sf12">
                除非在每个endpoint中明确覆盖，否则以下所有设置将在所有backend中使用
              </div>
              <!-- Backend Timeout -->
              <el-form-item label="Backend Timeout" prop="timeout">
                <el-input v-model="config.timeout" placeholder="3000ms"></el-input>
                <div class="fs12">
                  与您的后端的所有连接的默认timeout(从Melody发出请求到收到响应)。
                  以后可以在具体的endpoint上再覆盖此值。
                </div>
              </el-form-item>
              <!-- Default Cache TTL -->
              <el-form-item label="Default Cache TTL" prop="cache_ttl">
                <el-input v-model="config.cache_ttl" placeholder="300s"></el-input>
                <div class="fs12">
                  请求<code>header</code>会加上
                  <a
                    href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control"
                    target="_blank"
                  >
                    <code>Cache-Control</code></a
                  >，此值只对<code>Get</code>请求生效。
                </div>
              </el-form-item>
            </melody-card-item>
          </melody-card>

          <melody-card>
            <!-- Cross-origin resource sharing (CORS) -->
            <melody-card-item title="Cross-origin resource sharing (CORS)">
              <el-form-item>
                <el-switch v-model="openCORS" @change="swtichCORS"></el-switch>
              </el-form-item>
              <template v-if="openCORS">
                <!-- Allowed methods -->
                <el-form-item label="Allowed methods">
                  <el-checkbox-group v-model="melody_cors.allow_methods" size="small">
                    <el-checkbox label="GET" border></el-checkbox>
                    <el-checkbox label="POST" border></el-checkbox>
                    <el-checkbox label="HEAD" border></el-checkbox>
                    <el-checkbox label="PUT" border></el-checkbox>
                    <el-checkbox label="DELETE" border></el-checkbox>
                    <el-checkbox label="CONNECT" border></el-checkbox>
                    <el-checkbox label="OPTIONS" border></el-checkbox>
                    <el-checkbox label="TRACE" border></el-checkbox>
                    <el-checkbox label="PATCH" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <!-- Allowed origins -->
                <el-form-item label="Allowed origins">
                  <el-input
                    v-model="curOrigin"
                    placeholder="https://example.com"
                    @keyup.enter.native="saveOrigin"
                  ></el-input>
                  <el-tag
                    v-for="(origin, index) in melody_cors.allow_origins"
                    :key="index"
                    closable
                    type="info"
                    :style="index == 0 ? {} : { 'margin-left': '10px' }"
                    @close="handleAllowedOriginsTagClose(origin)"
                  >
                    {{ origin }}
                  </el-tag>
                  <div class="fs12">
                    添加您要接受的来源，或将<code>*</code>用作任何来源。
                  </div>
                </el-form-item>
                <el-row type="flex" class="row-bg" justify="space-around">
                  <!-- Allowed headers -->
                  <el-col :span="11" class="container">
                    <el-form-item label="Allowed headers">
                      <el-input
                        v-model="curAllowHeader"
                        placeholder="Accept-Language"
                        @keyup.enter.native="saveAllowHeader"
                      ></el-input>
                      <el-tag
                        v-for="(header, index) in melody_cors.allow_headers"
                        :key="index"
                        closable
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        @close="handleAllowedHeadersTagClose(header)"
                      >
                        {{ header }}
                      </el-tag>
                      <div class="fs12">
                        响应<code>header</code>会加上
                        <a
                          href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers"
                          target="_blank"
                        >
                          <code>Access-Control-Allow-Headers</code> </a
                        >。
                      </div>
                    </el-form-item>
                  </el-col>
                  <!-- Expose headers -->
                  <el-col :span="11" class="container">
                    <el-form-item label="Expose headers">
                      <el-input
                        v-model="curExposeHeader"
                        placeholder="Accept-Language"
                        @keyup.enter.native="saveExposeHeader"
                      ></el-input>
                      <el-tag
                        v-for="(header, index) in melody_cors.expose_headers"
                        :key="index"
                        closable
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        @close="handleExposeHeadersTagClose(header)"
                      >
                        {{ header }}
                      </el-tag>
                      <div class="fs12">
                        响应<code>header</code>会加上
                        <a
                          href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Expose-Headers"
                          target="_blank"
                        >
                          <code>Access-Control-Expose-Headers</code> </a
                        >。
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" justify="space-around">
                  <!-- Allow credentials -->
                  <el-col :span="11" class="container">
                    <el-form-item label="Allow credentials">
                      <el-switch v-model="melody_cors.allow_credentials"></el-switch>
                      <div class="fs12">
                        响应<code>header</code>会加上
                        <a
                          href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials"
                          target="_blank"
                        >
                          <code>Access-Control-Allow-Credentials</code></a
                        >。
                      </div>
                    </el-form-item>
                  </el-col>
                  <!-- Max age -->
                  <el-col :span="11" class="container">
                    <el-form-item label="Max age" prop="extra_config.melody_cors.max_age">
                      <el-input v-model="melody_cors.max_age" placeholder="12h"></el-input>
                      <div class="fs12">
                        响应<code>header</code>会加上
                        <a
                          href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age"
                          target="_blank"
                        >
                          <code>Access-Control-Max-Age</code></a
                        >。
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
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
                <el-input v-model="config.port" placeholder="8080" autocomplete="off"></el-input>
                <div class="fs12">
                  Melody用来监听连接的端口，默认为<code>8080</code>。
                  也可以在启动时使用标志<code>-p</code>指定该端口。
                </div>
              </el-form-item>
              <!-- Enable HTTPS -->
              <el-form-item label="Enable HTTPS">
                <el-switch @change="swtichEnableHTTPS" v-model="openEnableHTTPS"></el-switch>
              </el-form-item>
              <template v-if="openEnableHTTPS">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="11" class="container">
                    <!-- Public key -->
                    <el-form-item label="Public key">
                      <el-input
                        v-model="config.tls.public_key"
                        placeholder="/path/to/cert.pem"
                        autocomplete="off"
                      ></el-input>
                      <div class="fs12">
                        公钥的绝对路径或相对于当前工作目录的相对路径
                      </div>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11" class="container">
                    <!-- Private key -->
                    <el-form-item label="Private key">
                      <el-input
                        v-model="config.tls.private_key"
                        placeholder="/path/to/key.pem"
                        autocomplete="off"
                      ></el-input>
                      <div class="fs12">
                        私钥的绝对路径或相对于当前工作目录的相对路径
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="11" class="container">
                  <!-- HTTP Read Timeout -->
                  <el-form-item label="HTTP Read Timeout" prop="read_timeout">
                    <el-input
                      v-model="config.read_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      读取整个HTTP请求（包括body）的最大持续时间。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="container">
                  <!-- HTTP Write Timeout -->
                  <el-form-item label="HTTP Write Timeout" prop="write_timeout">
                    <el-input
                      v-model="config.write_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      超时写入响应之前的最大持续时间
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="11" class="container">
                  <!-- HTTP Read Header Timeout -->
                  <el-form-item label="HTTP Read Header Timeout" prop="read_header_timeout">
                    <el-input
                      v-model="config.read_header_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      读取header花费的最长时间
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="container">
                  <!-- HTTP Idle Timeout -->
                  <el-form-item label="HTTP Idle Timeout" prop="idle_timeout">
                    <el-input
                      v-model="config.idle_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      启用Keepalive时等待下一个请求的最长时间
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </melody-card-item>
            <!-- Options -->
            <melody-card-item title="Options">
              <!-- Output encoding -->
              <el-form-item label="Output encoding">
                <el-select v-model="config.output_encoding">
                  <el-option
                    v-for="item in output_encoding"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- Allow non-RESTful resource naming -->
              <el-form-item label="Allow non-RESTful resource naming">
                <el-switch v-model="config.disable_rest"></el-switch>
              </el-form-item>
            </melody-card-item>
          </melody-card>

          <melody-card>
            <!-- Bot detector -->
            <melody-card-item title="Bot detector">
              <el-form-item>
                <el-switch v-model="openBotDetector" @change="swtichBotDetector"></el-switch>
              </el-form-item>
              <template v-if="openBotDetector">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <!-- Whitelist -->
                  <el-col :span="11" class="container">
                    <el-form-item label="Whitelist">
                      <el-input
                        v-model="curWhitelist"
                        placeholder="MyAndroidClient/1.0"
                        @keyup.enter.native="saveWhitelist"
                      ></el-input>
                      <el-tag
                        v-for="(white, index) in melody_botdetector.whitelist"
                        :key="index"
                        closable
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        @close="handleWhitelistTagClose(white)"
                      >
                        {{ white }}
                      </el-tag>
                      <div class="fs12">
                        受信任的User-Agent列表(精确匹配)
                      </div>
                    </el-form-item>
                  </el-col>
                  <!-- Blacklist -->
                  <el-col :span="11" class="container">
                    <el-form-item label="Blacklist">
                      <el-input
                        v-model="curBlacklist"
                        placeholder="axios/0.17.1"
                        @keyup.enter.native="saveBlacklist"
                      ></el-input>
                      <el-tag
                        v-for="(black, index) in melody_botdetector.blacklist"
                        :key="index"
                        closable
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        @close="handleBlacklistTagClose(black)"
                      >
                        {{ black }}
                      </el-tag>
                      <div class="fs12">
                        立即拒绝的User-Agent列表(精确匹配)
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- Patterns -->
                <el-form-item label="Patterns">
                  <el-input
                    v-model="curPatterns"
                    placeholder="(facebookexternalhit)/.*"
                    @keyup.enter.native="savePatterns"
                  ></el-input>
                  <el-tag
                    v-for="(pattern, index) in melody_botdetector.patterns"
                    :key="index"
                    closable
                    type="info"
                    :style="index == 0 ? {} : { 'margin-left': '10px' }"
                    @close="handlePatternsTagClose(pattern)"
                  >
                    {{ pattern }}
                  </el-tag>
                  <div class="fs12">
                    拒绝被正则表达式匹配到的User-Agent。
                  </div>
                </el-form-item>
                <!-- Cache size -->
                <el-form-item label="Cache size">
                  <el-input-number v-model="melody_botdetector.cacheSize"></el-input-number>
                  <div class="fs12">
                    缓存用户代理的数量，以加快检测的速度。使用0表示不缓存。
                  </div>
                </el-form-item>
              </template>
            </melody-card-item>
          </melody-card>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="23" class="container">
          <melody-card>
            <melody-card-item title="HTTP Client settings (高级)">
              <div class="fs12">
                这些是用于处理查询后端的HTTP客户端的特定设置。您通常不需要设置这些值。
              </div>
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="7" class="container">
                  <!-- IDLE Connection Timeout -->
                  <el-form-item label="IDLE Connection Timeout" prop="idle_connection_timeout">
                    <el-input
                      v-model="config.idle_connection_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      在keep-alive的情况下，空闲连接在关闭自身之前将保持空闲的最长时间。<code>0</code>表示无限制。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="7" class="container">
                  <!-- Response Header Timeout -->
                  <el-form-item label="Response Header Timeout" prop="response_header_timeout">
                    <el-input
                      v-model="config.response_header_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      发送请求后，等待服务器的响应头的时间。该时间不包括读取响应正文的时间。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="7" class="container">
                  <!-- Expect Continue Timeout -->
                  <el-form-item label="Expect Continue Timeout" prop="expect_continue_timeout">
                    <el-input
                      v-model="config.expect_continue_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      如果在header中存在<code>"Expect: 100-continue"</code>
                      ，那么这个时间则是在发送请求的header之后等待服务器第一次响应的时间。<code>0</code>表示无限制。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="5" class="container">
                  <!-- Maximum IDLE connections -->
                  <el-form-item label="Maximum IDLE connections" prop="max_idle_connections">
                    <el-input
                      v-model="config.max_idle_connections"
                      placeholder="0"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      所有主机之间的最大空闲（keep-alive）连接数。
                      <code>0</code>表示无限制。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="container">
                  <!-- Maximum IDLE connections per host -->
                  <el-form-item
                    label="Maximum IDLE connections per host"
                    prop="max_idle_connections_per_host"
                  >
                    <el-input
                      v-model="config.max_idle_connections_per_host"
                      placeholder="0"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      每个主机允许的最大空闲连接数。默认为<code>250</code>。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="container">
                  <!-- Disable Keep-Alives -->
                  <el-form-item label="Disable Keep-Alives">
                    <el-switch v-model="config.disable_keep_alives"></el-switch>
                    <div class="fs12">
                      如果设置，则防止在不同的HTTP请求之间重用TCP连接。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="container">
                  <!-- Disable Compression -->
                  <el-form-item label="Disable Compression">
                    <el-switch v-model="config.disable_compression"></el-switch>
                    <div class="fs12">
                      如果设置，则阻止传输请求压缩的带有
                      <code>"Accept-Encoding: gzip"</code>请求头的请求。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="7" class="container">
                  <!-- Dialer Timeout -->
                  <el-form-item label="Dialer Timeout" prop="dialer_timeout">
                    <el-input
                      v-model="config.dialer_timeout"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      拨号等待连接完成的最长时间。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="7" class="container">
                  <!--Dialer Fallback Delay -->
                  <el-form-item label="Dialer Fallback Delay" prop="dialer_fallback_delay">
                    <el-input
                      v-model="config.dialer_fallback_delay"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      FallbackDelay指定在生成RFC 6555快速后备连接之前要等待的时间。
                      也就是说，这是在假设IPv6配置错误并退回到IPv4之前等待IPv6成功的时间。如果为零，则使用默认延迟300ms。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="7" class="container">
                  <!-- Dialer Keep-Alive -->
                  <el-form-item label="Dialer Keep-Alive" prop="dialer_keep_alive">
                    <el-input
                      v-model="config.dialer_keep_alive"
                      placeholder="0s"
                      autocomplete="off"
                    ></el-input>
                    <div class="fs12">
                      TCP心跳检测时间间隔。默认为15s。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
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

export default {
  name: 'Service',
  data() {
    let serviceConfig = this.$store.getters.serviceConfig
    return {
      config: serviceConfig,
      serviceConfigRules: {
        extra_config: {
          melody_cors: {
            max_age: [{ validator: validTimeDuration, trigger: 'blur' }],
          },
        },
        port: [{ validator: validNumber, trigger: 'blur' }],
        read_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        cache_ttl: [{ validator: validTimeDuration, trigger: 'blur' }],
        write_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        idle_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        read_header_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        idle_connection_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        response_header_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        expect_continue_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        max_idle_connections: [{ validator: validNumber, trigger: 'blur' }],
        max_idle_connections_per_host: [{ validator: validNumber, trigger: 'blur' }],
        dialer_timeout: [{ validator: validTimeDuration, trigger: 'blur' }],
        dialer_fallback_delay: [{ validator: validTimeDuration, trigger: 'blur' }],
        dialer_keep_alive: [{ validator: validTimeDuration, trigger: 'blur' }],
      },

      etcdDisabled: serviceConfig.extra_config.melody_etcd == undefined,
      disableSanitize: false,
      curSDType: 'static address resolution',
      curAvailableHost: '',
      availableHosts: this.$store.getters.availableHosts,

      output_encoding: [
        { value: 'json', label: 'JSON' },
        { value: 'string', label: 'String(text/plain)' },
        { value: 'no-op', label: 'No-op(just proxy)' },
      ],

      openEnableHTTPS: serviceConfig.tls !== undefined,
      openCORS: serviceConfig.extra_config.melody_cors !== undefined,
      openBotDetector: serviceConfig.extra_config.melody_botdetector !== undefined,

      curOrigin: '',
      curAllowHeader: '',
      curExposeHeader: '',
      curWhitelist: '',
      curBlacklist: '',
      curPatterns: '',

      tls:
        serviceConfig.tls == undefined
          ? {
              public_key: '',
              private_key: '',
            }
          : serviceConfig.tls,
      melody_cors:
        serviceConfig.extra_config.melody_cors == undefined
          ? {
              allow_origins: ['*'],
              expose_headers: ['Content-Length'],
              max_age: '12h',
              allow_methods: ['GET', 'POST'],
              allow_headers: ['*'],
              allow_credentials: false,
            }
          : serviceConfig.extra_config.melody_cors,
      melody_botdetector:
        serviceConfig.extra_config.melody_botdetector == undefined
          ? {
              cacheSize: 0,
              whitelist: [],
              blacklist: [],
              patterns: [],
            }
          : serviceConfig.extra_config.melody_botdetector,
    }
  },
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  methods: {
    saveAvailableHosts() {
      if (
        this.availableHosts.indexOf(this.curSDType.split(' ')[0] + ' - ' + this.curAvailableHost) ==
        -1
      ) {
        this.availableHosts.push(this.curSDType.split(' ')[0] + ' - ' + this.curAvailableHost)
        this.$store.commit('setAvailableHosts', this.availableHosts)
        this.curAvailableHost = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    saveOrigin() {
      let origins = this.melody_cors.allow_origins
      if (origins.indexOf(this.curOrigin) == -1) {
        origins.push(this.curOrigin)
        this.melody_cors.allow_origins = origins
        this.curOrigin = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    saveAllowHeader() {
      let headers = this.melody_cors.allow_headers
      if (headers.indexOf(this.curAllowHeader) == -1) {
        headers.push(this.curAllowHeader)
        this.melody_cors.allow_headers = headers
        this.curAllowHeader = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    saveExposeHeader() {
      let headers = this.melody_cors.expose_headers
      if (headers.indexOf(this.curExposeHeader) == -1) {
        headers.push(this.curExposeHeader)
        this.melody_cors.expose_headers = headers
        this.curExposeHeader = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    saveWhitelist() {
      let whitelist = this.melody_botdetector.whitelist
      if (whitelist.indexOf(this.curWhitelist) == -1) {
        whitelist.push(this.curWhitelist)
        this.melody_botdetector.whitelist = whitelist
        this.curWhitelist = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    saveBlacklist() {
      let blacklist = this.melody_botdetector.blacklist
      if (blacklist.indexOf(this.curBlacklist) == -1) {
        blacklist.push(this.curBlacklist)
        this.melody_botdetector.blacklist = blacklist
        this.curBlacklist = ''
      } else {
        this.$message({
          message: '请勿重复添加',
        })
      }
    },
    savePatterns() {
      let patterns = this.melody_botdetector.patterns
      if (patterns.indexOf(this.curPatterns) == -1) {
        patterns.push(this.curPatterns)
        this.melody_botdetector.patterns = patterns
        this.curPatterns = ''
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
    handleAllowedOriginsTagClose(value) {
      this.melody_cors.allow_origins.splice(this.melody_cors.allow_origins.indexOf(value), 1)
    },
    handleAllowedHeadersTagClose(value) {
      this.melody_cors.allow_headers.splice(this.melody_cors.allow_headers.indexOf(value), 1)
    },
    handleExposeHeadersTagClose(value) {
      this.melody_cors.expose_headers.splice(this.melody_cors.expose_headers.indexOf(value), 1)
    },
    handleWhitelistTagClose(value) {
      this.melody_botdetector.whitelist.splice(this.melody_botdetector.whitelist.indexOf(value), 1)
    },
    handleBlacklistTagClose(value) {
      this.melody_botdetector.blacklist.splice(this.melody_botdetector.blacklist.indexOf(value), 1)
    },
    handlePatternsTagClose(value) {
      this.melody_botdetector.patterns.splice(this.melody_botdetector.patterns.indexOf(value), 1)
    },
    swtichEnableHTTPS(enable) {
      if (enable) {
        this.config.tls = this.tls
      } else {
        delete this.config.tls
      }
    },
    swtichCORS(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_cors',
          config: this.melody_cors,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_cors' })
      }
    },
    swtichBotDetector(enable) {
      if (enable) {
        this.$store.commit('setExtraConfig', {
          name: 'melody_botdetector',
          config: this.melody_botdetector,
        })
      } else {
        this.$store.commit('removeExtraConfig', { name: 'melody_botdetector' })
      }
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
    melody_cors: {
      handler: function() {
        this.$refs.config.validate(valid => {
          if (valid) {
            this.$store.commit('setExtraConfig', {
              name: 'melody_cors',
              config: this.melody_cors,
            })
          }
        })
      },
      deep: true,
    },
    melody_botdetector: {
      handler: function() {
        this.$store.commit('setExtraConfig', {
          name: 'melody_botdetector',
          config: this.melody_botdetector,
        })
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
