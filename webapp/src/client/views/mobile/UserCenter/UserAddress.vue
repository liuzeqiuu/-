<template>
  <div class="mUserAddress">
    <!--默认展示页面-->
    <div class="address-loading" v-if="getAddressLoading">
      <Loading></Loading>
    </div>
    <div v-if="isEditor === false && !getAddressLoading">
      <div class="header">
        <m-header Title="收货地址" hyperLink="添加地址" :Url="url"></m-header>
      </div>
      <div class="address-box"  v-for="(item,index) in address" :key="index">
        <p class="column"><span class="name">{{item.harvestName}}</span><span>{{item.phone}}</span></p>
        <p class="column"><span class="default" v-if="item.isdefault === 0">【默认地址】</span>{{item.addressShow+item.addressDetails}}</p>
        <div class="bottom">
          <el-button type="text" class="delete" @click="deleteAddress(item)" :disabled="deleteReceiveAddressLoading">删除</el-button>
          <el-button type="text" class="edit" @click="openEditReceiveAddressDialog(item)">编辑</el-button>
        </div>
      </div>
      <div class="none-address" v-if="address.length === 0">
        <img src="@/client/assets/img/m/W.png" alt="暂无数据">
        <p>暂无收货地址</p>
      </div>
    </div>

    <!--编辑地址页面-->
    <div class="edit-address" v-if="isEditor === true">
      <div class="header">
        <m-header Title="收货地址" :closeRouter="true" @statusBack="closeEditAddress"></m-header>
      </div>
      <div class="content">
        <div class="input-box">
          <span class="label">收货人</span>
          <input type="text" placeholder="请输入姓名" v-model="editAddressData.harvestName">
        </div>
        <div class="input-box">
          <span class="label">联系方式</span>
          <input type="text" placeholder="请输入联系号码" v-model="editAddressData.phone">
        </div>
        <div class="input-box">
          <span class="label">所在地区</span>
          <span class="receiver-address">{{editAddressData.addressShow}}</span>
          <div class="choose" @click="chooseAddress">
            <span>请选择</span>
            <i class="iconfont icon-jinru"></i>
          </div>
        </div>
        <div class="input-box address-detail">
          <span class="label">详细地址</span>
          <textarea class="detail" placeholder="请输入详细地址信息，街道、门牌号小区、楼道号、单元" v-model="editAddressData.addressDetails"></textarea>
        </div>
        <div class="input-box">
          <span class="label">设置为默认地址</span>
          <div class="choose">
            <el-switch
              v-model="editAddressIsDefault"
              @change="setAddressIsDefault"
              active-color="#13ce66"
              inactive-color="#999">
            </el-switch>
          </div>
        </div>
      </div>
      <div class="button-confirm">
        <el-button class="confirmEditAddress" @click="confirmEditAddress" :loading="confirmEditAddressLoading">提交</el-button>
      </div>

      <!--选择地址-->
      <m-address :addressShow="addressShow" @ok="getAddress" @cancel="addressShow=false"></m-address>

    </div>

  </div>
</template>

