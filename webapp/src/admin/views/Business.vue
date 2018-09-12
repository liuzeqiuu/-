<template>
  <div class="Business" v-loading="loading">
    <div class="businessInfo">
      <div class="TitleBox">
        <img src="../assets/img/title.png">
        <h1 class="title">商家信息</h1>
      </div>
      <table class="infoBox">
        <tr class="line">
          <td class="lineTitle">商家名称</td>
          <td>{{userMsg.businessName}}</td>
          <td class="lineTitle">联系人姓名</td>
          <td>{{userMsg.contactName}}</td>
        </tr>
        <tr class="line">
          <td class="lineTitle">联系人手机号码</td>
          <td>{{userMsg.contactPhone}}</td>
          <td class="lineTitle">Token名称</td>
          <td>{{userMsg.tokenName}}</td>
        </tr>
      </table>
    </div>
    <div class="accountAssets">
      <div class="TitleBox">
        <img src="../assets/img/title.png">
        <h1 class="title">账户资产</h1>
      </div>
      <el-table :data="accountForm" stripe style="width: 100%">
        <el-table-column
          prop="currencyname"
          label="币种"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="usable_amount"
          label="可用数量"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="freeze_amount"
          label="冻结数量"
          min-width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200"
          v-if="ident === 'business'">
          <template slot-scope="scope">
              <span @click="showDepositDialog(accountForm[scope.$index].currencyname,accountForm[scope.$index].currencyId,businessID)" class="outBtn Deposit">充币</span>
              <span @click="showWithdrawDialog(accountForm[scope.$index].currencyname,accountForm[scope.$index].currencyId,businessID,accountForm[scope.$index].type)" class="outBtn">提币</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗区 -->
    <with-dialog  :dialogVisible="showWithdraw"
                  @onClose="handleCloseWithDrawDialog"
                  :addressForm="addressForm"
                  :feeForm="feeForm"
                  :coinName="WithCoinName"
                  :maxNum="(usable_amount+freeze_amount)"
                  :extractableNum="usable_amount"
                  :tel="WithdrawForm.contactPhone"
                  :email="WithdrawForm.contactEmail"
                  @ToSet="SetTelEmail"
                  @submit="withdraw"
                  @sendCode="getCodeWith"
                  @addressAdd="showAddressDialog"></with-dialog>
    <Deposit-dialog  :dialogVisible="showDepositDraw"
                      @onClose="handleCloseDepositDialog"
                      :coinName="ReCoinName"
                      :imgPath="DepositForm.base64"
                      :address="DepositForm.adrr"></Deposit-dialog>
    <add-address :dialogVisible="showAddress"
                 :tel="userTel"
                 :email="userEmail"
                 :businessId="businessID"
                 @ToSet="SetTelEmail"
                 @onClose="handleCloseAddressDialog"
                 @getCode="getCode"
                 @submit="buildAddress"></add-address>
    <div class="DepositRecord">
      <div class="DepositTitle">
        <h3>充提记录</h3>
      </div>
      <el-table :data="RecordForm.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe style="width: 100%">
        <el-table-column
          prop="transferTime"
          label="时间"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="transferType"
          label="类型"
          min-width="100">
          <template slot-scope="scope">
              <span v-if="scope.row.transferType === 2" style="color: #008000">提币</span>
              <span v-if="scope.row.transferType === 1">充币</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currencyname"
          label="币种"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="transferAddress"
          label="地址"
          min-width="300">
        </el-table-column>
        <el-table-column
          prop="transferNum"
          label="数量"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="transferState"
          label="状态"
          width="100">
          <template slot-scope="scope">
              <span v-if="scope.row.transferState === 1" style="color: #008000">成功</span>
              <span v-if="scope.row.transferState === 0">处理中</span>
              <span v-if="scope.row.transferState === 2" style="color: red">失败</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageblock">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page.sync="currentPage"
          @current-change="pageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import DepositDialog from '../../common/components/Deposit.vue'
