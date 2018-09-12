<template>
  <div class="pcProduct">
    <div class="content">
      <div class="content-top">
        <div :class="{'trapezoid': true, 'trapezoid-started': product.productState === 2, 'trapezoid-finished': product.productState === 4 }">
          <span class="trapezoid-word" v-if="product.productState === 1">即将开始</span>
          <span class="trapezoid-word" v-if="product.productState === 2">销售中</span>
          <span class="trapezoid-word" v-if="product.productState === 4">已结束</span>
        </div>
        <div class="content-top-img">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="(item,index) in product.detailsPictureList" :key="index">
              <img-box :imgPath="item.fileUrl"  width="759" height="312" standard='scaleToBox'></img-box>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content-top-detail">
          <p class="content-top-detail-title" :title="product.productName">{{product.productName}}</p>
          <p class="content-top-detail-price">价格: <span class="redColor">{{product.productPrice}}</span> {{product.tokenName}}</p>
          <p class="content-top-detail-people rank-style">
            <span v-if="product.productState === 1">未开始</span>
            <span v-else-if="product.productState === 2"><span class="content-top-detail-peopleNum">{{product.reserveSum}}人</span>已预订</span>
            <span v-else>{{product.reserveSum}}人已预订</span>
            <span class="content-top-detail-peopleRight">定金：{{product.deposit}} {{product.tokenName}}</span>
          </p>
          <el-button v-if="product.productState === 1" class="content-top-button whiteColor-grayBackground" disabled>即将开始</el-button>
          <el-button v-if="product.productState === 2" class="content-top-button whiteColor-blueBackground" @click="bookNow">立即预定</el-button>
          <el-button v-if="product.productState === 3" class="content-top-button whiteColor-grayBackground" disabled>提货中</el-button>
          <el-button v-if="product.productState === 4" class="content-top-button whiteColor-grayBackground" disabled>已结束</el-button>
        </div>
      </div>
      <div class="content-middle">
        <div class="content-middle-left">
          <p class="content-middle-title">详情介绍</p>
          <div class="content-middle-leftImg">
            <div v-html="product.productDes"></div>
          </div>
        </div>
        <div class="content-middle-right">
          <p class="content-middle-title">热销产品</p>
          <router-link class="content-middle-rightBox pointer" v-for="hotProduct in hotProducts" :key="hotProduct.id" :to="{path:`/product/${hotProduct.id}`}">
            <div class="content-middle-rightBox-img">
              <img-box :imgPath="hotProduct.fileUrl"  width="204" height="218" standard='scaleToBox'></img-box>
            </div>
            <p class="content-middle-rightBox-title">{{hotProduct.productName}}</p>
            <div class="content-middle-rightBox-price rank-style">
              <span class="redColor">{{hotProduct.productPrice}}</span> Token
            </div>
            <div class="content-middle-rightBox-people">
              <span class="redColor">{{hotProduct.reserveSum}}</span> 人预订
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!--填写并核对订单信息  弹框-->
    <el-dialog
      class="writeOrder"
      :visible.sync = "writeOrderDialog">
      <div v-if="writeOrderLoading" class="writeOrderLoading" v-loading>
        <Loading></Loading>
      </div>
      <div v-if="!writeOrderLoading">
        <p class="title">填写并核对订单信息</p>
        <div>
          <span class="label">预售付款方式：</span>
          <div class="firstPayDeposit">
            <span>先付定金</span>
          </div>
        </div>
        <div>
          <span class="label"></span><span class="contactNumber">尾款支付联系方式：{{postBookNow.userPhone}}</span>
        </div>
        <div>
          <span class="label">购买数量：</span>
          <div class="numberInput">
            <!-- <el-input-number v-model="postBookNow.Account" size="small" :min="1" :max="200"></el-input-number> -->
            <c-input-number v-model="postBookNow.Account" size="small" :min="1" :max="200"></c-input-number>
          </div>

        </div>
        <div>
          <span class="label">应付定金：</span><span class="tokenValue">{{showAllTokenValue}} {{postBookNow.tokenName}}</span>
        </div>
        <div>
          <span class="label">付款方式：</span>
          <div class="paymentMethod">
            <el-input v-model="showAllCurrencyValue" :disabled="true">
              <template slot="append">
                {{product.currency}}
              </template>
            </el-input>
            <div class="select">
              <el-select v-model="postBookNow.currencyId" @change="chooseCurrency">
                <el-option
                  v-for="item in paymentMethod"
                  :key="item.currencyId"
                  :label="item.currencyName"
                  :value="item.currencyId">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <p class="remarks">备注: 定金支付后不退还, 请在指定时间内申请提货</p>
        <el-button class="cancel" @click="cancelBookNow">取消</el-button>
        <el-button class="submit" @click="comfirmBookNow" :loading="confirmOrderWaiting">确定</el-button>
      </div>
    </el-dialog>
    <tipDialog
      title="您还未登录, 请先登录"
      Url="/login"
      UrlText="去登录"
      @closeDialog="closeTipsDialog"
      :tipVisible="loginTipSeen">
    </tipDialog>

    <!-- <tipDialog
      title="ETH不足, 请前往充值"
      Url="/"
      UrlText="去充值"
      @closeDialog="closeTipsDialog"
      :tipVisible="rechargeTipSeen">
    </tipDialog> -->

  </div>
