<template>
<div v-if="visibility" :class="style" class="fzm-logreg-wrap">
  <div class="fzm-logreg-win" v-loading="showLoading" @click="winclick" @click.stop>
    <div v-if="icon" class="logo"><img :src="logo" /></div>
    <!--默认-->
    <div class="default" v-if="visible.step<4">
      <div class="tabs">
        <span class="tab" @click="step(0,'mobile',null,'sms')">手机</span>
        <span class="tab" @click="step(0,'email')">邮箱</span>
        <i class="line" :style="'left:'+config[type].line.left+'px;'"></i>
      </div>
      <div class="tabc">
        <div class="step1">
          <div v-if="type=='mobile'" class="mobile edit-box item">
            <span @click="visible.world = !visible.world" @click.stop>
                <em class="code">{{params.area.code}}</em>
                <i class="icon-tog"></i>
            </span>
            <ul v-if="visible.world" class="world">
              <li class="country" v-for="(item,index) in world" :key="index" @click="chooseArea(item)" @click.stop>
                <span><em>{{item.code}}</em> {{item.name}}</span>
              </li>
            </ul>
            <input v-if="params.area.code==='+86'" @blur="blur" @focus="focus" v-model="chinaMobile" ref="chinaMobile1" type="tel" placeholder="请输入手机号" autocomplete="off" maxlength="13" />
            <input v-else @blur="blur" @focus="focus" v-model="params.mobile.number" @input="input" type="tel" placeholder="请输入手机号" autocomplete="off" maxlength="11" />
          </div>
          <div v-if="type=='email'" class="email edit-box item">
            <input @blur="blur" @focus="focus" v-model="params.email.number" @input="input" type="text" autocomplete="off" placeholder="请输入邮箱" />
          </div>
        </div>
        <!--验证码登录注册-->
        <div v-if="visible.step==2" class="step2">
          <!--手机-->
          <div v-if="type=='mobile'" class="mobile">
            <!--短信-->
            <div v-if="params.mobile.type=='sms' && visible.login=='verification'" class="sms">
              <div class="edit-box item">
                <input type="text" @blur="blur" @focus="focus" v-model="params.verification.number" autocomplete="off" placeholder="请输入验证码" />
                <span class="btn-verification" v-if="params.verification.enable" @click="getVerification('sms','quick')">获取验证码</span>
                <span class="countdown" v-else>还剩<span>{{params.verification.seconds}}</span>s</span>
              </div>
              <!-- <div class="note" v-if="!params.verification.enable">收不到短信试一试<span @click="step(2,'mobile','verification','voice',function(){this.getVerification('voice','quick')})">语言认证</span></div> -->
            </div>
            <!--语音-->
            <div v-if="params.mobile.type=='voice'" class="voice">
              <div class="edit-box item">
                <input type="text" @blur="blur" @focus="focus" v-model="params.verification.number" autocomplete="off" placeholder="请输入验证码" />
              </div>
              <div class="note" v-if="params.verification.enable" @click="getVerification('voice','quick')">获取语音验证码</div>
              <div class="note" v-else>请注意接听语音认证 还剩<span>{{params.verification.seconds}}</span>s</div>
            </div>
          </div>
          <!--邮箱-->
          <div v-if="type=='email'" class="email">
            <div class="edit-box item">
              <input type="text" @blur="blur" @focus="focus" v-model="params.verification.number" autocomplete="off" placeholder="请输入验证码" />
              <span class="btn-verification center" v-if="params.verification.enable" @click="getVerification('email','quick')">获取验证码</span>
              <span class="countdown" v-else>还剩<span>{{params.verification.seconds}}</span>s</span>
            </div>
          </div>
        </div>
        <!--密码登录-->
        <div v-if="visible.step==3" class="step3">
          <div v-if="visible.login=='password' && visible.pass" class="edit-box item">
            <input v-model="params[type].password" @blur="blur" @focus="focus" type="password" autocomplete="new-password" placeholder="请输入密码" class="full center" />
          </div>
          <!-- <span @click="remember" class="remember-item">
            <i :class="{'icon iconfont icon-wancheng':userinfoIsRemember}" class="remember-check"></i>
            记住密码
          </span> -->
          <span @click="step(5)" class="forget-item">忘记密码</span>
        </div>
        <!--登录注册按钮在step1、step2的时候都有,但是其实step1的时候没有用处-->
        <div class="submit" @click="submit"><span>注册/登录</span></div>
        <!--密码登录、验证码登录放在这里是因为要放在注册/登录后面-->
        <div v-if="visible.step==2 || visible.step==3" class="step-box">
          <span @click="step(3,null,'password')" class="step" v-if="visible.login=='verification' && visible.pass">密码登录</span>
          <span @click="step(2,null,'verification')" class="step" v-if="visible.login=='password'">验证码登录</span>
        </div>
      </div>
      <!--这里放在这里是因为这个上面有一条线-->
      <div v-if="visible.step==2 && !visible.pass && isRegistered" class="nopassword">
        <span>您还没有设置登录密码，无法使用密码登录!</span>
        <span class="step" @click="step(4,null,'password')">设置登录密码</span>
      </div>
    </div>

    <!--设置密码-->
    <div v-if="visible.step==4" class="step4">
      <div class="tabs">
        <div class="tab">
          <span>设置密码</span>
          <i class="line" style="left:164px;"></i>
        </div>
      </div>
      <div class="tabc">
        <div class="item center"><span>验证码已发送至{{type=='mobile' && params.area.code || ""}} {{params[type].number}}</span></div>
        <div class="edit-box item">
          <input v-model="params.verification.number" class="most" type="text" @blur="blur" @focus="focus" autocomplete="off" placeholder="请输入验证码" />
          <span v-if="params.verification.enable" class="btn-verification" @click="getVerification(null,'set_password')">获取验证码</span>
          <span v-else class="countdown">还剩<span>{{params.verification.seconds}}</span>s</span>
        </div>
        <div class="edit-box item">
          <input v-model="params[type].password" class="full" type="password" @blur="blur" @focus="focus" autocomplete="new-password" placeholder="请设置新密码（6-16个字符）">
        </div>
        <div class="control">
          <span class="back" @click="step(2,null,'verification')">返回</span>
          <span class="ok" @click="setPassword()">确定</span>
        </div>
      </div>
    </div>

    <!--找回密码-->
    <div v-if="visible.step==5" class="step5">
      <div class="tabs">
        <span class="tab" @click="step(5,'mobile')">手机找回密码</span>
        <span class="tab" @click="step(5,'email')">邮箱找回密码</span>
        <i class="line" :style="'left:'+config[type].line.left+'px;'"></i>
      </div>
      <div class="tabc">
        <div v-if="type=='mobile'" class="edit-box mobile">
          <span @click="visible.world = !visible.world" @click.stop>
              <em class="code">{{params.area.code}}</em>
              <i class="icon-tog"></i>
          </span>
          <ul v-if="visible.world" class="world">
            <li class="country" v-for="(item,index) in world" :key="index" @click="chooseArea(item)" @click.stop>
              <span><em>{{item.code}}</em> {{item.name}}</span>
            </li>
          </ul>
          <input v-if="params.area.code==='+86'" @blur="blur" @focus="focus" v-model="chinaMobile" ref="chinaMobile2" type="text" placeholder="请输入手机号" autocomplete="off" maxlength="13" />
          <input v-else @blur="blur" @focus="focus" v-model="params.mobile.number" @input="input" type="text" placeholder="请输入手机号" autocomplete="off" maxlength="11" />
        </div>
        <div v-if="type=='email'" class="edit-box email">
          <input @blur="blur" @focus="focus" v-model="params.email.number" type="text" autocomplete="off" placeholder="请输入邮箱" />
        </div>
        <div class="edit-box item">
          <input v-model="params.verification.number" @blur="blur" @focus="focus" class="center" type="text" autocomplete="off" placeholder="请输入验证码" />
          <span class="btn-verification" v-if="params.verification.enable" @click="getVerification(null,'reset')">获取验证码</span>
          <span class="countdown" v-else>还剩<span>{{params.verification.seconds}}</span>s</span>
        </div>
        <!--新密码-->
        <div class="edit-box item">
          <input v-model="params[type].password" @blur="blur" @focus="focus" class="full center" type="password" autocomplete="new-password" placeholder="请设置新密码（6-16个字符）" />
        </div>
        <div class="control">
          <span class="back" @click="step(2,null,'verification')">返回</span>
          <span class="ok" @click="resetPassword">确定</span>
        </div>
      </div>
    </div>

    <!-- 填写图片验证码 -->
    <div v-if="imageVerify.show" class="image-verify-box">
      <div class="edit-box item" v-loading="imageVerify.loading">
        <input type="text" maxlength="11" @blur="blur" @focus="focus" v-model="imageVerify.code" autocomplete="off" placeholder="请输入图片中的文字" />
        <span class="btn-verification">
          <img class="img-code" @load="handleVerifyImageLoaded" :src="imageVerify.imgSrc" alt="图片验证码">
        </span>
      </div>
      <div @click="handleFreshImageCode"><span class="tips-clickable">看不清？刷新验证码</span></div>
    </div>
  </div>
