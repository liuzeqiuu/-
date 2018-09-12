<template>
    <el-menu text-color="#CFCFCF"
             active-text-color="#ffd04b"
             mode="horizontal"
             background-color="#545c64"
             :default-active="currentPath"
             router>
        <el-menu-item index="/?">mall.bityuan.com管理端</el-menu-item>
        <el-menu-item class="ifr" @click="LoginOut()" index="/">退出<i class="el-icon-outline"></i></el-menu-item>
        <el-menu-item :index="currentPath" class="ifr">消息</el-menu-item>
        <el-menu-item index="/center/userInfo" class="ifr">{{userName}}<i class="el-icon-outline"></i></el-menu-item>

    </el-menu>
</template>

<script>
export default {
  name: 'HeaderNav',
  data: () => {
    return {
      currentPath: '',
      userName: ''
    }
  },
  methods: {
    LoginOut () {
      sessionStorage.clear()
    }
    // getUserInfo() {
    //   this.myFetch({
    //     apiName: 'businessInfo',
    //     postdata: {

    //     },
    //     // fail(){ reject(SERVICE_FAILD) },
    //     error: (err)=> {
    //       this.$notify({
    //         title: '提示',
    //         message: err.resultMsg,
    //         type: 'error'
    //       })
    //     },
    //     success: (res) => {
    //       sessionStorage.setItem('Ident', ident)
    //     }
    //   })
    // }
  },
  mounted () {
    this.currentPath = this.$route.path || '/'
    if (!sessionStorage.getItem('Token')) {
      this.$notify({
        title: '提示',
        message: '登录异常，请重新登录',
        type: 'error',
        duration: 2000
      })
      this.$router.push('/Login')
    }
    this.userName = sessionStorage.getItem('userName')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
