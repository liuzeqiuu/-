<template>
  <div class="OrderList">
    <div class="header">
      <div class="firstLine">
        <label for="orderNumber">订单号</label>
        <input type="text" name="orderNumber" v-model="searchData.orderId" onkeyup="keyup">
        <label for="userName">用户姓名</label>
        <input type="text" name="userName" v-model="searchData.username">
        <label for="userNumber">手机号码</label>
        <input type="text" name="userNumber" v-model="searchData.userPhone">
      </div>
      <div class="secondLine">
        <label for="orderName">产品名称</label>
        <input type="text" name="orderName" v-model="searchData.productName">
        <span class="orderStatus">订单状态</span>
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
        <span class="chooseTime">时间选择</span>
        <el-date-picker
          v-model="searchData.orderTime"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button @click="searchOrder">查询</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
         v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="orderCreateTime"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="100"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="username"
          max-width="80"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          min-width="150"
          label="产品名称">
          <template slot-scope="scope">
            <span :title="scope.row.productName">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="购物数量"
          max-width="80">
          <template slot-scope="scope">
            <span>X {{scope.row.productSum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productPrice"
          label="产品价格">
        </el-table-column>
        <el-table-column
          prop="amountPrepaid"
          label="产品定金">
        </el-table-column>
        <el-table-column
          prop="stateName"
          max-width="80"
          label="订单状态">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="operate" @click="checkOrder(scope.row)">查看</el-button>
            <div class="vertical-line"></div>
            <el-button type="text" class="operate" @click="deleteOrder(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalNumber: 1, // 总数目
      loading: true,
      searchData: { // 搜索查询
        orderId: '', // 订单号
        username: '', // 用户姓名
        userPhone: '', // 手机号码
        productName: '', // 产品名称
        orderState: '', // 订单状态
        orderTime: '', // 时间选择
        rowNum: 10, // 一页几条数据
        page: 1 // 第几页
      },
      orderStatus: [],
      value6: '',
      value: '',
      currentPage3: NaN,
      tableData: [
        {
          orderCreateTime: '2018-1-1 21-1', // 订单时间
          id: '21312', // 订单编号
          username: '李大钊', // 用户姓名
          userPhone: '13288982324', // 用户手机号
          productName: '嗨车族滑板车', // 产品名称
          productSum: '10', // 产品数量
          productPrice: '1000', // 产品价格
          amountPrepaid: '100', // 产品定金
          stateName: '', // 订单状态
          tokenName: '' // 商家的token名称
        }
      ]
    }
  },
  mounted () {
    this.getOrderStatus()
    this.getOrderData()
  },
  methods: {
    // 获取订单表格数据
    getOrderData (data = {}) {
      this.tableData = []
      this.loading = true
      console.log(data)
      this.myFetch({
        apiName: 'orderlist',
        postdata: data,
        success: ({rows, total}) => {
          this.tableData = rows
          this.totalNumber = total
          this.loading = false
        }
      })
    },
    // 获取订单状态信息
    getOrderStatus () {
      this.myFetch({
        apiName: 'queryAllOrderState',
        postdata: {},
        success: (res) => {
          this.orderStatus = res
          this.orderStatus.unshift({orderState: '', stateName: '全部'})
        }
      })
    },
    searchOrder () {
      let data = this.transferPostData(this.searchData)
      this.getOrderData(data)
    },
    checkOrder (data) { // 查看
      let id = data.id
      this.$router.push(`/center/order/${id}`)
    },
    transferPostData (searchData) {
      let startTime, endTime
      if (searchData.orderTime) {
        startTime = new Date(searchData.orderTime[0]).getTime()
        endTime = new Date(searchData.orderTime[1]).getTime()
        console.log(startTime)
        console.log(endTime)
      } else {
        startTime = ''
        endTime = ''
      }
      let data = {
        orderId: searchData.orderId,
        username: searchData.username,
        userPhone: searchData.userPhone,
        productName: searchData.productName,
        orderState: searchData.orderState,
        startTime: String(startTime),
        endTime: String(endTime),
        rowNum: searchData.rowNum,
        page: searchData.page
      }

      return data
    },
    deleteOrder (data) {
      this.myFetch({
        apiName: 'deleteOrderByOrderCode',
        postdata: {
          id: data.id
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          let data = this.transferPostData(this.searchData)
          this.getOrderData(data)
        }
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.searchData.rowNum = val
      let data = this.transferPostData(this.searchData)
      this.getOrderData(data)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.searchData.page = val
      console.log('第几页', this.searchData)
      let data = this.transferPostData(this.searchData)
      this.getOrderData(data)
    },
    keyup () {
      console.log('执行')
    }
  }
}
</script>

<style scoped lang="scss">
.OrderList{
  .header{
    padding: 30px;
    min-width: 1200px;
    background: $admin_bg_white;
    .firstLine{
      margin-bottom: 30px;
    }
    .firstLine > input,.secondLine > input{
      margin-right: 30px;
      padding-left: 10px;
      width: 210px;
      height: 34px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
    }
    .firstLine > label{
      font-size: 14px;
      margin-right: 30px;
    }
    .secondLine > label{
      font-size: 14px;
      margin-right: 16px;
    }
    .orderStatus,.chooseTime{
      font-size: 14px;
      margin-right: 30px;
    }
    .select{
      display: inline-block;
      margin-right: 30px;
      width: 210px;
      height: 30px;
    }
  }
  .content{
    margin-top: 20px;
    padding: 30px 30px 60px 30px;
    min-width: 1200px;
    background: $font_light_white;
    color: $font_deep_black;
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
      font-size: 13px;
      margin: 30px 60px;
    }
    .bottom{
      overflow: hidden;
      border-right:1px solid $admin_table_border;
      border-bottom:1px solid $admin_table_border;
      border-left:1px solid $admin_table_border;
    }
  }
}
</style>
<style lang="scss">
  .OrderList .header .el-input--suffix .el-input__inner{
    height: 36px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }
  .OrderList .header .el-range-editor.el-input__inner{
    margin-right: 30px;
    height: 36px;
    width: 260px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }
  .OrderList .header .el-button{
    width: 80px;
    height: 34px;
    padding: 0px;
    background: $admin_main_color;
    color: $font_light_white;
  }
  .OrderList .content .el-button--text span{
    color: $admin_main_color;
    font-weight: $YH_bold;
  }
  .OrderList .content .el-pagination{
    float: right;
    margin-top: 20px;
    margin-right: 20px;
  }
  .OrderList .content .el-table{
    text-align: center;
    border-collapse: collapse;
    border: 1px solid $admin_table_border;
  }
  .OrderList .content .el-table th{
    text-align: center;
    background: $admin_table_header;
    color: $font_deep_black;
  }
  .OrderList .content .el-table td{
    font-size: 14px;
    height: 40px;
    padding: 0px;
    color: $font_deep_black;
  }
  .OrderList .content .el-table th.is-leaf, .el-table td{
    border-color: $admin_table_border;
  }
  .OrderList .content .el-pager li.active{
    color: $admin_main_color;
  }
  .OrderList .content .el-pager li:hover{
    color: $admin_main_color;
  }
  .OrderList .content .el-button{
    background: none;
  }
  .OrderList .el-pagination .el-select .el-input{
    margin-left: 20px;
  }
  .OrderList .content .cell{
    display: -webkit-box; // 用来限制在一个块元素显示的文本的行数
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
