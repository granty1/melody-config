<template>
  <div>
    <el-col :span="span" :offset="offset">
      <el-collapse-item :title="title" :disabled="disabled" :name="title">
        <slot></slot>
      </el-collapse-item>
    </el-col>
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
    span: {
      type: Number,
      default: 24,
    },
    offset: {
      type: Number,
    },
  },
}
</script>

<style lang="scss" scoped></style>