<script>
import LoadingComponent from '@/common/components/LoadingComponent.vue'
import mHeader from '../../../components/mNav.vue'
import mAddress from '@/common/components/address-picker.vue'
export default {
  data () {
    return {
      isEditor: false, // 用于打开编辑地址页面
      editAddressIsDefault: false, // 设置为默认地址开关
      getAddressLoading: true,
      addressShow: false, // 是否打开选择地址组件
      deleteReceiveAddressLoading: false,
      confirmEditAddressLoading: false,
      url: '/user/addAddress',
      finalAddress: { // 选定后的地址
        province: '',
        city: '',
        county: '',
        street: ''
      },
      editAddressData: {},
      address: []
    }
  },
  components: {
    mHeader,
    'Loading': LoadingComponent,
    mAddress
  },
  mounted () {
    this.getMyAllAddress()
  },
  methods: {
    // 获取所有地址
    getMyAllAddress () {
      this.getAddressLoading = true
      this.myFetch({
        apiName: 'selectReceivingAddress',
        postdata: {userId: this.$store.state.User.userId},
        success: (address) => {
          this.address = address.map(item => {
            let addressArrary = item.address.split('-')
            if (addressArrary.length === 2) {
              item.addressShow = addressArrary[0] + addressArrary[1]
            } else if (item.address.split('-').length === 3) {
              item.addressShow = addressArrary[0] + addressArrary[1] + addressArrary[2]
            }
            return item
          })
        },
        complete: () => {
          this.getAddressLoading = false
        }
      })
    },
    chooseAddress () {
      this.addressShow = !this.addressShow
    },
    getAddress (data) {
      console.log('打印一下data', data)
      let {province, city, town} = data
      if (town) {
        this.editAddressData.addressShow = province + city + town
        this.editAddressData.address = province + '-' + city + '-' + town
      } else {
        this.editAddressData.addressShow = province + city
        this.editAddressData.addressShow = province + '-' + city
      }
      this.addressShow = false
    },
    deleteAddress ({addressId}) {
      this.deleteReceiveAddressLoading = true
      this.myFetch({
        apiName: 'deleteReceivingAddressByAddressId',
        postdata: {addressId: addressId},
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.getMyAllAddress()
        },
        complete: () => {
          this.deleteReceiveAddressLoading = false
        }
      })
    },
    openEditReceiveAddressDialog (data) {
      this.isEditor = true
      console.log('打印一下data', data)
      this.editAddressData = data
      this.editAddressData.isdefaultStatus = this.editAddressData.isdefault
      this.editAddressIsDefault = (this.editAddressData.isdefault === 0)
    },
    closeEditAddress () {
      this.isEditor = false
    },
    confirmEditAddress () {
      let {address, addressId, harvestName, phone, addressDetails, isdefaultStatus} = this.editAddressData
      this.confirmEditAddressLoading = true
      this.myFetch({
        apiName: 'updatePhoneUserAddress',
        postdata: {
          addressId: addressId,
          harvestName: harvestName,
          address: address,
          addressDetails: addressDetails,
          phone: phone,
          phoneDefaultState: isdefaultStatus,
          userId: this.$store.state.User.userId
        },
        success: () => {
          this.getMyAllAddress()
          this.isEditor = false
        },
        complete: () => {
          this.confirmEditAddressLoading = false
        }
      })
    },
    setAddressIsDefault () {
      if (this.editAddressData.isdefault === 1) {
        this.editAddressData.isdefaultStatus = (this.editAddressIsDefault === true) ? 0 : 1
      }
      console.log('打印一下现在的开关状态', this.editAddressData.isdefaultStatus)
    }
  }
}
</script>

<style scoped lang="scss">
.mUserAddress{
  .header{
    margin-bottom: 2.67vw;
  }
  .none-address{
    text-align: center;
    >img{
      margin-top: 20vw;
    }
    >p{
      margin-top: 3vw;
      font-size: 4vw;
      font-weight: 500;
    }
  }
  .address-box{
    margin-bottom: 2.67vw;
    padding-top: 5.34vw;
    background: #fff;
    font-family: PingFangSC-Regular;
    font-size: 3.5vw;
    color: #000;
    .column{
      margin-left: 5.2vw;
    }
    .name{
      display: inline-block;
      margin-bottom: 3.5vw;
      min-width: 13vw;
    }
    .default{
      display: inline-block;
      margin-left: -2vw;
      height: 4.55vw;
      font-size: 3vw;
      color: #59BFC6;
    }
    .bottom{
      margin-top: 4.8vw;
      padding-right: 6.4vw;
      border-top: 1px solid #EBEBEB;
      height: 9.25vw;
      .edit{
        float: right;
        margin-right: 3vw;
        color: #59BFC6;
        font-family: PingFangSC-Regular;
        font-size: 3.5vw;
        max-height: 100%;
        line-height: 9.25vw;
        padding: 0px;
      }
      .delete{
        float: right;
        color: #59BFC6;
        font-family: PingFangSC-Regular;
        font-size: 3.5vw;
        max-height: 100%;
        line-height: 9.25vw;
        padding: 0px;
      }
    }
  }
  .edit-address{
    .button-confirm{
        margin-top: 5vw;
        text-align: center;
        .confirmEditAddress{
          width: 80vw;
          background: #59BFC6;
          color: #fff;
        }
      }
    .content{
      background: #fff;
      .input-box{
        padding-left: 4.54vw;
        padding-right: 3.47vw;
        min-height: 11.88vw;
        line-height: 11.88vw;
        border-bottom: 1px solid #EBEBEB;
        .label{
          float: left;
          min-width: 23vw;
          font-family: PingFangSC-Regular;
          font-size: 3.74vw;
          color: #000;
        }
        .receiver-address{
          display: inline-block;
          margin-top: 3vw;
          width: 50vw;
          font-size: 3vw;
          line-height: 5.94vw;
        }
        input{
          border: none;
        }
        .choose{
          float: right;
          >span{
            display: inline-block;
            margin-right: 1vw;
            font-size: 3vw;
          }
          >i{
            float: right;
            font-size: 3vw;
          }
        }
      }
      .address-detail{
        position: relative;
        height: 19.31vw;
        .detail{
          position: absolute;
          top: 3.2vw;
          padding: 1vw;
          width: 61.27vw;
          min-height: 8.59vw;
          border-color: #e6e3e3;
          padding-bottom: 2vw;
        }
      }
    }
  }
}
</style>
