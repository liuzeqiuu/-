<template>
  <div class="orderList">
    <m-header Title="订单详情"></m-header>
    <div class="m-tabs">
      <m-tabs :tabs='tabs' @onTabChange="onTabChange"></m-tabs>
    </div>
    <div v-infinite-scroll="loadMore"
         infinite-scroll-distance="10">
    <div class="orderList-content" v-for="(order,index) in orderList" :key="index">
      <div class="orderList-detail">
        <p :class="{'title': true, 'titleActive': order.stateName === '订单过期'}">
          {{order.stateName}}
          <span class="time">{{order.orderCreateTime}}</span>
        </p>
        <div class="intro">
          <div class="intro-img">
            <img :src="order.fileUrl" alt="">
          </div>
          <div class="intro-words">
            <p class="intro-words-title">{{order.productName}}</p>
            <p class="intro-words-price">价格：{{order.productPrice}} {{order.tokenName}}</p>
            <p class="intro-words-deposit">定金：{{order.amountPrepaid}} {{order.tokenName}}</p>
          </div>
          <div class="intro-box">
            X<span class="intro-box-num">{{order.productSum}}</span>
          </div>
        </div>
        <div class="step">
          <el-steps
            v-if="order.orderState !== 2 && order.orderState !== 3"
            :active='order.step'
            align-center>
            <el-step title="预订成功" icon="iconfont icon-icon-"></el-step>
            <el-step title="支付尾款" icon="iconfont icon-m_v_4"></el-step>
            <el-step title="已发货" icon="iconfont icon-shizhong"></el-step>
            <el-step title="确认收货" icon="iconfont icon-qicheqianlian-"></el-step>
          </el-steps>
          <el-steps
            class="two-step"
            v-if="order.orderState === 2 || order.orderState === 3"
            :active='order.step'
            align-center>
            <el-step title="预订成功" icon="iconfont icon-icon-"></el-step>
            <el-step :title="(order.orderState === 2) ? '订单过期' : '订单转让'" icon="iconfont icon-m_v_4"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="orderList-operate">
        <div class="middle">
          <div class="button order-detail" @click="toDetail()">
            <span>订单详情</span>
          </div>
          <div class="button" v-if="order.stateName === '提货中' || order.stateName === '待提货'" @click="openbTransferTokenDialog(order)">
            <span>转让Token</span>
          </div>
          <div class="button" v-if="(order.stateName === '提货中')" @click="applicationForDelivery(order)">
            <span>申请提货</span>
          </div>
          <div class="button" v-if="(order.stateName === '待发货' || order.stateName === '已发货')">
            <span>确认收货</span>
          </div>
        </div>
      </div>
    </div>
    <p class="tc" v-show="showListLoading"><i class="el-icon-loading"></i></p>
    <div class="nodata-box tc" v-show="showNoData">
      <img src="@/client/assets/img/m/W.png" alt="暂无数据">
      <p>{{noDataMsg}}</p>
    </div>
    </div>

    <!--转让token弹框-->
    <el-dialog
      class="transferTokenDialog"
      title="转让"
      :visible.sync="transferDialogVisible">
      <p class="tip">(仅限转让给本平台注册用户)</p>
      <div class="row">
        <span class="label">产品名称: </span>
        <span>{{transferPostData.productName}}</span>
      </div>
      <div class="row">
        <span class="label">转让数量: </span>
        <span>{{transferPostData.amountPrepaid}} {{transferPostData.tokenName}}</span>
      </div>
      <div class="row">
        <span class="label">转出地址: </span>
        <div class="input-address">
          <el-input
            type="textarea"
            :autosize="{minRows: 2}"
            placeholder="请输入转让地址"
            v-model="transferPostData.userUuid">
          </el-input>
        </div>
      </div>
      <div class="bottom">
        <el-button class="transfer-cancel" @click="transferDialogVisible = false">取消</el-button>
        <div class="border-line"></div>
        <el-button class="transfer-comfirm" @click="comfirmTransferToken" :loading="comfirmTransferTokenLoading">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import mHeader from '../../components/mNav.vue'
import mTabs from '../../components/mTabs.vue'
import infiniteScroll from 'vue-infinite-scroll'
import { productStatus2Step } from '../../../common/helper.js'

