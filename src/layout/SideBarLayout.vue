<template>
  <div>
    <el-container>
      <el-aside class="aside">
        <el-menu router :default-active="$route.name">
          <el-menu-item index="dashboard" :route="{ name: 'dashboard' }">
            <template slot="title"><i class="el-icon-document"></i>开始</template>
          </el-menu-item>

          <el-menu-item index="service" :route="{ name: 'service' }">
            <template slot="title"><i class="el-icon-setting"></i>Service</template>
          </el-menu-item>

          <el-menu-item index="sd" :route="{ name: 'sd' }">
            <template slot="title"> <i class="el-icon-search"></i>服务发现</template>
          </el-menu-item>

          <el-submenu index="safe">
            <template slot="title"><i class="el-icon-s-goods"></i>安全选项</template>
            <el-menu-item index="safe" :route="{ name: 'safe' }">
              <template slot="title"> <i class="el-icon-news"></i>响应头配置</template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="endpoints">
            <template slot="title"><i class="el-icon-s-tools"></i>Endpoints</template>

            <el-menu-item-group>
              <span class="title pointer" @click="addEndpoint">添加endpoint</span>
            </el-menu-item-group>

            <el-menu-item
              v-for="(endpoint, index) in endpoints"
              :key="`key-${index}`"
              :index="index + ''"
              :route="{ name: 'endpoints', params: { url: index } }"
            >
              <template slot="title">
                <i class="el-icon-odometer"></i>
                <el-tag size="medium" :type="endpoint.method == 'GET' ? 'success' : ''">
                  {{ endpoint.method }}
                </el-tag>
                {{ endpoint.url }}
              </template>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="logging" :route="{ name: 'logging' }">
            <template slot="title"><i class="el-icon-odometer"></i>日志与监控</template>
          </el-menu-item>

          <el-menu-item index="import" :route="{ name: 'import' }">
            <template slot="title"><i class="el-icon-upload"></i>配置生成</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  data() {
    return {
      endpoints: [],
    }
  },
  methods: {
    addEndpoint() {
      this.endpoints.push({
        method: 'GET',
        url: '/new_endpoint',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.aside {
  min-height: 700px;
  border-right: 1px solid #eaecef;
}

.title {
  display: block;
  padding: 7px 0 7px 40px;
  line-height: normal;
  font-size: 12px;
  color: #909399;
}

.pointer {
  cursor: pointer;
}
</style>
