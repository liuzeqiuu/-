<template>
  <div class="editAddress">
    <el-dialog
      :visible.sync = "visibleSeen"
      :before-close = "closeAddAddress">
      <div class="addAddress-dialog">
        <p class="title">添加收货地址</p>
        <p class="tips">请准确填写收货地址, 众筹结束后不可变更</p>
        <el-form :model="addReceiverAddress" :rules="rules" :inline="true"  ref="addReceiverAddress">
          <el-form-item label="收货人：" prop="harvestName">
            <div class="input">
              <el-input v-model="addReceiverAddress.harvestName"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="收货地区：" prop="address" class="addressProof">
            <linkage v-if="visibleSeen" :existAddress="selectAddress" @getAddress="getLinkageAddress"></linkage>
          </el-form-item>
          <el-form-item label="详细地址：" prop="addressDetails">
            <div class="input">
              <el-input v-model="addReceiverAddress.addressDetails"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <div class="input">
              <el-input v-model="addReceiverAddress.phone"></el-input>
            </div>
          </el-form-item>
        </el-form>
        <el-button class="cancel left" @click="closeAddAddress">取消</el-button>
        <el-button @click="comfirmAddAddress" class="submit" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import linkage from '@/client/components/linkage.vue'
export default {
  data: () => {
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
      selectAddress: '',
      addReceiverAddress: {
        harvestName: '',
        address: '',
        addressDetails: '',
        phone: '',
        userId: ''
      },
      rules: {
        harvestName: [
          {required: true, message: '收货人姓名不能为空', trigger: 'blur'},
          {validator: checkName, trigger: 'change'},
          {validator: checkName, trigger: 'blur'}
        ],
        address: [
          {required: true, message: '收货地区不能为空', trigger: 'blur'}
        ],
        addressDetails: [
          {required: true, message: '详细地址不能为空', trigger: 'blur'},
          {required: true, message: '详细地址不能为空', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入正确的手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'change'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    existAddress: {
      type: Object,
      default: function () {
        return {}
      }
    },
    visibleSeen: {
      type: Boolean,
      default: false
    },
    resetForm: {
      type: Boolean,
      default: false
    }
  },
  components: {
    linkage
  },
  watch: {
    existAddress: function (val) {
      if (val.harvestName || val.addressDetails || val.phone) {
        this.addReceiverAddress = val
        this.selectAddress = val.address
      }
    },
    resetForm: function (val) {
      if (val) {
        this.$refs['addReceiverAddress'].resetFields()
      }
    }
  },
  methods: {
    comfirmAddAddress () {
      this.$emit('submit', this.addReceiverAddress)
    },
    closeAddAddress () {
      this.$refs['addReceiverAddress'].resetFields()
      this.$emit('close')
    },
    // 地级选择器子组件传来的数据
    getLinkageAddress (data) {
      this.addReceiverAddress.address = data
    }
  },
  mounted () {
    if (this.existAddress.harvestName || this.existAddress.addressDetails || this.existAddress.phone) {
      this.addReceiverAddress = this.existAddress
      this.selectAddress = this.existAddress.address
    }
  }
}
</script>

<style scoped>

</style>

<style lang="scss">
.editAddress .el-dialog{
  width: 475px;
  .dialogLoading{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    min-height: 300px;
  }
  .el-dialog__body{
    padding: 27px 0px 40px 38px;
  }
}
.editAddress .addAddress-dialog{
  text-align: left;
  .title{
    margin-bottom: 20px;
    font-family: $PF_Light;
    font-size: 16px;
    font-weight: $YH_big;
  }
  .tips{
    margin-bottom: 25px;
    font-family: $PF_Regular;
    font-size: 14px;
    color: $font_light_grey;
  }
  .input{
    display: inline-block;
    height: 30px;
    width: 312px;
  }
  .addressProof .el-form-item__error{
    position: relative;
    margin-right: 12px;
    text-align: right;
  }
  .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
  .select{
    display: inline-block;
    margin-right: 12px;
    width: 96px;
    height: 30px;
  }
  .el-form-item{
    margin-bottom: 5px;
  }
  .el-form-item__label{
    width: 95px;
    text-align: left;
  }
  .el-dialog__body{
    padding: 27px 0px 40px 38px;

  }
  .left{
    margin-top: 20px;
    margin-left: 11px;
  }
  .el-form-item__error{
    line-height: 30px;
    right: 10px;
    left: auto;
    top: 0;
  }
  .cancel{
    padding: 0px 20px;
    width: 193px;
    height: 35px;
  }
  .submit{
    padding: 0px 20px;
    color: $font_light_white;
    background: $client_primary_color;
    width: 193px;
    height: 35px;
  }
}
</style>
