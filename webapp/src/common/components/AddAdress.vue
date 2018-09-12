<template>
  <div class="address-box">
    <el-dialog
      :visible.sync="dialogVisible"
      width="0"
      height="0"
      :before-close="handleClose"
      @close="clearForm('tableForm');$emit('onClose')"
      class="box-bg"
    >
      <div class="address-inner-box">
        <div class="address-line-header">
          <i class="el-icon-close closeBtn" @click="clearForm('tableForm');$emit('onClose')"></i>
          <span class="address-line-title">添加地址</span>
        </div>
        <div class="address-line-body">
          <el-form :model="tableForm" :rules="rules" ref="tableForm">
            <el-form-item prop="purseAdr">
              <div class="address-line">
                <p>提币地址：</p>
                <el-input class="line-text" v-model="tableForm.purseAdr"></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="adrrLabel">
              <div class="address-line">
                <p>地址标签：</p>
                <el-input class="line-text" v-model="tableForm.adrrLabel"></el-input>
              </div>
            </el-form-item>
            <div class="address-line panel-box">
              <p>验证方法：</p>
              <div class="btn-group">
                <button class="panel-btn tel-panel" :class="{'panel-active': panel === 1}" @click="panelChange(1)" type="button">手机验证</button>
                <button class="panel-btn mail-panel" :class="{'panel-active': panel === 2}" @click="panelChange(2)" type="button">邮箱验证</button>
              </div>
            </div>
            <el-form-item class="short-line">
              <div class="address-line" v-show="panel === 1">
                <p>手机号：</p>
                <div class="line-text" style="display:inline-block;text-align:left" v-if="tel">{{tel}}</div>
                <div class="line-text" style="display:inline-block;text-align:left" v-else>未设置手机号码 <span @click="setTelEmail('tel')">去设置>></span></div>
              </div>
              <div class="address-line" v-show="panel === 2">
                <p>邮箱：</p>
                <div class="line-text" style="display:inline-block;text-align:left" v-if="email">{{email}}</div>
                <div class="line-text" style="display:inline-block;text-align:left" v-else>未设置邮箱 <span @click="setTelEmail('email')">去设置>></span></div>
              </div>
            </el-form-item>
            <el-form-item prop="code" class="short-line">
              <div class="address-line">
                <p>验证码：</p>
                <el-input v-model="tableForm.code" placeholder="请输入内容" class="line-text-code"></el-input>
                <button class="getCode" v-if="sent===false" @click="sendCode()" type="button">获取验证码</button>
                <button class="getCode sent" v-if="sent===true" type="button">{{time+'秒后获取'}}</button>
              </div>
            </el-form-item>
          </el-form>
          <button class="newAddressBtn" @click="submit(tableForm)" type="button">新建提币地址</button>
<!--           <el-table
            :data="addressTable"
            style="width: 81.5%"
            max-height="180">
            <el-table-column
              prop="sign"
              label="标签"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提币地址"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                  <span class="del" @click="del()">删除</span>
              </template>
            </el-table-column>
            <el-table-column
              label="默认"
              align="center"
              >
              <template slot-scope="scope">&nbsp;
                <el-radio v-model="radio" :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
          </el-table> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default{
  props: ['btnName', 'dialogVisible', 'tel', 'email', 'businessId'],
  data () {
    return {
      name: this.btnName,
      radio: 0,
      panel: 1,
      sent: false,
      time: 60,
      tableForm: {
        purseAdr: '',
        adrrLabel: '',
        code: '',
        type: 1,
        verificationType: '29'
      },
      rules: {
        purseAdr: [
          { required: true, message: '请输入提币地址', trigger: 'blur' }
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        adrrLabel: [
          { required: true, message: '请输入地址标签', trigger: 'blur' }
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
          // { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    panelChange (val) {
      this.panel = val
      console.log(val)
      if (val === 1) {
        this.tableForm.type = 1
        this.tableForm.verificationType = '29'
      } else if (val === 2) {
        this.tableForm.type = 2
        this.tableForm.verificationType = '30'
      }
    },
    sendCode () {
      let _this = this
      _this.sent = true
      let interval = window.setInterval(function () {
        if ((_this.time--) <= 0) {
          _this.time = 60
          _this.sent = false
          window.clearInterval(interval)
        }
      }, 1000)
      console.log('触发了')
      this.$emit('getCode', this.tableForm.type)
    },
    setTelEmail (type) {
      this.$emit('ToSet', type)
    },
    submit (form) {
      let self = this
      let addForm = {
        purseAdr: this.tableForm.purseAdr,
        adrrLabel: this.tableForm.adrrLabel,
        code: this.tableForm.code,
        verificationType: this.tableForm.verificationType,
        businessId: this.businessId,
        type: this.tableForm.type,
        tel: this.tel,
        email: this.email
      }
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          self.$emit('submit', addForm)
        } else {
          return false
        }
      })
    },
    handleClose () {
      this.clearForm('tableForm')
    },
    clearForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('onClose')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.address-box{
  position: absolute;
  z-index: 10001;
  display: inline-block;
  .el-table{
    margin-top: 20px;
    margin-left: 120px;
    border-radius: 4px;
  }
  .el-dialog__header{
    display:none;
  }
  .el-dialog__body{
    padding:0;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .el-form-item__error{
    position: relative;
    margin-top: -30px;
    margin-right: 15px;
    float: right;
  }
  .short-line .el-form-item__error{
    margin-right: 230px;
  }
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
.outBtn{
  cursor: pointer;
}
.address-inner-box{
  position: relative;
  z-index: 106;
  width: 700px;
  height: 390px;
  border-radius: 10px;
  background-color: #fff;
}
.address-line-header{
  width: 100%;
  height: 60px;
  line-height:60px;
  text-align: center;
  border-radius: 10px;
  border-bottom: 1px solid rgba(230,230,230,1);
}
.address-line-header span{
  position: absolute;
  font-size:20px;
  font-weight: 600;
  font-family:SourceHanSansCN-Regular;
  color:rgba(0,0,0,1);
}
.address-line-header .closeBtn{
  padding-right: 20px;
  float: right;
  font-size: 25px;
  line-height: 60px;
  color:rgba(192,192,192,1);
}
.address-line-header .closeBtn:before{
  cursor: pointer;
}
.address-line-body{
  padding: 30px;
  text-align: right;
}
.newAddressBtn{
  width: 520px;
  height: 34px;
  margin-top: 37px;
  border: 1px solid #00BCD4;
  border-radius: 4px;
  cursor: pointer;
  background-color: #00BCD4;
  color: #fff;
  font-size: 14px;
}
.address-line{
  height: 40px;
  line-height: 40px;
}
.address-line input{
  height: 34px;
  line-height: 34px;
}
.address-line p{
  display: inline-block;
  width: 90px;
  margin-right: 22px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  color: #444;
}
.panel-box{
  height: 50px;
  line-height: 50px;
}
.panel-btn{
  width: 135px;
  height: 34px;
  border: 1px solid #00BCD4;
  background: #fff;
  color: #00BCD4;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.panel-active{
  background: #00BCD4;
  color: #fff;
}
.tel-panel{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.mail-panel{
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.line-text{
  width: 520px;
  span{
    color: #0000FF;
    cursor: pointer;
  }
}
.address-box .btn-group{
  display: inline-block;
  width: 520px;
  text-align: left;
}
.line-text-code{
  width: 310px;
}
.getCode{
  width: 200px;
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
.sent{
  background: #00BCD4;
  color: #fff;
  pointer-events: none;
}
</style>
