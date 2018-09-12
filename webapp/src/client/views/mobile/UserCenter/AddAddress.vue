<template>
  <div class="mAddAddress">
    <div class="header">
      <m-header Title="收货地址"></m-header>
    </div>
    <div class="edit-address">
      <div class="content">
        <el-form :model="receiverInfoForm" :rules="receiverInfoRules" ref="receiverInfoForm">
          <el-form-item label="收货人: " prop="name" class="input-box">
            <el-input class="input" v-model="receiverInfoForm.harvestName" placeholder="请输入收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式: " prop="phoneNumber" class="input-box">
            <el-input class="input" v-model="receiverInfoForm.phone" placeholder="请输入联系号码"></el-input>
          </el-form-item>
          <el-form-item label="所在地区: " prop="address" class="input-box">
            <span class="disabled-input">{{showReceiveInfoAddress}}</span>
            <div class="choose" @click="chooseAddress">
              <span>请选择</span>
              <i class="iconfont icon-jinru"></i>
            </div>
          </el-form-item>
          <el-form-item label="详细地址: " prop="name" class="input-box address-detail">
            <el-input class="input" type="textarea" :rows="2" v-model="receiverInfoForm.addressDetails" placeholder="请输入详细地址信息，街道、门牌号小区、楼道号、单元"></el-input>
          </el-form-item>
          <div class="input-box">
            <span class="label">设置为默认地址</span>
            <div class="choose">
              <el-switch
                v-model="isSetDefaultAddress"
                active-color="#13ce66"
                inactive-color="#999">
              </el-switch>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <div class="button">
      <el-button class="confirmAddAddress" @click="confirmAddAddress" :loading="confirmAddAddressLoading">确认</el-button>
    </div>

    <!--选择地址-->
    <m-address :addressShow="addressShow" @ok="getAddress" @cancel="addressShow=false"></m-address>

  </div>
</template>

<script>
import mHeader from '../../../components/mNav.vue'
import mAddress from '@/common/components/address-picker.vue'
export default {
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('收货人姓名不能为空'))
      } else {
        const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,10}|[a-zA-Z]{4,20}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入2-10汉字或者4-20英文'))
        }
      }
    }
    return {
      isEditor: false, // 用于打开编辑地址页面
      isSetDefaultAddress: false, // 设置为默认地址开关
      addressShow: false, // 是否打开选择地址组件
      url: '/addAddress',
      showReceiveInfoAddress: '',
      confirmAddAddressLoading: false,
      finalAddress: { // 选定后的地址
        province: '',
        city: '',
        county: '',
        street: ''
      },
      receiverInfoForm: {

      },
      receiverInfoRules: {
        name: [
          {required: true, message: '收货人姓名不能为空', trigger: 'blur'},
          {validator: checkName, trigger: 'change'},
          {validator: checkName, trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入正确的手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'change'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    mHeader,
    mAddress
  },
  mounted () {

  },
  methods: {
    chooseAddress () {
      this.addressShow = !this.addressShow
    },
    getAddress (data) {
      this.addressShow = false
      let {province, city, town} = data
      if (town) {
        this.showReceiveInfoAddress = province + city + town
        this.receiverInfoForm.address = province + '-' + city + '-' + town
      } else {
        this.showReceiveInfoAddress = province + city
        this.receiverInfoForm.address = province + '-' + city
      }
    },
    confirmAddAddress () {
      this.$refs['receiverInfoForm'].validate((valid) => {
        if (valid) {
          this.receiverInfoForm.userId = this.$store.state.User.userId
          if (this.isSetDefaultAddress) {
            this.receiverInfoForm.phoneDefaultState = 0
          } else {
            this.receiverInfoForm.phoneDefaultState = 1
          }
          console.log('打印一下要添加的地址', this.receiverInfoForm)
          // a
          this.myFetch({
            apiName: 'insertPhoneReceivingAddress',
            postdata: this.receiverInfoForm,
            success: () => {
              console.log('添加地址成功了')
              this.$router.go(-1)
            },
            complete: () => {
              this.confirmAddAddressLoading = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mAddAddress{
  .header{
    margin-bottom: 2.67vw;
  }
  .edit-address{
    .content{
      background: #fff;
      font-size: 3.73vw;
      .input-box{
        padding-left: 4.54vw;
        padding-right: 3.47vw;
        line-height: 12vw;
        border-bottom: 1px solid #EBEBEB;
        .label{
          display: inline-block;
          min-width: 23vw;
          font-family: PingFangSC-Regular;
          font-size: 3.74vw;
          color: #000;
        }
      }
      .address-detail{
        position: relative;
        height: 10.86vh;
        .detail{
          position: absolute;
          top: 3.2vw;
          width: 55.27vw;
          min-height: 4.83vh;
          border: none;
          padding-bottom: 2vw;
        }
      }
    }
  }
  >.button{
    margin-top: 8vw;
    text-align: center;
    .confirmAddAddress{
      width: 80vw;
      background: #59BFC6;
      color: #fff;
    }
  }
}
</style>
<style lang="scss">
.mAddAddress{
  .el-form-item__content{
    font-size: 3.73vw;
  }
  .edit-address .content{
    .input-box{
      .disabled-input{
        display: inline-block;
        width: 55vw;
        margin-top: 1.5vh;
        color: #606266;
        line-height: 3vh;
      }
      .input{
        width: 70vw;
        .el-input__inner{
          border: none;
          padding: 0px;
          height: 100%;
        }
      }
    }
    .el-form-item__label{
      padding: 0px;
      width: 18vw;
      text-align: left;
      font-family: PingFangSC-Regular;
      font-size: 3.74vw;
      color: #000
    }
    .el-form-item{
      margin-bottom: 0px;
    }
    .el-textarea__inner{
      padding: 2.6vw 0px;
      border: none;
    }
    .el-input.is-disabled .el-input__inner{
      background: transparent;
      color: #606266;
    }
    .choose{
      float: right;
      color: #999999;
      >span{
        display: inline-block;
        margin-right: 1vw;
        font-size: 3.5vw;
      }
      .icon-jinru{
        float: right;
        font-size: 3.5vw;
      }
    }
  }
  input{
    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      font-size: 3.75vw;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      font-size: 3.75vw;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      font-size: 3.75vw;
    }
    &:-moz-placeholder { /* Firefox 18- */
      font-size: 3.75vw;
    }
  }
  textarea{
    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      font-size: 3.75vw;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      font-size: 3.75vw;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      font-size: 3.75vw;
    }
    &:-moz-placeholder { /* Firefox 18- */
      font-size: 3.75vw;
    }
  }
}
</style>
