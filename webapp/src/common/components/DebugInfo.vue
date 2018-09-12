<template>
    <div :class="['debuginfo-board',{'active':show}]">
        <div class="board-title" @click="toggle">Debug Info <span class="fr">{{ show | pointer }}</span></div>
        <section>
          api代理配置: <br>
          <p v-html="rawProxyInfo"></p>
          <p>token: {{usertoken}}</p>
          <span class="btn" @click="mockLogin">模拟 userid=3 登录</span>
        </section>
    </div>
</template>
<script>
import {devServer} from '../../../vue.config.js'
export default {
  data () {
    // 将配置转换为 apiname => ip address 展示
    let rawProxyInfo = []
    Object.keys(devServer.proxy).forEach(apiName => {
      rawProxyInfo.push(`${apiName} => ${devServer.proxy[apiName].target}`)
    })
    return {
      show: false,
      rawProxyInfo: rawProxyInfo.join('\n')
    }
  },
  filters: {
    pointer (show) {
      if (show) {
        // 收起
        return '👆'
      } else {
        // 展开
        return '👇'
      }
    }
  },
  computed: {
    usertoken () {
      return this.$store.state.User.token
    }
  },
  methods: {
    toggle () {
      this.show = !this.show
    },
    mockLogin () {
      let user = {
        userId: 3,
        mobile: 15113081314,
        email: '',
        hasPwd: true,
        token: 'fake token',
        registered: true
      }
      sessionStorage.setItem('user@client', JSON.stringify(user))
      sessionStorage.setItem(`${window.location.protocol}//${window.location.host}.token`, user.token)
      window.location.reload()
      return false
    }
  }
}
</script>
<style scoped>
.debuginfo-board {
  position: fixed;
  top: 12px;
  right: 12px;
  background-color: rgb(110, 110, 110);
  width: 180px;
  height: 22px;
  overflow: hidden;
  color: #ffffff;
  opacity: .8;
  z-index: 99999;
}
.debuginfo-board.active {
  height: auto;
  max-height: 300px;
  overflow: auto;
}
.debuginfo-board .board-title {
  font-size: 16px;
}
.debuginfo-board section{
  padding: 12px;
  font-size: 12px;
  text-align: left;
}
.debuginfo-board .btn{
  cursor: pointer;
  display: inline-block;
  background-color: darkslateblue;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
