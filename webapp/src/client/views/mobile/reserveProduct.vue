<template>
  <div class="mReserveProduct">
    <m-header Title='预售'></m-header>
    <div class="content">
      <div class="box">
        <span class="box-title">预售付款方式</span>
        <span class="box-right">先付定金</span>
      </div>
      <div class="box marginBottom">
        <span class="box-title">购买数量</span>
        <span class="box-right">
           <c-input-number v-model="postdataReserveProduct.productSum" :min="1" :max="200"></c-input-number>
        </span>
      </div>
      <div class="box">
        <span class="box-title">应付定金</span>
        <span class="box-right">{{showProductPrice}} {{product.tokenName}}</span>
      </div>
      <div class="box">
        <span class="box-title">付款方式</span>
        <div class="payment-input">
          <el-input
            placeholder="请输入内容"
            v-model="showProductTokenValue">
          </el-input>
        </div>
        <div class="payment-select">
          <el-select @change="choosePayment" v-model="postdataReserveProduct.currencyId" placeholder="请选择">
            <el-option
              v-for="(item,index) in paymentMethod"
              :key="index"
              :label="item.currencyName"
              :value="item.currencyId">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="deposit-button comfirm"  @click="comfirmReserve">
      <span>确定</span>
    </div>
    <div class="deposit-button cancel" @click="cancelReserve">
      <span>取消</span>
    </div>
  </div>
</template>

<script>
import mHeader from '../../components/mNav.vue'
import customeInputNumber from '@/common/components/InputNumber.vue'
export default {
  data () {
    return {
      product: '',
      num1: 1,
      paymentMethod: [],
      postdataReserveProduct: {
        productId: '',
        userId: '',
        productSum: 1,
        currencyId: '',
        currencyName: '',
        currencyValue: '',
        productPrice: ''
      }
    }
  },
  components: {
    mHeader,
    'c-input-number': customeInputNumber
  },
  computed: {
    showProductPrice: function () {
      // 应付尾款 = 单价 * 数量
      // tokenValue 为某种商品的单价
      // productSum 为商品的数量
      const value = this.product && this.product.tokenValue
      const amount = this.postdataReserveProduct.productSum
      if ((value || value === 0) && amount) {
        return (value * 100000000 * amount) / 100000000
      }
    },
    showProductTokenValue: function () {
      if (this.postdataReserveProduct.currencyValue) {
        const value = this.postdataReserveProduct.currencyValue
        const amount = this.postdataReserveProduct.productSum
        if ((value || value === 0) && amount) {
          return (value * amount).toFixed(8)
        }
      } else {
        return '--'
      }
    }
  },
  methods: {
    reservationInfo () {
      const loading = this.$loading()
      this.myFetch({
        apiName: 'getReserveInfo',
        postdata: {
          userId: this.$store.state.User.userId,
          productId: this.$route.params.uuid
        },
        success: (product = {}) => {
          this.product = product
          this.paymentMethod = product.switchTokenVOList
          this.postdataReserveProduct.currencyValue = this.paymentMethod[0].currencyValue
          this.postdataReserveProduct.currencyId = this.paymentMethod[0].currencyId
          this.postdataReserveProduct.currencyName = this.paymentMethod[0].currencyName
        },
        failed: (res) => {
          if (/Not Found/.test(res)) {
            this.$router.replace('/404')
          }
        },
        complete: function () {
          loading.close()
        }
      })
    },
    choosePayment () {
      const payment = this.paymentMethod.find(item => this.postdataReserveProduct.currencyId === item.currencyId)
      this.postdataReserveProduct.currencyValue = payment.currencyValue
      this.postdataReserveProduct.currencyName = payment.currencyName
    },
    comfirmReserve () {
      this.postdataReserveProduct.productPrice = this.showProductPrice
      this.postdataReserveProduct.currencyValue = this.showProductTokenValue
      this.postdataReserveProduct.productId = this.$route.params.uuid
      this.postdataReserveProduct.userId = this.$store.state.User.userId
      this.myFetch({
        apiName: 'goodsReserve',
        postdata: this.postdataReserveProduct,
        success: () => {
          console.log('预订成功了')
        }
      })
    },
    cancelReserve () {
      this.$router.back(-1)
    },
    handleChange (value) {
      console.log(value)
    }
  },
  mounted () {
    this.reservationInfo()
  }
}
</script>

<style scoped lang="scss">
.mReserveProduct{
  .content{
    margin-top: 2.94vw;
    margin-bottom: 11.88vw;
    width: 100%;
    overflow: hidden;
    .box{
      width: 100%;
      background: #fff;
      border-bottom: 1px solid #EBEBEB;
      height: 11.89vw;
      line-height: 11.89vw;
      font-family: PingFangSC-Regular;
      .payment-select{
        float: right;
        margin-right: 3vw;
        width: 21vw;
      }
    }
    .box-title{
      float: left;
      margin-left: 3.87vw;
      font-size: 3.74vw;
      font-weight: 500;
      color: #000;
    }
    .box-right{
      float: right;
      margin-right: 4vw;
      font-size: 3.74vw;
      font-weight: 500;
      color: #999;
    }
  }
  .deposit-button{
    margin: 0px auto 3.74vw auto;
    border-radius: 1vw;
    width: 92.12vw;
    height: 11.89vw;
    line-height: 11.89vw;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 3.74vw;
    color: #fff;
  }
  .comfirm{
    background: #59BFC6
  }
  .cancel{
    background: #AAA;
  }
  .marginBottom{
    margin-bottom: 2.4vw;
  }
}
</style>
<style lang="scss">
.mReserveProduct{
  .el-input-number{
    width: 22.4vw;
    height: 6.86vw;
    line-height: 6.86vw;
  }
  .el-input-number__increase, .el-input-number__decrease{
    width: 5vw;
    height: 93%;
  }
  .el-input-number .el-input__inner{
    padding-left: 4vw;
    padding-right: 4vw;
    height: 6.86vw;
    line-height: 0px;
  }
  .payment-select .el-input__inner{
    height: 6.93vw;
    line-height: 6.93vw;
    border-color: transparent;
  }
  .payment-select .el-select .el-input.is-focus .el-input__inner{
    border-color: transparent;
  }
  .payment-input{
    display: inline-block;
    margin-top: 0.5vw;
    margin-left: 3vw;
    .el-input__inner{
      height: 6.93vw;
      line-height: 6.93vw;
      border-color: transparent;
    }
  }
}
</style>