</template>

<script>
import customeInputNumber from '@/common/components/InputNumber.vue'
import tipDialog from '../../components/tipDialog.vue'
import imgBox from '@/common/components/ImgBox.vue'
import LoadingComponent from '@/common/components/LoadingComponent.vue'
export default {
  props: {
    uuid: String
  },
  data () {
    return {
      num1: '',
      postBookNowAccount: '',
      loginTipSeen: false,
      rechargeTipSeen: false,
      writeOrderLoading: true,
      confirmOrderWaiting: false,
      status: '已结束',
      writeOrderDialog: false,
      product: {

      },
      postBookNow: {
        // userId: '',
        // productId: '',
        // currencyId: '',
        // currencyValue: '',
        // productSum: '', // 购买数量
        // productPrice: ''
      },
      hotProducts: [],
      paymentMethod: [
        {
          currencyId: '',
          currencyName: '',
          currencyValue: ''
        }
      ]
    }
  },
  components: {
    tipDialog,
    'Loading': LoadingComponent,
    'c-input-number': customeInputNumber,
    imgBox
  },
  mounted () {
    this.getReceptionGoods()
    this.queryHotsaleList()
    console.log(this.$store.state.User)
  },
  watch: {
    'postBookNow.currencyValue': (v) => {
      console.log('currencyValue changed')
    },
    uuid (v) {
      this.getReceptionGoods()
      this.queryHotsaleList()
    }
  },
  computed: {
    showAllTokenValue: function () {
      // 应付尾款 = 单价 * 数量
      // currencyValue 某种币种数量(单价)
      // productSum    商品数量(数量)
      const value = this.postBookNow && this.postBookNow.tokenValue
      const amount = this.postBookNow.Account
      if ((value || value === 0) && amount) {
        return (value * 100000000 * amount) / 100000000
      } else {
        return '--'
      }
    },
    // 付款方式
    showAllCurrencyValue: function () {
      // 应付 = 单价 * 数量
      // currencyValue 某种币种数量(单价)
      // productSum    商品数量(数量)
      if (!this.postBookNow) return '--'
      const value = this.postBookNow.currencyValue
      const amount = this.postBookNow.Account
      if ((value || value === 0) && amount) {
        return (value * amount).toFixed(8)
      } else {
        return '--'
      }
    }
  },
  methods: {
    queryHotsaleList () {
      this.myFetch({
        apiName: 'queryHotsaleList',
        postdata: {
          userId: this.$store.state.User.userId,
          proId: this.uuid
        },
        success: (value) => {
          this.hotProducts = value
        }
      })
    },
    getReceptionGoods () {
      let id = this.$route.params.uuid
      const loading = this.$loading()
      this.myFetch({
        apiName: 'getReceptionGoods',
        postdata: {id: id},
        success: (product = {}) => {
          this.product = product
        },
        error: ({code}) => {
          if (code === 404) {
            this.$router.replace('/404')
          }
        },
        failed: (res) => {
          if (/Not Found/.test(res)) {
            // 找不到商品
            this.$router.replace('/404')
          }
        },
        complete: function () {
          loading.close()
        }
      })
    },
    bookNow () {
      if (this.$store.state.User.userId === 0) {
        this.loginTipSeen = true
        return
      }
      this.writeOrderDialog = true
      this.writeOrderLoading = true
      this.myFetch({
        apiName: 'getReserveInfo',
        postdata: {
          userId: this.$store.state.User.userId,
          productId: this.product.id
        },
        success: (data = {}) => {
          console.log('获取到的数据', data)
          this.paymentMethod = data.switchTokenVOList
          data.Account = 1
          data.currencyValue = ''
          data.currencyName = ''
          this.$set(this, 'postBookNow', data)

          this.postBookNow.currencyId = data.switchTokenVOList[0].currencyId
          this.postBookNow.currencyName = data.switchTokenVOList[0].currencyName
          this.postBookNow.currencyValue = data.switchTokenVOList[0].currencyValue
        },
        complete: () => {
          this.writeOrderLoading = false
        }
      })
      // this.loginTipSeen = true;
      // this.rechargeTipSeen = true
    },
    // 确定 预订
    comfirmBookNow () {
      let data = {
        productId: this.postBookNow.productId,
        userId: this.postBookNow.userId,
        currencyId: this.postBookNow.currencyId,
        currencyName: this.postBookNow.currencyName,
        currencyValue: this.showAllCurrencyValue,
        productSum: this.postBookNow.Account,
        productPrice: this.showAllTokenValue
      }
      this.confirmOrderWaiting = true
      this.myFetch({
        apiName: 'goodsReserve',
        postdata: data,
        success: ({orderId}) => {
          this.$router.push({path: `/user/order/${orderId}`, query: {state: 0}})
        },
        complete: () => {
          this.confirmOrderWaiting = false
        }
      })
    },
    // 关闭预订弹框
    cancelBookNow () {
      this.writeOrderDialog = false
      this.postBookNow = {}
    },
    // 选择币种
    chooseCurrency () {
      // array.find
      const payment = this.paymentMethod.find(item => item.currencyId === this.postBookNow.currencyId)
      const { currencyValue, currencyName } = payment
      this.postBookNow.currencyValue = currencyValue
      this.postBookNow.currencyName = currencyName
    },
    // 点击弹窗的X关闭弹窗
    closeTipsDialog () {
      this.loginTipSeen = false
      this.rechargeTipSeen = false
    }
  }
}
</script>

