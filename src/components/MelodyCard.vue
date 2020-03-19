<template>
  <div>
    <el-card class="box-card item">
      <el-collapse :value="activeList">
        <slot></slot>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  computed: {
    activeList() {
      return this.$ls.get('active_cards')
    },
  },
}
</script>

<style lang="scss" scoped></style>