const FIRST_PAGE = 1

const orderStatusArray = [
  {status: '待提货', step: 1},
  {status: '提货中', step: 1},
  {status: '待发货', step: 2},
  {status: '订单过期', step: 2},
  {status: '订单转让', step: 2},
  {status: '已发货', step: 3},
  {status: '已确认收货', step: 4}
]

export default {
  directives: {infiniteScroll},
  data () {
    return {
      transferDialogVisible: false,
      textarea3: '',
      stepActive: Number,
      loadingData: false,
      noMoreData: false,
      comfirmTransferTokenLoading: false,
      transferPostData: {},
      tabs: [
        {value: 0, label: '全部'},
        {value: 1, label: '待提货'},
        {value: 2, label: '待收货'},
        {value: 3, label: '已完成'},
        {value: 4, label: '已失效'}
      ],
      tab: 0,
      page: FIRST_PAGE,
      total: 0,
      orderList: []
    }
  },
  components: {
    mHeader,
    mTabs
  },
  mounted () {
    this.loadOrder(FIRST_PAGE)
  },
  computed: {
    disableScrollListen () {
      return this.loadingData || this.noMoreData
    },
    showListLoading () {
      return this.page > 1 && this.loadingData
    },
    showNoData () {
      return this.total === 0
    },
    noDataMsg () {
      const label = this.tabs.find(item => item.value === this.tab).label
      return `暂无${label}的订单`
    }
  },
  methods: {
    loadMore () {
      // 加载更多
      console.log('加载', this.page + 1)
      this.loadOrder(this.page + 1)
    },
    loadOrder (page) {
      if (this.disableScrollListen) return
      this.loadingData = true
      let loadingLayer = null
      if (page === FIRST_PAGE) {
        loadingLayer = this.$loading()
      }
      this.myFetch({
        apiName: 'reservationRecordPhone',
        postdata: {
          userId: this.$store.state.User.userId,
          orderState: this.tab,
          rowNum: 10,
          page: page
        },
        success: ({ total, rows = [] }) => {
          rows.forEach(item => {
            item.step = productStatus2Step(item.stateName, orderStatusArray)
          })
          if (page === FIRST_PAGE) {
            this.orderList = rows
          } else {
            this.orderList = [ ...this.orderList, ...rows ]
          }
          this.page = page
          if (total <= this.orderList.length) {
            this.noMoreData = true
          }
          this.total = total
        },
        complete: () => {
          this.loadingData = false
          loadingLayer && loadingLayer.close()
        }
      })
    },
    onTabChange (value) {
      this.tab = value
      this.noMoreData = false
      this.loadOrder(FIRST_PAGE)
    },
    toDetail () {
      this.$router.push({path: '/detail/:uuid'})
    },
    applicationForDelivery (data) {
      this.$router.push({path: '/user/orders/applicationDelivery', query: {id: data.id, tailMoney: data.tailMoney, tokenName: data.tokenName}})
    },
    openbTransferTokenDialog (order) {
      let {id, amountPrepaid, tokenName, productName} = order
      this.transferPostData = {id, amountPrepaid, tokenName, productName}
      this.transferPostData.userUuid = ''
      this.transferDialogVisible = true
    },
    comfirmTransferToken () {
      let {id, userUuid, amountPrepaid} = this.transferPostData
      this.comfirmTransferTokenLoading = true
      this.myFetch({
        apiName: 'applyForPicUpGoods',
        postdata: {id, userUuid, amountPrepaid},
        success: (res) => {
          console.log('转让成功')
          this.transferDialogVisible = false
          this.loadOrder(this.page)
        },
        complete: () => {
          this.comfirmTransferTokenLoading = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.nodata-box{
  margin-top: 35.57vw;
  p{
    color: $font_deep_grey;
    font-size: 16px;
  }
}
.orderList{
  min-height: 100vh;
  overflow: hidden;
  background: $client_bg_light_grey;
  padding-bottom: 10vw;
  .m-tabs{
    margin-top: 2.67vw;
  }
  .orderList-content{
    margin-bottom: 2.67vw;
  }
  .orderList-detail{
    border-bottom: 1px solid $client_border_Lightgrey;
    padding: 5.2vw 3.47vw 0vw 4.14vw;
    background: $client_bg_white;
    .title{
      font-size: 3.74vw;
      font-weight: 500;
      font-family:PingFangSC-Regular;
      color: $client_primary_color;
    }
    .titleActive{
      color: $font_deeper_grey;
    }
    .time{
      float: right;
      font-family: PingFangSC-Regular;
      font-size: 2.94vw;
      color: $font_light_grey;
      vertical-align: top;
    }
    .intro{
      position: relative;
      overflow:hidden;
      margin: 4.54vw 0px;
    }
    .intro-img{
      float: left;
      padding: 1.2vw;
      width: 18.96vw;
      height: 17.3vw;
      border: 1px solid $client_border_Lightgrey;
    }
    .intro-img img{
      width: 100%;
      height: 100%;
    }
    .intro-words{
      float: left;
      margin-left: 4.94vw;
      height: 17.3vw;
      max-width: 56vw;
    }
    .intro-words-title{
      margin-bottom: 2vw;
      font-family: PingFangSC-Regular;
      font-size: 3.47vw;
      font-weight: 500;
      color: $font_deep_black;
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
      height: 4.625vw;
      line-height: 4.625vw;
      text-align: center;
      color: $client_primary_color;
    }
    .intro-box span{
      font-weight: 500;
    }
    .step{
      width: 65.95vw;
    }
  }
  .orderList-operate{
    position: relative;
    height: 15.58vw;
    background: $client_bg_white;
    border-bottom: 1px solid $client_border_Lightgrey;
    .middle{
      position: absolute;
      top: 50%;
      margin-top: -3.34vw;
      height: 6.59vw;
      width: 100%;
      padding-right: 1.6vw;
    }
    .button{
      float: right;
      margin-right: 2vw;
      border: 1px solid $client_tab_content_end;
      width: 18.69vw;
      height: 6.59vw;
      line-height: 6.59vw;
      text-align: center;
      span{
        font-family: PingFangSC-Regular;
        font-size: 2.94vw;
        color: $font_deeper_grey
      }
    }
    .order-detail{
      border-color: $client_primary_color;
      span{
        color: $client_primary_color;
      }
    }
  }
}
</style>
<style lang="scss">
.orderList .el-step__icon{
  width: 6.8vw;
  height: 6.8vw;
  color: $font_light_white;
  background: $client_tab_content_grey;
  border-radius: 50%;
}
.orderList .is-finish .el-step__icon{
  background: $admin_main_color;
}
.orderList .el-step__head.is-finish{
  border-color: $admin_main_color;
}
.orderList .el-step__title{
  font-size: 2.94vw;
  color: $font_deep_black;
  font-weight: 300;
}
.orderList{
  .step{
    .two-step{
      margin-left: -11vw;
    }
  }
  .transferTokenDialog .el-dialog{
    width: 88.93vw;
    min-height: 69.73vw;
    .el-dialog__header{
      text-align: center;
      padding: 5.33vw 0px 2.8vw 0px;
      .el-dialog__title{
        font-size: 4.26vw;
        font-weight: bold;
      }
    }
    .el-dialog__body{
      padding: 0px;
      .tip{
        margin-bottom: 6.93vw;
        text-align: center;
        font-size: 3.466vw;
        color: #999;
      }
      .row{
        margin-bottom: 4vw;
        padding-left: 6vw;
        font-size: 3.46vw;
        .label{
          display: inline-block;
          margin-right: 2.26vw;
          color: #000;
        }
        .input-address{
          display: inline-block;
          margin-top: -1vw;
          vertical-align: top;
          width: 60.13vw;
        }
      }
      .bottom{
        position: relative;
        border-top: 1px solid #D4D4D4;
        height: 13.19vw;
        line-height: 13.19vw;
        .transfer-cancel{
          margin: 0px;
          width: 50%;
          border: none;
          border-radius: 0px;
          font-weight: bold;
          color: #000;
        }
        .border-line{
          position: absolute;
          top: 0px;
          left: 50%;
          height: 100%;
          border-right: 1px solid #D4D4D4;
        }
        .transfer-comfirm{
          margin: 0px;
          width: 50%;
          border: none;
          border-radius: 0px;
          font-weight: bold;
          color: #59BFC6;
        }
      }
    }

  }
}
</style>
