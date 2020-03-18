<template>
  <div>
    <el-card class="box-card item" @click="show = !show">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>
      <el-collapse v-show="show">
        <slot></slot>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: true,
  }),
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped></style>
