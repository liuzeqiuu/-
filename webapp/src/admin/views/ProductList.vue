<template>
  <div class="productlist">
    <form class="search" @submit.prevent="listGoods">
      <div>
        <label>产品名称</label>
        <el-input v-model="product_name" @keyup.enter.native="listGoods"></el-input>
      </div>
      <div>
        <label>产品状态</label>
        <el-select v-model="product_state" placeholder="全部" @change="listGoods">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <label>状态</label>
        <el-select v-model="state_value" placeholder="全部" @change="listGoods">
          <el-option
            v-for="it in searchOnline"
            :key="it.value"
            :label="it.label"
            :value="it.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <label>操作员</label>
        <el-autocomplete
          v-model="operator"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <el-button native-type="submit" type="primary">查询</el-button>
      <el-button type="info" @click="link()">添加</el-button>
    </form>
    <div class="list">
      <el-table
        v-loading="loadingTableData"
        :data="tabledata"
        style="width: 100%">
        <el-table-column
          label="产品ID"
          width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="产品名称"
          width="210">
          <template slot-scope="scope">
            <span style="margin-left: 10px" :title="scope.row.altName">{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
         <el-table-column
          label="展示序号"
          width="50">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.displaySort }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="产品价格"
          width="90">
          <template slot-scope="scope">
           <span style="margin-left: 10px">{{ scope.row.productPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="定金"
          width="70">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.deposit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="预售时间"
          width="150">
          <template slot-scope="scope">
             <span style="margin-left: 10px">{{ scope.row.presaletime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="提货时间"
          width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.carrytime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="产品状态"
          width="70">
          <template slot-scope="scope">
             <span style="margin-left: 10px">{{ scope.row.productState }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否推荐"
          width="70">
          <template slot-scope="scope">
           <span style="margin-left: 10px">{{ scope.row.isGroom | recomendedChannel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="70">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.onlineWords }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作员"
          width="70">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.opertorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <el-button
              size="mini"
              @click="handleonline(scope.$index, scope.row.isonline, scope.row.id)">{{ scope.row.isonline | onlineOperate }}</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, tabledata)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {
  PRODUCT_NOT_START,
  PRODUCT_ON_SALE,
  PRODUCT_WAITING_CONFIRM,
  PRODUCT_NOT_START_LABEL,
  PRODUCT_ON_SALE_LABEL,
  PRODUCT_WAITING_CONFIRM_LABEL,
  PRODUCT_STOP_SALE,
  PRODUCT_STOP_SALE_LABEL
} from '@/common/constants/status.js'
export default {
  data () {
    /*
      options: 产品状态的6种状态
      searchOnline: 上线的4种状态
      operator: 选中的操作员
      state_value: 选中的上线状态
      operators: [], 远程搜索时，将获取的消息赋值给operators,然后在函数中处理
      product_name: 输入的产品名称
      product_state: 选中的产品状态
      timeout: null, 远程搜索操作员时，延迟执行，方便clear
      tabledata: [], 产品信息列表
      currentPage: 当前页面页码
      userid: 当前登录修改的操作员id
      productId: 编辑时需要向product.vue传递的产品id
      total: 产品的数量
    */
    return {
      loadingTableData: true,
      options: [
        {
          value: ' ',
          label: '全部'
        }, {
          value: PRODUCT_NOT_START,
          label: PRODUCT_NOT_START_LABEL
        }, {
          value: PRODUCT_ON_SALE,
          label: PRODUCT_ON_SALE_LABEL
        }, {
          value: PRODUCT_WAITING_CONFIRM,
          label: PRODUCT_WAITING_CONFIRM_LABEL
        }, {
          value: PRODUCT_STOP_SALE,
          label: PRODUCT_STOP_SALE_LABEL
        }],
      searchOnline: [
        {
          value: ' ',
          label: '全部'
        },
        {
          value: '0',
          label: '未上线'
        },
        {
          value: '1',
          label: '已上线'
        }
      ],
      value: '',
      operator: '',
      state_value: '',
      operators: [],
      product_name: '',
      product_state: '',
      timeout: null,
      tabledata: [],
      currentPage: 1,
      userid: '',
      productId: '',
      total: 1
    }
  },
  filters: {
    onlineOperate (state) {
      // 状态为 1 可以下线 其他可以上线
      return state === 1 ? '下线' : '上线'
    },
    recomendedChannel ({ isRecommendedOnPc, isRecommendedOnMobile }) {
      if (isRecommendedOnPc && isRecommendedOnMobile) {
        return 'pc&手机'
      } else if (isRecommendedOnPc) {
        return 'pc'
      } else if (isRecommendedOnMobile) {
        return '手机'
      } else {
        return '否'
      }
    }
  },
  methods: {
    // 点击添加，直接跳转页面
    link () {
      this.$router.push('/center/product')
    },
    // 选中某一页码，给currenttPage赋值后，调用查询商品列表的函数
    currentChange (val) {
      this.currentPage = val
      this.listGoods()
    },
    // 查询商品，显示商品的列表信息
    listGoods () {
      this.loadingTableData = true
      this.myFetch({
        apiName: 'productList',
        postdata: {
          'pageSize': 9,
          'pageIndex': this.currentPage,
          'productName': this.product_name,
          'productState': this.product_state,
          'isonline': this.state_value,
          'userId': this.userid
        },
        success: ({ list = [], total }) => {
          let string = ''
          let omit = '...'
          let current = ''
          this.tabledata = list
          list.forEach(function (currentValue) {
            if (currentValue.productName.length > 10) {
              currentValue.altName = currentValue.productName
              string = currentValue.productName.substring(0, 10)
              currentValue.productName = current.concat(string, omit)
            }
          })
          this.total = parseInt(total)
        },
        complete: () => {
          this.loadingTableData = false
        }
      })
    },
    // 操作员远程搜索，直接出现下拉列表
    loadAll () {
      this.myFetch({
        apiName: `operator`,
        success: (list) => {
          const operators = list.map(({ id, username }) => {
            return { id, value: username }
          })
          this.operators = operators
        }
      })
    },
    querySearchAsync (queryString, cb) {
      var operators = this.operators
      var results = operators
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 搜索操作员时，选中某一个，会将操作员的id赋值给userid
    handleSelect (item) {
      this.userid = item.id
    },
    // 对产品进行上线，下线的操作
    handleonline (index, isonline, id) {
      let onlineState = 1
      if (isonline === 1) {
        onlineState = 0
      } else {
        onlineState = 1
      }
      this.myFetch({
        apiName: 'goodsOnOff',
        postdata: {
          id: id,
          isonline: onlineState
        },
        success: (res) => {
          this.$notify({
            title: '成功',
            message: '产品操作成功',
            type: 'success'
          })
          this.listGoods()
        }
      })
    },
    // 操作中的编辑功能，跳转到product.vue页面
    handleEdit (index, row) {
      this.productId = this.tabledata[index].id
      this.$router.push('/center/product/' + this.productId)
    },
    // 操作中的删除功能
    handleDelete (index, rows) {
      let self = this
      this.$confirm('是否删除' + this.tabledata[index].productName, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
        .then(() => {
          this.myFetch({
            apiName: 'deleteGoods',
            postdata: {
              id: this.tabledata[index].id
            },
            fail (res) {
              self.$notify.error({
                title: '错误',
                message: res.resultMsg
              })
            },
            success (res) {
              rows.splice(index, 1)
              self.$notify({
                title: '成功',
                message: '产品删除成功',
                type: 'success'
              })
            }
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    }
  },
  mounted () {
    this.listGoods()
    this.loadAll()
  }
}
</script>
<style lang="scss">
.productlist{
  min-width: 1228px;
  background: #ececec;
  .search{
    margin-bottom: 30px;
    width: 100%;
    height: 100px;
    padding: 30px;
    background: #fff;
    margin-left: 0px;
    div{
      margin-right: 10px;
      display: inline-block;
      label{
        display: inline-block;
        margin-right: 20px;
        font-family: 'PingFangSC-Regular', 'PingFang SC';
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
      }
    }
    div:nth-of-type(1) , div:nth-of-type(4){
      width: 20%;
      .el-autocomplete,.el-input{
        width: 60%;
      }
      .el-autocomplete{
        .el-input{
          width: 100%;
        }
      }
    }
    div:nth-of-type(2) , div:nth-of-type(3){
     width: 20%;
      .el-select{
        display: inline-block;
        width: 60%;
        .el-input{
            width: 100%;
        }
      }
    }
    .el-button{
      margin-right: 10px;
      width: 7%;
      height: 40px;
      border: none;
      box-sizing: border-box;
      border-radius: 3px;
      cursor: pointer;
      font-size: 14px;
    }
  }
  .list{
    border: 1px solid $admin_table_border;
    background: #fff;
    padding-bottom: 100px;
    .el-table{
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      th{
        text-align: center;
        color: #000;
        font-weight: bold !important;
        background: #f7f7f7;
      }
      th,tr{
        padding: 10px 0;
      }
      .cell{
        padding: 0;
        .el-button{
          &:focus{
            background: none !important;
          }
          &:hover,&:active{
            color: #000;
          }
        }
      }
      .el-button{
        margin: 0;
        position: relative;
        width: 40px;
        border: 0;
        text-align: center;
        // border-right: 1px solid #000;
        color: $admin_main_color;
        background: none;
      }
      .el-message-box{
        &:focus{
          background:  $admin_main_color !important;
        }
      }
      .el-button:nth-of-type(1):after{
        content: ' ';
        position: absolute;
        top: 7px;
        left: 49px;
        height: 14px;
        width: 1px;
        background:grey;
      }
      .el-button:nth-of-type(2):after{
        content: ' ';
        position: absolute;
        top: 7px;
        left: 49px;
        height: 14px;
        width: 1px;
        background:grey;
      }
    }
    .el-pagination{
      clear: both;
      float: right;
      overflow: hidden;
      margin: 35px 0 ;
      .btn-prev,.btn-next{
        width:83px;
        height:27px;
        border: 1px solid #A0A0A0;
        font-size:12px;
        font-family:PingFangSC-Semibold;
        color:rgba(179,179,179,1);
        line-height:27px;
        .el-icon-arrow-left:before{
          content: '\E600 上一页'
        }
        .el-icon-arrow-right:before{
          content: '下一页 \E604'
        }
      }
      .active{
        background: $admin_main_color !important;
        color: #fff !important;
        border: none !important;
      }
      .el-pager li{
        width:27px;
        height:27px;
        border: 1px solid #A0A0A0;
        background: $client_bg_light;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight: normal;
        color:rgba(160,160,160,1);
        line-height:27px;
        &:hover{
          color: $client_primary_color !important
        }
    }
    }
  }
}
.el-popper{
  min-width: 10px !important;
}
</style>
