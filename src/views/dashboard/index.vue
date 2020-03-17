<template>
  <div>
    <el-row>
      <!-- 预览 -->
      <el-card :body-style="{ height: '120px', padding: '50px' }" class="box-card item">
        <div style="font-size: 12px; margin-bottom: 30px; margin-left: 40px">
          嗨，感谢您使用Melody
          Configer。该应用程序创建Melody服务加载的配置。为了正确配置服务，请至少执行以下步骤：
        </div>
        <el-col :span="24" class="container">
          <el-steps :active="cur" align-center>
            <template v-for="(item, index) in stepData">
              <el-step :key="index" :title="item.title"
                ><span slot="description" @mouseenter="setCur(index)">{{
                  item.description
                }}</span></el-step
              >
            </template>
          </el-steps>
        </el-col>
      </el-card>
      <el-card class="box-card item"></el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      cur: -1,
      stepData: [
        {
          title: 'Service配置',
          description: '关于Melody服务本身端口、时延、速率限制相关等配置',
        },
        {
          title: 'Endpoints配置',
          description: 'Endpoint对应每一个节点，也就是网关中暴露出去的API',
        },
        {
          title: 'Backends配置',
          description: 'Backend对应后端服务，一个Endpoints下可以配置多个Backends',
        },
        {
          title: '日志监控配置',
          description: '关于整个服务的日志级别、输出方式，以及对各个接口的监控方式。',
        },
        {
          title: '导出配置',
          description: '导出配置文件，供Melody服务启用',
        },
      ],
    }
  },
  methods: {
    setCur(val) {
      this.cur = val
    },
  },
  mounted() {},
}
</script>

<style lang="scss"></style>
