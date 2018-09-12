<template>
  <div class="UserBox">
    <div class="userInfo">
      <div class="TitleBox">
        <img src="../assets/img/title.png">
        <h1 class="title">用户信息</h1>
      </div>
      <table class="infoBox">
        <tr class="line">
          <td class="lineTitle">姓名</td>
          <td>{{userMsg.userName}}</td>
          <td class="lineTitle">手机号码</td>
          <td>{{userMsg.mobile}}</td>
        </tr>
        <tr class="line">
          <td class="lineTitle">邮箱</td>
          <td>{{userMsg.email}}</td>
          <td class="lineTitle">UID</td>
          <td>{{userMsg.UID}}</td>
        </tr>
      </table>
    </div>
    <div class="shipping">
      <div class="TitleBox">
        <img src="../assets/img/title.png">
        <h1 class="title">收货地址</h1>
      </div>
      <div class="addressBox" v-for="(item,index) in shippingAddress" :key='index'>
        <p>{{item.name}}</p>
        <p>{{item.tel}}</p>
        <p>{{item.address}}</p>
      </div>
    </div>
    <div class="accountAssets">
      <div class="TitleBox">
        <img src="../assets/img/title.png">
        <h1 class="title">账户资产</h1>
      </div>
      <el-table :data="accountForm" stripe style="width: 100%">
        <el-table-column
          prop="coin"
          label="币种"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="num"
          label="可用数量"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="freezeNum"
          label="冻结数量"
          min-width="180">
        </el-table-column>
<!--         <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">

          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>

export default{
  data () {
    return {
      accountForm: [
        {
          coin: 'ETH',
          num: '1.0000000',
          freezeNum: '0.67898000'
        },
        {
          coin: 'BTY',
          num: '1.0000000',
          freezeNum: '0.67898000'
        },
        {
          coin: 'YCC',
          num: '1.0000000',
          freezeNum: '0.67898000'
        },
        {
          coin: 'BCC',
          num: '1.0000000',
          freezeNum: '0.67898000'
        },
        {
          coin: 'ETC',
          num: '1.0000000',
          freezeNum: '0.67898000'
        }
      ],
      userMsg: {
        userName: '张晓',
        mobile: '17816874183',
        email: 'bvtv@163.com',
        UID: '162323'
      },
      shippingAddress: [
        {
          name: '李大莫',
          tel: '17816874183',
          address: '浙江省杭州市西湖区东部软件园6楼601'
        },
        {
          name: '李大钊',
          tel: '17816666666',
          address: '浙江省杭州市西湖区东部软件园6楼602'
        },
        {
          name: '蜡笔小新',
          tel: '17816666666',
          address: '浙江省杭州市西湖区东部软件园6楼602'
        }
      ]
    }
  },
  methods: {

  },
  mounted () {

  },
  components: {

  }
}
</script>

<style scoped>
.outBtn{
  padding: 10px;
  color: #04C3E0;
  cursor: pointer;
}
.UserBox{
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background: #fff;
  min-width: 1000px;
}
.userInfo,.accountAssets,.shipping{
  width: 90%;
  margin: 0 auto;
}
.accountAssets{
  margin-top: 30px;
}
.TitleBox{
  height: 30px;
  margin-bottom: 10px;
  line-height: 30px;
  font-weight: 650;
  font-style: normal;
  font-size: 16px;
  color: #666666;
}
.TitleBox img{
  margin-top: 7px;
  height: 16px;
  float: left;
}
.title{
  margin-left: 8px;
  float: left;
}
.infoBox{
  width: 100%;
  text-align: center;
  font-size: 13px;
}
.infoBox td{
  border: 1px solid #ccc;
}
.line{
  height: 40px;
}
.lineTitle{
  width: 150px;
  /*background-color: #ececec;*/
}
.addressBox{
  display: inline-block;
  width: 400px;
  height: 100px;
  margin-left: 10px;
  padding-top: 15px;
  border: 1px solid #ccc;
}
.addressBox p{
  font-size: 14px;
  line-height: 20px;
  margin-left: 15px;
}
</style>

<style>
.accountAssets .has-gutter .is-leaf:nth-of-type(4){
  text-indent:17px;
}
</style>
