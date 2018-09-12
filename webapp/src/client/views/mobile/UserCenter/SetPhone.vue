<template>
  <div class="mSetPhone">
    <m-header Title="设置手机"></m-header>
    <p class="title" v-if="isSend === false">您还未设置手机号码，请先设置：</p>
    <p class="title changeColor" v-if="isSend === true">验证码发送至手机{{showSendPhone}}</p>
    <div class="input-box">
      <input type="text" @blur="checkPhoneNumber"  @keyup="checkPhoneNumber" v-model="setUserPhone.phone" placeholder="请输入手机号码">
      <div class="error-tip" v-if="error.show">{{error.message}}</div>
    </div>
    <div class="input-box">
      <input type="text" placeholder="请输入验证码" v-model="setUserPhone.code">
      <div class="getCode" v-if="isSend === false" @click="sendCode">
        <span>获取验证码</span>
      </div>
      <div class="getCode" v-if="isSend === true">
        <span>{{time}}秒后获得</span>
      </div>
    </div>
    <el-button :loading="comfirmSetPhoneLoading" class="submit" @click="confirmSetPhone">提交</el-button>
  </div>
</template>

<script>
import mHeader from '../../../components/mNav.vue'
export default {
  data () {
    return {
      isSend: false,
      time: 60,
      setUserPhone: {
        id: this.$store.state.User.userId,
        type: 0,
        phone: '',
        verificationType: '29',
        code: ''
      },
      error: {
        show: false,
        message: ''
      },
      comfirmSetPhoneLoading: false
    }
  },
  components: {
    mHeader
  },
  computed: {
    showSendPhone: function () {
      let showPhone = String(this.setUserPhone.phone)
      return showPhone.substr(0, 3) + '****' + showPhone.substr(showPhone.length - 4)
    }
  },
  methods: {
    sendCode () {
      this.checkPhoneNumber()
      if (!this.error.show) {
        this.isSend = true
        let interval = window.setInterval(() => {
          if ((this.time--) <= 0) {
            this.time = 60
            this.isSend = false
            window.clearInterval(interval)
          }
        }, 1000)
        this.myFetch({
          apiName: 'getVerifyCode',
          postdata: {
            name: this.setUserPhone.phone,
            verificationType: '29',
            code: ''
          },
          success: (res) => {
            console.log('啊哈哈哈', res)
          }
        })
      }
    },
    checkPhoneNumber () {
      console.log('打印一下现在的手机号码', this.setUserPhone.phone)
      if (!this.setUserPhone.phone) {
        this.error.message = '手机号码不能为空'
        this.error.show = true
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(this.setUserPhone.phone)) {
          this.error.show = false
          this.error.message = ''
        } else {
          this.error.message = '请输入正确手机号码'
          this.error.show = true
        }
      }
    },
    confirmSetPhone () {
      this.comfirmSetPhoneLoading = true
      console.log('打印一下发送的数据', this.setUserPhone)
      this.myFetch({
        apiName: 'setUserInfo',
        postdata: this.setUserPhone,
        success: (res) => {
          this.$router.push({path: '/user'})
        },
        complete: () => {
          this.comfirmSetPhoneLoading = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mSetPhone{
  .title{
    margin:4.67vw 0px 2.26vw 4.4vw;
    font-family: PingFangSC-Regular;
    font-size: 3.47vw;
    color: #000;
  }
  .changeColor{
    color: #72BCC3;
  }
  .input-box{
    position: relative;
    padding-left: 4.27vw;
    height: 11.88vw;
    line-height: 11.88vw;
    background: #fff;
    border-bottom: 1px solid #EBEBEB;
    input{
      font-size: 3.73vw;
      border: none;
      width: 100%;
    }
    .error-tip{
      position: absolute;
      right: 10vw;
      top: 0px;
      color: red;
    }
  }
  .getCode{
    position: absolute;
    top: 50%;
    margin-top: -3.55vw;
    right: 3.74vw;
    width: 20.16vw;
    height: 7.1vw;
    line-height: 7.1vw;
    background: #59BFC6;
    color: #fff;
    font-size: 3vw;
    text-align: center;
    border-radius: 1vw;
  }
  .submit{
    display: block;
    margin: 23.23vw auto 0px auto;
    text-align: center;
    border-radius: 2vw;
    width: 92vw;
    height: 11.88vw;
    line-height: 11.88vw;
    padding: 0px;
    background: #59BFC6;
    color: #fff;
    font-family:PingFangSC-Regular;
    font-size: 4vw;
  }
}
</style>
