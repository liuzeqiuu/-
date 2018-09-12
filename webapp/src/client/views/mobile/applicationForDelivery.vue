<template>
  <div class="mapplicationForDelivery">
    <m-header Title="申请提货"></m-header>
    <div class="content">
      <div class="row-box">
        <span class="label">收货地址</span>
        <div class="right" v-if="address.length === 0" @click="addReceiveAddress">添加
          <i class="iconfont icon-jinru"></i>
        </div>
        <div class="select" v-if="address.length > 0">
          <el-select popper-class="mapplicationForDeliverySelectDown" v-model="deliveryPostData.addressId" placeholder="请选择">
            <el-option
              v-for="(item,index) in address"
              :key="index"
              :label="item.address+item.addressDetails"
              :value="item.addressId">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="button-addAddress" v-if="address.length > 0">
        <el-button class="addAddress" @click="addReceiveAddress" type="text">+添加地址</el-button>
      </div>
      <div class="row-box">
        <span class="label">应付定金</span>
        <div class="right">{{deliveryPostData.tailMoney}} {{tokenName}}</div>
      </div>
      <div class="row-box">
        <span class="label">付款方式</span>
        <div class="payment">
          <el-select popper-class="mapplicationForDeliverySelectDown" @change="choosePayment" v-model="deliveryPostData.currencyId" placeholder="请选择">
            <el-option
              v-for="(item,index) in payment"
              :key="index"
              :label="item.currencyType"
              :value="item.currencyId">
            </el-option>
          </el-select>
        </div>
        <span class="currencyValue">{{deliveryPostData.currencyValue}}</span>
      </div>
    </div>
    <div class="bottom">
      <el-button @click='comfirmDelivery' class="comfirm" :loading="comfirmDeliveryLoading">确定</el-button>
      <el-button class="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import mHeader from '../../components/mNav.vue'
export default {
  components: {
    mHeader
  },
  data () {
    return {
      value: '',
      value1: '',
      currencyValue: 12.111,
      comfirmDeliveryLoading: false,
      tokenName: this.$route.query.tokenName,
      address: [],
      payment: [
        {
          currencyId: 1,
          currencyType: 'BTY'
        },
        {
          currencyId: 2,
          currencyType: 'ETH'
        }
      ],
      deliveryPostData: {
        id: this.$route.query.id,
        addressId: '',
        currencyValue: '',
        tailMoney: this.$route.query.tailMoney,
        currencyId: ''
      }
    }
  },
  mounted () {
    this.getAddress()
    this.getSelectAllCurrencyType()
  },
  methods: {
    getAddress () {
      this.myFetch({
        apiName: 'selectReceivingAddress',
        postdata: {
          userId: this.$store.state.User.userId
        },
        success: (address) => {
          this.address = address.map(({address, ...others}) => {
            if (address.split('-').length === 2) {
              address = address.split('-')[0] + address.split('-')[1]
            } else if (address.split('-').length === 3) {
              address = address.split('-')[0] + address.split('-')[1] + address.split('-')[2]
            }
            return {address, ...others}
          })
          if (address.length > 0) {
            this.deliveryPostData.addressId = address[0].addressId
          }
        }
      })
    },
    getSelectAllCurrencyType () {
      this.myFetch({
        apiName: 'selectAllCurrencyType',
        postdata: {},
        success: (res) => {
          this.payment = res
          this.deliveryPostData.currencyId = this.payment[0].currencyId
          this.getSelectTailMoney()
        }
      })
    },
    getSelectTailMoney () {
      // 需要一个id和currencyId
      this.myFetch({
        apiName: 'selectTailMoney',
        postdata: {
          id: this.$route.query.id,
          currencyId: this.deliveryPostData.currencyId
        },
        success: (currencyValue) => {
          this.deliveryPostData.currencyValue = currencyValue
        }
      })
    },
    choosePayment () {
      console.log('先打印一下id', this.deliveryPostData.currencyId)
      this.getSelectTailMoney()
    },
    comfirmDelivery () {
      console.log('确认提货时的postdata', this.deliveryPostData)
      this.comfirmDeliveryLoading = true
      this.myFetch({
        apiName: 'applyfordelivery',
        postdata: this.deliveryPostData,
        success: () => {
          console.log('成功了')
        },
        complete: () => {
          this.comfirmDeliveryLoading = false
        }
      })
    },
    addReceiveAddress () {
      this.$router.push({path: '/user/addAddress'})
    }
  }
}
</script>
<style scoped lang="scss">
.mapplicationForDelivery{
  .content{
    margin-top: 2.6667vw;
    .button-addAddress{
      height: 9.9vw;
      line-height: 9.9vw;
      padding-right: 4vw;
      .addAddress{
        float: right;
        max-height: 100%;
        color: #59BFC6;
      }
    }
    .row-box{
      height: 11.88vw;
      line-height: 11.88vw;
      border-bottom: 1px solid rgba(235,235,235,1);
      background: #fff;
      .label{
        margin-left: 4.267vw;
        font-family: PingFangSC-Regular;
        font-weight: bold;
        font-size: 3.74vw;
      }
      .currencyValue{
        float:right;
        font-size: 3.74vw;
      }
      .right{
        float: right;
        margin-right: 3.733vw;
        font-family: PingFangSC-Regular;
        font-size: 3.74vw;
        color: #999;
        .iconfont{
          vertical-align: middle;
          line-height: 0px;
          font-size: 4.532vw;
        }
      }
    }
  }
  .bottom{
    text-align: center;
    .comfirm{
      margin-top: 12.13vw;
      background: #59BFC6;
      color: #fff;
      width: 92vw;
      height: 11.88vw;
    }
    .cancel{
      margin: 3.73vw auto;
      background: rgba(170,170,170,1);
      color: #fff;
      width: 92vw;
      height: 11.88vw;
    }
  }
}
</style>
<style lang="scss">
  .mapplicationForDelivery{
    .select{
      float: right;
      width: 75vw;
      .el-input__inner{
        font-size: 1.6vw;
        border: none;
        text-align: right;
        padding-right: 10vw;
      }
    }
    .payment{
      float: right;
      width: 20vw;
      .el-input__inner{
        font-size: 3.74vw;
        border: none;
        text-align: right;
        padding-right: 10vw;
        padding-left: 0px;
      }
    }
  }
  .mapplicationForDeliverySelectDown{
    .el-select-dropdown__item{
      font-size: 1.6vw;
    }
  }
</style>
