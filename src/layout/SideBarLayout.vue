<template>
  <div>
    <el-container>
      <el-aside class="aside">
        <el-menu router :default-active="$route.name" @open="toEndpoints">
          <el-menu-item index="dashboard" :route="{ name: 'dashboard' }">
            <template slot="title"><i class="el-icon-s-home"></i>控制台</template>
          </el-menu-item>

          <el-menu-item index="service">
            <template slot="title"><i class="el-icon-setting"></i>Service配置</template>
          </el-menu-item>

          <el-menu-item index="sd">
            <template slot="title"> <i class="el-icon-search"></i>服务发现</template>
          </el-menu-item>

          <el-submenu index="endpoints">
            <template slot="title"><i class="el-icon-s-tools"></i>Endpoints</template>

            <el-menu-item-group>
              <span class="title pointer" @click="addEndpoint">添加endpoint</span>
            </el-menu-item-group>

            <el-menu-item v-for="(endpoint, index) in endpoints" :key="index" index="endpoints">
              <template slot="title">
                <i class="el-icon-odometer"></i>
                <el-tag size="medium" :type="endpoint.method == 'GET' ? 'success' : ''">
                  {{ endpoint.method }}
                </el-tag>
                {{ endpoint.url }}
              </template>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="logging">
            <template slot="title"><i class="el-icon-odometer"></i>日志与指标参数</template>
          </el-menu-item>

          <el-menu-item index="import">
            <template slot="title"><i class="el-icon-upload"></i>导入</template>
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
    toEndpoints(index) {
      if (index === 'endpoints' && this.$route.name !== 'endpoints') {
        this.$router.push('endpoints')
      }
    },
    addEndpoint() {
      this.endpoints.push({
        method: 'GET',
        url: '/new_endpoint',
      })
      this.endpoints.push({
        method: 'POST',
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
