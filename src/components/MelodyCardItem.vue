<template>
  <div @click="modify">
    <el-collapse-item :title="title" :disabled="disabled" :name="p + '-' + title">
      <slot></slot>
    </el-collapse-item>
  </div>
</template>

<script>
import { modifyActiveCards, addActiveCards } from '@/utils/active_cards'

export default {
  data() {
    return {
      p: this.prefix === '' ? this.$route.name : this.prefix,
    }
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    remember: {
      type: Boolean,
      default: true,
    },
    prefix: {
      type: String,
      default: '',
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    modify() {
      if (this.remember) {
        if (this.prefix === '') {
          modifyActiveCards(this.$route.name + '-' + this.title)
        } else {
          modifyActiveCards(this.prefix + '-' + this.title)
        }
      }
    },
    add() {
      if (this.prefix === '') {
        addActiveCards(this.$route.name + '-' + this.title)
      } else {
        addActiveCards(this.prefix + '-' + this.title)
      }
    },
  },
  mounted() {
    if (this.open) {
      this.add()
    }
  },
}
</script>

<style lang="scss" scoped></style>
