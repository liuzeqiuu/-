<template>
  <div class="UserManage">
    <div class="searchBox">
      <div class="detailMsg">
        <span class="lineTitle">用户姓名</span>
        <el-input placeholder="请输入内容" clearable class="lineOne" v-model="searchForm.realName"></el-input>
        <span class="lineTitle">用户手机号码</span>
        <el-input placeholder="请输入内容" clearable class="lineOne" v-model="searchForm.userPhone"></el-input>
        <span class="lineTitle">状态</span>
        <el-select v-model="searchForm.roleId" slot="prepend" placeholder="请选择" class="lineOne">
          <el-option value="1" label="正常"></el-option>
          <el-option value="2" label="冻结"></el-option>
        </el-select>
      </div>
      <div class="block">
        <span class="lineTitle">UID</span>
        <el-input placeholder="请输入内容" clearable class="lineOne" v-model="searchForm.userUuid"></el-input>
        <span class="lineTitle">时间选择</span>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          class="lineOne">
        </el-date-picker>
      </div>
      <div class="btn-group">
        <button class="search btn" @click="search(searchForm)">查询</button>
      </div>
    </div>
    <div class="tableBox">
      <div class="tableBody">
        <el-table :data="userList" stripe style="width: 100%" v-loading="loadingTable">
          <el-table-column prop="id" label="UID" min-width="100" align="center" >
          </el-table-column>
          <el-table-column prop="realName" label="用户姓名" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop="userPhone" label="手机号码" min-width="120" align="center">
          </el-table-column>
          <el-table-column prop="userEmail" label="邮箱" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="totalcount" label="账户总资产" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="origin" label="来源" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="rigtime" label="注册时间" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="statename" label="状态" min-width="100" align="center">
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope">
                <span class="operateBtn view" @click="view(userList[scope.$index].id)">查看</span>
                <span class="operateBtn withdraw" @click="freeze(userList[scope.$index].id)">冻结</span>
                <!-- <span class="operateBtn withdraw" @click="recover(userList[scope.$index])">恢复</span> -->
                <span class="operateBtn del" @click="del(userList[scope.$index].id)">删除</span>
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
      pageSize: 10,
      total: 10,
      currentPage: 1,
      time: [],
      searchForm: {
        realName: '',
        userPhone: '',
        roleId: '',
        userUuid: '',
        beginDate: '',
        endDate: '',
        pageSize: 10,
        pageNum: 1
      },
      userList: []
    }
  },
  methods: {
    search (form) {
      this.searchForm.beginDate = this.time[0]
      this.searchForm.endDate = this.time[1]
      this.currentPage = 1
      this.initSearch()
    },
    initSearch (form) {
      this.loadingTable = true
      let params = {
        realName: this.searchForm.realName,
        userPhone: this.searchForm.userPhone,
        role_id: this.searchForm.roleId,
        userUuid: this.searchForm.userUuid,
        beginDate: this.searchForm.beginDate,
        endDate: this.searchForm.endDate,
        pageSize: 10,
        pageNum: this.currentPage,
        requireTotalCount: true
      }
      this.myFetch({
        apiName: `searchUserList`,
        postdata: params,
        success: (res) => {
          this.userList = res
          this.total = res.length
          for (var i = res.length - 1; i >= 0; i--) {
            this.userList[i].rigtime = formatTime(this.userList[i].rigtime, 'yyyy-MM-dd hh:mm:ss')
          }
        },
        complete: () => {
          this.loadingTable = false
        }
      })
    },
    view (val) {
      this.$router.push({path: '/center/userInfo', query: {form: val}})
    },
    freeze (val) {
      console.log(val)
      this.myFetch({
        apiName: `freezeUser`,
        postdata: {
          'id': val,
          'role_id': 2 // 2冻结 1恢复
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '冻结成功',
            type: 'success'
          })
          this.initSearch()
        }
      })
    },
    del (val) {
      this.myFetch({
        apiName: `delUser`,
        postdata: {
          'id': val
        },
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
    recover (val) {
      console.log(val.id)
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

<style lang="scss">
.UserManage{
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
  // width: 580px;
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
  background:$admin_main_color;
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
