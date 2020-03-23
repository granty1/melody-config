<template>
  <el-card class="box-card" v-bind:data-parm="this.$route.params.url">
    <div slot="header" class="clearfix">
      <span>/endpoint</span>
      <el-button style="float: right; padding: 3px 0" type="text">清空</el-button>
    </div>
    <el-row :gutter="10">
      <el-col :span="15">
        <strong>Endpoint</strong>
        <el-input placeholder="输入后端地址" suffix-icon="el-icon-edit" v-model="input1"></el-input>
        <p>
          这是您的客户端将连接到的URI。必须以斜线开头。同时你也可以使用{parameters}的形式传递参数。
        </p>
      </el-col>
      <el-col :span="4" :offset="1">
        <strong>Method</strong>
        <el-select v-model="mvalue" placeholder="请选择">
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <p>HTTP 动词</p>
      </el-col>
      <el-col :span="4">
        <strong>Output</strong>
        <el-select v-model="ovalue" placeholder="请选择">
          <el-option
            v-for="item in outputs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <p>使用的编码</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      methods: [
        {
          value: '选项1',
          label: 'GET',
        },
        {
          value: '选项2',
          label: 'POST',
        },
        {
          value: '选项3',
          label: 'PUT',
        },
        {
          value: '选项4',
          label: 'DELETE',
        },
      ],
      outputs: [
        {
          value: '选项1',
          label: 'JSON',
        },
        {
          value: '选项2',
          label: 'String(text/plain)',
        },
        {
          value: '选项3',
          label: 'No-op',
        },
      ],
      mvalue: '选项1',
      ovalue: '选项1',
    }
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
</style>
