<template>
  <div class="userorder">
    <div class="content">
      <div class="process" v-show="process">
        <h1>预订进程</h1>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step :title="item.title" :description="item.description" :key="item.id" v-for="item in step"></el-step>
        </el-steps>
      </div>
      <div class="record" v-show="record">
        <h1>转出记录</h1>
        <table>
          <tr>
            <th>转出记录</th>
            <th>转出地址</th>
            <th>数量</th>
            <th>状态</th>
          </tr>
          <tr>
            <td>{{table.time}}</td>
            <td>{{table.place}}</td>
            <td>{{table.num}}</td>
            <td>成功</td>
          </tr>
        </table>
      </div>
      <div class="logistics" v-show="logistics">
        <h1>物流信息</h1>
        <div class="logis-content">
          <div class="left">
            快递承运人：{{ product.logisticsName }}<br>
            快递单号：{{ product.logisticsCode }}<br>
            发货时间：{{ product.logisticsTime }}
          </div>
          <div class="right">
            <div :key="it.id" v-for="it in logis" class="line" v-show="!shownologis">
              <div class="circle">
                <div class="cir"></div>
              </div>
              <p>{{ it.AcceptTime }}</p>
              <p>{{ it.AcceptStation }}</p>
            </div>
            <div v-show="shownologis" class="shownologis">
              暂无轨迹消息
            </div>
          </div>
        </div>
      </div>
      <div class="infor">
        <h1>订单信息</h1>
        <div class="order">
          <div class="num">
            <p>订单号：{{ product.id }} <span>{{ product.orderCreateTime }}</span><span>{{ product.stateName }}</span></p>
          </div>
          <div class="product">
            <div class="photo" @click="link">
              <img :src="product.fileUrl" alt="">
            </div>
            <div class="product-title" :title="product.altName">
              {{ product.productName }} X {{ product.productSum }}
              <p>{{ product.statusName }}</p>
            </div>
            <div class="product-infor">
              <div>
                <p>价格：{{ product.productPrice }}{{ product.tokenName }}</p>
                <p>{{ product.reserveSum }}人已预订</p>
              </div>
              <div>
                <p>定金：{{ product.amountPrepaid }} {{ product.tokenName }}</p>
                <p>剩余天数：<count-down :times="time"></count-down></p>
              </div>
              <div>
                <p>{{ product.harvestName }}    {{ product.phone }}</p>
                <p>{{ product.address}}{{ product.addressDetails }}</p>
              </div>
              <div>
                <p>总额：{{ product.totalAmount }}{{ product.tokenName }}</p>
                <p><span v-show="payment">应付尾款: </span><span v-show="!payment">已付尾款: </span>{{ product.tailMoney }}{{ product.tokenName }}</p>
              </div>
            </div>
          </div>
          <p class="check">
            <a :href="hash()">查看区块链信息</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatTime } from '@/common/helper.js'
import CountDown from '@/common/components/CountDown.vue'
import { assignment } from '@/common/userOrder.js'

