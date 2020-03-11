<template>
  <div>
    <el-container>
      <el-aside>
        <el-menu :default-openeds="['1', '1']" router>
          <el-menu-item index="dashboard">
            <template slot="title"><i class="el-icon-message"></i>Dashboard</template>
          </el-menu-item>

          <el-menu-item index="service">
            <template slot="title"><i class="el-icon-menu"></i>Service configuration</template>
          </el-menu-item>

          <el-menu-item index="service-discovery">
            <template slot="title">
              <i class="el-icon-setting"></i>Service Discovery and hosts
            </template>
          </el-menu-item>

          <el-submenu index="endpoints">
            <template slot="title"><i class="el-icon-menu"></i>Endpoints</template>
            <el-menu-item-group>
              <template slot="title">Add endpoint</template>
            </el-menu-item-group>
          </el-submenu>
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
  name: 'home',
  data() {
    return {
      serviceConfig: {
        version: 1,
        serviceName: 'Hello Melody',
      },
    }
  },
  mounted() {
    console.log(this.serviceConfig)
  },
}
</script>

<style lang="scss" scoped></style>
