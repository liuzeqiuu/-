<template>
  <div class="addBusiness" v-loading="loading">
    <div class="innerBox">
      <div class="add-title">
        <img src="../assets/img/title.png">
        <h1 class="title">商家信息</h1>
      </div>
      <div class="line-box">
        <span>商家名称：</span>
        <input type="text" v-model="addForm.businessName" placeholder="请输入商家名称" class="line-input">
      </div>
      <div class="line-box">
        <span>联系人姓名：</span>
        <input type="text" v-model="addForm.contactName" placeholder="请输入联系人姓名" class="line-input">
      </div>
      <div class="line-box">
        <span>联系人手机号码：</span>
        <input type="text" v-model.number="addForm.contactPhone" placeholder="请输入联系人手机号码" class="line-input">
      </div>
      <div class="line-box">
        <span>Token名称：</span>
        <input type="text" v-model="addForm.tokenName" placeholder="请输入Token名称" class="line-input">
      </div>
      <div class="line-box rate" >
        <span>Token兑换比例：</span>
        <div class="rate-line" v-for="(item,index) in addForm.tokens" :key='index'>
          <el-input placeholder="请输入Token值" v-model="addForm.tokens[index].tokensum" class="rate-input">
            <template slot="append" ><div class="token">Token</div></template>
          </el-input>
          <!-- <input type="text" class="rate-input" v-model="tokens.value"> -->
          <span class="rate-icon">=</span>
          <el-input placeholder="请输入法币值" class="rate-input" v-model="addForm.tokens[index].currencysum">
            <el-select v-model="addForm.tokens[index].currencyId" slot="append" >
              <el-option  v-for="(item,index) in CoinId" :label="item.currencyType" :value="item.id" :key='index'></el-option>
            </el-select>
            <!-- <template slot="append" ><div class="token"></div></template> -->
          </el-input>
          <!-- <input type="text" class="rate-input" v-model="tokens.currencyId"> -->
        </div>
        <div @click="addRate" class="addRateBtn" v-show="plus === true">+ 添加</div>
      </div>
      <div class="btn-group">
        <button class="add-btn sure" @click="add(addForm)">确 定</button>
        <!-- <button class="add-btn cancel">取消</button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {
      loading: true,
      plus: true,
      coinSum: 1,
      typeSum: '',
      addForm: {
        businessName: '',
        contactName: '',
        contactPhone: '',
        tokenName: '',
        tokens: [
          {
            tokensum: '',
            currencysum: '',
            currencyId: 1
          }
        ]
      },
      coin: '',
      CoinId: []
    }
  },
  methods: {
    add (form) {
      let tel = /^[1][3,4,5,7,8][0-9]{9}$/
      if (form.businessName === '') {
        this.$notify({
          title: '提示',
          message: '商家名称不能为空',
          type: 'warning',
          duration: 2000
        })
      } else if (form.contactName === '') {
        this.$notify({
          title: '提示',
          message: '联系人姓名不能为空',
          type: 'warning',
          duration: 2000
        })
      } else if (form.contactPhone === '' || !tel.test(form.contactPhone)) {
        this.$notify({
          title: '提示',
          message: '联系人手机号码不正確',
          type: 'warning',
          duration: 2000
        })
      } else if (form.tokenName === '') {
        this.$notify({
          title: '提示',
          message: 'Token名称不能为空',
          type: 'warning',
          duration: 2000
        })
      } else if (form.tokens[0].currencysum === '' || form.tokens[0].tokensum === '') {
        this.$notify({
          title: '提示',
          message: '请输入正确的Token兑换比例',
          type: 'warning',
          duration: 2000
        })
      } else {
        console.log(form.tokens[0])
        this.myFetch({
          apiName: `addBusinessInfo`,
          postdata: form,
          success: (res) => {
            this.$notify({
              title: '提示',
              message: '添加成功',
              type: 'success'
            })
            this.addForm = {
              businessName: '',
              contactName: '',
              contactPhone: '',
              tokenName: '',
              tokens: [
                {
                  tokensum: '',
                  currencysum: '',
                  currencyId: 1
                }
              ]
            }
          },
          error: (err) => {
            this.$notify({
              title: '提示',
              message: err.resultMsg,
              type: 'warning'
            })
          },
          failed: (fail) => {
            this.$notify({
              title: '提示',
              message: '添加异常',
              type: 'warning'
            })
          }
        })
      }
    },
    addRate () {
      this.addForm.tokens.push({
        tokensum: '',
        currencysum: '',
        currencyId: 1
      })
      this.coinSum++
      if (this.coinSum >= this.typeSum) {
        this.plus = false
      }
    },
    getCoinId () {
      this.myFetch({
        apiName: `searchCoinId`,
        success: (res) => {
          this.CoinId = res
          this.typeSum = res.length
          if (this.coinSum >= this.typeSum) {
            this.plus = false
          }
        },
        complete: () => {
          this.loading = false
        }
      })
    }
  },
  mounted () {
    this.getCoinId()
  }
}
</script>

<style lang="scss">
.addBusiness{
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background: #fff;
  min-width: 600px;
  display:flex;
  align-items: center;
  justify-content: center;
  input::-webkit-input-placeholder{
    color:#ccc;
  }
  .el-input__inner{
    font-size:12px;
  }
  .el-select .el-input__inner{
    font-size:14px;
  }
.innerBox{
  width: 650px;
  margin: 0 auto;
}
.line-box{
  height: 50px;
  line-height: 50px;
  text-align: right;
  margin-right: 50px;
}
.rate{
  height: auto;
}
.rate-line{
  display: inline-block;
  height: 50px;
}
.line-box span{
  font-style: normal;
  font-size: 14px;
  margin-right: 50px;
}
.line-box .line-input{
  height: 35px;
  width: 400px;
  border: 1px solid #dedbdb;
  padding: 0 10px 0 10px;
  border-radius: 5px;
}
.rate-icon{
  margin: 0 20px 0 20px !important;
}
.rate-input{
  width: 175px !important;
  display: inline-block;
}
.line-box   input:focus{
  border: 1px solid #999;
}
.btn-group{
  margin-top: 20px;
  text-align: center;
}
.add-btn{
  width: 120px;
  height: 36px;
  background:#59BFC6;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.add-btn:hover{
  border: 1px solid #ececec;
  color: #000;
}
.add-title{
  height: 30px;
  margin: 0 0 20px 60px;
  line-height: 30px;
  font-weight: 650;
  font-style: normal;
  font-size: 16px;
  color: #666666;
}
.add-title img{
  margin-top: 7px;
  height: 16px;
  float: left;
}
.title{
  margin-left: 8px;
  float: left;
}
.el-input-group__append, .el-input-group__prepend{
  background-color: #fff;
  border: none;
}
.token{
  margin-top: -28px;
  margin-left: 105px;
}
.addRateBtn{
  width: 50px;
  height: 30px;
  margin-left: 200px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.rate-input .el-input__suffix{
  /*margin-top: -28px;*/
  left: 70px;
}
.rate-input .el-input--suffix{
  width: 100px;
  margin-left: 35px;
  text-align: right;
  position: relative;
  top: -28px;
}
.rate-input .el-input--suffix .el-input__inner{
  text-align: right;
}
.el-input--suffix .el-input__inner{
  border:none !important;
}
}
</style>
