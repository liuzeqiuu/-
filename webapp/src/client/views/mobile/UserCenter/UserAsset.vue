<template>
  <div class="account">
    <m-header Title="账户资产"></m-header>
    <loading v-if="loadingAssetList"></loading>
    <div class="switch">
      <span class="font">隐藏小于￥1</span>
      <el-switch
        v-model="whetherHide"
        @change = "searchMyAssetList"
        active-color="#59BFC6"
        inactive-color="#D0D0D0">
      </el-switch>
    </div>
    <div v-if="!loadingAssetList">
      <div v-if="assetList.length === 0" class="no-asset">
        <img src="@/client/assets/img/m/W.png" alt="">
        <p>暂无资产信息~</p>
      </div>
      <div v-if="assetList.length > 0" v-for="(item,index) in assetList" :key="index" class="assets">
        <p class="designation">
          <span>{{item.firstLetter}}</span>
          {{ item.currencyname }}
        </p>
        <div class="number">
          <p>可用：<span>{{ item.usable_amount }}</span></p>
          <p>冻结：<span>{{ item.freeze_amount }}</span></p>
        </div>
        <div class="button" :class="{three: item.adressname}">
          <p @click="showWalletDialog(index)" v-show="item.adressname">钱包地址</p>
          <p @click='charge(item.currencyId,item.currencyname)'>充币</p>
          <p @click="mention(item.currencyId)">提币</p>
        </div>

        <div class="purseAddressDialog">
          <el-dialog
            :visible.sync = "purseAddressDialog"
            title="钱包地址"
            width="85%">
            <p class="tips">
              您的钱包地址为:
            </p>
            <p class="purseAddress">{{item.adressname}}</p>
            <el-button class="handleCopy" @click = "handleCopy" :data-clipboard-text="item.adressname">复制钱包地址</el-button>
            <div class="clear"></div>
          </el-dialog>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import mHeader from '../../../components/mNav.vue'
import loading from '@/common/components/LoadingComponent.vue'
export default {
  name: 'Account',
  components: {
    mHeader,
    loading
  },
  data () {
    return {
      value1: true,
      whetherHide: false,
      firstLetter: '',
      letter: '',
      assetList: [],
      loadingAssetList: false,
      searchAsset: {
        userId: '',
        type: '',
        assetsname: ''
      },
      purseAddressDialog: true,
      copyaddress: false
    }
  },
  methods: {
    // 获取 个人资产
    getMyAssetList () {
      this.searchAsset.userId = this.$store.state.User.userId
      console.log('打印一下发送请求前的数据', this.searchAsset)
      this.loadingAssetList = true
      this.myFetch({
        apiName: 'getMyAssetList',
        postdata: this.searchAsset,
        success: ({userAssets, userTransfers}) => {
          this.assetList = userAssets.map(item => {
            item.firstLetter = item.currencyname.substring(0, 1).toUpperCase()
            return item
          })

          // console.log('拿到的数据', this.assetList)
        },
        complete: () => {
          this.loadingAssetList = false
        }
      })
    },
    // 搜索  个人资产
    searchMyAssetList () {
      if (this.whetherHide === false) {
        this.searchAsset.type = ''
      }
      if (this.whetherHide === true) {
        this.searchAsset.type = 1
      }
      this.getMyAssetList()
    },
    charge (currencyId, currencyname) {
      this.$router.push({path: `/charge`, query: {currencyId: currencyId, currencyname: currencyname}})
    },
    mention (currencyId) {
      this.$router.push({path: `/mention`, query: {currencyId: currencyId}})
    },
    showWalletDialog (data) {
      console.log('获取打开钱包地址数据', data)
      this.purseAddressDialog = true
    },
    // 复制钱包地址
    handleCopy (e) {
      var clipboard = new Clipboard('.handleCopy')
      clipboard.on('success', e => {
        this.$notify({
          title: '提示',
          message: '地址复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$notify({
          title: '提示',
          message: '地址复制失败,该浏览器不支持自动复制,请手动复制',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    }
  },
  mounted () {
    this.getMyAssetList()
  }
}
</script>
<style lang="scss">
.account{
  h1{
    width: 100%;
    height: 10.6vw;
    padding: 0 4vw;
    background: #fff;
    display: flex;
    text-align: center;
    font-size: 4.53vw;
    line-height: 10.6vw;
    justify-content: space-between;
    .iconfont{
      font-size: 5.3vw;
    }
    span{
      font-weight: 500;
    }
    .icon-down{
      color: #999;
    }
    .icon-lookup{
      color: #59BFC6;
    }
  }
  .no-asset{
    margin-top: 17.78vw;
    text-align: center;
    font-size: 6vw;
    >p{
      margin-top: 1.778vw;
    }
  }
  .switch{
    width: 100%;
    padding-right: 3.9vw;
    line-height: 11.18vw;
    text-align: right;
    font-size: 3.5vw;
    >span{
      display: inline-block;
      background: #D0D0D0 !important;
      border-color: #d0d0d0 !important;
    }
    .font{
       margin-right: 6vw;
       font-weight: 500;
       border: none;
       background: none !important;
    }
  }
  .assets{
    margin-bottom: 2.9vw;
    width: 100%;
    height: 34.57vw;
    padding-top: 4.1vw;
    // padding-bottom: 0;
    background: #fff;
    .designation{
      padding: 0  5.6vw;
      font-size: 4vw;
      color: #000;
      font-weight: 500;
      span{
        display: inline-block;
        margin-right: 2.8vw;
        width: 7.7vw;
        height: 7.7vw;
        border-radius: 50%;
        text-align: center;
        line-height: 7.7vw;
        background: #A2E2E8;
        font-size: 4vw;
        font-weight: bold;
        color:rgba(255,255,255,1);
      }
    }
    .number{
      margin: 3.7vw 0;
      display: flex;
      justify-content:space-between;
      font-size: 4vw;
      color: #999;
      p{
        width: 50%;
        text-align: center;
        font-weight: 500;
        span{
          color: #000;
          font-weight: 500;
        }
      }
    }
    .button{
      width: 100%;
      height: 10.6vw;
      border-top: 1px solid #ebebeb;
      p{
        display: inline-block;
        width: 50%;
        text-align: center;
        line-height: 10.6vw;
        font-size: 4vw;
        color: #59bfc6;
        font-weight: 500;
        border-right: 1px solid #ebebeb;
      }
      p:nth-of-type(3){
        border: none;
      }
    }
    .three{
      p{
        width: 33.3%;
      }
    }
  }
  .el-dialog{
    text-align: center;
    .tips,.purseAddress{
      text-align: left;
      line-height: 8vw;
    }
    .el-button{
      margin-top: 4vw;
      background:#59BFC6;
      color: #fff;
    }
  }
}
</style>
