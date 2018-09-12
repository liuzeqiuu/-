<template>
  <div class="DeliveryList">
    <div class="header">
      <div class="firstLine">
        <label for="deliveryNumber">发货单号</label>
        <input type="text" name="deliveryNumber" v-model="searchData.logisticsCode">
        <label for="orderNumber">订单编号</label>
        <input type="text" name="orderNumber" v-model="searchData.orderCode">
        <label for="receiver">收货人</label>
        <input type="text" name="receiver" v-model="searchData.harvestName">
        <span class="status">发货状态</span>
        <div class="select">
          <el-select v-model="searchData.shipmentsState" placeholder="请选择">
            <el-option
              v-for="item in deliveryStatus"
              :key="item.orderState"
              :label="item.stateName"
              :value="item.orderState">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="secondLine">
        <span>发货时间</span>
        <el-date-picker
          v-model="searchData.deliveryTime"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <span>提货时间</span>
        <el-date-picker
          v-model="searchData.takeTime"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <span>订单状态</span>
        <div class="select">
          <el-select v-model="searchData.orderState" placeholder="请选择">
            <el-option
              v-for="item in orderStatus"
              :key="item.orderState"
              :label="item.stateName"
              :value="item.orderState">
            </el-option>
          </el-select>
        </div>
        <el-button class="searchData" @click="searchDeliveryOrder">查询</el-button>
      </div>
    </div>

    <div class="content">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="takeTime"
          label="提货时间"
          width="100">
        </el-table-column>
        <el-table-column
          label="订单号/下单时间">
          <template slot-scope="scope">
            <p>{{scope.row.orderCode}}</p>
            <p>{{scope.row.orderCreateTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="收货人信息">
          <template slot-scope="scope">
            <p>{{scope.row.harvestName}}</p>
            <p>{{scope.row.phone}}</p>
            <p>{{scope.row.address}}{{scope.row.addressDetails}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="订单信息">
          <template slot-scope="scope">
            <p>X{{scope.row.productSum}}</p>
            <p>{{scope.row.productPrice}} Token</p>
            <p>{{scope.row.productName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStateName"
          label="订单状态"
          width="100">
        </el-table-column>
        <el-table-column
          label="物流信息">
          <template slot-scope="scope">
            <p>{{scope.row.logisticsName}}</p>
            <p>{{scope.row.logisticsCode}}</p>
            <p>{{scope.row.deliverTime}}</p>
            <p v-if="!scope.row.logisticsName && !scope.row.logisticsCode && !scope.row.deliverTime">暂无</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="shipmentsStateName"
          width="100"
          label="发货状态">
        </el-table-column>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text"
              :class="{'btnDefault': true, 'btnActive': scope.row.shipmentsStateName == '待发货'}"
              :disabled = "scope.row.shipmentsStateName === '已发货'"
              @click="openLogisticsDialog(scope.row.orderId,1)">发货</el-button>
            <div class="vertical-line"></div>
            <el-button type="text"
              :class="{'btnDefault': true, 'btnActive': scope.row.shipmentsStateName == '已发货'}"
              :disabled = "scope.row.shipmentsStateName === '待发货'"
              @click="openLogisticsDialog(scope.row.orderId,2)">编辑物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="10"
          layout="prev, pager, next, jumper, sizes"
          :total="totalNumber">
        </el-pagination>
        <span class="totalNumber">共搜索到 {{this.totalNumber}} 条数据</span>
      </div>
    </div>
    <!-- 发货弹框-->
    <div class="deliverDialog" v-if="deliverDialogSeen">
      <div class="deliverDialog-form">
        <p class="deliverDialog-form-title">发货信息</p>
        <div class="deliverDialog-form-row">
          <span>发货时间:</span>
          <div class="deliverDialog-form-row-box">
            <el-date-picker
              @change="transferDeliveryTime"
              v-model="unTransferDeliveryTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="deliverDialog-form-row">
          <span>公司名称:</span>
          <div class="deliverDialog-form-row-box">
            <el-select v-model="editLogisticsData.logisticsName" placeholder="请选择">
              <el-option
                v-for="item in express"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="deliverDialog-form-row">
          <span>快递单号:</span>
          <div class="deliverDialog-form-row-box">
            <el-input v-model="editLogisticsData.logisticsCode" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="deliverDialog-form-bottom">
          <el-button v-if="interfaceType === 1" @click="submitLogistics('1')">确定</el-button>               <!--确定发货按钮 -->
          <el-button v-if="interfaceType === 2" @click="submitLogistics('2')">确定</el-button>               <!--确定编辑物流按钮 -->
          <el-button @click="cancelLogistics">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalNumber: 1,
      loading: true,
      interfaceType: 0,
      unTransferDeliveryTime: '',
      searchData: { // 搜索查询
        pageIndex: '1', // 页码
        pageSize: '10', // 每页条数
        logisticsCode: '', // 发货单号
        orderCode: '', // 订单编号
        harvestName: '', // 收货人姓名
        shipmentsState: '', // 发货状态
        deliveryTime: '', // 发货时间
        takeTime: '', // 提货时间
        orderState: '' // 订单状态
      },
      editLogisticsData: { // 编辑物流信息
        // orderId: '', // 订单编号
        // deliveryTime: '', // 发货时间
        // logisticsCode: '', // 快递单号
        // logisticsAbbreviation: '', // 快递公司(字母)
        // logisticsName: '' // 快递公司名称
      },
      express: [
        {name: '顺丰速运', id: 'SF'},
        {name: '百世快递', id: 'HTKY'},
        {name: '中通快递', id: 'ZTO'},
        {name: '申通快递', id: 'STO'},
        {name: '圆通速递', id: 'YTO'},
        {name: '韵达速递', id: 'YD'},
        {name: '邮政快递包裹', id: 'YZPY'},
        {name: 'EMS', id: 'EMS'},
        {name: '天天快递', id: 'HHTT'},
        {name: '京东物流', id: 'JD'},
        {name: '优速快递', id: 'UC'},
        {name: '德邦快递', id: 'DBL'},
        {name: '快捷快递', id: 'FAST'},
        {name: '宅急送', id: 'ZJS'},
        {name: 'TNT快递', id: 'TNT'},
        {name: 'UPS', id: 'UPS'},
        {name: 'DHL', id: 'DHL'},
        {name: 'FEDEX联邦(国内件)', id: 'FEDEX'},
        {name: 'FEDEX联邦(国际件)', id: 'FEDEX_GJ'},
        {name: '苏宁物流', id: 'SNWL'}
      ],
      orderStatus: [
        {orderState: '', stateName: '全部'},
        {orderState: '4', stateName: '待发货'},
        {orderState: '5', stateName: '待收货'},
        {orderState: '6', stateName: '已收货'}
      ],
      deliveryStatus: [
        {orderState: '', stateName: '全部'},
        {orderState: '0', stateName: '待发货'},
        {orderState: '1', stateName: '已发货'}
      ],
      value: '',
      value6: '',
      value1: '',
      input: '',
      currentPage3: NaN,
      deliverDialogSeen: false,
      tableData: []
    }
  },
  mounted () {
    this.myFetch({
      apiName: 'queryOrderList',
      postdata: {},
      success: (res) => {
        console.log('拿到的数据', res)
        this.tableData = res.list
        this.totalNumber = res.total
        this.loading = false
      }
    })
  },
  methods: {
    // 查询订单列表
    searchDeliveryOrder () {
      this.tableData = []
      let data = this.transferPostData(this.searchData)
      this.loading = true
      this.myFetch({
        apiName: 'queryOrderList',
        postdata: data,
        success: (res) => {
          console.log('拿到的数据', res)
          this.tableData = res.list
          this.totalNumber = res.total
          this.loading = false
        }
      })
    },
    // 打开物流弹框
    openLogisticsDialog (orderId, type) {
      console.log('打印一下orderId', orderId)
      this.deliverDialogSeen = true
      this.editLogisticsData.orderId = orderId
      this.unTransferDeliveryTime = '' // 初始化日期
      this.interfaceType = type // 判断点击的是   发货按钮  还是 编辑物流按钮
    },
    // 确定 编辑物流 或者 发货
    submitLogistics (type) {
      const abbreviation = this.express.find(item => item.name === this.editLogisticsData.logisticsName)
      const {id} = abbreviation
      this.editLogisticsData.logisticsAbbreviation = id
      this.editLogisticsData.userId = '1'
      console.log('打印一下发送的数据', this.editLogisticsData)
      if (type === '1') { // 调用发货接口
        console.log('调用了发货接口')
        console.log('打印一下发送的数据', this.editLogisticsData)
        this.myFetch({
          apiName: 'deliverGoods',
          postdata: this.editLogisticsData,
          success: (res) => {
            this.$notify({
              title: '提示',
              message: '发货成功',
              type: 'success'
            })
            console.log('成功Lee')
            this.deliverDialogSeen = false
            this.searchDeliveryOrder()
            this.editLogisticsData = {}
          }
        })
      }
      if (type === '2') { // 调用编辑物流接口
        console.log('调用了编辑物流接口')
        console.log('打印一下发送的数据', this.editLogisticsData)
        this.myFetch({
          apiName: 'updatelogistics',
          postdata: this.editLogisticsData,
          success: (res) => {
            this.$notify({
              title: '提示',
              message: '编辑物流成功',
              type: 'success'
            })
            this.deliverDialogSeen = false
            this.searchDeliveryOrder()
            this.editLogisticsData = {}
          }
        })
      }
    },
    // 转换成时间戳
    transferDeliveryTime () {
      this.editLogisticsData.deliveryTime = new Date(this.unTransferDeliveryTime).getTime() + ''
    },
    // 关闭 物流窗口
    cancelLogistics () {
      this.deliverDialogSeen = false
      this.editLogisticsData = {}
    },
    handleSizeChange (val) {
      this.searchData.pageSize = val
      this.searchDeliveryOrder()
    },
    handleCurrentChange (val) {
      this.searchData.pageIndex = val
      this.searchDeliveryOrder()
    },
    // 搜索数据  转换
    transferPostData (searchData) {
      let takeStarTime, takeEndTime, deliverStartTime, deliverEndTime
      if (searchData.takeTime) {
        takeStarTime = new Date(searchData.takeTime[0]).getTime()
        takeEndTime = new Date(searchData.takeTime[1]).getTime()
      } else {
        takeStarTime = ''
        takeEndTime = ''
      }
      if (searchData.deliveryTime) {
        deliverStartTime = new Date(searchData.deliveryTime[0]).getTime()
        deliverEndTime = new Date(searchData.deliveryTime[1]).getTime()
      } else {
        deliverStartTime = ''
        deliverEndTime = ''
      }
      let data = {
        pageIndex: searchData.pageIndex,
        pageSize: searchData.pageSize,
        logisticsCode: searchData.logisticsCode,
        orderCode: searchData.orderCode,
        harvestName: searchData.harvestName,
        shipmentsState: searchData.shipmentsState,
        deliverStartTime: String(deliverStartTime),
        deliverEndTime: String(deliverEndTime),
        takeStartTime: String(takeStarTime),
        takeEndTime: String(takeEndTime),
        orderState: searchData.orderState
      }

      return data
    }
  }
}
</script>

<style scoped lang="scss">
.DeliveryList{
  .header{
    padding: 30px;
    min-width: 1240px;
    background: $admin_bg_white;
    .firstLine{
      margin-bottom: 30px;
    }
    .firstLine > input{
      margin-right: 30px;
      width: 210px;
      height: 34px;
      border: 1px solid $admin_input_border;
    }
    .firstLine > label{
      font-size: 14px;
      margin-right: 30px;
    }
    .status{
      font-size: 14px;
      margin-right: 15px;
    }
    .select{
      display: inline-block;
      width: 120px;
      height: 30px;
    }
    .secondLine span{
      font-size: 14px;
      margin-right: 30px;
    }
  }
  .content{
    margin-top: 20px;
    padding: 30px 30px 60px 30px;
    min-width: 1200px;
    background: $admin_bg_white;
    overflow: hidden;
    .vertical-line{
      display: inline-block;
      margin: 0px 6px;
      height: 14px;
      border-right: 2px solid $admin_input_border;
      vertical-align: middle;
    }
    .totalNumber{
      float: right;
      margin: 30px 60px;
    }
    .bottom{
      overflow: hidden;
      border-right:1px solid $admin_table_border;
      border-bottom:1px solid $admin_table_border;
      border-left:1px solid $admin_table_border;
    }
    .btnDefault{
      background: none;
      color: $font_light_grey;
    }
    .btnActive{
      color: $admin_main_color;
    }
  }
  .deliverDialog{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.3);
  }
  .deliverDialog-form{
    position: absolute;
    box-sizing: border-box;
    left: 50%;
    top: 34%;
    margin-top: -30px;
    margin-left: -130px;
    padding: 20px 15px;
    width: 360px;
    border-radius: 4px;
    background: $admin_bg_white;
  }
  .deliverDialog-form-title{
    font-size: 16px;
    font-weight: $YH_bold;
  }
  .deliverDialog-form-row{
    margin: 15px 0px;
  }
  .deliverDialog-form-row > span{
    margin-right:10px;
    font-size: 14px;
  }
  .deliverDialog-form-row-box{
    display: inline-block;
    margin: 5px 0px;
    height: 28px;
    width: 220px;
  }
  .deliverDialog-form-bottom{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
<style lang="scss">
.DeliveryList .header .el-range-editor.el-input__inner{
  margin-right: 30px;
  height: 36px;
  width: 260px;
  border-color: $admin_input_border;
}
.DeliveryList .header .searchData{
  margin-left: 100px;
  padding: 0px;
  width: 79px;
  height: 32px;
  background: rgba(4, 195, 224, 1);
  color: $font_light_white;
}
.DeliveryList .header .el-input--suffix .el-input__inner{
  height: 36px;
  border-color: $admin_input_border;
}
.DeliveryList .content .el-pagination{
  float: right;
  margin-top: 20px;
  margin-right: 40px;
}
.DeliveryList .content .el-table_3_column_24{
  text-align: center;
}
.DeliveryList .content .el-table--fit{
  border-top: 1px solid $admin_table_border;
  border-left: 1px solid $admin_table_border;
  border-right: 1px solid $admin_table_border;
}
.DeliveryList .content .el-table th.is-leaf, .el-table td{
  border-color: $admin_table_border;
  color: #000;
}
.DeliveryList .content .el-table th{
  background: $admin_table_header;
}
.DeliveryList .content .el-table_4_column_35{
  color: red;
}
.DeliveryList .content .el-table::before{
  height: 0;
}
.DeliveryList .deliverDialog-form-bottom .el-button{
  padding: 0px;
  width: 120px;
  height: 35px;
}
.DeliveryList .content .el-pager li.active{
  color: $admin_main_color;
}
.DeliveryList .content .el-pager li:hover{
  color: $admin_main_color;
}
// not scoped
.DeliveryList .content .btnDefault span {
  font-weight: $YH_bold;
}
</style>
