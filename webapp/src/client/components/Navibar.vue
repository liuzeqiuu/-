<template>
<div :class="['nav-box',{ white : isHome }]">
    <nav class="nav">
        <el-menu :text-color="navTextColor"
                active-text-color="#3FC5DA"
                mode="horizontal"
                :default-active="currentPath"
                router>
            <el-menu-item index="/?" class="noactive">产品预售平台</el-menu-item>
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/user/orders">我的预售</el-menu-item>
            <el-menu-item index="/user">个人中心</el-menu-item>
            <el-menu-item index="/contactUs">联系我们</el-menu-item>
            <el-menu-item v-if="hasLogin" index="/logout" class="ifr">退出</el-menu-item>
            <el-menu-item v-else index="/login" class="ifr">登录</el-menu-item>
            <el-menu-item v-if="hasLogin" index="/user?" class="ifr">{{ desensitizedName }}</el-menu-item>
        </el-menu>
    </nav>
</div>
</template>

<script>
export default {
  name: 'Navibar',
  data: () => {
    return {
      currentPath: '',
      isHome: false
    }
  },
  mounted () {
    this.judgeIsHome(this.$route)
  },
  methods: {
    judgeIsHome (route) {
      this.currentPath = route.path || '/'
      if (!this.isHome && route.name === 'home') {
        this.isHome = true
      }
      if (this.isHome && route.name !== 'home') {
        this.isHome = false
      }
    }
  },
  computed: {
    navTextColor () {
      return this.isHome ? '#000' : '#CFCFCF'
    },
    desensitizedName () {
      return this.$store.getters['User/desensitizedName']
    },
    hasLogin () {
      return this.$store.getters['User/hasLogin']
    }
  },
  watch: {
    '$route': 'judgeIsHome'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nav-box{
    transition: all .3s;
    &.white{
        background: #ffffff;
    }
}
.nav{
    width: 1234px;
    margin: 0 auto;
    .el-menu--horizontal > .el-menu-item{
      height: 64px;
      font-size: 14px;
    }
    .el-menu--horizontal{
      background-color: transparent;
      border: 0 none;
    }
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover{
      background-color: rgba(197, 197, 197, 0.2);
    }
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus{
      background-color: transparent;
    }
    a{
      text-decoration: none;
    }
    .noactive{
      border: 0 none;
      font-size: 16px;
      &:hover{
        background-color: transparent!important;
      }
    }
    li{
      font-weight: $YH_regular;
    }
}
.white .nav .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover{
  background-color: rgba(100, 100, 100,.2)
}
</style>
<style lang="scss">
.header{
  background-color: $client_bg_dark;
}
</style>
