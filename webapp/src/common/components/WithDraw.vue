<template>
  <div class="main-box">
    <el-dialog
      :visible.sync="dialogVisible"
      width="0"
      height="0"
      :before-close="handleClose"
      @close="$emit('onClose')"
      class="box-bg"
    >
    <!-- <div class="box-bg" v-if="dialogVisible === true"> -->
      <div class="inner-box">
        <div class="line-header">
          <i class="el-icon-close closeBtn" @click="clearForm('tableForm');$emit('onClose')"></i>
          <span class="line-title">{{coinName}}提币</span>
        </div>
        <div class="line-body">
          <el-form :model="tableForm" :rules="rules" ref="tableForm">
            <el-form-item prop="address" class="short-line1">
              <div class="line-input first">
                <p>提币地址</p>
                <el-select v-model="tableForm.address" placeholder="请输入提币地址" class="withdrawAddress">
                  <el-option
                    v-for="(item,index) in addressForm"
                    :key="index"
                    :value="item.purseAdr">
                  </el-option>
                </el-select>
                <button class="addBtn" @click="$emit('addressAdd')" type="button"><i class="el-icon-plus" style="margin-right:10px;"></i>添加地址</button>
              </div>
            </el-form-item>
            <el-form-item prop="num">
              <div class="line-input">
                <p>提币数量</p>
                <el-input v-model.number="tableForm.num" placeholder="请输入提币数量" class="line-text"></el-input>
              </div>
            </el-form-item>
            <p class="maxNum">最高&nbsp;&nbsp;{{maxNum}}</p>
            <p class="extractableNum">可提&nbsp;&nbsp;{{extractableNum}}</p>
            <el-form-item prop="fee">
              <div class="line-input">
                <p>矿工费</p>
                <el-select v-model="tableForm.fee" placeholder="选择矿工费" class="line-text">
                  <el-option
                    v-for="(item,index) in feeForm"
                    :key="index"
                    :value="item.minerMoney">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <div class="line-input panel-box">
              <button class="panel-btn tel-panel" :class="{'panel-active': panel === 1}" @click="panelChange(1)" type="button">手机验证</button>
              <button class="panel-btn mail-panel" :class="{'panel-active': panel === 2}" @click="panelChange(2)" type="button">邮箱验证</button>
            </div>
            <div class="phoneVerify" v-if="panel===1">
              <div class="line-input">
                <el-form-item prop="area" class="area">
                  <div>
                  <p>手机号</p>
                  <span v-if="tel">{{tel}}</span>
                  <p class="unSet" v-else>未设置手机号码 <span @click="setTelEmail('tel')">去设置>></span></p>
                  </div>
                </el-form-item>
              </div>
              <el-form-item prop="code" class="short-line2" v-if="tel != ''">
                <div class="line-input">
                  <p>验证码</p>
                  <el-input v-model="tableForm.code" placeholder="请输入验证码" class="line-text-code"></el-input>
                  <button class="getCode" v-if="sent===false" @click="sendCode('tel')" type="button">获取验证码</button>
                  <button class="getCode sent" v-if="sent===true">{{time+'秒后获取'}}</button>
                </div>
              </el-form-item>
            </div>
            <div class="emailVerify" v-if="panel===2">
              <el-form-item>
                <div class="line-input">
                  <p>邮箱</p>
                  <span v-if="email">{{email}}</span>
                  <p class="unSet" v-else>未设置邮箱 <span @click="setTelEmail('email')">去设置>></span></p>
                </div>
              </el-form-item>
              <el-form-item prop="code" class="short-line2" v-if="email != ''">
                <div class="line-input">
                  <p>验证码</p>
                  <el-input v-model="tableForm.code" placeholder="请输入验证码" class="line-text-code"></el-input>
                  <button class="getCode" v-if="sent===false" @click="sendCode('email')">获取验证码</button>
                  <button class="getCode sent" v-if="sent===true">{{time+'秒后获取'}}</button>
                </div>
              </el-form-item>
            </div>
          </el-form>
          <div class="line-input">
            <el-button class="confirm" @click="submit(tableForm)" :loading="loading" type="button">确认提币</el-button>
          </div>
        </div>
        <div class="line-footer">
          <div class="info">
            <span>提示</span>
            <p>比特币提币需要1个确认，实际到账时间取决于区块链确认速度，大约需要5-30分钟时间。联系客服：</p>
          </div>
        </div>
      </div>
    <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
export default{
  props: ['dialogVisible', 'onClose', 'addressForm', 'feeForm', 'coinName', 'maxNum', 'extractableNum', 'tel', 'email', 'loading', 'newAddress'],
  data () {
    return {
      panel: 1,
      select: '',
      sent: false,
      time: 60,
      tableForm: {
        coin: this.coinName,
        address: '',
        num: '',
        fee: '',
        area: '+86',
        tel: this.tel,
        email: this.email,
        code: '',
        type: '1'
      },
      rules: {
        address: [
          { required: true, message: '请选择提币地址', trigger: 'blur' }
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入提币数量' },
          { type: 'number', message: '提币数量必须为数字值' }
        ],
        fee: [
          { required: true, message: '请选择矿工费', trigger: 'blur' }
          // { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        area: [
          { required: true, message: ' ', trigger: 'blur' }
          // { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号格式不正确', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
          // { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码' }
        ]
      }
    }
  },
  methods: {
    panelChange (val) {
      this.panel = val
      if (val === 1) {
        this.tableForm.type = '1'
      } else {
        this.tableForm.type = '2'
      }
    },
    sendCode (type) {
      let _this = this
      _this.sent = true
      let interval = window.setInterval(function () {
        if ((_this.time--) <= 0) {
          _this.time = 60
          _this.sent = false
          window.clearInterval(interval)
        }
      }, 1000)
      this.$emit('sendCode', type)
    },
    setTelEmail (type) {
      this.$emit('ToSet', type)
    },
    submit (form) {
      let self = this
      this.$refs.tableForm.validate((valid, result) => {
        if (valid) {
          self.$emit('submit', form)
        } else {
          return false
        }
      })
    },
    handleClose () {
      this.clearForm('tableForm')
      this.$emit('onClose')
    },
    clearForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    newAddress: function () {
      this.tableForm.address = this.newAddress
    }
  }
}
</script>

