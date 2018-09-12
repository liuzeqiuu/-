<template>
  <div>
    <router-view></router-view>
    <div :class="['mUserCenter',{ hide : !isUserRootPath }]">
      <m-header Title="我的账户"></m-header>
      <div class="user-header">
        <div class="left">
          <div class="left-img">

          </div>
          <div class="left-word">
            <p class="number" >
              <span v-if="userInfo.userPhone">{{userInfo.userPhone}}</span>
              <span v-if="userInfo.userEmail && !userInfo.userPhone">{{userInfo.userEmail}}</span>
            </p>
            <p>实名认证：未认证</p>
          </div>
        </div>
        <router-link class="right" :to="{name:'userAsset'}">
          <span class="right-word">账户资产</span>
          <i class="iconfont icon-jinru"></i>
        </router-link>
      </div>
      <div class="info-column">
        <span>手机号码</span>
        <span v-if="userInfo.userPhone" class="right word">{{userInfo.userPhone}}</span>
        <router-link v-if="!userInfo.userPhone" class="right" :to="{name:'userSetPhone'}">
          <span class="word">未设置</span>
          <i class="iconfont icon-jinru"></i>
        </router-link>
      </div>
      <div class="info-column">
        <span>邮箱</span>
        <span v-if="userInfo.userEmail" class="right word">{{userInfo.userEmail}}</span>
        <router-link v-if="!userInfo.userEmail" class="right" :to="{name:'userSetEmail'}">
          <span class="word">未设置</span>
          <i class="iconfont icon-jinru"></i>
        </router-link>
      </div>
      <div class="info-column no-borderColor">
        <span>账号密码</span>
        <router-link class="right" :to="{name:'userSetPassword'}">
          <span class="word">去修改</span>
          <i class="iconfont icon-jinru"></i>
        </router-link>
      </div>
      <div class="info-column marginTop">
        <span>收货地址</span>
        <router-link class="right" :to="{name:'userAddress'}">
          <i class="iconfont icon-jinru"></i>
        </router-link>
      </div>

      <div class="sign-out" @click="exitLogin">
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from '../../components/mNav.vue'
export default {
  data () {
    return {
      isUserRootPath: false,
      userInfo: {},
      userID: this.$store.state.User.userId
    }
  },
  components: {
    mHeader
  },
  mounted () {
    this.judgeIsRoot(this.$route)
    this.getUserInfo()
  },
  methods: {
    judgeIsRoot (route) {
      if (!this.isUserRootPath && route.name === 'userCenter') {
        this.isUserRootPath = true
      }
      if (this.isUserRootPath && route.name !== 'userCenter') {
        this.isUserRootPath = false
      }
    },
    getUserInfo () {
      this.myFetch({
        apiName: 'getUserInfo',
        postdata: {id: this.userID},
        success: (userInfo) => {
          this.userInfo = userInfo
        }
      })
    },
    exitLogin () {
      // console.log('退出登录')
      this.$router.push({path: '/logout'})
    }
  },
  watch: {
    '$route': 'judgeIsRoot'
  }
}
</script>

<style scoped lang="scss">
.mUserCenter{
  .user-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2.67vw 0px;
    padding: 0px 4.27vw 0px 4vw;
    background: #fff;
    height: 21.69vw;
    .left{
      min-width: 30vw;
      height: 10.45vw;
    }
    .left-img{
      float: left;
      margin-right: 4.93vw;
      width: 10.55vw;
      height: 100%;
      background: #999;
    }
    .left-word{
      float: left;
      font-family:PingFangSC-Regular;
      font-size: 3.47vw;
      color: #999;
      .number{
        margin-bottom: 1.5vw;
        min-width: 12.8vw;
        min-height: 4vw;
        color: #000;
      }
    }
    .right{
      font-size: 3.47vw;
      color: #59BFC6;
      .right-word{
        display: inline-block;
        margin-right: 3.2vw;
      }
      i{
        float: right;
      }
    }
  }
  .info-column{
    padding: 0px 3.74vw 0px 4.54vw;
    background: #fff;
    height: 11.88vw;
    line-height: 11.88vw;
    border-bottom: 1px solid #EBEBEB;
    font-family: PingFangSC-Regular;
    font-size: 3.74vw;
    color: #000;
    .right{
      float: right;
      color: #999;
      .word{
        display: inline-block;
        margin-right: 3.2vw;
      }
      i{
        float: right;
      }
    }
  }
  .marginTop{
    margin-top: 2.67vw;
    border-color: #fff;
  }
  .no-borderColor{
    border-color: #fff;
  }
  .sign-out{
    margin: 23.36vw auto;
    border-radius: 2vw;
    width: 92.12vw;
    height: 11.88vw;
    line-height: 11.88vw;
    text-align: center;
    background: #E6E6E6;
    color: #6A6A6A;
    font-family: PingFangSC-Regular;
    font-size: 4vw;
  }
}
</style>
