<template>
  <div class="img-upload">
    <el-upload
      action="string"
      :http-request="upload"
      :class="{disabled:cardDisabled}"
      list-type="picture-card"
      :on-change="change"
      :on-remove="handleRemove"
      drag
      :style="boxStyle"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
export default{
  name: 'oss-upload',
  props: ['width', 'height', 'operate'],
  data () {
    return {
      imgOperate: this.operate,
      cardDisabled: false,
      isLoad: false,
      boxStyle: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  computed: {

  },
  methods: {
    change () {
      this.cardDisabled = true
    },
    upload () {
      console.log('http上传')
      // http请求上传
    },
    handleRemove (file, fileList) {
      this.cardDisabled = false
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
.el-upload-dragger,.el-upload--picture-card,.el-upload-list--picture-card .el-upload-list__item{
  width: 100%;
  height: 100%;
}
.el-upload-dragger{
  display:flex;
  align-items: center;
  justify-content: center;
}
</style>
