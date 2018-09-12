<template>
  <div class="loginPage">
    <div class="loginBg">
      <div class="line"></div>
      <div class="selectBtn">
        <span @click="changeIdent('business')" :class="{'selected':identType === false}">商家登录</span>
        <span @click="changeIdent('admin')" :class="{'selected':identType === true}">超管登录</span>
      </div>
      <div class="loginBox" v-show="identType === false">
        <div class="account line-box">
          <input type="text" placeholder="请输入用户名" v-model="loginForm.username">
        </div>
        <div class="password line-box">
          <input type="password" placeholder="请输入密码" v-show="showPwd === false" v-model="loginForm.password">
          <span class="eye2" @click="viewPwd()" v-show="showPwd === false"></span>
          <input type="text" placeholder="请输入密码" v-show="showPwd === true" v-model="loginForm.password">
          <span class="eye1" @click="viewPwd()" v-show="showPwd === true"></span>
        </div>
<!--         <div class="code line-box">
          <input placeholder="请输入验证码" class="codeInput" v-model="loginForm.code">
          <div v-if="sent===false" class="sendCode" @click="sendCode()">发送验证码</div>
          <div v-if="sent===true" class="sendCode sent">{{time+'秒后获取'}}</div>
        </div> -->
        <div class="loginBtn" @click="Login('business')">登录</div>
      </div>
      <!-- 超管 -->
      <div class="loginBox" v-show="identType === true">
        <div class="account line-box">
          <input type="text" placeholder="请输入用户名" v-model="adminForm.username">
        </div>
        <div class="password line-box">
          <input type="password" placeholder="请输入密码" v-show="showPwd === false" v-model="adminForm.password">
          <span class="eye2" @click="viewPwd()" v-show="showPwd === false"></span>
          <input type="text" placeholder="请输入密码" v-show="showPwd === true" v-model="adminForm.password">
          <span class="eye1" @click="viewPwd()" v-show="showPwd === true"></span>
        </div>
<!--         <div class="code line-box">
          <input placeholder="请输入验证码" class="codeInput" v-model="loginForm.code">
          <div v-if="sent===false" class="sendCode" @click="sendCode()">发送验证码</div>
          <div v-if="sent===true" class="sendCode sent">{{time+'秒后获取'}}</div>
        </div> -->
        <div class="loginBtn" @click="Login('admin')">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
