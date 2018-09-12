<template>
  <div class="tipDialog">
    <el-dialog
      :visible.sync="tipVisible"
      :before-close="handleClose">
      <div class="icon">!</div>
      <p class="tipText">{{title}}</p>
      <router-link :to="Url" class="button">{{UrlText}}></router-link>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    title: {
      type: String,
      default: '提示信息'
    },
    Url: {
      type: String,
      default: '/home'
    },
    UrlText: {
      type: String,
      default: '去哪呢?'
    },
    tipVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose (done) {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped lang="scss">
  .tipDialog{
    .button{
      color: #0068B1;
    }
  }
</style>
<style lang="scss">
  .tipDialog .el-dialog{
    width: 352px;
    min-height: 188px;
    text-align: center;
    .el-dialog__header{
      padding: 0px;
    }
    .el-dialog__body{
      padding: 0px;
    }
    .icon{
      display: inline-block;
      margin: 26px 0px;
      width: 41px;
      height: 41px;
      line-height: 41px;
      border-radius: 50%;
      background: #F3A610;
      color: #fff;
      font-size: 20px;
      font-weight: 500
    }
    .tipText{
      margin-bottom: 24px;
      font-family: PingFangSC-Light;
      font-size: 17px;
      font-weight: 500;
      color: #000;
    }
  }
</style>
