<template>
  <div>
    <!-- 头部 -->
    <header class="navbar">
      <el-row>
        <!-- logo -->
        <el-col :span="4">
          <router-link :to="{ name: 'home' }">
            <img class="navbar-logo" src="../assets/img/melodylogo.png" alt="" />
            <span>Melody</span>
          </router-link>
        </el-col>
        <!-- list -->
        <el-col class="navbar-list" :span="15">
          <div>
            <span>
              Features
            </span>
            <span>
              Download
            </span>
            <span>
              Documentation
            </span>
          </div>
        </el-col>
        <!-- user -->
        <el-col :span="5"> </el-col>
      </el-row>
    </header>
    <!-- 主体部分 -->
    <router-view class="main" />
    <!-- 尾部 -->
    <div class="footer">MIT Licensed | Copyright © 2020 ❤️ Melody-Team</div>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout',
}
</script>

<style scoped>
.navbar {
  height: 3rem;
  background-color: #fff;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  padding: 0.2rem 1rem 1rem;
  line-height: 2rem;
}

.navbar-logo {
  height: 2.2rem;
  min-width: 2.2rem;
  margin-right: 0.8rem;
  vertical-align: top;
}

a span {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.navbar-list span {
  margin-right: 1.3rem;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
}

.footer {
  padding: 2.5rem;
  border-top: 1px solid #eaecef;
  text-align: center;
  color: #4e6e8e;
}

.main {
  min-height: 600px;
}
</style>
