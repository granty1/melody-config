<template>
  <div>
    <el-collapse-item :title="title" :disabled="disabled">
      <slot></slot>
    </el-collapse-item>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
