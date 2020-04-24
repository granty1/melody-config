<template>
  <div>
    <p v-bind:class="{ myhidden: !isEndpointsNone }">还没有endpoint哦！</p>
    <el-form v-bind:class="{ myhidden: isEndpointsNone }">
      <!-- endponit -->
      <melody-card>
        <melody-card-item title="Endpoint Config">
          <!-- 端点地址、方法、地址 -->
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="端点地址(name)">
                <el-input
                  placeholder="输入后端地址"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.endpoint"
                ></el-input>
                <div class="fs12">
                  这是您的客户端将连接到的URI。必须以斜线开头。同时你也可以使用{parameters}的形式传递参数。
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="请求的方法(Method)" style="float:left;width:47%">
                <el-select v-model="curendpoint.method" placeholder="请选择">
                  <el-option
                    v-for="item in methods"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <div class="fs12">
                  HTTP请求方法
                </div>
              </el-form-item>
              <el-form-item label="输出格式(Output)" style="float:left;margin-left:20px;width:47%">
                <el-select v-model="curendpoint.output_encoding" placeholder="请选择">
                  <el-option
                    v-for="item in outputs"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <div class="fs12">
                  请求数据的编码格式
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 允许通过的请求查询参数和请求头 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="允许的请求查询参数 (?param=value)">
                <el-input
                  clearable
                  placeholder="parameter_name"
                  @keyup.enter.native="addParameterHandle"
                  v-model="endCfg.curParameter"
                >
                  <el-button slot="append" @click="addParameterHandle" type="primary"
                    >Add parameter</el-button
                  >
                </el-input>
                <div v-if="curendpoint.querystring_params">
                  <template v-for="(item, index) in curendpoint.querystring_params">
                    <el-tag
                      type="info"
                      :style="index == 0 ? {} : { 'margin-left': '10px' }"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      @close="removeParameterHandle(index)"
                      >{{ item }}</el-tag
                    >
                  </template>
                </div>
                <div style="font-size: 12px">
                  <p>查询要传递到后端的字符串参数。只写参数的名称，没有问号或相等的符号。</p>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="允许通过的请求头(Headers)">
                <el-input
                  clearable
                  placeholder="header_name"
                  @keyup.enter.native="addHeaderHandle"
                  v-model="endCfg.curHeader"
                >
                  <el-button slot="append" @click="addHeaderHandle" type="primary"
                    >Add Header</el-button
                  >
                </el-input>
                <div v-if="curendpoint.headers_to_pass">
                  <template v-for="(item, index) in curendpoint.headers_to_pass">
                    <el-tag
                      type="info"
                      :style="index == 0 ? {} : { 'margin-left': '10px' }"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      @close="removeHeaderHandle(index)"
                      >{{ item }}</el-tag
                    >
                  </template>
                </div>
                <div style="font-size: 12px">
                  允许头文件从客户端传递到每个后端。这些标头不是附加的，而是设置后的替换。只有在需要自定义标头返回时才使用，但要确保声明所有需要的标头(包括Content-Type)。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 并发数与组合器 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="并发数(concurrent_calls)">
                <el-input
                  placeholder="输入并发数"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.concurrent_calls"
                ></el-input>
                <div class="fs12">
                  要发送到后端以处理相同请求的并行请求。最快的请求被接受，其余的被丢弃。这个值应该在1和3之间(如果后端能够支持非常高的负载，则更高)
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自定义组合器(combiner)">
                <el-input
                  placeholder="combiner name"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint['extra_config']['melody_proxy']['combiner']"
                ></el-input>
                <div class="fs12">
                  如果您有一个自定义组合器，请在这里配置它，以便使用您的自定义配置修改代理管道(指定合并后端响应的组合器。)
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <!-- 时间延迟和缓存 -->
        <melody-card-item title="Timeout and Cache TTL">
          <div class="fs12">
            下面的所有设置都是在服务配置中定义的，在这里设置一个或多个值意味着仅覆盖此特定端点的设置。
            <br />有效时间单位为: ns, us, (or µs), ms, s, m, h E.g: 1s
          </div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="时延(timeout)">
                <el-input
                  placeholder="timeout"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.timeout"
                ></el-input>
                <div class="fs12">
                  等待最慢响应的时间最长。通常以毫秒为单位。
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="缓存时间(cache_ttl)">
                <el-input
                  placeholder="cache_ttl"
                  suffix-icon="el-icon-edit"
                  v-model="curendpoint.cache_ttl"
                ></el-input>
                <div class="fs12">
                  代理可以将请求缓存到此端点的时间。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <!-- rate limit -->
        <melody-card-item title="Rate limit">
          <el-row>
            <el-col :span="24">
              <el-form-item label="请求次数限制"
                ><br />
                <el-switch @change="switchRateLimit" v-model="enableRateLimit"></el-switch>
                <span style="margin-left:20px"
                  >Enable rate limiting for {{ curendpoint.endpoint }}</span
                >
                <p>限制此端点可以接收的请求数量。</p>
                <template v-if="enableRateLimit">
                  <el-row>
                    <el-form-item label="每秒最大请求数(Rate limit)">
                      <el-input
                        placeholder="0"
                        suffix-icon="el-icon-edit"
                        v-model="curendpoint['extra_config']['melody_ratelimit_router']['maxRate']"
                      ></el-input>
                      <div class="fs12">
                        要让此端点处理的每秒最大请求。每秒最大请求为0时速率限制器不起作用
                      </div>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-switch v-model="enableClientRateLimit"></el-switch>
                      <span style="margin-left:20px">Enable client rate limiting</span>
                      <template v-if="enableClientRateLimit">
                        <el-row>
                          <el-form-item label="设置不同客户端的每秒最大请求数(Client Rate limit)">
                            <el-input
                              placeholder="0"
                              suffix-icon="el-icon-edit"
                              v-model="
                                curendpoint['extra_config']['melody_ratelimit_router'][
                                  'clientMaxRate'
                                ]
                              "
                            ></el-input>
                            <div class="fs12">
                              您希望允许每个不同API用户每秒的最大请求数。该值将作为所有端点的默认值使用，除非在每个端点中覆盖该值,使用0没有限制。
                            </div>
                          </el-form-item>
                          <el-radio
                            v-model="
                              curendpoint['extra_config']['melody_ratelimit_router']['strategy']
                            "
                            label="ip"
                            @change="setStrategyKey"
                            >根据IP识别客户端</el-radio
                          ><br />
                          <el-radio
                            v-model="
                              curendpoint['extra_config']['melody_ratelimit_router']['strategy']
                            "
                            label="header"
                            @change="setStrategyKey"
                            >根据Header识别客户端</el-radio
                          >
                          <template
                            v-if="
                              curendpoint['extra_config']['melody_ratelimit_router']['strategy'] &&
                                curendpoint['extra_config']['melody_ratelimit_router'][
                                  'strategy'
                                ] === 'header'
                            "
                          >
                            <el-input
                              placeholder="key"
                              suffix-icon="el-icon-edit"
                              v-model="
                                curendpoint['extra_config']['melody_ratelimit_router']['key']
                              "
                            ></el-input>
                          </template>
                        </el-row>
                      </template>
                    </el-col>
                  </el-row>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
        <melody-card-item title="JWT validation">
          <el-row>
            <el-col :span="24">
              <el-form-item label="JWT validation"
                ><br />
                <el-switch @change="switchJWTvalidation" v-model="enableJWTvalidation"></el-switch>
                <span style="margin-left:20px"
                  >Enable JWT validation for {{ curendpoint.endpoint }}</span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="enableJWTvalidation">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="JWK地址(JWK URI)">
                  <el-input
                    suffix-icon="el-icon-edit"
                    v-model="curendpoint['extra_config']['melody_jose_validator']['jwk-url']"
                  ></el-input>
                  <div class="fs12">
                    指向JWK端点的URL，其中包含一组用于验证JWT的真实性的公钥。
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="算法(Algorithm)">
                  <el-select
                    style="width:100%"
                    v-model="curendpoint['extra_config']['melody_jose_validator']['alg']"
                  >
                    <el-option v-for="item in alg" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <div class="fs12">
                    数字签名和MACs算法
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="Issuer">
                  <el-input
                    suffix-icon="el-icon-edit"
                    v-model="curendpoint['extra_config']['melody_jose_validator']['issuer']"
                  ></el-input>
                  <div class="fs12">
                    预期的发行人
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="受众(Audience)">
                  <el-input
                    clearable
                    placeholder="http://api.example.com"
                    @keyup.enter.native="addAudienceHandle"
                    v-model="endCfg.audience"
                  >
                    <el-button slot="append" @click="addAudienceHandle" type="primary"
                      >Add</el-button
                    >
                  </el-input>
                  <div v-if="curendpoint['extra_config']['melody_jose_validator']['audience']">
                    <template
                      v-for="(item, index) in curendpoint['extra_config']['melody_jose_validator'][
                        'audience'
                      ]"
                    >
                      <el-tag
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @close="removeAudienceHandle(index)"
                        >{{ item }}</el-tag
                      >
                    </template>
                  </div>
                  <div class="fs12">
                    <p>此端点支持的所有受众的列表</p>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色(Roles)">
                  <el-input
                    clearable
                    placeholder="admin"
                    @keyup.enter.native="addRolesHandle"
                    v-model="endCfg.Roles"
                  >
                    <el-button slot="append" @click="addRolesHandle" type="primary">Add</el-button>
                  </el-input>
                  <div v-if="curendpoint['extra_config']['melody_jose_validator']['roles']">
                    <template
                      v-for="(item, index) in curendpoint['extra_config']['melody_jose_validator'][
                        'roles'
                      ]"
                    >
                      <el-tag
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @close="removeRolesHandle(index)"
                        >{{ item }}</el-tag
                      >
                    </template>
                  </div>
                  <div class="fs12">
                    允许访问此端点的所有角色的列表。
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Roles Key">
                  <el-input
                    suffix-icon="el-icon-edit"
                    v-model="curendpoint['extra_config']['melody_jose_validator']['roles_key']"
                  ></el-input>
                  <div class="fs12">
                    存储角色的密钥名。
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Cookie name">
                  <el-input
                    suffix-icon="el-icon-edit"
                    v-model="curendpoint['extra_config']['melody_jose_validator']['cookie_key']"
                  ></el-input>
                  <div class="fs12">
                    cookie的密钥名。
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="指纹(jwk_fingerprints)">
                  <el-input
                    clearable
                    @keyup.enter.native="addFingerprintHandle"
                    v-model="endCfg.fingerprint"
                  >
                    <el-button slot="append" @click="addFingerprintHandle" type="primary"
                      >Add</el-button
                    >
                  </el-input>
                  <div
                    v-if="curendpoint['extra_config']['melody_jose_validator']['jwk_fingerprints']"
                  >
                    <template
                      v-for="(item, index) in curendpoint['extra_config']['melody_jose_validator'][
                        'jwk_fingerprints'
                      ]"
                    >
                      <el-tag
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @click="removeFingerprintHandle(index)"
                        >{{ item }}</el-tag
                      >
                    </template>
                  </div>
                  <div class="fs12">
                    <p>所有的指纹必须在base64中。</p>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="自定义密码套件(Custom Cipher Suites)">
                  <el-select
                    multiple
                    style="width:100%"
                    v-model="curendpoint['extra_config']['melody_jose_validator']['cipher_suites']"
                  >
                    <el-option
                      v-for="item in cipher"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div class="fs12">
                    将会覆盖默认密码套件。
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="">
                  <el-checkbox
                    v-model="curendpoint['extra_config']['melody_jose_validator']['cache']"
                    >Enable caching</el-checkbox
                  >
                  <div class="fs12">
                    如果将此值设置为true，那么经过验证的令牌将存储在内存中，以便进行重复验证。
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-checkbox
                    v-model="
                      curendpoint['extra_config']['melody_jose_validator']['disable_jwk_security']
                    "
                    >Disable JWK security</el-checkbox
                  >
                  <div class="fs12">
                    当您使用不安全的连接时(纯http)。
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </melody-card-item>
        <melody-card-item title="JWT signing">
          <el-row>
            <el-col :span="24">
              <el-form-item label="JWT signing"
                ><br />
                <el-switch @change="switchJWTsigning" v-model="enableJWTsigning"></el-switch>
                <span style="margin-left:20px"
                  >Enable JWT signing for {{ curendpoint.endpoint }}</span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="enableJWTsigning">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="JWK地址(JWK URI)">
                  <el-input
                    suffix-icon="el-icon-edit"
                    v-model="curendpoint['extra_config']['melody_jose_signer']['jwk-url']"
                  ></el-input>
                  <div class="fs12">
                    指向JWK端点的URL，其中包含一组用于签名令牌的私钥。
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="算法(Algorithm)">
                  <el-select
                    style="width:100%"
                    v-model="curendpoint['extra_config']['melody_jose_signer']['alg']"
                  >
                    <el-option v-for="item in alg" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <div class="fs12">
                    数字签名和MACs算法
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="标志键(keys-to-sign)">
                  <el-input clearable @keyup.enter.native="addKeysHandle" v-model="endCfg.keys">
                    <el-button slot="append" @click="addKeysHandle" type="primary">Add</el-button>
                  </el-input>
                  <div v-if="curendpoint['extra_config']['melody_jose_signer']['keys-to-sign']">
                    <template
                      v-for="(item, index) in curendpoint['extra_config']['melody_jose_signer'][
                        'keys-to-sign'
                      ]"
                    >
                      <el-tag
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @close="removeKeysHandle(index)"
                        >{{ item }}</el-tag
                      >
                    </template>
                  </div>
                  <div class="fs12">
                    <p>需要签名的特定密钥列表。</p>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密匙标识(Key ID)">
                  <el-input
                    suffix-icon="el-icon-edit"
                    v-model="curendpoint['extra_config']['melody_jose_signer']['kid']"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="指纹(jwk_fingerprints)">
                  <el-input
                    clearable
                    @keyup.enter.native="addFingerprintHandle"
                    v-model="endCfg.fingerprint"
                  >
                    <el-button slot="append" @click="addFingerprintHandle" type="primary"
                      >Add</el-button
                    >
                  </el-input>
                  <div v-if="curendpoint['extra_config']['melody_jose_signer']['jwk_fingerprints']">
                    <template
                      v-for="(item, index) in curendpoint['extra_config']['melody_jose_signer'][
                        'jwk_fingerprints'
                      ]"
                    >
                      <el-tag
                        type="info"
                        :style="index == 0 ? {} : { 'margin-left': '10px' }"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @click="removeFingerprintHandle(index)"
                        >{{ item }}</el-tag
                      >
                    </template>
                  </div>
                  <div class="fs12">
                    <p>所有的指纹必须在base64中。</p>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="自定义密码套件(Custom Cipher Suites)">
                  <el-select
                    multiple
                    style="width:100%"
                    v-model="curendpoint['extra_config']['melody_jose_signer']['cipher_suites']"
                  >
                    <el-option
                      v-for="item in cipher"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div class="fs12">
                    将会覆盖默认密码套件。
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="">
                  <el-checkbox v-model="curendpoint['extra_config']['melody_jose_signer']['full']"
                    >完整的序列化(Full serialization)</el-checkbox
                  >
                  <div class="fs12">
                    使用JSON格式而不是JWT给出的紧凑格式。
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-checkbox
                    v-model="
                      curendpoint['extra_config']['melody_jose_signer']['disable_jwk_security']
                    "
                    >Disable JWK security</el-checkbox
                  >
                  <div class="fs12">
                    当您使用不安全的连接时(纯http)。
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </melody-card-item>
        <!-- 顺序代理 -->
        <melody-card-item title="Backend API calls">
          <el-row>
            <el-col :span="24">
              <el-form-item label="后端API调用"
                ><br />
                <el-switch
                  v-model="curendpoint['extra_config']['melody_proxy']['sequential']"
                  @change="switchSequential"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
                <span style="margin-left:20px">启用顺序代理(sequential proxy)</span>
                <div class="fs12">
                  当启用顺序代理时，后端调用可以使用前一次调用的数据。以前调用的数据在{resp0_XXXX}这样的变量中可用，其中0是后端索引，XXXX是属性。E。g:
                  {resp1_hotel_id}从第二个后端调用中获取字段hotel_id(索引从0开始)。将此变量注入所需的后端端点。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </melody-card-item>
      </melody-card>
      <!-- endponit end -->
      <el-button type="primary" icon="el-icon-plus" @click="addBackendHandle"
        >add backend response</el-button
      >
      <el-button
        type="info"
        icon="el-icon-plus"
        @click="addStaticHandle"
        :disabled="enableStaticRes"
        >add static response</el-button
      >

      <!-- static response -->
      <template v-if="enableStaticRes">
        <el-card style="margin-top:20px">
          <!-- header -->
          <div slot="header">
            <span>Static Response(存根数据)</span>
            <i
              class="el-icon-close"
              style="float: right; padding: 3px 4px; margin-left:10px; cursor:pointer"
              @click="delStaticRes()"
            ></i>
            <i
              class="el-icon-minus"
              style="float: right; padding: 3px 4px; margin-left:10px; cursor:pointer"
              @click="smallStaticRes()"
            ></i>
          </div>
          <!-- header end-->
          <!-- body -->
          <div id="staticResID" class="">
            <el-row>
              <el-col :span="24">
                <el-form-item label="静态响应">
                  <br />
                  <p>
                    当后端失败时，您仍然可以将下面提供的静态数据返回给用户。数据与任何现有的部分响应合并。如果您仍然没有后端，并且希望拥有这些数据，请添加一个无法解析的伪数据。
                  </p>
                  <el-row style="margin-top:20px"
                    ><el-col :span="4">
                      <el-form-item label="响应方式(Strategy)">
                        <el-select
                          v-model="
                            curendpoint['extra_config']['melody_proxy']['static']['strategy']
                          "
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in StaticResponseS"
                            :key="item"
                            :label="item"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </el-form-item> </el-col
                  ></el-row>
                  <el-row :gutter="20" style="margin-top:20px">
                    <el-col :span="12">
                      <el-form-item label="响应内容(data)">
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 5, maxRows: 10 }"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="resdata"
                        >
                        </el-input>
                        <div id="resStaticTip" class="fs12"></div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- body end-->
        </el-card>
      </template>
      <!-- static response end -->
      <!-- backend -->
      <div v-if="curendpoint.backends" style="margin-top:20px">
        <template v-for="(backend, i) in curendpoint.backends">
          <el-card :key="i" style="margin-top:20px">
            <!-- header -->
            <div slot="header">
              <span @click="smallBackend(i)">{{ backend.url_pattern }}</span>
              <i
                class="el-icon-close"
                style="float: right; padding: 3px 4px; margin-left:10px; cursor:pointer"
                @click="delBackend(i)"
              ></i>
              <i
                class="el-icon-minus"
                style="float: right; padding: 3px 4px; margin-left:10px; cursor:pointer"
                @click="smallBackend(i)"
              ></i>
            </div>
            <!-- header end-->
            <!-- body -->
            <div class="myhidden" :data-acback="i">
              <template v-if="hostResolution.length >= 1">
                <el-row>
                  <el-form-item label="主机类型选择(Host resolution)"
                    ><br />
                    <template>
                      <el-radio
                        @change="setSD(backend)"
                        v-for="(hostJ, hostIndex) in hostResolution"
                        :key="hostIndex"
                        v-model="backend.sd"
                        :label="hostJ"
                        >{{ hostJ }}</el-radio
                      >
                    </template>
                    <div class="fs12">已配置的服务发现选项。</div>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="可选的主机(availableHosts)"
                    ><br />
                    <template>
                      <el-checkbox-group v-model="backend.host">
                        <el-checkbox
                          v-for="(j, index) in availableHosts[backend.sd]"
                          :key="index"
                          :label="j"
                        ></el-checkbox>
                      </el-checkbox-group>
                    </template>
                    <div class="fs12">所有的后端可以用来满足这个请求，平衡使用轮询。</div>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="禁用主机消毒处理(Disable host sanitization)"
                    ><br />
                    <el-switch
                      v-model="backend.disable_host_sanitize"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                    <span style="margin-left:20px">启用主机名消毒处理</span>
                    <div class="fs12">检查地址何时不需要验证协议。如果不确定，则保留建议的值。</div>
                  </el-form-item>
                </el-row>
              </template>
              <template v-else
                ><div class="fs12" style="color:red">
                  重要！！！<router-link :to="{ name: 'service' }">请前往添加Host</router-link>
                </div>
                <br
              /></template>
              <el-row :gutter="24">
                <el-col :span="16">
                  <el-form-item label="后端地址(Backend endpoint)">
                    <el-input
                      placeholder="输入地址"
                      suffix-icon="el-icon-edit"
                      v-model="backend.url_pattern"
                    ></el-input>
                    <div class="fs12">
                      这是您要查询的后端服务器的端点。必须以斜线开头。同时你也可以使用{parameters}的形式传递参数。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="请求方法(HTTP Verb)" style="float:left;width:47%">
                    <el-select v-model="backend.method" placeholder="请选择">
                      <el-option
                        v-for="item in methods"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                    <div class="fs12">
                      HTTP请求方法
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="编码(encoding)"
                    style="float:left;margin-left:20px;width:47%"
                  >
                    <el-select v-model="backend.encoding" placeholder="请选择">
                      <el-option
                        v-for="item in outputs"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                    <div class="fs12">
                      请求数据的编码格式
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="黑名单">
                    <el-input
                      clearable
                      placeholder="Blacklist"
                      @keyup.enter.native="addBackendBlacklist(backend)"
                      v-model="black"
                    >
                      <el-button slot="append" @click="addBackendBlacklist(backend)" type="primary"
                        >Add Blacklist</el-button
                      >
                    </el-input>
                    <div v-if="backend.blacklist">
                      <template v-for="(item, index) in backend.blacklist">
                        <el-tag
                          type="info"
                          :style="index == 0 ? {} : { 'margin-left': '10px' }"
                          :key="index"
                          closable
                          :disable-transitions="false"
                          @close="removeBackendBlacklist(backend, index)"
                          >{{ item }}</el-tag
                        >
                      </template>
                    </div>
                    <div style="font-size: 12px">
                      <p>您不会从响应中选择的属性。</p>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="白名单">
                    <el-input
                      clearable
                      placeholder="Whitelist"
                      @keyup.enter.native="addBackendWhitelist(backend)"
                      v-model="white"
                    >
                      <el-button slot="append" @click="addBackendWhitelist(backend)" type="primary"
                        >Add whitelist</el-button
                      >
                    </el-input>
                    <div v-if="backend.whitelist">
                      <template v-for="(item, index) in backend.whitelist">
                        <el-tag
                          type="info"
                          :style="index == 0 ? {} : { 'margin-left': '10px' }"
                          :key="index"
                          closable
                          :disable-transitions="false"
                          @close="removeBackendWhitelist(backend, index)"
                          >{{ item }}</el-tag
                        >
                      </template>
                    </div>
                    <div style="font-size: 12px">
                      您将从响应中选择的属性。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="分组(Capturing group)">
                    <el-input
                      placeholder="my-group"
                      suffix-icon="el-icon-edit"
                      v-model="backend.group"
                    ></el-input>
                    <div class="fs12">
                      只有在希望捕获所有响应并将其封装在属性名中时才填充。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="根对象名(target)">
                    <el-input
                      placeholder="target"
                      suffix-icon="el-icon-edit"
                      v-model="backend.target"
                      :disabled="backend.is_collection"
                    ></el-input>
                    <div class="fs12">
                      一些api返回封装在根对象(通常命名为data、response、items)中的所有内容。在这里指定一个根对象将把它的所有子对象放在第一层。在操作数据时，只有其子数据是可见的。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="最大请求数(Max rate limit)">
                    <el-input
                      placeholder="Max rate limit"
                      suffix-icon="el-icon-edit"
                      v-model="backend['extra_config']['melody_ratelimit_proxy']['maxRate']"
                    ></el-input>
                    <div class="fs12">
                      后端希望接收的每秒最大请求数。
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="桶容量(Capacity)">
                    <el-input
                      placeholder="Capacity"
                      suffix-icon="el-icon-edit"
                      v-model="backend['extra_config']['melody_ratelimit_proxy']['capacity']"
                    ></el-input>
                    <div class="fs12">
                      推荐值= maxRate的值。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="无对象响应(Non-object response)"
                    ><br />
                    <el-switch
                      v-model="backend.is_collection"
                      active-color="#13ce66"
                      @change="switchNonObject(backend)"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                    <span style="margin-left:20px">启用Non-object响应</span>
                    <div class="fs12">
                      将响应视为一个集合，而不是对象。Melody期望返回的内容封装在一个对象中(在json中，e。g:
                      {"status":"OK"}但是如果后端返回一个集合(e。g: ["a"，
                      "b"])选中这个选项。集合将在集合属性中返回。使用下面的重命名将其重命名为任何其他名称。
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <p class="fs12">更改命名(Renaming)</p>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="">
                    <el-input
                      placeholder="Original object"
                      suffix-icon="el-icon-edit"
                      v-model="back.o"
                    ></el-input>
                    <div class="fs12">
                      Original object
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="">
                    <el-input
                      placeholder="Renamed object"
                      suffix-icon="el-icon-edit"
                      v-model="back.r"
                    ></el-input>
                    <div class="fs12">
                      Renamed object
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="">
                    <el-button type="primary" @click="addMapping(backend)">添加</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-if="backend.mapping">
                <template v-for="(item, index) in backend.mapping">
                  <el-tag
                    type="info"
                    :style="index == 0 ? {} : { 'margin-left': '10px' }"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="removeMapping(backend, index)"
                    >{{ index }} -> {{ item }}</el-tag
                  >
                </template>
              </div>
            </div>
            <!-- body end-->
          </el-card>
        </template>
      </div>
      <!-- backend end -->
    </el-form>
  </div>
</template>

<script>
import MelodyCard from '@/components/MelodyCard'
import MelodyCardItem from '@/components/MelodyCardItem'
import Backend from '@/utils/config/Backend.js'
export default {
  name: 'endpoint',
  components: {
    MelodyCard,
    MelodyCardItem,
  },
  mounted: function() {
    this.setInit()
  },
  data() {
    let serviceConfig = this.$store.getters.serviceConfig
    let sdHost = this.$store.getters.availableHosts
    let sdHead = []
    let sdmap = {}
    if (sdHost && sdHost !== undefined) {
      for (let v in sdHost) {
        let h = sdHost[v].split(' - ')[0]
        let hv = sdHost[v].split(' - ')[1]
        if (sdmap[h] === undefined) {
          sdmap[h] = []
          sdmap[h].push(hv)
        } else {
          sdmap[h].push(hv)
        }
        if (sdHead.indexOf(h) === -1) {
          sdHead.push(h)
        }
      }
    }

    return {
      config: serviceConfig,
      endpoints: serviceConfig.endpoints,
      curendpoint: serviceConfig.endpoints[this.$route.params.url * 1],
      isEndpointsNone: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      outputs: ['JSON', 'XML', 'RSS', 'String', 'No-op'],
      StaticResponseS: ['Always', 'Success', 'Errored', 'Incomplete'],
      alg: [
        'EdDSA',
        'HS256',
        'HS384',
        'HS512',
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
        'PS256',
        'PS384',
        'PS512',
      ],
      cipher: [
        {
          value: '5',
          label: 'TLS_RSA_WITH_RC4_128_SHA',
        },
        {
          value: '10',
          label: 'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
        },
        {
          value: '47',
          label: 'TLS_RSA_WITH_AES_128_CBC_SHA',
        },
        {
          value: '53',
          label: 'TLS_RSA_WITH_AES_256_CBC_SHA',
        },
        {
          value: '60',
          label: 'TLS_RSA_WITH_AES_128_CBC_SHA256',
        },
        {
          value: '156',
          label: 'TLS_RSA_WITH_AES_128_GCM_SHA256',
        },
        {
          value: '157',
          label: 'TLS_RSA_WITH_AES_256_GCM_SHA384',
        },
        {
          value: '49159',
          label: 'TLS_ECDHE_ECDSA_WITH_RC4_128_SHA',
        },
        {
          value: '49161',
          label: 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
        },
        {
          value: '49162',
          label: 'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
        },
        {
          value: '49169',
          label: 'TLS_ECDHE_RSA_WITH_RC4_128_SHA',
        },
        {
          value: '49170',
          label: 'TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA',
        },
        {
          value: '49171',
          label: 'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
        },
        {
          value: '49172',
          label: 'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
        },
        {
          value: '49187',
          label: 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
        },
        {
          value: '49191',
          label: 'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
        },
        {
          value: '49195',
          label: 'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
        },
        {
          value: '49196',
          label: 'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
        },
        {
          value: '49199',
          label: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
        },
        {
          value: '49200',
          label: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        },
        {
          value: '52392',
          label: 'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305',
        },
        {
          value: '52393',
          label: 'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305',
        },
      ],
      endCfg: {
        curParameter: '',
        curHeader: '',
        audience: '',
        fingerprint: '',
      },
      resdata: '',
      textarea: '',
      enableRateLimit: false,
      enableJWTvalidation: false,
      enableJWTsigning: false,
      enableClientRateLimit: false,
      enableStaticResponse: false,
      enableStaticRes: false,
      hostResolution: sdHead,
      availableHosts: sdmap,
      checkHosts: [],
      black: '',
      white: '',
      back: {
        o: '',
        r: '',
      },
    }
  },
  methods: {
    setInit() {
      if (
        this.curendpoint['extra_config']['melody_ratelimit_router']['strategy'] ||
        this.curendpoint['extra_config']['melody_ratelimit_router']['clientMaxRate']
      ) {
        this.enableClientRateLimit = true
      } else {
        this.enableClientRateLimit = false
      }
      if (
        this.curendpoint['extra_config']['melody_ratelimit_router']['maxRate'] ||
        this.enableClientRateLimit === true
      ) {
        this.enableRateLimit = true
      } else {
        this.enableRateLimit = false
      }
      if (this.curendpoint['extra_config']['melody_jose_validator']) {
        if (Object.keys(this.curendpoint['extra_config']['melody_jose_validator']).length == 0) {
          this.enableJWTvalidation = false
        } else {
          this.enableJWTvalidation = true
        }
      } else {
        this.enableJWTvalidation = false
      }
      if (this.curendpoint['extra_config']['melody_jose_signer']) {
        if (Object.keys(this.curendpoint['extra_config']['melody_jose_signer']).length == 0) {
          this.enableJWTsigning = false
        } else {
          this.enableJWTsigning = true
        }
      } else {
        this.enableJWTsigning = false
      }
      if (this.curendpoint['extra_config']['melody_proxy']['static']) {
        this.enableStaticRes = true
        if (this.curendpoint['extra_config']['melody_proxy']['static']['data']) {
          this.resdata = JSON.stringify(
            this.curendpoint['extra_config']['melody_proxy']['static']['data'],
            null,
            5
          )
        }
      } else {
        this.enableStaticRes = false
      }
    },
    smallBackend(i) {
      let backArr = document.querySelectorAll('[data-acback]')
      backArr[i].classList.toggle('myhidden')
    },
    smallStaticRes() {
      let st = document.getElementById('staticResID')
      st.classList.toggle('myhidden')
      console.log('ssss')
    },
    addParameterHandle() {
      if (this.curendpoint['querystring_params'] === undefined) {
        this.curendpoint['querystring_params'] = []
      }

      if (
        this.endCfg.curParameter &&
        this.curendpoint['querystring_params'].indexOf(this.endCfg.curParameter) == -1
      ) {
        this.curendpoint['querystring_params'].push(this.endCfg.curParameter)
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
        this.endCfg.curParameter = ''
      }
    },
    removeParameterHandle(index) {
      this.curendpoint['querystring_params'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addHeaderHandle() {
      if (this.curendpoint['headers_to_pass'] === undefined) {
        this.curendpoint['headers_to_pass'] = []
      }

      if (
        this.endCfg.curHeader &&
        this.curendpoint['headers_to_pass'].indexOf(this.endCfg.curHeader) == -1
      ) {
        this.curendpoint['headers_to_pass'].push(this.endCfg.curHeader)
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeHeaderHandle(index) {
      this.curendpoint['headers_to_pass'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addAudienceHandle() {
      if (this.curendpoint['extra_config']['melody_jose_validator']['audience'] === undefined) {
        this.curendpoint['extra_config']['melody_jose_validator']['audience'] = []
      }
      if (
        this.endCfg.audience &&
        this.curendpoint['extra_config']['melody_jose_validator']['audience'].indexOf(
          this.endCfg.audience
        ) === -1
      ) {
        this.curendpoint['extra_config']['melody_jose_validator']['audience'].push(
          this.endCfg.audience
        )
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeAudienceHandle(index) {
      this.curendpoint['extra_config']['melody_jose_validator']['audience'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addRolesHandle() {
      if (this.curendpoint['extra_config']['melody_jose_validator']['roles'] === undefined) {
        this.curendpoint['extra_config']['melody_jose_validator']['roles'] = []
      }
      if (
        this.endCfg.Roles &&
        this.curendpoint['extra_config']['melody_jose_validator']['roles'].indexOf(
          this.endCfg.Roles
        ) === -1
      ) {
        this.curendpoint['extra_config']['melody_jose_validator']['roles'].push(this.endCfg.Roles)
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeRolesHandle(index) {
      this.curendpoint['extra_config']['melody_jose_validator']['roles'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addKeysHandle() {
      if (this.curendpoint['extra_config']['melody_jose_signer']['keys-to-sign'] === undefined) {
        this.curendpoint['extra_config']['melody_jose_signer']['keys-to-sign'] = []
      }
      if (
        this.endCfg.keys &&
        this.curendpoint['extra_config']['melody_jose_signer']['keys-to-sign'].indexOf(
          this.endCfg.keys
        ) === -1
      ) {
        this.curendpoint['extra_config']['melody_jose_signer']['keys-to-sign'].push(
          this.endCfg.keys
        )
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeKeysHandle(index) {
      this.curendpoint['extra_config']['melody_jose_signer']['keys-to-sign'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addFingerprintHandle() {
      if (
        this.curendpoint['extra_config']['melody_jose_validator']['jwk_fingerprints'] === undefined
      ) {
        this.curendpoint['extra_config']['melody_jose_validator']['jwk_fingerprints'] = []
      }
      if (
        this.endCfg.fingerprint &&
        this.curendpoint['extra_config']['melody_jose_validator']['jwk_fingerprints'].indexOf(
          this.endCfg.fingerprint
        ) === -1
      ) {
        this.curendpoint['extra_config']['melody_jose_validator']['jwk_fingerprints'].push(
          this.endCfg.fingerprint
        )
        this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
      }
    },
    removeFingerprintHandle(index) {
      this.curendpoint['extra_config']['melody_jose_validator']['jwk_fingerprints'].splice(index, 1)
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    addBackendHandle() {
      let backend = new Backend()
      this.curendpoint.backends.push(backend)
    },
    addStaticHandle() {
      let staticData = {}
      staticData['strategy'] = 'Incomplete'
      staticData['data'] = {
        new_field_a: 12,
        new_field_b: ['arr1', 'arr2'],
        new_field_c: {
          obj: 'obj1',
        },
      }
      this.resdata = JSON.stringify(staticData['data'], null, 5)
      this.curendpoint['extra_config']['melody_proxy']['static'] = staticData
      this.enableStaticRes = true
    },
    clearCacheHandle() {
      this.endCfg.curParameter = ''
      this.endCfg.curHeader = ''
      this.curendpoint.headers_to_pass = []
      this.curendpoint.querystring_params = []
    },

    setExtraConfig(name, config) {
      this.curendpoint.extra_config[name] = config
    },
    removeExtraConfig(name) {
      delete this.curendpoint.extra_config[name]
    },
    switchSequential(enable) {
      if (this.melody_proxy.sequential !== undefined) {
        this.melody_proxy.sequential = enable
      }
    },
    switchRateLimit(enable) {
      if (this.curendpoint['extra_config']['melody_ratelimit_router'] && !enable) {
        this.curendpoint['extra_config']['melody_ratelimit_router'] = {}
      }
    },
    switchJWTvalidation(enable) {
      if (!enable) {
        if (this.curendpoint['extra_config']['melody_jose_validator']) {
          this.curendpoint['extra_config']['melody_jose_validator'] = {}
        }
      }
    },
    switchJWTsigning(enable) {
      if (!enable) {
        if (this.curendpoint['extra_config']['melody_jose_signer']) {
          this.curendpoint['extra_config']['melody_jose_signer'] = {}
        }
      }
    },
    switchStaticResponse(enable) {
      if (enable) {
        this.melody_proxy['static'] = JSON.parse(JSON.stringify(this.resstatic))
      } else {
        delete this.melody_proxy['static']
      }
    },
    setStrategyKey() {
      if (this.curendpoint['extra_config']['melody_ratelimit_router']['strategy'] !== undefined) {
        if (
          this.curendpoint['extra_config']['melody_ratelimit_router']['key'] !== undefined &&
          this.curendpoint['extra_config']['melody_ratelimit_router']['strategy'] === 'ip'
        ) {
          delete this.curendpoint['extra_config']['melody_ratelimit_router']['key']
        }
      }
    },
    switchNonObject(backend) {
      if (backend.is_collection === true) {
        backend.target = ''
      }
    },
    addBackendWhitelist(backend) {
      if (backend != undefined) {
        if (this.white && backend.whitelist.indexOf(this.white) == -1) {
          backend.whitelist.push(this.white)
        }
      }
    },
    addBackendBlacklist(backend) {
      console.log(backend)
      if (backend != undefined) {
        if (this.black && backend.blacklist.indexOf(this.black) == -1) {
          backend.blacklist.push(this.black)
        }
      }
    },
    removeBackendWhitelist(backend, index) {
      backend.whitelist.splice(index, 1)
    },
    removeBackendBlacklist(backend, index) {
      backend.blacklist.splice(index, 1)
    },
    addMapping(backend) {
      backend.mapping[this.back.o] = this.back.r + ''
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    removeMapping(backend, index) {
      delete backend.mapping[index]
      this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
    },
    reSetcheckHosts(backend) {
      backend.host = this.checkHosts
    },
    splitHost(j) {
      let c = j.split(' - ')
      return c[1]
    },
    delBackend(i) {
      this.curendpoint.backends.splice(i, 1)
    },
    setSD(b) {
      if (b.sd === undefined || b.sd === '') {
        b.sd = 'static'
      }
      b.host = []
      return b.sd
    },
    isJSON(jsonContent) {
      if (typeof jsonContent == 'string') {
        try {
          JSON.parse(jsonContent)
          if (jsonContent.indexOf('{') > -1) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
      return false
    },
    delStaticRes() {
      if (this.curendpoint['extra_config']['melody_proxy']['static']) {
        delete this.curendpoint['extra_config']['melody_proxy']['static']
        this.enableStaticRes = false
      }
    },
  },
  computed: {
    serviceCfg() {
      return this.$store.getters.serviceConfig
    },
  },
  watch: {
    resdata: {
      handler: function() {
        if (this.isJSON(this.resdata)) {
          let tip = document.getElementById('resStaticTip')
          tip.innerHTML = '<span style="color:green">格式正确</span>'
          this.curendpoint['extra_config']['melody_proxy']['static']['data'] = JSON.parse(
            this.resdata
          )
        } else {
          let tip = document.getElementById('resStaticTip')
          tip.innerHTML = '<span style="color:red">格式错误</span>'
        }
      },
      deep: true,
    },
    serviceCfg: {
      handler: function(newVal) {
        if (newVal.endpoints === [] || newVal.endpoints === undefined) {
          this.clearCacheHandle()
          this.isEndpointsNone = true
          this.$router.push('/')
        } else {
          this.curendpoint = JSON.parse(JSON.stringify(this.curendpoint))
          this.isEndpointsNone = false
        }
      },
      deep: true,
    },
    $route() {
      if (this.$route.params.url != undefined) {
        this.curendpoint = this.endpoints[this.$route.params.url * 1]
      }
      this.setInit()
    },
    curendpoint: {
      handler: function() {
        this.config = this.$store.getters.serviceConfig
        this.endpoints = this.config.endpoints || []
        this.curendpoint = this.endpoints[this.$route.params.url * 1]
        this.$store.commit('updateServiceConfig', this.config)
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.myhidden {
  display: none;
}
.el-icon-close:hover {
  background-color: red;
  color: white;
}
.el-icon-minus:hover {
  background-color: #d8d6d6;
}
</style>
