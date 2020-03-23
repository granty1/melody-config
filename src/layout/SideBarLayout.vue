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
                <i class="el-icon-odometer"></i>
                <el-tag size="medium" :type="endpoint.method == 'GET' ? 'success' : ''">
                  {{ endpoint.method }}
                </el-tag>
                {{ endpoint.url }}
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
export default {
  name: 'SideBar',
  data() {
    return {
      endpoints: [],
      isCollapse: this.$store.getters.isCollapse,
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
  computed: {
    myCollapse() {
      return this.$store.getters.isCollapse
    },
  },
  watch: {
    myCollapse: function(newVal) {
      this.isCollapse = newVal
      // if(newVal === false){

      // }else {

      // }
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
