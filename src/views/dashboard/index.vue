<template>
  <div>
    <el-row>
      <!-- 预览 -->
      <el-col :span="12" class="container">
        <el-card class="box-card item">
          <div slot="header" class="clearfix">
            <span>预览melody.json</span>
          </div>
          <json-viewer
            :value="melodyJSON"
            :expand-depth="5"
            theme="my-awesome-json-theme"
          ></json-viewer>
        </el-card>
      </el-col>
      <!-- 导入 -->
      <el-col :span="12" class="container">
        <el-card class="box-card item">
          <div slot="header" class="clearfix">
            <span>导入melody.json</span>
          </div>
          <el-upload
            drag
            :multiple="false"
            :show-file-list="false"
            :auto-upload="false"
            accept=".json"
            action=""
            :on-change="loadJsonFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      melodyJSON: '',
    }
  },
  methods: {
    loadJsonFile(file) {
      console.log(file)
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = () => {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        this.melodyJSON = JSON.parse(reader.result)
        this.$ls.set('test', this.melodyJSON)
      }
    },
  },
  mounted() {
    if (this.$ls.get('test')) {
      this.melodyJSON = this.$ls.get('test')
    }
  },
}
</script>

<style lang="scss">
// values are default one from jv-light template
.my-awesome-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 16px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #111111;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
