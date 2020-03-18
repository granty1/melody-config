<template>
  <div>
    <el-card class="box-card item">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>
      <el-collapse :value="openlist">
        <slot></slot>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    openlist: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped></style>
