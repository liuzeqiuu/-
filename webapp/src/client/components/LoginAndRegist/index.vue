<template>
    <div class="login-box">
        <FzmLogReg :api="loginApi"
                    platkey='mall.bityuan.com'
                    :showLoading="loadingData"
                    :callback="afterLoginOrRegistSuccess"
                    :open.sync="open"
                    sty="absolute"/>
    </div>
</template>
<script>
import {
  LOGIN_CODE_TYPE_TPLID,
  REGISTER_CODE_TYPE_TPLID,
  SET_PWD_CODE_TYPE_TPLID,
  RESET_PWD_CODE_TYPE_TPLID,
  LOGIN_BY_CODE,
  LOGIN_BY_PWD,
  USER_IDENTITY
} from '@/common/constants/apiCode.js'
import {SERVICE_FAILD} from '@/client/constants/webapp.js'
import {saveToken} from '@/client/config/tokenManager.js'
import {UPDATE_USER_MUTATION} from '@/client/store/modules/User.js'
import {jumpBackOrHome} from '@/common/helper.js'

export default {
  name: 'LoginAndRegist',
  components: {
    'FzmLogReg': () => import('../../../packages/fzm-ui/packages/logreg/src/index.vue')
  },
  mounted () {
    // 如果已有身份
    if (this.$store.getters['User/hasLogin']) {
      this.jumpBack()
    }
  },
  data () {
    return {
      loadingData: false,
      open: true,
      loginApi: {
        getRegisterState: (params) => {
          // 判断是否已注册
          return new Promise(function (resolve, reject) {
            // {type: "sms", area: "+86", mobile: "18520828680"}
            // {type: "email", mobile: "18520828680"}
            this.loadingData = true
            this.myFetch({
              apiName: 'getRegisterState',
              postdata: {
                username: params.mobile || params.email,
                ruled: USER_IDENTITY
              },
              fail (err) { reject(err) },
              error (err) { reject(err) },
              success: ({registered, ispwd}) => {
                this.$store.commit(`User/${UPDATE_USER_MUTATION}`, {registered, hasPwd: ispwd})
                resolve({isRegistered: registered, ispwd})
              },
              complete: () => {
                this.loadingData = false
              }
            })
          }.bind(this))
        },
        getVerifyImage: (forWho) => {
          return new Promise(function (resolve, reject) {
            this.loadingData = true
            this.myFetch({
              apiName: 'getVerifyImage',
              postdata: {
                name: forWho
              },
              fail (err) { reject(err) },
              error (err) { reject(err) },
              success ({base64}) {
                resolve(base64)
              },
              complete: () => {
                this.loadingData = false
              }
            })
          }.bind(this))
        },
        getCodeBySms: (params) => {
          // 获取短信验证码
          // { area: "86", businessId:"",codetype:"quick", mobile: "18520828680",param:"FzmRandom4",platkey:"",ticket:""}
          return this.getVerifyCode(params.mobile, params.imageCode, params.codetype)
        },
        getCodeByEmail: (params) => {
          // 获取邮箱验证码
          // { businessId:"",codetype:"quick", email: "123@33.cn",param:"FzmRandom4",platkey:"",ticket:""}
          return this.getVerifyCode(params.email, params.imageCode, params.codetype)
        },
        getCodeByVoice: (params) => {
          // 获取语音验证码
          return new Promise(function (resolve, reject) {
            // console.log('getCodeByVoice', params)
            this.loadingData = true
            this.myFetch({
              apiName: 'getCodeByVoice',
              postdata: params,
              fail (err) { reject(err) },
              error (err) { reject(err) },
              success (res) {
                resolve({params: res})
              },
              complete: () => {
                this.loadingData = false
              }
            })
          }.bind(this))
        },
        register: (params) => {
          // 快速注册
          // { area: "86", businessId:"",code:"1234",logintype:"code", mobile: "18520828680",ticket:"",type:"sms"}
          // { businessId:"",code:"1234",logintype:"code",email: "123@33.cn",ticket:"",type:"email"}
          return this.loginOrRegist(params.mobile || params.email, null, params.code, REGISTER_CODE_TYPE_TPLID, null)
        },
        login: (params) => {
          // 快速登录
          return this.loginOrRegist(params.mobile || params.email, params.password, params.code, LOGIN_CODE_TYPE_TPLID, USER_IDENTITY)
        },
        setPassword: (params) => {
          // 设置密码
          return new Promise(function (resolve, reject) {
            this.loadingData = true
            this.myFetch({
              apiName: 'setPassword',
              postdata: {
                name: params.mobile || params.email,
                userId: this.$store.state.User.userId,
                password: params.password,
                code: params.code,
                verificationType: SET_PWD_CODE_TYPE_TPLID,
                ruled: USER_IDENTITY
              },
              fail () { reject(SERVICE_FAILD) },
              error (err) { reject(err.resultMsg) },
              success (res) {
                resolve({params: res})
              },
              complete: () => {
                this.loadingData = false
              }
            })
          }.bind(this))
        },
        resetPassword: (params) => {
          // 找回密码
          console.log('resetpassword', params)
          return new Promise(function (resolve, reject) {
            this.loadingData = true
            this.myFetch({
              apiName: 'resetPassword',
              postdata: {
                name: params.mobile || params.email,
                code: params.code,
                newpassword: params.password,
                verificationType: RESET_PWD_CODE_TYPE_TPLID,
                ruled: USER_IDENTITY
              },
              fail () { reject(SERVICE_FAILD) },
              error (err) { reject(err.resultMsg) },
              success (res) {
                resolve({params: res})
              },
              complete: () => {
                this.loadingData = false
              }
            })
          }.bind(this))
        },
        isCaptcha: (params) => {
          // 获取图形验证码
          return new Promise(function (resolve, reject) {
            // console.log('isCaptcha', params)
            resolve({})
          })
        }
      }
    }
  },
  methods: {
    loginOrRegist (account, pwd, code, verifyCodeType) {
      return new Promise(function (resolve, reject) {
        this.loadingData = true
        let postdata = {
          'username': account,
          'verificationType': verifyCodeType,
          'ruled': USER_IDENTITY
        }
        if (pwd) {
          postdata.type = LOGIN_BY_PWD
          postdata.password = pwd
        } else if (code) {
          postdata.type = LOGIN_BY_CODE
          postdata.code = code
        }
        this.myFetch({
          apiName: 'loginOrRegist',
          postdata: postdata,
          fail () { reject(SERVICE_FAILD) },
          error (err) { reject(err.resultMsg) },
          success: (res) => {
            // 保存用户的登录账户
            let userinfo = {last_login: +new Date()}
            if (/@/.test(account)) {
              userinfo.email = account
            } else if (/^\d{11}$/.test(account)) {
              userinfo.mobile = account
            } else {
              userinfo.account = account
            }
            this.$store.commit(`User/${UPDATE_USER_MUTATION}`, userinfo)
            resolve({params: res})
          },
          complete: () => {
            this.loadingData = false
          }
        })
      }.bind(this))
    },
    getVerifyCode (forWho, verifyCode, codetype) {
      // codetype   quick:快速登录注册   set_password:设置密码   reset:忘记密码
      console.log('get code', codetype)
      return new Promise(function (resolve, reject) {
        this.loadingData = true
        let verificationType = null
        console.log(this.$store.state.User.registered)
        switch (codetype) {
          case 'quick':
            if (this.$store.state.User.registered) {
              verificationType = LOGIN_CODE_TYPE_TPLID
            } else {
              verificationType = REGISTER_CODE_TYPE_TPLID
            }
            break
          case 'set_password':
            verificationType = SET_PWD_CODE_TYPE_TPLID
            break
          case 'reset_password':
            verificationType = RESET_PWD_CODE_TYPE_TPLID
            break
        }
        this.myFetch({
          apiName: 'getVerifyCode',
          postdata: {
            name: forWho,
            code: verifyCode,
            verificationType: verificationType,
            ruled: USER_IDENTITY
          },
          fail () { reject(SERVICE_FAILD) },
          error (err) { reject(err.resultMsg) },
          success (res) {
            resolve({params: res})
          },
          complete: () => {
            this.loadingData = false
          }
        })
      }.bind(this))
    },
    afterLoginOrRegistSuccess (type, res) {
      let { params } = res
      const {token, userId} = params
      // 设置tokan
      // 登陆/注册 成功之后
      // 跳到 redirect 指定地址/上一页/首页
      saveToken(token)
      this.$store.commit(`User/${UPDATE_USER_MUTATION}`, {userId, token})
      jumpBackOrHome(this)
      // switch (type) {
      //   case 'login':
      //     break
      //   case 'register':
      //   可以写给新注册用户的活动
      //     break
      //   default:
      //     break
      // }
    }
  }
}
</script>
<style>
.fzm-logreg-wrap>.fzm-logreg-win{
  box-shadow: 1px 1px 20px rgba(33,33,33,.1);
}
</style>