</div>
</template>
<script>
import './../../notyf/index.css'
import Notyf from './../../notyf/index.js'
// import world from './../../../json/world.json'
// import png from './../../../json/png.json'
import config from './../../../json/logreg.json'
import cookie from './../../../utils/cookie.js'

let world = [
  {
    "code":"+86","name":"中国"
  }
]

var notyf = new Notyf()
let position = 0
let positioning = false// 临近空格操作时候的光标
let logo = require('../../../assets/i/logo.png')
let debounce, countdown
const check = (number, type, ac) => {
  if (!number) {
    return false
  }
  switch (type) {
    case 'mobile':
      if (ac == '+86') {
        return /^1[345789]\d{9}$/.test(number)
      }
      if (ac == '+1') {
        return /^[2-9]\d{2}[2-9](?!11)\d{6}$/.test(number)
      }
      return false
    case 'email':
      return /^\w+@\w+\.[a-zA-Z]{2,6}$/.test(number)
    case 'verification':
      return /^\d{4,6}$/.test(number)
    case 'password':
      return /^[\w|\W]{6,}$/.test(number)
  }
}
let userinfoIsRemember = !!cookie.get('userinfo')
let userinfo = cookie.get('userinfo') && JSON.parse(cookie.get('userinfo')) || {
  area: {
    code: '+86',
    name: '中国'
  },
  mobile: {
    type: 'sms',
    number: '',
    password: ''
  },
  email: {
    number: '',
    password: ''
  }
}
function createScript (res, vm, params) {
  if (res.isShow == 1) {
    // Object.assign(params, {
    //   businessId: res.businessId
    // })
    // var script = document.createElement('script')
    // script.src = res.data.jsUrl
    // document.getElementsByTagName('body')[0].appendChild(script)
    // setTimeout(function () {
    //   var TCaptcha = document.getElementById('TCaptcha')
    //   var capOption = {
    //     callback (res) {
    //       if (res.ret == 0) {
    //         Object.assign(params, {
    //           ticket: res.ticket
    //         })
            let type = vm.type === 'mobile' ? vm.params.mobile.type : 'email'
            switch (type) {
              case 'sms':
                vm.api.getCodeBySms(params).then(res => {
                  vm.params.verification.enable = false
                })
                break
              case 'voice':
                vm.api.getCodeByVoice(params).then(res => {
                  vm.params.verification.enable = false
                })
                break
              case 'email':
                vm.api.getCodeByEmail(params).then(res => {
                  vm.params.verification.enable = false
                })
                break
            }
          // }
    //       capDestroy()
    //       script.remove()
    //     },
    //     type: 'popup',
    //     pos: 'fixed'
    //   }
    //   capInit(TCaptcha, capOption)
    // }, 300)
  } else {
    vm.params.verification.enable = false
  }
}

