<template>
  <div class="mSetPassword">
    <div class="header">
      <m-header Title="账号密码"></m-header>
    </div>
    <el-form :model="changePasswordsForm" ref="changePasswordsForm" :rules="changePasswordsRules">
      <el-form-item  prop="oldPassword" class="input-box">
        <el-input type="password" v-model="changePasswordsForm.oldPassword" placeholder="原密码"></el-input>
      </el-form-item>
      <el-form-item  prop="newPassword" class="input-box">
        <el-input type="password" v-model="changePasswordsForm.newPassword" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item  prop="repeatPasswords" class="input-box">
        <el-input type="password" v-model="changePasswordsForm.repeatPasswords" placeholder="重复新密码"></el-input>
      </el-form-item>
    </el-form>
    <p class="tips">建议6-30位字母、数字和符号的组合</p>
    <el-button :loading="changePasswordsLoading" class="submit" @click="confirmChangePassword">提交</el-button>
  </div>
</template>

<script>
import mHeader from '../../../components/mNav.vue'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.changePasswordsForm.repeatPasswords !== '') {
          this.$refs.changePasswordsForm.validateField('repeatPasswords')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordsForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      changePasswordsLoading: false,
      changePasswordsForm: {
        userId: this.$store.state.User.userId,
        oldPassword: '',
        newPassword: '',
        repeatPasswords: '',
        ruled: 1 // 识别是用户操作的
      },
      changePasswordsRules: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repeatPasswords: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    mHeader
  },
  methods: {
    confirmChangePassword () {
      this.$refs['changePasswordsForm'].validate((valid) => {
        if (valid) {
          console.log('发起了请求')
          this.changePasswordsLoading = true
          console.log('请求发送的数据', this.changePasswordsForm)
          this.myFetch({
            apiName: 'modifypassword',
            postdata: this.changePasswordsForm,
            success: () => {
              console.log('修改成功了')
              this.$router.push({path: '/user'})
            },
            complete: () => {
              this.changePasswordsLoading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mSetPassword{
  .header{
    margin-bottom: 2.67vw;
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
      min-width: 50vw;
    }
  }
  .tips{
    margin: 4.27vw 0px 0px 4.27vw;
    font-family:PingFangSC-Regular;
    font-size: 3.2vw;
    color: #000;
  }
  .submit{
    display: block;
    margin: 8.95vw auto 0px auto;
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
<style lang="scss">
.mSetPassword{
  .el-input__inner{
    height: 11.38vw;
    line-height: 11.38vw;
    border: none;
    padding: 0px;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .el-form-item__error{
    top: 3.2vw;
    left: auto;
    right: 4vw;
  }
}
</style>
