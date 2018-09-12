<template>
  <div class="mProductDetail">
    <m-header Title="订单详情"></m-header>
    <div class="product-status">
      <i class="iconfont linerBg" :class="icon_class"></i>
      <p class="status">{{ icon_font }}</p>
      <p class="time">
        <i class="iconfont icon-shizhong"></i>
        提货时间：{{ carrygoods }}
      </p>
      <div class="block-button marginRight" v-if="status === '等待提货'">
        转让Token
      </div>
      <div class="block-button marginRight" v-if="status === '已发货'">
        确认收货
      </div>
      <div class="block-button">
        <a :href="hash()">区块链信息</a>
      </div>
      <div v-show="address">
        <p class="receiver-info">收货信息：{{ product.harvestName }}    {{ product.phone }}</p>
        <p class="receiver-info">地址：{{ product.address}}{{ product.addressDetails }}</p>
      </div>
    </div>

    <div v-if="status === '待发货' || status === '已发货' || status === '已确认收货' || status === '等待提货'">
      <div class="product-price">
        <p class="left">总额：<span class="money">{{ product.totalAmount }} {{ product.tokenName }}</span></p>
        <p class="right"><span v-show="payment">应付尾款: </span><span v-show="!payment">已付尾款: </span>
          <span class="money">{{ product.tailMoney }} {{ product.tokenName }}</span>
        </p>
      </div>
      <div class="express-info" v-show="logis" @click="link">
        <div class="box">
          <div class="box-label">
            <p>快递承运人：</p>
            <p>快递单号：</p>
          </div>
          <div class="box-value" v-if="product.logisticsCode !== undefined">
            <p>{{ product.logisticsName }}</p>
            <p>{{ product.logisticsCode }}</p>
          </div>
        </div>
        <i class="iconfont icon-jinru"></i>
      </div>
    </div>

    <div class="turn-out-info" v-if="product.stateName === '订单转让'">
      <p>转出时间：{{table.time}}</p>
      <p>转出地址：{{table.place}}</p>
      <p><span class="word-bread">数</span>量：{{table.num}}</p>
      <p><span class="word-bread">状</span>态：成功</p>
    </div>

    <div class="product-info">
      <div class="header">
        <span class="title">商品信息</span>
        <span class="time">{{ product.orderCreateTime }}</span>
      </div>
      <div class="intro">
        <div class="intro-img">
          <img :src="product.fileUrl" alt="">
        </div>
        <div class="intro-words">
          <p class="intro-words-title">{{ product.productName }}</p>
          <p class="intro-words-price">价格：{{ product.productPrice }} {{ product.tokenName }}</p>
          <p class="intro-words-deposit">定金：{{ product.amountPrepaid }} {{ product.tokenName }}</p>
        </div>
        <div class="intro-box">
          X<span class="intro-box-num">{{ product.productSum }}</span>
        </div>
      </div>
      <div class="bottom-box">
        <span class="step">阶段一：付定金</span>
        <span class="price">{{ product.amountPrepaid }} {{ product.tokenName }}</span>
        <span class="status">已完成</span>
      </div>
      <div class="bottom-box">
        <span class="step">阶段二：申请提货</span>
        <span class="price">{{ product.tailMoney }} {{ product.tokenName }}</span>
        <span class="status">{{ secondStep }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from '../../components/mNav.vue'
import { formatTime } from '@/common/helper.js'
import { assignment } from '@/common/userOrder.js'

export default {
  props: ['uuid'],
  data () {
    return {
      status: '已确认收货',
      productState: [
        {
          class: 'icon-icon-test3',
          font: '等待提货'
        },
        {
          class: 'icon-icon-test6',
          font: '订单取消'
        },
        {
          class: 'icon-icon-test6',
          font: '订单过期'
        },
        {
          class: 'icon-icon-test7',
          font: '待发货'
        },
        {
          class: 'icon-icon-test5',
          font: '已发货'
        },
        {
          class: 'icon-icon-test4',
          font: '确认收货'
        }
      ],
      product: {
        amountPrepaid: '',
        carrygoodStartTime: '',
        carrygoodsEndTime: '',
        fileUrl: '',
        id: '',
        orderCreateTime: '',
        presaleEndTime: '',
        presaleStartTime: '',
        productName: '',
        productPrice: '',
        productSum: '',
        reserveSum: '',
        stateName: '',
        statusName: '',
        tailMoney: '',
        tokenName: '',
        totalAmount: '',
        harvestName: '',
        phone: '',
        address: '',
        addressDetails: '',
        logisticsName: '',
        logisticsCode: '',
        logisticsTime: '',
        operationHash: ''
      },
      table: {
        time: '2018/01/08  15:20',
        place: '1MLxrzkvkguslaiwkHls isoaoallYlsozlxoxoslQ',
        num: '0.2910124221'
      },
      address: false,
      productId: '',
      time: Number,
      record: false,
      logistics: false,
      process: true,
      payment: true,
      carrygoods: '',
      icon_font: '',
      icon_class: '',
      logis: false,
      secondStep: ''
    }
  },
  components: {
    mHeader
  },
  methods: {
    judge (state) {
      if (state === '待提货') {
        this.icon_font = this.productState[0].font
        this.icon_class = this.productState[0].class
        this.secondStep = '未完成'
      } else if (state === '订单过期') {
        this.icon_font = this.productState[2].font
        this.icon_class = this.productState[2].class
        this.secondStep = '未完成'
      } else if (state === '订单转让') {
        this.icon_font = this.productState[1].font
        this.icon_class = this.productState[1].class
        this.secondStep = '未完成'
      } else if (state === '待发货') {
        this.icon_font = this.productState[3].font
        this.icon_class = this.productState[3].class
        this.secondStep = '已完成'
      } else if (state === '已发货') {
        this.icon_font = this.productState[4].font
        this.icon_class = this.productState[4].class
        this.secondStep = '已完成'
        this.logis = true
      } else if (state === '已确认收货') {
        this.icon_font = this.productState[5].font
        this.icon_class = this.productState[5].class
        this.secondStep = '已完成'
        this.logis = true
      } else {
        this.icon_font = this.productState[0].font
        this.icon_class = this.productState[0].class
        this.secondStep = '未完成'
      }
    },
    hash () {
      return 'http://47.74.190.154:8088?hash=' + this.product.operationHash
    },
    orderQuery (state) {
      let self = this
      this.myFetch({
        apiName: 'orderState',
        postdata: {
          id: this.uuid,
          logisticsCode: this.Code,
          logisticsAbbreviation: this.Abbreviation
        },
        success (value) {
          let content = {}
          if (self.Code !== undefined) {
            content = value.ordersOkShipments
          } else {
            content = value
          }
          let product = self.product
          let table = self.table
          assignment(product, content, table)
          self.judge(content.stateName)
          self.carrygoods = `${formatTime(content.carrygoodStartTime * 1000, 'yyyy年MM月dd日')} 至 ${formatTime(content.carrygoodsEndTime * 1000, 'yyyy年MM月dd日')}`
        }
      })
    },
    link () {
      this.$router.push({path: '/ordertracking', query: {code: this.Code, abbreviation: this.Abbreviation, name: this.product.logisticsName, time: this.product.logisticsTime}})
    }
  },
  mounted () {
    let { code, abbreviation, state } = this.$route.query
    this.Code = code
    this.Abbreviation = abbreviation
    this.state = state
    this.orderQuery(state)
  }
}
</script>

<style scoped lang="scss">
.mProductDetail{
  min-height: 100vh;
  overflow: hidden;
  .product-status{
    margin: 2.67vw 0px;
    overflow: hidden;
    padding-top: 5.1vw;
    padding-bottom: 5.1vw;
    background: #fff;
    text-align: center;
    .linerBg{
      background: -webkit-gradient(linear, 0 0, 0 100%, from(#CBFAFE), to(#5ABFC6));
    }
    >i{
      font-size: 11.75vw;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent;
    }

    .status{
      margin: 4vw auto;
      font-family:PingFangSC-Regular;
      font-weight: 500;
      font-size: 4.27vw;
      color: #59BFC6;
    }
    .time{
      position: relative;
      color: #999;
      font-family:PingFangSC-Regular;
      font-size: 2.94vw;
      height: 4vw;
      line-height: 4vw;
      i{
        font-size: 4vw;
      }
    }
    .block-button{
      display: inline-block;
      margin: 4.41vw auto;
      width: 26.7vw;
      height: 6.67vw;
      line-height:  5.87vw;
      border: 1px solid #5F606A;
      border-radius: 1vw;
      font-family: PingFangSC-Regular;
      font-size: 3.2vw;
      font-weight: 500;
      cursor: pointer;
      a{
        color: #000;
      }
    }
    .marginRight{
      margin-right: 2.54vw;
    }
    .receiver-info{
      font-family:PingFangSC-Regular;
      font-size: 2.94vw;
      line-height: 5vw;
      color: #999;
    }
  }
  .product-price{
    margin-bottom: 2.67vw;
    height: 12.81vw;
    line-height: 12.81vw;
    background: #fff;
    font-family:PingFangSC-Regular;
    font-size: 3.47vw;
    .left{
      float:left;
      margin-left: 4vw;
    }
    .right{
      float: right;
      margin-right: 9.1vw;
    }
    .money{
      color: #59BFC6;
    }
  }
  .express-info{
    position: relative;
    margin-bottom: 2.67vw;
    height: 20.29vw;
    background: #fff;
    font-family: PingFangSC-Regular;
    font-size: 3.47vw;
    line-height: 6.67vw;
    color: #5F606A;
    .box{
      position: absolute;
      top: 50%;
      margin-top: -6.95vw;
      height: 13.5vw;
    }
    .box-label{
      float: left;
      margin-left: 4.13vw;
    }
    .box-value{
      float: left;
      margin-left: 4.13vw;
    }
    i{
      position: absolute;
      color: #59BFC6;
      right: 4.93vw;
      top: 50%;
      margin-top: -2.67vw;
      font-size: 5.34vw;
    }
  }
  .turn-out-info{
    margin-bottom: 2.67vw;
    padding: 2.27vw 0px 1.73vw 4.27vw;
    background: #fff;
    font-family: PingFangSC-Regular;
    font-size: 3.2vw;
    color: #5F606A;
    line-height: 8vw;
    .word-bread{
      margin-right: 6.4vw;
    }
  }
  .product-info{
    overflow: hidden;
    background: #fff;
    .header{
      padding-left: 3.74vw;
      height: 9.34vw;
      line-height: 9.34vw;
      border-bottom: 1px solid #f0f0f0;
      .title{
        font-family: PingFangSC-Regular;
        font-size: 3.47vw;
        color: #000;
      }
      .time{
        float: right;
        margin-right: 4.67vw;
        font-family: PingFangSC-Regular;
        font-size: 3.47vw;
      }
    }
    .intro{
      position: relative;
      overflow:hidden;
      margin: 4.54vw 6.8vw 6.27vw 4vw;
    }
    .intro-img{
      float: left;
      padding: 2.8vw 2.4vw 1.7vw 1.2vw;
      width: 18.96vw;
      height: 17.49vw;
      border: 1px solid #ECECEC;
    }
    .intro-img img{
      width: 100%;
      height: 100%;
    }
    .intro-words{
      float: left;
      margin-left: 4.94vw;
      height: 17.49vw;
      max-width: 56vw;
    }
    .intro-words-title{
      margin-bottom: 2vw;
      font-family: PingFangSC-Regular;
      font-size: 3.47vw;
      font-weight: 500;
      color: #000;
    }
    .intro-words-price{
      margin-bottom: 1.6vw;
      font-size: 3.2vw;
      font-family: PingFangSC-Medium;
    }
    .intro-words-deposit{
      font-size: 3.2vw;
      font-family: PingFangSC-Medium;
    }
    .intro-box{
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -2.335vw;
      min-width: 4.67vw;
      height: 4.67vw;
      line-height: 4.67vw;
      text-align: center;
      color: #59BFC6;
    }
    .intro-box span{
      font-weight: 500;
    }
    .bottom-box{
      overflow: hidden;
      margin-bottom:5.2vw;
      display: flex;
      justify-content: space-around;
      .step{
        width: 26vw;
      }
      .price{
        width: 40vw;
        text-align: center;
      }
      .status{
        width: 12vw;
      }
    }
  }
}
</style>
