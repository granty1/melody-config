<template>
  <div>
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="Test">
        <el-input v-model="input"></el-input>
      </el-form-item>
      <el-form-item label="Local Storage:">
        {{ cur }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClick">
          Add to Ls
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      input: 'Local Storage Test',
      cur: '',
      form: {},
    }
  },
  methods: {
    handleClick() {
      this.$ls.set('test', this.input)
      this.$message({
        type: 'success',
        message: 'stored in local storage success',
      })
      this.cur = {
        test: this.$ls.get('test'),
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