import withDialog from '../../common/components/WithDraw.vue'
import addAddress from '../../common/components/AddAdress.vue'
import {formatTime} from '../../common/helper.js'
export default{
  data () {
    return {
      loading: true,
      pageSize: 10,
      total: 10,
      currentPage: 1,
      ident: '',
      showWithdraw: false,
      showDepositDraw: false,
      showAddress: false,
      ReCoinName: '',
      WithCoinName: '',
      url: 'http://www.baidu.com',
      accountForm: [],
      DepositForm: [],
      RecordForm: [],
      WithdrawForm: [],
      addressForm: [
        {
          address: 'asdfqwefsdvzxvxcvzdfas'
        },
        {
          address: 'svkxjchvzsfakjshfsjdfkasfk'
        }
      ],
      feeForm: [],
      userMsg: {
        businessName: '',
        contactName: '',
        contactPhone: '',
        tokenName: ''
      },
      businessID: '',
      userTel: '',
      userEmail: '',
      coinID: '',
      userID: '',
      tokensymbol: '',
      usable_amount: '',
      freeze_amount: ''
    }
  },
  methods: {
    showWithdrawDialog (coin, coinID, userID, type) {
      this.coinID = coinID
      this.userID = userID
      this.WithCoinName = coin
      this.showWithdraw = true
      this.getAddressForm(coinID, userID)
      this.myFetch({
        apiName: 'withdrawMsg',
        postdata: {businessId: userID, currencyId: coinID},
        success: (res) => {
          this.WithdrawForm = res
          this.feeForm = res.minerMoneys
          if (type === 1) {
            this.tokensymbol = ''
            this.usable_amount = res.usable_amount
            this.freeze_amount = res.freeze_amount
          } else if (type === 2) {
            this.tokensymbol = coin
            this.usable_amount = res.usable_amount_token
            this.freeze_amount = res.freeze_amount_token
          }
        }
      })
    },
    showDepositDialog (coin, coinID, userID) {
      this.ReCoinName = coin
      this.showDepositDraw = true
      this.myFetch({
        apiName: 'deposit',
        postdata: {'businessId': userID, 'currencyId': coinID},
        success: (res) => {
          this.DepositForm = res
          // console.log(res)
        }
      })
      // console.log(coin,coinID,userID)
    },
    showAddressDialog () {
      this.showAddress = true
    },
    handleCloseWithDrawDialog () {
      this.showWithdraw = false
    },
    handleCloseDepositDialog () {
      this.showDepositDraw = false
    },
    handleCloseAddressDialog () {
      this.showAddress = false
    },
    buildAddress (form) {
      this.myFetch({
        apiName: 'addAddress',
        postdata: {
          adrrLabel: form.adrrLabel,
          businessId: form.businessId,
          code: form.code,
          type: form.type,
          email: form.email,
          phone: form.tel,
          purseAdr: form.purseAdr,
          verificationType: form.verificationType,
          currencyId: this.coinID
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '添加地址成功！',
            type: 'success'
          })
          this.showAddress = false
          this.getAddressForm(this.coinID, this.userID)
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
      // this.handleCloseAddressDialog()
    },
    filterTag (value, row) {
      return row.tag === value
    },
    Deposit () {
      console.log('充币')
    },
    pageChange (val) {
      this.currentPage = val
    },
    SetTelEmail (type) {
      if (type === 'email') {
        this.$notify({
          title: '提示',
          message: '暂未支持邮箱验证！',
          type: 'warning'
        })
      }
    },
    withdraw (form) {
      console.log('地址：', form.fee)
      this.myFetch({
        apiName: 'withdraw',
        postdata: {
          'businessId': this.businessID,
          'currencyId': this.coinID,
          'type': form.type, // 验证码模块，1是手机，2是邮箱
          'verificationType': 23, // 提币模块20
          'phone': this.userTel, // 手机
          'email': this.userEmail,
          'code': form.code,
          'number': form.num, // 提币数量
          'minermoney': form.fee,
          'adrr': form.address,
          'tokensymbol': this.tokensymbol // 币种名 BTC等为空，Token发送   根据Assets中的type判断
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '提币申请成功！',
            type: 'success'
          })
          this.showWithdraw = false
          this.getAccountAssets(sessionStorage.getItem('businessId'))
        }
      })
      console.log(form)
    },
    getCode (type) {
      this.myFetch({
        apiName: 'SendCode',
        postdata: {
          'verificationType': '26', // 添加地址模块26
          'name': this.userTel
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '发送成功！',
            type: 'success'
          })
        }
      })
    },
    getCodeWith () {
      this.myFetch({
        apiName: 'SendCode',
        postdata: {
          'verificationType': '23', // 获取提币验证码模块23
          'name': this.userTel
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '发送成功！',
            type: 'success'
          })
        }
      })
    },
    getRecord () {
      this.myFetch({
        apiName: 'allRecord',
        postdata: {},
        success: (res) => {
          console.log(this.accountForm)
        }
      })
    },
    getAccountAssets (id) {
      this.myFetch({
        apiName: 'bussinessAccountAssets',
        postdata: {'businessId': id},
        success: (res) => {
          this.total = res.businessTransfers.length
          // console.log(res)
          this.userMsg = res.business
          this.RecordForm = res.businessTransfers
          // this.RecordForm.transferTime = formatTime(this.RecordForm.transferTime, 'yyyy-MM-dd hh:mm:ss')
          this.accountForm = res.businessAssetss
          this.businessID = res.business.id
          this.userTel = res.business.contactPhone
          this.userEmail = res.business.contactEmail
          for (var i = res.businessTransfers.length - 1; i >= 0; i--) {
            this.RecordForm[i].transferTime = formatTime(this.RecordForm[i].transferTime, 'yyyy-MM-dd hh:mm:ss')
          }
          // console.log(res.businessTransfers.length)
        },
        complete: () => {
          this.loading = false
        }
      })
    },
    getAddressForm (coinID, userID) {
      this.myFetch({
        apiName: 'withdrawAddress',
        postdata: {
          businessId: userID,
          currencyId: coinID
        },
        success: (res) => {
          this.addressForm = res
          console.log('地址添加：', this.addressForm)
        }
      })
    },
    getFeeForm () {
      this.myFetch({
        apiName: 'feeList',
        postdata: {},
        success: (res) => {
          console.log(this.feeForm)
        }
      })
    }
  },
  mounted () {
    this.ident = sessionStorage.getItem('Ident')
    if (this.ident === 'admin') {
      this.getAccountAssets(this.$route.query.form.id)
    } else if (this.ident === 'business') {
      this.getAccountAssets(sessionStorage.getItem('businessId'))
    }
    // this.userMsg = this.$route.query.form
  },
  components: {
    withDialog,
    DepositDialog,
    addAddress
  }
}
</script>