// import {
//   LOGIN_CODE_TYPE_TPLID,
//   LOGIN_BY_PWD
// } from '@/common/constants/apiCode.js'
export default{
  data () {
    return {
      showPwd: false,
      sent: false,
      time: 60,
      identType: false,
      loginForm: {
        name: '',
        password: '',
        code: ''
      },
      adminForm: {
        name: '',
        password: '',
        code: ''
      },
      userInfo: {}
    }
  },
  methods: {
    changeIdent (ident) {
      if (ident === 'business') {
        this.identType = false
      } else if (ident === 'admin') {
        this.identType = true
      }
    },
    viewPwd: function () {
      this.showPwd = !this.showPwd
    },
    sendCode: function () {
      let _this = this
      _this.sent = true
      let interval = window.setInterval(function () {
        if ((_this.time--) <= 0) {
          _this.time = 60
          _this.sent = false
          window.clearInterval(interval)
        }
      }, 1000)
      console.log('sent code')
    },
    Login: function (ident) {
      // if (ident === 'business') {
      //   sessionStorage.setItem('Ident', ident)
      //   sessionStorage.setItem('businessId', 255)
      //   this.$router.push({path: '/center', query: {ident: 'business'}})
      // } else if (ident === 'admin') {
      //   sessionStorage.setItem('Ident', ident)
      //   sessionStorage.removeItem('businessId')
      //   this.$router.push({path: '/center', query: {ident: 'admin'}})
      // }

      if (ident === 'business') {
        console.log('商家')
        if (this.loginForm.username === '') {
          this.$notify({
            title: '提示',
            message: '用户名不能为空',
            type: 'error',
            duration: 2000
          })
        } else if (this.loginForm.password === '') {
          this.$notify({
            title: '提示',
            message: '密码不能为空',
            type: 'error',
            duration: 2000
          })
        } else {
          this.myFetch({
            apiName: 'businessLogin',
            postdata: {
              'username': this.loginForm.username,
              'password': this.loginForm.password
              // 'verificationType': LOGIN_CODE_TYPE_TPLID,
              // 'type': LOGIN_BY_PWD
            },
            // fail(){ reject(SERVICE_FAILD) },
            error: (err) => {
              this.$notify({
                title: '提示',
                message: err.resultMsg,
                type: 'error'
              })
            },
            success: (res) => {
              sessionStorage.setItem('Ident', ident)
              sessionStorage.setItem('userName', this.loginForm.username)
              sessionStorage.setItem('userId', res.userId)
              sessionStorage.setItem('Token', res.token)
              sessionStorage.setItem('businessId', res.businessId)
              this.$router.push({path: '/center', query: {ident: 'business'}})
            }
          })
        }
      } else if (ident === 'admin') {
        console.log('超管登录')
        if (this.adminForm.username === '') {
          this.$notify({
            title: '提示',
            message: '用户名不能为空',
            type: 'error',
            duration: 2000
          })
        } else if (this.adminForm.password === '') {
          this.$notify({
            title: '提示',
            message: '密码不能为空',
            type: 'error',
            duration: 2000
          })
        } else {
          this.myFetch({
            apiName: 'adminLogin',
            postdata: {
              'username': this.adminForm.username,
              'password': this.adminForm.password
              // 'verificationType': LOGIN_CODE_TYPE_TPLID,
              // 'type': LOGIN_BY_PWD
            },
            // fail(){ reject(SERVICE_FAILD) },
            error: (err) => {
              this.$notify({
                title: '提示',
                message: err.resultMsg,
                type: 'error'
              })
            },
            success: (res) => {
              sessionStorage.setItem('Ident', ident)
              sessionStorage.setItem('userName', this.adminForm.username)
              sessionStorage.setItem('userId', res.userId)
              sessionStorage.setItem('Token', res.token)
              sessionStorage.removeItem('businessId')
              this.$router.push({path: '/center', query: {ident: 'admin'}})
            }
          })
        }
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.loginPage{
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background:#222;
  // opacity: 0.8;
  .loginBg{
    height: 320px;
    width: 420px;
    margin: 0 auto;
    margin-top: 270px;
    background-color: hsla(0,0%,100%,.4);
    .line{
      height:20px;
    }
  }
  .selectBtn{
    width: 390px;
    height:40px;
    line-height:40px;
    margin: 0 auto 5px;
    background:#fff;
    span{
      margin-left:90px;
      font-size: 16px;
      cursor:pointer;
    }
    .selected{
      color:#409EFF;
    }
  }
  .loginBox{
    width: 390px;
    height: 240px;
    // position: abso;
    margin: 0 auto;
    padding: 30px 20px;
    background: #fff;
    .line-box{
      height: 40px;
      margin-top: 10px;
    }
    .codeInput{
      width: 230px;
    }
    .sendCode{
      display: inline-block;
      height: 40px;
      width: 100px;
      color: #fff;
      margin-left: 20px;
      text-align: center;
      // border: 1px solid #ccc;
      border-radius: 5px;
      line-height: 40px;
      cursor: pointer;
      background: #333;
    }
    .loginBtn{
      width: 350px;
      height: 40px;
      margin: 20px auto 0;
      text-align: center;
      line-height: 40px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      color: #fff;
      background: #333;
    }
    .eye1,.eye2{
      position: relative;
      display: inline-block;
      background: url("../../client/assets/eye2.png") no-repeat;
      width: 24px;
      height: 16px;
      background-size: 24px 16px;
      left: 310px;
      top: -28px;
      cursor: pointer;
    }
    .eye2{
      background: url("../../client/assets/eye1.png") no-repeat;
      background-size: 24px 16px;
    }
    .sent{
      background: $admin_btn_grey;
      pointer-events: none;
    }
  }
  input{
    width: 100%;
    height: 40px;
    padding: 0 15px;
    border: 1px solid $admin_table_border;
    border-radius: 5px;
  }
  input:focus{
    border: 1px solid $admin_input_border;
  }
}
</style>