function createScriptForLoginByPassword (res, vm, params) {
  // if (res.isCaptcha == 1) {
    // Object.assign(params, {
    //   businessId: res.businessId
    // })
    // var script = document.createElement('script')
    // script.src = res.jsUrl
    // document.getElementsByTagName('body')[0].appendChild(script)
    // setTimeout(function () {
    //   var TCaptcha = document.getElementById('TCaptcha')
    //   var capOption = {
    //     callback (res) {
    //       if (res.ret == 0) {
    //         Object.assign(params, {
    //           ticket: res.ticket
    //         })
            vm.api.login(params).then(res => {
              notyf.confirm('登录成功!')
              vm.visible.context = false
              vm.step(0, 'mobile', null, 'sms', false)
              vm.callback && vm.callback('login', res)
            })
    //       }
    //       capDestroy()
    //       script.remove()
    //     },
    //     type: 'popup',
    //     pos: 'fixed'
    //   }
    //   capInit(TCaptcha, capOption)
    // }, 300)
  // }
}

// 获取光标位置
function getCursorPosition (e) {
  let position = 0
  if (document.selection) {
    let selectRange = document.selection.createRange()
    selectRang.moveStart('character', -e.value.length)
    return selectRange.text.length
  } else if (e.selectionStart || e.selectionStart == '0') {
    return e.selectionStart
  }
}

