<template>
  <div class="mProduct">
    <m-header Title='预售' hyperLink="我的预订" @notLogin="notLogin" :Url="url"></m-header>
    <div class="product-intro">
      <div class="center">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="(item,index) in product.detailsPictureList" :key="index">
            <div class="imgBox">
              <img :src="item.fileUrl" alt="">
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <p class="title">{{product.productName}}</p>
      <div class="left">
        <p class="left-price">价格：<span class="price-red">{{product.productPrice}}</span> {{product.tokenName}}</p>
        <p class="left-account">{{product.reserveSum}}人预定</p>
      </div>
      <div class="right">
        <p class="right-deposit">定金：{{product.deposit}} {{product.tokenName}}</p>
        <p class="right-time">
          <count-down v-if="isShowTime" :times="product.presaleEndTime"></count-down>
        </p>
      </div>
    </div>
    <div class="product-detail center">
      <div v-html="product.productDes"></div>
    </div>
    <div class="bottom">
      <el-button @click="toReserve">立即预订</el-button>
    </div>

    <!--阴影弹窗 -->
    <div class="not-logged-in m-dialog">
      <el-dialog
        :visible.sync="loginVisible"
        center>
        <p class="remind">您还未登录，请先登录</p>
        <div slot="footer" class="dialog-footer">
          <div class="button" @click="loginVisible = false">
            <span class="button-cancel">取消</span>
          </div>
          <div class="button-line"></div>
          <div class="button" @click="goLogin">
            <span class="button-login">去登录</span>
          </div>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import CountDown from '@/common/components/CountDown.vue'
import mHeader from '../../components/mNav.vue'
import ImgBox from '@/common/components/ImgBox.vue'
export default {
  data () {
    return {
      loginVisible: false,
      toDeposit: true, // 是否已跳转预订页面
      url: '/products',
      product: {
        // id: 15316420, // 商品id
        // productName: '嗨车族超轻滑板车 枫木弹性好', // 标题
        // tokenValue: '1000.00', // 价格
        // deposit: '100', // 定金
        // personNumber: '230', // 人数
        // presaleEndTime: ''
      }
    }
  },
  computed: {
    isShowTime: function () {
      let reg = /^\d{10}$/
      if (reg.test(this.product.presaleEndTime)) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    mHeader,
    CountDown,
    ImgBox
  },
  methods: {
    toReserve () {
      if (this.$store.state.User.userId === 0) {
        this.loginVisible = true
      } else {
        this.$router.push({path: `/reserve/${this.product.id}`})
      }
    },
    notLogin () {
      this.loginVisible = true
    },
    getReceptionGoods () {
      let id = this.$route.params.uuid
      const loading = this.$loading()
      this.myFetch({
        apiName: 'getReceptionGoods',
        postdata: {id: id},
        success: (product = {}) => {
          this.product = product
          console.log(product)
        },
        failed: (res) => {
          if (/Not Found/.test(res)) {
            this.$router.replace('/404')
          }
        },
        complete: function () {
          loading.close()
        }
      })
    },
    goLogin () {
      this.$router.push({path: '/'})
    }
  },
  mounted () {
    this.getReceptionGoods()
  }
}
</script>

<style scoped lang="scss">
.mProduct{
  min-height: 100vh;
  background: $client_bg_light_grey;
  overflow: hidden;
  padding-bottom: 15vw;
  .product-intro{
    box-sizing: border-box;
    margin-top: 2.8vw;
    padding: 6.8vw 4vw 4vw 4vw;
    background: $font_light_white;
    .main-img{
      margin: 0 auto 7.74vw auto;
      width: 27.23vw;
      height: 28.8vw;
    }
    .main-img img{
      height: 100%;
    }
    .title{
      margin-bottom: 4.67vw;
      font-size: 3.7vw;
      font-weight: $YH_big;
    }
    .left{
      display: inline-block;
    }
    .left-price{
      margin-bottom: 3.74vw;
      font-size: 2.93vw;
      color: $font_deep_black;
    }
    .price-red{
      color: $client_tab_content_red;
      font-size: 4.01vw;
    }
    .left-account{
      font-size: 3.2vw;
      color: $font_light_grey;
    }
    .right{
      display: inline-block;
      float: right;
      font-size: 3.2vw;
      color: $font_light_grey;
    }
    .right-deposit{
      margin-bottom: 3.74vw;
      margin-top: 0.7vw;
    }
    .time-unit{
      display: inline-block;
      margin-right: 0.5vw;
      color: $font_deep_black;
      font-weight: $YH_bold;
    }
    .right-time{
      min-width: 108px
    }
  }
  .product-detail{
    margin-top: 2.8vw;
    padding: 6.4vw 2.93vw 0vw 2.93vw;
    min-height: 19.81vw;
    background: $font_light_white;
    img{
      max-width: 100%;
    }
  }
  .bottom{
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
  .center{
    text-align: center;
  }
  .imgBox{
    height: 28.74vw;
    img{
      max-height: 100%;
    }
  }
}
</style>
<style lang="scss">
.mProduct{
  .bottom .el-button{
    width: 100%;
    height: 11.65vw;
    border: none;
    border-radius: 0;
    background: $client_primary_color;
    font-size: 3.74vw;
    color: $font_light_white;
  }
  .el-carousel__container{
    height: 29.72vw;
  }
  .product-detail img{
    max-width: 100%;
  }
}
</style>
