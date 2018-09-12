<template>
  <div class="charge">
   <m-header :Title="title" v-if="!chargeLoading"></m-header>
    <div v-if="chargeLoading" class="chargeLoading" v-loading>
        <loading></loading>
      </div>
    <div class="address" v-if="!chargeLoading">
      <p>请将需要存入的{{ title }}发送至以下地址：</p>
      <div>
        <img :src="qrcodeImg" alt="">
      </div>
      <p>
        <span>地址</span>
        <span >{{ addressName }}</span>
      </p>
      <button :data-clipboard-text="addressName" class="copy" @click="copy">复制存币地址</button>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
// import QRCode from 'qrcodejs2'
import loading from '@/common/components/LoadingComponent.vue'
import mHeader from '../../components/mNav.vue'

export default {
  components: {
    mHeader,
    loading
  },
  data () {
    return {
      name: '',
      tokenname: '',
      state: '',
      addressName: '',
      chargeLoading: false,
      qrcodeImg: '',
      title: ''
    }
  },
  methods: {
    copy (e) {
      var clipboard = new Clipboard('.copy')
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
          message: '地址复制失败,该浏览器不支持自动复制,请手动复制',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    change (index) {
      this.tokenname = this.title[index]
      this.state = index
    },
    showDepositDialog () {
      let self = this
      this.chargeLoading = true
      this.myFetch({
        apiName: 'getUserAdrr',
        postdata: {
          userId: this.$store.state.User.userId,
          currencyId: this.currencyId
        },
        success: ({adrr, base64}) => {
          // console.log(data)
          this.addressName = adrr
          this.qrcodeImg = base64
        },
        complete () {
          self.chargeLoading = false
        }
      })
    },
    link () {
      this.$router.go(-1)
    }
  },
  mounted () {
    let { currencyId, currencyname } = this.$route.query
    this.currencyId = currencyId
    this.title = currencyname
    this.change(0)
    this.showDepositDialog()
    console.log(this.title)
  }
}
</script>
<style lang="scss">
.charge{
  h1{
    width: 100%;
    height: 6vh;
    background: #fff;
    padding-left: 1.6vh;
    line-height: 5.8vh;
    i{
      display: inline-block;
      margin-right: 10.8vh;
      font-size: 3.3vh;
      color: #999;
    }
    span{
      display: inline-block;
      width: 13vh;
      text-align: center;
      font-size: 2.2vh;
      font-weight: 500;
      color: #000;
      &:hover{
        color: #59bfc6;
        border-bottom: 1px solid #59bfc6;
      }
    }
    .green{
      color: #59bfc6;
      border-bottom: 1px solid #59bfc6;
    }
  }
  .address{
    margin-top: 1.5vh;
    width: 100%;
    height: 92.35vh;
    padding-top: 9.2vh;
    text-align: center;
    background: #fff;
    font-size: 2.4vh;
    font-weight: 500;
    div{
      width: 100%;
      padding: 7vh 16.6vh;
      img{
        width: 100%;
      }
    }
    p:nth-of-type(2){
      margin-bottom: 6.7vh;
      padding-left: 8vh;
      width: 100%;
      font-size: 2.2vh;
      display: flex;
      span{
        display: inline-block;
      }
      span:nth-of-type(1){
        margin-right: 2.2vh;
        font-size: 1.8vh;
        width: 5vh;
        color: #8a97a5;
      }
      span:nth-of-type(2){
        width: 39.1vh;
        padding-right: 5.4vh;
        word-break:break-all;
        text-align: left;
      }
    }
    button{
      width: 23.4vh;
      height: 6vh;
      background: #59bfc6;
      text-align: center;
      cursor: pointer;
      border-radius: 0.7vh;
      line-height: 6vh;
      font-size: 2.2vh;
      color: #fff;
      border: none;
      &:hover{
        background: #139fdc;
      }
    }
  }
}
</style>