<style scoped>
.outBtn{
  padding: 10px;
  color: #04C3E0;
  cursor: pointer;
}
.pageblock{
  margin: 20px auto 20px;
  text-align: center;
}
.Business{
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background: #fff;
  min-width: 1000px;
}
.businessInfo,.accountAssets,.DepositRecord{
  width: 90%;
  margin: 0 auto;
}
.accountAssets,.DepositRecord{
  margin-top: 30px;
}
.TitleBox{
  height: 30px;
  margin-bottom: 10px;
  line-height: 30px;
  font-weight: 650;
  font-style: normal;
  font-size: 16px;
  color: #666666;
}
.TitleBox img{
  margin-top: 7px;
  height: 16px;
  float: left;
}
.title{
  margin-left: 8px;
  float: left;
}
.DepositTitle h3{
  font-weight: 650;
  font-style: normal;
  font-size: 15px;
  color: #666666;
}
.infoBox{
  width: 100%;
  text-align: center;
  font-size: 13px;
}
.infoBox td{
  border: 1px solid #ccc;
}
.line{
  height: 40px;
}
.lineTitle{
  width: 150px;
  /*background-color: #ececec;*/
}
.operateCoin{
  padding: 10px;
  color: #04C3E0;
  cursor: pointer;
}
.Deposit{
  border-right: 1px solid #ccc;
}

</style>

<style>
.accountAssets .has-gutter .is-leaf:nth-of-type(4){
  text-indent:17px;
}
</style>
