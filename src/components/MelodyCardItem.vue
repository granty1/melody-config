<template>
  <div>
    <el-collapse-item :disabled="disabled" :name="p + '-' + title">
      <template slot="title">
        <div @click="modify" style="width: 100%;">
          {{ title }}
        </div>
      </template>
      <slot></slot>
    </el-collapse-item>
  </div>
</template>

<script>
import { modifyActiveCards } from '@/utils/active_cards'

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
  },
  methods: {
    modify() {
      console.log('modify')
      if (this.remember) {
        if (this.prefix === '') {
          modifyActiveCards(this.$route.name + '-' + this.title)
        } else {
          modifyActiveCards(this.prefix + '-' + this.title)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 48px;
  background-color: #333333;
}
</style>
