<template>
  <div>
    <el-container>
      <el-aside v-bind:class="{ myhidden: isCollapse }">
        <!-- <span class="myspan"><i class="el-icon-menu"></i></span> -->
        <el-menu router :default-active="$route.name" :collapse="myCollapse">
          <el-menu-item index="dashboard" :route="{ name: 'dashboard' }">
            <i class="el-icon-document"></i><span slot="title">开始</span>
          </el-menu-item>

          <el-menu-item index="service" :route="{ name: 'service' }">
            <i class="el-icon-setting"></i><span slot="title">Service</span>
          </el-menu-item>

          <el-menu-item index="sd" :route="{ name: 'sd' }">
            <i class="el-icon-search"></i><span slot="title">服务发现</span>
          </el-menu-item>

          <el-submenu index="safe">
            <template slot="title"
              ><i class="el-icon-s-goods"></i><span slot="title">安全选项</span></template
            >
            <el-menu-item index="safe" :route="{ name: 'safe' }">
              <template slot="title">
                <i class="el-icon-news"></i><span slot="title">响应头配置</span></template
              >
            </el-menu-item>
          </el-submenu>

          <el-submenu index="endpoints">
            <template slot="title"
              ><i class="el-icon-s-tools"></i><span slot="title">Endpoints</span></template
            >

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
                <!-- <i class="el-icon-odometer"></i> -->
                <i class="el-icon-delete" @click="delEndpointConfirm(index)"></i>
                <el-tag size="medium" :type="methodType(endpoint.method)">
                  {{ endpoint.method }}
                </el-tag>
                {{ easyEndpoint(endpoint.endpoint) }}
                <!-- <i class="el-icon-delete" style="margin-left:43px" @click="delEndpointConfirm(index)"></i> -->
              </template>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="logging" :route="{ name: 'logging' }">
            <!-- <template slot="title"><i class="el-icon-odometer"></i><span slot="title">日志与监控</span></template> -->
            <i class="el-icon-odometer"></i><span slot="title">日志与监控</span>
          </el-menu-item>

          <el-menu-item index="import" :route="{ name: 'import' }">
            <i class="el-icon-upload"></i><span slot="title">配置生成</span>
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
import EndpointConfig from '@/utils/config/EndpointConfig.js'
export default {
  name: 'SideBar',
  data() {
    return {
      endpoints: this.$store.getters.serviceConfig.endpoints || [],
      isCollapse: this.$store.getters.isCollapse,
    }
  },
  methods: {
    addEndpoint() {
      const endpointConfig = new EndpointConfig()
      this.$store.commit('addEndpointConfig', endpointConfig)
    },
    methodType(method) {
      if (method === 'GET') {
        return 'success'
      } else if (method === 'POST') {
        return 'warning'
      } else if (method === 'DELETE') {
        return 'danger'
      } else {
        return 'info'
      }
    },
    easyEndpoint(name) {
      if (name.length <= 13) {
        if(name && name.length>0){
          return name
        }else {
          return 'none'
        }
        
      } else {
        let n = name.slice(0, 13) + ''
        name = n + '...'
        return name
      }
    },
    easyEndpointMethod(m) {
      if(m && m != '' && m != undefined){
        return m
      } else {
        return 'none'
      }
    },
    delEndpointConfirm(index) {
      this.$confirm('此操作将删除该endpoint配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.endpointCfg.splice(index, 1)
          if (this.endpointCfg.length >= 1) {
            let i = index % this.endpointCfg.length
            this.$router.push({ name: 'endpoints', path: '/endpoints', params: { url: i } })
          } else {
            this.$router.push('/')
          }

          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
  computed: {
    myCollapse() {
      return this.$store.getters.isCollapse
    },
    endpointCfg() {
      return this.$store.getters.serviceConfig.endpoints
    },
  },
  watch: {
    myCollapse: function(newVal) {
      this.isCollapse = newVal
    },
    endpointCfg: {
      handler: function(newVal) {
        this.endpoints = newVal
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.aside {
  min-height: 700px;
  height: 100%;
}

.myspan {
  display: block;
  width: 40px;
  height: 40px;
  background-color: aqua;
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

.myhidden {
  display: none;
}
</style>
