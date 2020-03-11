<template>
  <div>
    <el-container>
      <el-aside class="aside">
        <el-menu :default-openeds="['1', '1']" router>
          <el-menu-item index="dashboard" :route="{ name: 'dashboard' }">
            <template slot="title"><i class="el-icon-s-home"></i>Dashboard</template>
          </el-menu-item>

          <el-menu-item index="service">
            <template slot="title"><i class="el-icon-setting"></i>Service configuration</template>
          </el-menu-item>

          <el-menu-item index="service-discovery">
            <template slot="title">
              <i class="el-icon-search"></i>Service Discovery and hosts
            </template>
          </el-menu-item>

          <el-submenu index="endpoints">
            <template slot="title"><i class="el-icon-s-tools"></i>Endpoints</template>
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
export default {}
</script>

<style lang="scss" scoped>
.aside {
  min-height: 700px;
  border-right: 1px solid #eaecef;
}
</style>