export default {
  components: {
    CountDown
  },
  props: ['uuid'],
  data () {
    /*
      active: 决定步骤条到哪一步
      step: 步骤条的每一步描述
      product{
        amountPrepaid: 预付定金
        carrygoodStartTime: 提货开始时间
        carrygoodsEndTime: 提货结束时间
        fileUrl: 产品缩略图地址
        id: 订单编号
        orderCreateTime: 订单生成时间
        presaleEndTime: 预售结束时间
        presaleStartTime: 预售开始时间
        productName: 产品名称
        productPrice: 产品价格
        productSum: 产品数量
        reserveSum: 预定人数
        stateName: 订单状态名称
        statusName: 产品状态名称
        tailMoney: 已付尾款Or应付尾款
        tokenName: token名称
        totalAmount: 总金额
        harvestName: 收货人姓名,
        phone: 收货人手机号码,
        address: 收货地址省市区,
        addressDetails: 收货具体详情地址
      }

      address: 值为true false 订单信息中的地址，联系人，电话是否显示
    */
    return {
      active: 1,
      step: [
        {
          title: '预订成功',
          description: ''
        },
        {
          title: '支付尾款/申请提货',
          description: ' '
        },
        {
          title: '已发货',
          description: ' '
        },
        {
          title: '确定收货',
          description: ' '
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
      logis: [
        {
          AcceptTime: '2018-03-20/周五',
          AcceptStation: '【杭州市】 您的订单已经到达京东【杭州分拣中心】'
        }
      ],
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
      shownologis: false
    }
  },
  methods: {
    orderstate (state) {
      if (state === 1 || state === '待提货') {
        state = '待提货'
        this.active = 1
        this.payment = true
      } else if (state === 2 || state === '订单过期') {
        state = '订单过期'
        this.process = false
        this.payment = true
      } else if (state === 3 || state === '订单转让') {
        state = '订单转让'
        this.record = true
        this.process = false
        this.payment = true
      } else if (state === 4 || state === '待发货') {
        state = '待发货'
        this.active = 2
        this.payment = false
      } else if (state === 5 || state === '已发货') {
        state = '已发货'
        this.active = 3
        this.logistics = true
        this.payment = false
      } else if (state === 6 || state === '已确认收货') {
        state = '已确认收货'
        this.active = 4
        this.logistics = true
        this.payment = false
      } else {
        state = '提货中'
        this.active = 1
        this.payment = true
      }
      this.product.stateName = state
    },

    productstate (state, presaleStartTime, presaleEndTime, carrygoodsEndTime) {
      if (state === 1 || state === '即将开始') {
        state = '即将开始'
        this.time = presaleStartTime
      } else if (state === 2 || state === '预售中') {
        state = '预售中'
        this.time = presaleEndTime
      } else if (state === 3 || state === '提货中') {
        state = '提货中'
        this.time = carrygoodsEndTime
      } else {
        state = '已结束'
        this.time = carrygoodsEndTime
      }
      this.product.statusName = state
    },
    description (content) {
      this.step[0].description = formatTime(content.orderCreateTime, 'yyyy年MM月dd日 hh:mm:ss')
      this.step[1].description = `${formatTime(content.carrygoodStartTime * 1000, 'yyyy年MM月dd日')} 至 ${formatTime(content.carrygoodsEndTime * 1000, 'yyyy年MM月dd日')}`
      if (this.active === 3 || this.active === 4) {
        this.step[2].description = formatTime(content.deliverTime, 'yyyy年MM月dd日 hh:mm:ss')
      }
      if (this.active === 4) {
        this.step[3].description = formatTime(content.confirmReceiptTime, 'yyyy年MM月dd日 hh:mm')
      }
    },
    hash () {
      return 'http://47.74.190.154:8088?hash=' + this.product.operationHash
    },
    // 产品详情查询
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
            if (value.Traces.length === 0) {
              self.shownologis = true
            } else {
              self.logis = value.Traces.reverse()
              self.shownologis = false
            }
          } else {
            content = value
          }
          let product = self.product
          console.log(self.product)
          let table = self.table
          assignment(product, content, table)
          self.orderstate(content.stateName)
          self.productstate(content.statusName, content.presaleStartTime, content.presaleEndTime, content.carrygoodsEndTime)
          self.description(content)
        }
      })
    },
    link () {
      this.$router.push('/product/' + this.productId)
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
<style lang="scss">
.userorder{
  width: 100%;
  height: 100%;
  min-height: calc( 100vh - 294px);
  background: #F1F4F5;
  .content{
    margin: 0 auto;
    width: 1200px;
    padding-top: 27px;
    h1{
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight: bold;
      color:rgba(0,0,0,1);
    }
    .process{
      .el-steps{
        margin: 44px 0 76px 0;
        .is-text{
          width:50px;
          height:50px;
          border: 3px solid #CCCCCC;
          font-size: 30px;
        }
        .el-step__line {
          top: 25px;
          height: 1px;
          border: 0;
          background: none;
          border-top: 2px dashed #ccc;
        }
        .el-step__title{
          margin: 39px 0 16px 0;
          font-weight: bold;
          font-family:PingFangSC-Regular;
          color:#62605F;
        }
        .el-step__icon-inner{
          color: #CCCCCC;
        }
        .is-success{
          border-color: $client_tab_content_pre !important;
          color: $client_tab_content_pre;
          font-weight: bold;
          .is-text{
            border-width: 3px;
            border-color: $client_tab_content_pre !important;
            color: $client_tab_content_pre;
          }
          .el-step__line {
            border: 1.5px solid $client_tab_content_pre;
          }
          .el-step__icon-inner{
            color: $client_tab_content_pre;
          }
          .el-step__line-inner{
            border-width: 1.5px !important;
            margin-top: -3px;
            background: none;
          }
        }
        .el-step__description{
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight: bold;
          color:rgba(98,96,95,1);
        }
      }
    }
    .record{
      table{
        margin: 20px 0;
        width:1199px;
        background:rgba(255,255,255,1);
        tr{
          height: 48px;
          line-height: 48px;
          font-size:14px;
          font-family:PingFangSC-Medium;
          color:rgba(95,96,106,1);
          th:nth-of-type(1){
            padding-left: 27px;
          }
          td:nth-of-type(1){
            padding-left: 27px;
          }
        }
        tr:nth-of-type(1){
          border-bottom: 1px solid #F0F0F0;
          font-size:14px;
          font-family:PingFangSC-Regular;
          color:rgba(0,0,0,1);
        }
      }
    }
    .logistics{
      .logis-content{
        margin: 19px 0;
        width:100%;
        height:173px;
        background:rgba(255,255,255,1);
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(0,0,0,1);
        line-height:38px;
        div{
          padding: 30px;
        }
        .left{
          float: left;
          width: 330px;
          border-right: 1px solid #d4d4d4;
        }
        .right{
          float: right;
          width: 868px;
          height: 173px;
          padding-top: 25px;
          overflow: auto;
          .line{
            width: 671px;
            padding: 0;
            display: flex;
            align-items: center;
            .circle{
              margin-right: 30px;
              padding: 0;
              display: inline-block;
              .cir{
                position: relative;
                top: -2px;
                width:7px;
                height:7px;
                border-radius: 100%;
                padding: 0;
                background: #D4D4D4;
              }
              .cir:before{
                content: ' ';
                position: absolute;
                top: -29px;
                left: 3px;
                height: 30px;
                width: 1px;
                background: #d4d4d4;
              }
              .cir:after{
                content: ' ';
                position: absolute;
                top: 6px;
                left: 3px;
                height: 50px;
                width: 1px;
                background: #d4d4d4;
              }
            }
            p{
              display: inline-block;
            }
            p:nth-of-type(1){
              width: 150px;
            }
            p:nth-of-type(2){
              width: 500px;
            }
          }
          .shownologis{
            padding-left: 30px;
          }
        }
      }
    }
    .infor{
      clear: both;
      .order{
        margin: 17px 0 87px 0;
        width: 100%;
        height: 235px;
        background: #fff;
        .num{
          height: 40px;
          width: 100%;
          border-bottom: 1px solid #F0F0F0;
          padding: 0 15px 12px 15px;
          font-size:12px;
          font-family:PingFangSC-Regular;
          color:rgba(0,0,0,1);
          line-height:40px;
          p{
            span:nth-of-type(1){
              display: inline-block;
              margin-left: 31px;
            }
            span:nth-of-type(2){
              float: right;
              font-size:14px;
              font-family:PingFangSC-Light;
              color:#BE2F1F;
            }
          }
        }
        .product{
          padding: 24px 15px;
          .photo{
            position: relative;
            width:130px;
            height:115px;
            float: left;
            border: 1px solid #EEECEC;
            img{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              max-width: 100%;
              max-height: 100%;
            }
          }
          .product-title{
            float: left;
            margin: 0 0 31px 31px;
            width: 1000px;
            font-size:16px;
            font-family:PingFangSC-Regular;
            color:rgba(0,0,0,1);
            font-weight: bold;
            p{
              display: inline-block;
              margin-left: 22px;
              width:80px;
              height:25px;
              border-radius:4px;
              border: 1px solid #BE2F1F;
              text-align: center;
              font-size:12px;
              font-family:PingFangSC-Light;
              color:rgba(190,47,31,1);
              line-height:25px;
            }
          }
          .product-infor{
            float: left;
            margin-left: 31px;
            font-size:14px;
            font-family:PingFangSC-Medium;
            color:rgba(95,96,106,1);
            line-height:35px;
            display: flex;
            justify-content: space-around;
            div{
              margin-right: 30px;
            }
            div:nth-of-type(2){
              // margin: 0 50px;
              .countdown{
                i{
                  font-weight: 500;
                }
              }
            }
             div:nth-of-type(3){
              // margin-right: 160px;
              width: 260px;
            }
            div:nth-of-type(4){
              // float: right;
              text-align: right;
            }
            .timeBox{
              float: right;

            }
          }
        }
        .check{
          clear: both;
          width: 100%;
          padding-right: 17px;
          text-align: right;
          font-size:14px;
          font-family:PingFangSC-Regular;
          line-height:30px;
          cursor: pointer;
          a{
            color: #0068B1;
          }
        }
      }
    }
  }
  ::-webkit-scrollbar{
    width:6px;
    height:171px;
  }
  ::-webkit-scrollbar-button{
    display: none;
  }
  ::-webkit-scrollbar-thumb{
    background:#e0e0e0;
    border-radius:3px;
  }
  ::-webkit-scrollbar-track{
    background: rgba(236,236,236,1);
  }
}
</style>