<style scoped lang="scss">
.pcProduct{
  height:100%;
  overflow: auto;
  background: $client_bg_light;
}
.rank-style{
  color: $font_light_grey;
  font-size: 16px;
  line-height: 30px;
  font-family: $PF_Regular;
}
.content{
  margin:96px auto;
  width: 1150px;
  overflow: hidden;
}
.content-top{
  position: relative;
  background: $client_bg_white;
  width: 100%;
  height:345px;
  text-align: left;
}
.content-top-img{
  position: absolute;
  text-align: center;
  top: 50%;
  margin-top: -156px;
  display: inline-block;
  margin-left: 18px;
  width: 759px;
  height: 312px;
}
.content-top-detail{
  display: inline-block;
  box-sizing: border-box;
  padding-top: 30px;
  margin-right: 32px;
  float: right;
  font-size: 16px;
  width:305px;
}
.content-top-detail-title{
  display: -webkit-box; // 用来限制在一个块元素显示的文本的行数
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-bottom:29px;
  font-size: 20px;
  font-family: $PF_Regular;
  line-height: 30px;
  color:(0,0,0,1);
  font-weight: $YH_big;
}
.content-top-detail-price{
  margin-bottom: 60px;
  color: $font_deep_black;
  font-family: $PF_Regular;
  font-size: 16px;
  line-height: 30px;
}
.content-top-detail-price span{
  font-size: 30px;
  font-weight: $YH_bold;
  margin:0px 11px 0px 11px
}
.content-top-detail-peopleNum{
  color: $font_deep_red;
}
.content-top-detail-peopleRight{
  float: right;
}
.content-top-button{
  margin:18px 0px 15px 0px;
  width:100%;
  font-size: 16px;
  font-family: $PF_Regular;
}

