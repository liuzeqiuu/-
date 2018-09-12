<template>
  <div class="management">
    <div class="searchBox">
      <div class="detailMsg">
        <span class="lineTitle">商家名称</span>
        <el-input placeholder="请输入内容" clearable class="lineOne" v-model="searchForm.businessName"></el-input>
        <span class="lineTitle">联系人手机号码</span>
        <el-input placeholder="请输入内容" clearable class="lineOne" v-model="searchForm.contactPhone"></el-input>
        <span class="lineTitle">联系人姓名</span>
        <el-input placeholder="请输入内容" clearable class="lineOne" v-model="searchForm.contactName"></el-input>
      </div>
      <div class="block">
        <span class="lineTitle">状态</span>
        <el-select v-model="searchForm.state" slot="prepend" placeholder="请选择" class="lineOne lineStatus">
          <el-option label="正常" value="1"></el-option>
          <el-option label="冻结" value="2"></el-option>
        </el-select>

        <span class="lineTitle">时间选择</span>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          class="lineOne linePick">
        </el-date-picker>
      </div>
      <div class="btn-group">
        <button class="search btn" @click="search(searchForm)">查询</button>
        <button class="add btn" @click="add()">新增</button>
      </div>
    </div>
    <div class="tableBox">
      <div class="tableBody">
        <el-table :data="businessList" stripe style="width: 100%" v-loading="loadingTable">
          <el-table-column prop="businessName" label="商家名称" min-width="100" align="center" >
          </el-table-column>
          <el-table-column prop="contactName" label="联系人姓名" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop="contactPhone" label="联系人手机号码" min-width="120" align="center">
          </el-table-column>
          <el-table-column prop="tokenName" label="Token名称" min-width="150" align="center">
          </el-table-column>
         <el-table-column prop="scale" label="Token兑换比例" min-width="170" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="businessStateName" label="状态" min-width="100" align="center">
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center" v-if="userType === 1">
            <template slot-scope="scope">
                <span class="operateBtn view" @click="view(businessList[scope.$index])">查看</span>
                <span class="operateBtn view" @click="edit(businessList[scope.$index])">编辑</span>
                <span class="operateBtn view" @click="del(businessList[scope.$index])">删除</span>
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
  </div>
</template>

<script>
import {formatTime} from '../../common/helper.js'
export default{
  data () {
    return {
      loadingTable: true,
      userType: 1,
      pageSize: 10,
      total: 10,
      currentPage: 1,
      time: [],
      searchForm: {
        businessName: '',
        contactPhone: '',
        contactName: '',
        startTime: '',
        endTime: '',
        rowNum: 10,
        page: 1,
        state: ''
      },
      businessList: []
    }
  },
  methods: {
    search (form) {
      this.searchForm.startTime = this.time[0]
      this.searchForm.endTime = this.time[1]
      this.currentPage = 1
      this.initSearch()
    },
    initSearch (form) {
      this.loadingTable = true
      let params = {
        pageNum: 1,
        pageSize: 10,
        requireTotalCount: true,
        businessName: this.searchForm.businessName,
        contactName: this.searchForm.contactName,
        contactPhone: this.searchForm.contactPhone,
        beginDate: this.searchForm.startTime,
        endDate: this.searchForm.endTime,
        roleId: this.searchForm.state
        // rowNum: 10,
        // page: this.currentPage
      }
      this.myFetch({
        apiName: `searchBusinessInfo`,
        postdata: params,
        success: (res) => {
          this.businessList = res
          for (var i = res.length - 1; i >= 0; i--) {
            this.businessList[i].createTime = formatTime(this.businessList[i].createTime, 'yyyy-MM-dd hh:mm:ss')
          }
          // console.log(res.length)
          // this.businessList.createTime = formatTime(this.businessList.createTime,'yyyy-MM-dd hh:mm:ss')
          this.total = res.length
        },
        complete: () => {
          this.loadingTable = false
        }
      })
    },
    add () {
      this.$router.push({path: '/center/addBusiness'})
    },
    view (val) {
      console.log(val.id)
      this.$router.push({path: '/center/business', query: {form: val}})
    },
    edit (val) {
      console.log(val.id)
      this.$router.push({path: '/center/Edit', query: {form: val.id}})
    },
    del (val) {
      this.myFetch({
        apiName: `delBusiness`,
        postdata: {'id': val.id},
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.initSearch()
        }
      })
    },
    pageChange (val) {
      this.currentPage = val
      this.initSearch()
    }
  },
  mounted () {
    this.initSearch()
    this.searchForm.startTime = this.time[0]
    this.searchForm.endTime = this.time[1]
  }
}
</script>

<style scoped>
.management{
  width: 100%;
  height: 100%;
  min-width: 1100px;
}
.searchBox{
  height: 20%;
  min-height: 170px;
  background: #fff;
}
.tableBox{
  margin-top: 20px;
  height: 78%;
  background: #fff;
}
.lineOne{
  width: 240px;
  margin-top: 30px;
}
.lineStatus{
  width: 120px;
}
.linePick{
  width: 400px;
}
.lineTitle{
  margin-left: 50px;
  margin-right: 10px;
}
.el-range-input:nth-of-type(2){
  margin-left: 20px;
}
.block{
  display: inline-block;
  padding-left:28px;
}
.detailMsg{
  width: 100%;
}
.searchBox .btn-group{
  display: inline-block;
}
.btn-group .btn{
  width: 100px;
  height: 36px;
  background:#59BFC6;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.btn-group .btn:hover{
  border: 1px solid #ececec;
  color: #000;
}
.btn-group .add{
  margin-left: 10px;
}
.tableBox{
  padding: 30px;
}
.tableBody{
  /*border: 1px solid #ccc;*/
}
.pageblock{
  margin: 20px auto 20px;
  text-align: center;
}
.operateBtn{
  color: #04C3E0;
  padding: 10px;
  cursor: pointer;
}
.search{
  margin-left: 30px;
}
</style>
<style>

</style>
