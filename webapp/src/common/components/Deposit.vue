<template>
  <div class="recharge-box">
    <el-dialog
      :visible.sync="dialogVisible"
      width="0"
      height="0"
      :before-close="handleClose"
      @close="$emit('onClose')"
      class="box-bg"
    >
      <div class="rec-inner-box">
        <div class="rec-line-header">
          <i class="el-icon-close closeBtn" @click="$emit('onClose')"></i>
          <span class="rec-line-title">{{coinName}}充币</span>
        </div>
        <div class="rec-line-body">
          <img :src="imgPath" height="107" width="107" alt="">
          <div class="coin-address">
            <p class="address-tip">请将需要存入的{{coinName}}发送至：</p>
            <button class="copyAddress" @click="handleCopy" :data-clipboard-text="address" type="button">复制存币地址</button>
            <p class="addressCode">{{address}}</p>
          </div>
        </div>
        <div class="rec-line-footer">
          <div class="info">
            <span>提示</span>
            <p>比特币提币需要1个确认，实际到账时间取决于区块链确认速度，大约需要5-30分钟时间。联系客服：</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default{
  props: ['coinName', 'address', 'dialogVisible', 'imgPath'],
  data () {
    return {

    }
  },
  methods: {
    getMsg () {
      this.$emit('rechargeEntrance')
    },
    handleCopy (e) {
      console.log('111')
      var clipboard = new Clipboard('.copyAddress')
      clipboard.on('success', e => {
        this.$notify({
          title: '提示',
          message: '地址复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$notify({
          title: '提示',
          message: '地址复制失败，该浏览器不支持自动复制，请手动复制',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    handleClose () {
      this.$emit('onClose')
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">
.recharge-box{
  position: absolute;
  z-index: 10002;
  display: inline-block;
  text-align: left;
  .el-dialog__header{
    display:none;
  }
  .el-dialog__body{
    padding:0;
  }
.box-bg,.box-bg .el-dialog{
  z-index: 105;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgba(0,0,0,.7);
  display:flex;
  align-items: center;
  justify-content: center;
}
.box-bg .el-dialog{
  margin-top:0 !important;
}
.outBtn{
  padding: 10px;
  color: #04C3E0;
  cursor: pointer;
}
.rec-inner-box{
  position: relative;
  z-index: 106;
  width: 700px;
  height: 360px;
  border-radius: 10px;
  background-color: #fff;
}
.rec-line-header{
  width: 100%;
  height: 60px;
  line-height:60px;
  text-align: center;
  border-radius: 10px;
  border-bottom: 1px solid rgba(230,230,230,1);
}
.rec-line-header span{
  position: absolute;
  font-size:20px;
  font-weight: 600;
  font-family:SourceHanSansCN-Regular;
  color:rgba(0,0,0,1);
}
.rec-line-header .closeBtn{
  padding-right: 20px;
  float: right;
  font-size: 25px;
  line-height: 60px;
  color:rgba(192,192,192,1);
}
.rec-line-header .closeBtn:before{
  cursor: pointer;
}
.rec-line-body{
  height: 190px;
}
.rec-line-footer{
  width: 100%;
  height: 110px;
  border-radius: 10px;
}
.rec-line-footer .info{
  width: 555px;
  margin-left: 42px;
  font-size: 14px;
  line-height: 30px;
  word-wrap:break-word;
}
.info span{
  font-weight: 600;
  color: #BE2F29;
}
.rec-line-body{
  padding: 40px;
}
.rec-line-body img{
  float: left;
}
.coin-address{
  display: inline-block;
  height: 110px;
  width: 500px;
  padding-left: 12px;
  float: left;
}
.coin-address .address-tip{
  display: inline-block;
  font-size: 14px;
  color: #888;
  font-weight: 500;
}
.copyAddress{
  width: 140px;
  height: 30px;
  margin-left: 10px;
  border: 1px solid #00BCD4;
  border-radius: 4px;
  background: #fff;
  color: #00BCD4;
  font-size: 13px;
  cursor: pointer;
}
.addressCode{
  margin-top: 18px;
  font-size: 14px;
  font-weight: 550;
  color: #444;
  word-wrap:break-word;
}
}
</style>