function setCursorPosition (e, pos) {
  positioning = true
  this.$nextTick(function () {
    if (e.setSelectionRange) {
      e.focus()
      e.setSelectionRange(pos, pos)
    } else if (e.createTextRange) {
      let range = e.createTextRange()
      range.collapse(true)
      range.moveEnd('character', pos)
      range.moveStart('character', pos)
      range.select()
    }
    positioning = false
  })
}

export default {
  name: 'FzmLogReg',
  props: {
    api: Object,
    platkey: String,
    callback: Function,
    open: Boolean,
    icon: String,
    maxsec: Number,
    showLoading: Boolean,
    sty: String
  },
  data () {
    // let logo = '../../../' + png.logo.src;
    return {
      config,
      world,
      logo: this.icon == 'default' && logo || this.icon,
      type: 'mobile',
      isRegistered: false,
      style: this.sty || '',
      chinaMobile: '',
      maxSeconds: this.maxsec || 60,
      userinfoIsRemember,
      imageVerify: {
        show: false,
        code: "",
        imgSrc: "",
        loading: false
      },
      params: {
        ...userinfo,
        verification: {
          number: '',
          enable: false,
          seconds: this.maxsec || 60
        }
      },
      visible: {
        world: false,
        step: 1,
        login: 'verification',
        pass: false
      },
      history: {
        sms: [],
        email: [],
        voice: []
      }
    }
  },
  computed: {
    visibility () {
      return this.open
    }
  },
  watch: {
    'params.verification.enable' (now, old) {
      if ((!now) && this.params.verification.seconds) {
        this.countdown()
      }
    },
    'imageVerify.code' (value) {
      if ( value && /^\w{4}$/.test(value) ) {
        this.getVerification(this.imageVerify.tempType, this.imageVerify.tempCodeType)
        this.imageVerify.show = false
      }
    },
    chinaMobile (n, o) {
      if (n.length == 0) {
        this.params.mobile.number = ''
        return
      }
      if (!/^[\s\d]{0,13}$/.test(n)) {
        notyf.alert('请填写正确的中国手机号码!')
        return
      }
      if (positioning) {
        return
      }
      let input = this.visible.step == 5 && this.$refs.chinaMobile2 || this.$refs.chinaMobile1
      let temp = n.replace(/\s/g, '')
      if (temp == o.replace(/\s/g, '')) {
        if (n.length < o.length) {
          position = getCursorPosition(input)
          if (~'3,8'.indexOf('' + position)) {
            temp = (n.slice(0, position - 1) + n.slice(position)).replace(/\s/g, '')
            this.chinaMobile = temp.length < 4 && temp || temp.length < 8 && temp.slice(0, 3) + ' ' + temp.slice(3) || temp.slice(0, 3) + ' ' + temp.slice(3, 7) + ' ' + temp.slice(7)
            --position
          }
        }
        n.length > o.length && (~'4,9'.indexOf('' + position)) && (++position)
        this.params.mobile.number = temp
        this.input()
        setCursorPosition.call(this, input, position)
        return
      }
      position = getCursorPosition(input)
      this.params.mobile.number = temp
      this.input()
      if (n === (temp.length < 4 && temp || temp.length < 8 && temp.slice(0, 3) + ' ' + temp.slice(3) || temp.slice(0, 3) + ' ' + temp.slice(3, 7) + ' ' + temp.slice(7))) {
        // 光标在最后面一段,在删除最后一个空格的时候也可以满足该条件表达式,但是并不会走到这里,因为前面已经return了
        setCursorPosition.call(this, input, position)
      } else { // 光标不在最后面一段
        this.chinaMobile = temp.length < 4 && temp || temp.length < 8 && temp.slice(0, 3) + ' ' + temp.slice(3) || temp.slice(0, 3) + ' ' + temp.slice(3, 7) + ' ' + temp.slice(7)
      };
    }
  },
  methods: {
    close () {
      this.$emit('update:open', false)
      this.visible.world = false
    },
    winclick () {
      this.visible.world = false
    },
    focus (e) {
      e.target.parentNode.className += ' focus'
    },
    blur (e) {
      e.target.parentNode.className = e.target.parentNode.className.replace(' focus', '')
    },
    cover (ref) {
      this.$refs[ref].parentNode.className += ' focus'
      this.$refs[ref].focus()
    },
    // setp1
    chooseArea (item) {
      this.params.area = item
      this.visible.world = false
      this.input()
    },
    input () {
      let vm = this
      if (debounce) {
        clearTimeout(debounce)
      }
      let cb = function () {
        let type = vm.type
        let number = vm.params[type].number
        let ac = vm.params.area.code
        if (check(number, type, ac)) {
          let param
          switch (type) {
            // 无论是短信还是语音,在判断该手机号是否注册的时候传过去的type都是sms
            case 'mobile':
              param = {
                type: 'sms',
                area: ac,
                mobile: number
              }
              break
            case 'email':
              param = {
                type: 'email',
                email: number
              }
              break
            default:
              throw new Error('未知的type')
          }
          vm.isRegistered = vm.visible.pass = false
          vm.api.getRegisterState(param).then(res => {
            vm.isRegistered = !!res.isRegistered // 该账号有没有被注册过
            vm.visible.pass = !!-res.ispwd // 该账号有没有设置过密码
            console.log("getRegisterState",!!res.isRegistered)
            if (vm.visible.pass) {
              vm.step(3, type, 'password')
            } else {
              vm.step(2, type)
            }
            // params.verification.enable是计算属性,变为false的时候就会自动倒计时
            if (!vm.isRegistered) { 
              // 没有注册直接发送验证码
              // vm.getVerification(param.type, 'quick')
              // 在createScript中会将vm.params.verification.enable = false;
              vm.startImageCodeVerify(param.type, 'quick')
            } else {
              vm.params.verification.enable = true
            }
          }).catch(errmsg => {
            notyf.alert(errmsg)
          })
        } else {
          vm.step(1)
        }
      }
      debounce = setTimeout(cb, 300)
    },
    countdown () {
      if (countdown) {
        clearTimeout(countdown)
      }
      let vm = this
      if (vm.params.verification.seconds) {
        vm.params.verification.seconds--
        countdown = setTimeout(vm.countdown, 1000)
        // 本来这里可以直接传递一个max参数,但是iE9或者更早版本的浏览器不支持,所以这里吧max作为全局变量
      } else {
        vm.params.verification.enable = true
        vm.params.verification.seconds = this.maxSeconds
      }
    },
    getVerification (type, codetype) {
      if (!this.imageVerify.show) {
        this.startImageCodeVerify(type, codetype)
        return
      }
      console.log('getVerification', type, codetype)
      let vm = this
      let params = {platkey: this.platkey, businessId: '', ticket: '', imageCode: this.imageVerify.code }
      // quick:快速登录注册   set_password:设置密码   reset:忘记密码
      if (codetype == 'quick' || codetype == 'set_password') { Object.assign(params, {codetype, param: 'FzmRandom4'}) }
      if (codetype == 'reset') { Object.assign(params, {codetype: 'reset_password', param: 'FzmDataTime|FzmRandom4'}) }
      switch (vm.type) {
        case 'mobile':Object.assign(params, {area: vm.params.area.code.slice(1), mobile: vm.params.mobile.number}); break
        case 'email':Object.assign(params, {email: vm.params.email.number}); break
      }
      type || (type = vm.type === 'mobile' ? 'sms' : 'email')
      switch (type) {
        case 'sms':vm.api.getCodeBySms(params).then(res => {
          // createScript(res, vm, params)
          vm.params.verification.enable = false
        }).catch( msg => {
          notyf.alert(msg)
          vm.startImageCodeVerify(type, codetype)
        }); break
        case 'voice':vm.api.getCodeByVoice(params).then(res => {
          // createScript(res, vm, params)
          vm.params.verification.enable = false
        }).catch( msg => {
          notyf.alert(msg)
          vm.startImageCodeVerify(type, codetype)
        }); break
        case 'email':vm.api.getCodeByEmail(params).then(res => {
          // createScript(res, vm, params)
          vm.params.verification.enable = false
        }).catch( msg => {
          notyf.alert(msg)
          vm.startImageCodeVerify(type, codetype)
        }); break
      }
    },
    // 变化到指定的步骤
    step (number, type, login, mobiletype, callback) {
      console.log("change step",number, type, login, mobiletype, callback)
      let vm = this
      if (number === 0) {
        vm.params[vm.type].number = ''
        number = 1
      }
      // 初设密码
      if (number === 4) {
        this.getVerification(null,'set_password')
      }
      debounce && clearTimeout(debounce)
      countdown && clearTimeout(countdown)
      vm.params.verification.enable = true
      vm.params.verification.seconds = vm.maxSeconds
      vm.params.verification.number = ''
      number && (vm.visible.step = number)
      type && (vm.type != type) && (vm.type = type) && (vm.params[type].number = vm.userinfoIsRemember && userinfo[type].number || '')
      login && (vm.visible.login = login)
      mobiletype && (vm.params.mobile.type = mobiletype);
      (typeof callback === 'function') && callback.call(vm)
    },
    setPassword () {
      let vm = this
      // 检查验证码
      if (!check(vm.params.verification.number, 'verification')) {
        notyf.alert('请填写正确的验证码!')
        return false
      }
      // 检查密码
      if (!check(vm.params[vm.type].password, 'password')) {
        notyf.alert('密码字符个数至少为6位!')
        return false
      }
      let params = {
        password: vm.params[vm.type].password,
        code: vm.params.verification.number
      }
      if (vm.type === 'mobile') {
        Object.assign(params, {
          type: 'sms',
          area: vm.params.area.code.slice(1),
          mobile: vm.params.mobile.number
        })
      }
      if (vm.type === 'email') {
        Object.assign(params, {
          type: 'email',
          email: vm.params.email.number
        })
      }
      vm.api.setPassword(params).then(res => {
        notyf.confirm('设置密码成功!')
        vm.submit()
      }).catch( msg => {
        notyf.alert(msg)
      })
    },
    submit () {
      let vm = this
      let params = {
        ticket: '',
        businessId: '',
        redirect_uri: 'suibiantian'
      }
      // 检查手机号和邮箱
      if (!check(vm.params[vm.type].number, vm.type, vm.params.area.code)) {
        if (vm.type === 'mobile') {
          notyf.alert('请填写正确的手机号码!')
        } else if (vm.type === 'email') {
          notyf.alert('请填写正确的邮箱!')
        }
        return false
      }
      if (vm.type === 'mobile') {
        Object.assign(params, {
          type: 'sms',
          mobile: vm.params.mobile.number,
          area: vm.params.area.code.slice(1)
        })
      } else if (vm.type === 'email') {
        Object.assign(params, {
          type: 'email',
          email: vm.params.email.number
        })
      }
      if (vm.visible.step == 2) {
        // 检查验证码
        if (!check(vm.params.verification.number, 'verification')) {
          notyf.alert('请填写正确的验证码!')
          return false
        }
        Object.assign(params, {
          code: vm.params.verification.number,
          logintype: 'code'
        })
        if (vm.isRegistered) {
          vm.api.login(params).then(res => {
            notyf.confirm('登录成功!')
            vm.visible.context = false
            vm.step(0, 'mobile', null, null, false)
            vm.callback && vm.callback('login', res)
          }).catch(errmsg => {
            notyf.alert(errmsg)
          })
        } else {
          vm.api.register(params).then(res => {
            notyf.confirm('注册成功!')
            vm.isRegistered = true
            vm.visible.context = false
            vm.callback && vm.callback('register', res)
          }).catch(errmsg => {
            notyf.alert(errmsg)
          })
        }
      } else {
        // 检查密码
        if (!check(vm.params[vm.type].password, 'password')) {
          notyf.alert('密码字符个数至少为6位!')
          return false
        }
        Object.assign(params, {
          logintype: 'password',
          password: vm.params[vm.type].password
        })
        
        vm.api.login(params).then(res => {
          notyf.confirm('登录成功!')
          vm.visible.context = false
          vm.step(0, 'mobile', null, 'sms', false)
          vm.callback && vm.callback('login', res)
        }).catch(errmsg => {
          notyf.alert(errmsg)
        })
        // vm.api.isCaptcha({
        //   type: 'login'
        // }).then(res => {
        //   console.log("isCaptcha")
        //   // createScriptForLoginByPassword(res, vm, params)

        // })
      }
    },
    // 记住密码
    remember () {
      const flag = this.userinfoIsRemember
      if (flag) {
        cookie.remove('userinfo')
        this.userinfoIsRemember = false
      } else {
        let {area, mobile, email} = this.params
        cookie.set('userinfo', JSON.stringify({area, mobile, email}), 864000)
        this.userinfoIsRemember = true
      }
    },
    resetPassword () {
      let vm = this
      // 检查密码
      if (!check(vm.params[vm.type].password, 'password')) {
        notyf.alert('密码字符个数至少为6位!')
        return false
      }
      let params = {
        password: vm.params[vm.type].password,
        code: vm.params.verification.number
      }
      if (vm.type === 'mobile') {
        Object.assign(params, {
          type: 'sms',
          area: vm.params.area.code.slice(1),
          mobile: vm.params.mobile.number
        })
      }
      if (vm.type === 'email') {
        Object.assign(params, {
          type: 'email',
          email: vm.params.email.number
        })
      }
      this.api.resetPassword(params).then(res => {
        notyf.confirm(`密码重新设置成功!`)
        vm.step(3, null, 'password')
        this.submit()
      }).catch(errmsg => {
        notyf.alert(errmsg)
      })
    },
    handleFreshImageCode () {
      this.getVerifyImage()
    },
    startImageCodeVerify (type, codetype) {
      this.imageVerify.code = ""
      this.imageVerify.show = true
      this.imageVerify.tempType = type
      this.imageVerify.tempCodeType = codetype
      this.getVerifyImage()
    },
    handleVerifyImageLoaded () {
      console.log("img loaded")
      this.imageVerify.loading = false
    },
    getVerifyImage () {
      let vm = this
      this.imageVerify.loading = true
      this.api.getVerifyImage( this.params.mobile.number || this.params.email.number ).then( imgSrc => {
        vm.imageVerify.imgSrc = imgSrc
      })
    }
  }
}
</script>
<!--in>./src/fzm-ui/packages/logreg/src/logreg.scss</in-->
<style lang="scss">
// .blink:after {
//   content: "";
//   display:inline-block;
//   float:left;
//   width: 1px;
//   height: 20px;
//   margin-top:10px;
//   vertical-align: top;
//   background-color: #FF0000;
//   display: inline-block;
//   animation: blink .5s infinite alternate;
// }
//
// @keyframes blink {
//     to { background-color: transparent }
// }

