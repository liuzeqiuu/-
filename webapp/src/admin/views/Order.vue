<template>
  <div class="Product">
    <p class="title"><i class="iconfont icon-dingdan"></i>订单信息</p>
    <table border="1">
      <tr>
        <th>订单号</th>
        <td class="long">{{userInfo.orderId}}</td>
        <th>时间</th>
        <td class="long">{{userInfo.orderCreateTime}}</td>
        <th>订单状态</th>
        <td class="short">{{userInfo.stateName}}</td>
      </tr>
      <tr>
        <th>产品名称</th>
        <td>{{userInfo.productName}}</td>
        <th>产品价格</th>
        <td>{{userInfo.productPrice}}</td>
        <th>产品定金</th>
        <td>{{userInfo.amountPrepaid}}</td>
      </tr>
      <tr>
        <th>购买数量</th>
        <td>X{{userInfo.productSum}}</td>
        <th></th>
        <td></td>
        <th></th>
        <td></td>
      </tr>
    </table>
    <p class="title"><i class="iconfont icon-dingdan"></i>用户信息</p>
    <table border="1">
      <tr>
        <th>姓名</th>
        <td class="medium">{{userInfo.username}}</td>
        <th>手机号码</th>
        <td class="medium">{{userInfo.userPhone}}</td>
        <th>收货地址</th>
        <td class="long">{{userInfo.address}}{{userInfo.addressDetails}}</td>
      </tr>
      <tr>
        <th>收货人姓名</th>
        <td>{{userInfo.harvestName}}</td>
        <th>收货人手机</th>
        <td>{{userInfo.phone}}</td>
        <th></th>
        <td></td>
      </tr>
    </table>
    <p class="title"><i class="iconfont icon-dingdan"></i>区块链信息</p>
    <table border="1">
      <tr>
        <th>区块高度</th>
        <td class="medium">{{blockChain.height}}</td>
        <th>区块哈希</th>
        <td class="medium">{{blockChain.hash}}</td>
        <th>操作哈希</th>
        <td class="long">{{blockChain.operationHash}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderInfo: {
        orderNumber: '201805241152123456',
        orderTime: '2018.05.23 12:12:12',
        orderStatus: '提货中',
        orderTitle: '嗨车族超轻滑板车 枫木弹性好',
        orderPrice: '1000Token',
        downPayment: '10Token',
        orderAmount: '3'
      },
      userInfo: {
        address: '',
        addressDetails: '',
        harvestName: '', // 收货人姓名
        phone: '', // 收货人手机号
        userPhone: '', // 用户手机号
        username: ''
      },
      blockChain: {
        height: '暂无数据',
        hash: '暂无数据',
        operationHash: '暂无数据'
      }
    }
  },
  mounted () {
    let id = this.$route.params.uuid
    this.myFetch({
      apiName: 'OrderParticulars',
      postdata: {
        id: id
      },
      success: (res) => {
        console.log(res)
        this.userInfo = res
      }
    })
    this.myFetch({
      apiName: 'OrderBlockInfo',
      postdata: {
        id: id
      },
      success: (res) => {
        console.log(res)
        this.blockChain = res
      }
    })
  }
}
</script>

<style scoped lang="scss">
.Product{
  padding: 1px 30px;
  background: #fff;
  height: 100%;
  .title{
    margin: 20px 0px;
    font-size: 18px;
    font-weight: 500;
    i{
      margin-right: 7px;
      font-size: 20px;
      color: #909090;
    }
  }
  table{
    text-align: center;
    word-wrap: break-word;
  }
  th{
    width: 140px;
    height: 60px;
    background: #f5f5f5;
    text-align: center;
    border: 1px solid #dcd9d9;
  }
  td{
    word-wrap: break-word;
    word-break: break-all;
    font-size: 13px;
    border: 1px solid #dcd9d9;
  }
  .long{
    width: 240px;
  }
  .medium{
    width: 180px;
  }
  .short{
    width: 120px;
  }
}
</style>