<style lang="scss">
.main-box{
  display: inline-block;
  .el-form-item{
    margin-bottom: 0;
  }
  .el-form-item__error{
    position: relative;
    margin-top: -30px;
    margin-right: 55px;
    float: right;
  }
  .el-dialog__header{
    display:none;
  }
  .el-dialog__body{
    padding:0;
  }
  .short-line1 .el-form-item__error{
    margin-right: 170px;
  }
  .short-line2 .el-form-item__error{
    margin-right: 330px;
  }
  .tel .el-form-item__error{
    position: absolute;
    left:340px;
    margin-right:0;
  }
  .area{
    float:left;
    // display:inline-block;
  }
  .tel{
    display:inline-block;
  }
.box-bg,.box-bg .el-dialog{
  z-index: 105;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgba(0,0,0,.7);
  display:flex;
  align-items: center;
  justify-content: center;
}
.box-bg .el-dialog{
  margin-top:0 !important;
}
.inner-box{
  position: relative;
  z-index: 106;
  width: 700px;
  height: 580px;
  border-radius: 10px;
  background-color: #fff;
}
.line-header{
  width: 100%;
  height: 60px;
  line-height:60px;
  text-align: center;
  border-radius: 10px;
  border-bottom: 1px solid rgba(230,230,230,1);
}
.line-header span{
  position: absolute;
  font-size:20px;
  font-weight: 600;
  font-family:SourceHanSansCN-Regular;
  color:rgba(0,0,0,1);
}
.closeBtn{
  padding-right: 20px;
  float: right;
  font-size: 25px;
  line-height: 60px;
  color:rgba(192,192,192,1);
}
.closeBtn:before{
  cursor: pointer;
}
.line-body{
  width: 100%;
  height: 360px;
}
.line-footer{
  width: 100%;
  height: 110px;
  margin-top: 40px;
  border-radius: 10px;
}
.line-footer .info{
  width: 555px;
  margin-left: 42px;
  font-size: 14px;
  line-height: 30px;
  word-wrap:break-word;
}
.info span{
  font-weight: 600;
  color: #BE2F29;
}
.info p{
  font-weight: 500;
  color: #888888;
}
.line-input{
  height: 40px;
  line-height: 40px;
}
.line-input p{
  float: left;
  display: inline-block;
  width: 90px;
  margin-right: 32px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  color: #444;
}
.line-input input,.maxNum,.extractableNum{
  height: 34px;
  line-height: 34px;
}
.maxNum,.extractableNum{
  margin-left: 122px;
  color: #04C3E0;
  font-weight: 500;
  display:inline-block;
}
.extractableNum{
  float: right;
  margin-right:30px !important;
}
.first{
  margin-top: 50px;
}
.withdrawAddress{
  width: 440px;
}
.line-text{
  width: 550px;
}
.line-text .el-input-group__prepend{
  width: 120px;
}
.line-text-code{
  width: 270px;
}
.line-input .confirm{
  width: 550px;
  height: 34px;
  border: none;
  padding:0;
  border-radius: 5px;
  margin-left: 122px;
  margin-top: 20px;
  background-color: #00BCD4;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.line-input .confirm:hover{
  border: 1px solid #ccc;
}
.addBtn{
  width: 100px;
  height: 34px;
  margin-left: 10px;
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  background-color: #fff;
  font-size: 13px;
  cursor: pointer;
}
.getCode{
  width: 270px;
  height: 34px;
  margin-left: 10px;
  border: 1px solid #00BCD4;
  border-radius: 5px;
  background-color: #fff;
  color: #00BCD4;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.panel-box{
  height: 50px;
  line-height: 50px;
  margin-left: 122px;
}
.panel-btn{
  width: 135px;
  height: 34px;
  border: 1px solid #00BCD4;
  background-color: #fff;
  color: #00BCD4;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.tel-panel{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.unSet{
  width:450px !important;
  text-align:left !important;
}
.unSet span{
  color:#0000FF;
  cursor:pointer;
}
.mail-panel{
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.panel-active{
  background: #00BCD4;
  color: #fff;
}
.tel-select .el-input__inner{
  border-radius: 4px 0 0 4px;
}
.line-text-tel .el-input__inner{
  border-radius: 0 4px 4px 0;
}
.tel-select{
  width: 100px;
}
.line-text-tel{
  width: 450px;
}
.sent{
  background: #00BCD4;
  color: #fff;
  pointer-events: none;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
  background-color: #D8D8D8;
}
.el-select-dropdown__item.selected{
  color: #606266;
  background-color: #F0F0F0;
}
}
</style>
