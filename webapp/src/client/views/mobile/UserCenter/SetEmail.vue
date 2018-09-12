<template>
  <div class="mSetEmail">
    <m-header Title="邮箱设置"></m-header>
    <p class="title" v-if="isSend === false">您还未设置邮箱地址，请先设置：</p>
    <p class="title changeColor" v-if="isSend === true">验证码发送至邮箱{{showSendEmail}}</p>
    <div class="input-box">
      <input type="text"  @blur="checkEmailNumber"  @keyup="checkEmailNumber" v-model="setUserEmail.email" placeholder="请输入邮箱地址">
      <div class="error-tip" v-if="error.show">{{error.message}}</div>
    </div>
    <div class="input-box">
      <input type="text" v-model="setUserEmail.code" placeholder="请输入验证码">
      <div class="getCode" @click="sendCode" v-if="isSend === false">
        <span>获取验证码</span>
      </div>
      <div class="getCode" v-if="isSend === true">
        <span>{{time}}秒后获得</span>
      </div>
    </div>
    <el-button :loading="comfirmSetEmailLoading" class="submit" @click="confirmSetEmail">提交</el-button>
  </div>
</template>

<script>
import mHeader from '../../../components/mNav.vue'
export default {
  data () {
    return {
      isSend: false,
      time: 60,
      comfirmSetEmailLoading: false,
      setUserEmail: {
        id: this.$store.state.User.userId,
        type: 1,
        email: '',
        verificationType: '30',
        code: ''
      },
      error: {
        show: false,
        message: ''
      }
    }
  },
  components: {
    mHeader
  },
  computed: {
    showSendEmail: function () {
      let first = String(this.setUserEmail.email).split('@')[0]
      let second = String(this.setUserEmail.email).split('@')[1]
      return first.substr(0, 3) + '****' + first.substr(first.length - 3) + '@' + second
    }
  },
  methods: {
    checkEmailNumber () {
      if (!this.setUserEmail.email) {
        this.error.message = '邮箱地址不能为空'
        this.error.show = true
      } else {
        this.error.show = false
        this.error.message = ''
      }
    },
    sendCode () {
      this.checkEmailNumber()
      if (!this.error.show) {
        this.isSend = true
        let interval = window.setInterval(() => {
          if ((this.time--) <= 0) {
            this.time = 60
            this.isSend = false
            window.clearInterval(interval)
          }
        }, 1000)
      }
      this.myFetch({
        apiName: 'getVerifyCode',
        postdata: {
          name: this.emailAddressSet.address,
          verificationType: '30',
          code: ''
        },
        success: (res) => {
          console.log('成功发送了邮箱验证码', res)
        }
      })
    },
    confirmSetEmail () {
      console.log('打印一下发送的邮箱数据', this.setUserEmail)
      this.comfirmSetEmailLoading = true
      this.myFetch({
        apiName: 'setUserInfo',
        postdata: this.setUserEmail,
        success: (res) => {
          console.log('设置成功')
          this.$router.push({path: '/user'})
        },
        complete: () => {
          this.comfirmSetEmailLoading = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mSetEmail{
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