.centerActive{
  float: none;
  text-align: center;
}
.content-middle{
  margin: auto;
}
.content-middle-title{
  margin: 18px 0px;
  font-size: 16px;
  font-family: $PF_Regular;
  color: $font_deep_black;
  font-weight: $YH_big;
}
.content-middle-left{
  float: left;
  text-align: left;
}
.content-middle-leftImg{
  box-sizing: border-box;
  padding: 30px 14px 60px 14px;
  text-align: center;
  width: 778px;
  min-height:200px;
  background: $client_bg_white;
}
.content-middle-right{
  float: right;
  text-align: left;
}
.content-middle-rightBox{
  display: block;
  box-sizing: border-box;
  margin-bottom: 19px;
  padding-top: 42px;
  width: 351px;
  height: 427px;
  background: $client_bg_white;
  text-align: center;
}
.content-middle-rightBox-img{
  margin: auto;
  width: 204px;
  height: 218px;
}
.content-middle-rightBox-title{
  margin: 40px auto 37px auto;
  font-family: $PF_Regular;
  color: $font_deep_black;
  font-size: 18px;
  font-weight: $YH_big;
}
.content-middle-rightBox-price{
  display: inline-block;
  float: left;
  margin-left: 23px;
}
.content-middle-rightBox-price span{
  font-size: 26px;
  color: $client_red_color;
}
.content-middle-rightBox-people{
  display: inline-block;
  margin-top: 7px;
  margin-right: 25px;
  float: right;
  font-weight: $YH_big;
  font-size: 16px;
  color: $font_deep_black;
}
.content-middle-rightBox-people span{
  color: $client_red_color;
}
.trapezoid{
  position: absolute;
  top: 10px;
  left: -26px;
  z-index: 5;
  display: inline-block;
  transform:rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  width: 110px;
  height: 0;
  border-width: 0 30px 29px 28px;
  border-style: none solid solid;
  border-color: transparent transparent $client_tab_content_ready;
  color: $client_bg_white;
}
.trapezoid-started{
  border-color: transparent transparent $client_border_green;
}
.trapezoid-finished{
  border-color: transparent transparent $client_border_grey;
}
.trapezoid-word{
  display: inline-block;
  text-align: center;
  margin-top: 7px;
  font-size: 13px;
}
</style>
<style lang="scss">
.pcProduct .content-middle-leftImg img{
  max-width: 100%;
}
.pcProduct .el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus{
    color: $font_light_white;
    background: $client_tab_content_end;
  }
.pcProduct .writeOrder .el-dialog{
  padding: 27px 0px 39px 57px;
  width: 467px;
  min-height: 362px;
  .writeOrderLoading{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
  .el-dialog__header{
    padding: 0px;
  }
  .el-dialog__body{
    padding: 0px;
  }
  .title{
    margin-bottom: 27px;
    font-family: $PF_Light;
    font-size: 16px;
    font-weight: $YH_bold;
    color: $font_deep_black;
  }
  .firstPayDeposit{
    display: inline-block;
    width: 237px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    border: 1px solid $client_primary_color;
    border-radius: 5px;
    color: $client_primary_color;
    font-family: $PF_Light;
    font-size: 14px;
  }
  .label{
    display: inline-block;
    width: 100px;
    font-family: $PF_Light;
    font-size: 14px;
    color: $font_deep_black;
  }
  .contactNumber{
    display: inline-block;
    margin: 18px 0px 18px 0px;
    font-family: $PF_Light;
    font-size: 14px;
    color: $font_deep_grey;
  }
  .numberInput{
    display: inline-block;
    .el-input-number--small{
      width:237px;
    }
  }
  .remarks{
    margin-top: 18px;
    color: #000;
  }
  .tokenValue{
    display: inline-block;
    margin: 17px 0px;
  }
  .paymentMethod{
    position: relative;
    display: inline-block;
    width: 237px;
    height: 29px;
    .el-input__inner{
      height: 29px;
      line-height: 29px;
    }
    .select{
      position: absolute;
      display: inline-block;
      right: 0;
      width: 80px;
    }
    .el-input__icon{
      line-height: 0px;
    }
  }
  .cancel{
    color: $font_deep_grey;
  }
  .submit{
    background: $client_primary_color;
    color: $font_light_white;
  }
  .el-button{
    margin-top: 23px;
    padding: 0px;
    width: 164px;
    height: 35px;
  }
}
.pcProduct{
  .el-carousel__item.is-active{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