// $primary_color: #CE181D;
// $border_light: #DDDDDD;
// $input_bg: #FEF7F7;
// $font_grey_color: #808080;
// $focus_box_shadow: 0 0 9px rgba(206,24,29,.2);

$primary_color: $client_primary_color;
$border_light: #DDDDDD;
$input_bg: $client_primary_light;
$font_grey_color: #808080;
$focus_box_shadow: $client_primary_shadow;

.fzm-logreg-wrap {
    color: #333333;
    user-select: none;
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    div,
    em,
    input,
    li,
    span,
    ul {
        padding: 0;
        margin: 0;
        vertical-align: top;
        box-sizing: border-box;
        color: inherit;
    }
    ul {
        padding: 0;
        margin: 0;
        list-style: none;
        cursor: default;
    }
    input {
        position: absolute;
        outline: none;
        background: transparent;
        border: 0;
        top: 0;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        padding-left: 6px;
        &.transparent{
          color:transparent;
        }
    }
    .full {
        width: 100%;
    }
    .center {
        text-align: center;
    }
    .most {
        width: 220px;
    }
    .item {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 18px;
    }
    .tabs {
        position: relative;
        display: flex;
        height: 40px;
        padding-top: 6px;
        color: $primary_color;
        font-size: 14px;
        line-height: 20px;
        .tab {
            display: flex;
            flex: 1;
            justify-content: center;
            cursor: pointer;
        }
        .line {
            position: absolute;
            width: 20px;
            height: 2px;
            background-color: $primary_color;
            top: 28px;
        }
    }
    .tabc {
        padding: 0 30px;
    }

    .nopassword {
        display: flex;
        flex-direction: column;
        height: 100px;
        border-top: 1px solid $border_light;
        align-items: center;
        justify-content: center;
        span {
            margin: 4px;
        }
    }
    .submit {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background-color: $primary_color;
        border-radius: 4px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        margin: 40px 0 28px;
    }
    .control {
        text-align: center;
        cursor: pointer;
        margin: 40px 0 25px;
    }
    .btn-verification,
    .countdown {
        position: absolute;
        right: 0;
        top: 0;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        font-size: 14px;
        border-radius: 0;
    }
    .btn-verification {
        color: $primary_color;
        cursor: pointer;
    }
    .countdown {
        color: $font_grey_color;
        span {
            display: inline-block;
            width: 20px;
        }
    }
    .center {
        text-align: center;
    }
    .step-box {
        margin-top: -6px;
        position: relative;
        text-align: center;
        width: 100%;
        span {
            display: block;
            height: 46px;
        }
    }
    .step {
        color: $primary_color;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
    }
    .control {
        position: relative;
        display: flex;
        justify-content: space-between;
        .back,
        .ok {
            width: 140px;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
        }
        .back {
            color: $primary_color;
            border: 1px solid $primary_color;
        }
        .ok {
            color: #FFFFFF;
            background-color: $primary_color;
        }
    }
    .edit-box {
        position: relative;
        background-color: $input_bg;
        border-radius: 4px;
        height: 40px;
        &.focus {
            box-shadow: $focus_box_shadow;
            background-color: #FFFFFF;
            border-radius: 4px;
        }
    }
    .step3{
      position:relative;
      .remember-item,.forget-item{
        position:absolute;
        top:50px;
        cursor:pointer;
        color:$font_grey_color;
        .remember-check{
          float:left;
          width:14px;
          height:14px;
          line-height:16px;
          border-radius:4px;
          margin:2px 2px 0 0;
          background-color:#F7E1E1;
          overflow:hidden;
        }
      }
      .remember-item{
        left:0;
      }
      .forget-item{
        right:0px;
      }
    }
    .mobile {
        input {
            width: 220px;
        }
        .code {
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            width: 46px;
            display: inline-block;
        }
        .icon-tog {
            width: 13px;
            height: 40px;
            line-height: 40px;
            display: inline-block;
        }
        .world {
            position: relative;
            width: 160px;
            background-color: #FFFFFF;
            border-radius: 4px;
            box-shadow: $focus_box_shadow;
            z-index: 99;
            overflow-y: auto;
            max-height: 200px;
            .country {
                width: 100%;
                height: 40px;
                padding-left: 16px;
                line-height: 2.5;
                font-size: 16px;
                color: rgba(51,51,51,1);
                em {
                    display: inline-block;
                    font-style: normal;
                    width: 44px;
                }
                &:hover {
                    height: 60px;
                    line-height: 3.75;
                    background-color: $input_bg;
                }
            }
        }

    }
    .email {
        input {
            width: 100%;
            text-align: center;
        }
    }
    .fzm-logreg-win {
        ::-webkit-input-placeholder {
            font-size: 14px;
            text-align: center;
        }
        width: 350px;
        max-height: 80%;
        padding: 30px 0 0;
        margin: 0 auto;
        background-color: #FFFFFF;
        border-radius: 4px;
        box-sizing: border-box;
        position: relative;
        .logo {
            height: 80px;
            text-align: center;
        }
        .default {
            .step1 {
                .email,
                .mobile {
                    position: relative;
                    width: 290px;
                    overflow: visible;
                    color: $font_grey_color;
                }
                input {
                    right: 0;
                }
            }
            .step2 {
                .email,
                .mobile .sms {
                    position: relative;
                    width: 290px;
                    border-radius: 4px;
                    background-color: #FFFFFF;
                    overflow: visible;
                    color: $font_grey_color;
                    input {
                        left: 0;
                        width: 190px;
                    }
                }
                .mobile .note {
                    position: relative;
                    color: $font_grey_color;
                    font-size: 14px;
                    height: 40px;
                    line-height: 60px;
                    margin-bottom: -20px;
                    text-align: center;
                    span {
                        color: $primary_color;
                        cursor: pointer;
                        padding-left: 4px;
                    }
                }
                .mobile .voice {
                    position: relative;
                    width: 290px;
                    border-radius: 4px;
                    background-color: #FFFFFF;
                    overflow: visible;
                    color: $font_grey_color;
                    input {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            }
        }
    }
    .image-verify-box{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      padding: 30px;
      box-sizing: border-box;
      background-color: rgba(255,255,255,.8);
      -webkit-backdrop-filter:blur(3px);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .tips-clickable{
      display: inline-block;
      color: $primary_color;
      margin: 20px 0;
      text-decoration: underline;
    }
    .img-code{
      width: 100%;
      height: 100%;
    }
}
.fzm-logreg-wrap.absolute {
    position: absolute;
}
.fzm-logreg-wrap.relative {
    position: relative;
}
.fzm-logreg-wrap.auto {
    width: auto;
    height: auto;
}
</style>
