<template>
  <div class="home">
    <div class="block">
      <div v-if="BannerLoading" class="BannerLoading" v-loading>
        <Loading></Loading>
      </div>
      <el-carousel trigger="click" height="447px" :interval="3000" arrow="never" v-if="!BannerLoading">
        <el-carousel-item v-for="(item,num) in bannerimg" :key="item.id" class="banner">
          <img :src="item.fileUrl"  ref="imgHeight" @click="bannerlink(num)">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="goods">
      <div class="title" :key="index" v-for="(item,index) in tab" @click="change(index)" :class="{green:index==stateBg}">
        {{ item }}
      </div>
      <div v-show="noData" class="noData">
        <img src="../../assets/img/cart.png" alt="">
        <p>{{ stateBg ===3?'暂无已结束产品':'备货中，敬请期待'}}</p>
      </div>
      <div class="list" v-show="!noData">
        <div v-if="listLoading" class="listLoading" v-loading>
          <Loading></Loading>
        </div>
        <div class="good pointer" :key="it.id" v-for="(it,index) in productList" @click="link(index)" v-if="!listLoading">
          <h1 :title="it.altName ">{{ it.productName }}</h1>
          <div class="good_img">
              <img-box :imgPath="it.fileUrl" :standard="standard" width="260" height="260"></img-box>
          </div>
          <div class="price">
            <span>{{ it.productPrice }}</span>
            <span>{{ it.tokenName }}</span>
            <span :class="{'stateorange':it.productState === '即将开始','stategreen':it.productState === '预售中','stategray':it.productState === '已结束'}">
              {{ it.productState }}
            </span>
          </div>
          <div class="infor">
            <p class="number"><span>{{ it.reserveSum }}</span>人预订</p>
            <p class="time">
              <count-down :times="it.times"></count-down>
            </p>
          </div>
          <div class="cover">
            <p class="cover-price"><span>{{ it.productPrice }}</span>{{ it.tokenName }}</p>
            <p class="time">
              <count-down :times="it.times"></count-down>
            </p>
            <div class="deposit">
              <p class="number"><span>{{ it.reserveSum }}</span>人预订</p>
              <p>定金: <span>{{ it.deposit }}</span></p>
            </div>
            <el-button v-show="!it.reservation" class="reservationBg">不可预定</el-button>
            <el-button v-show='it.reservation' @click="link(index)">立即预订</el-button>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="currentChange"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CountDown from '@/common/components/CountDown.vue'
import ImgBox from '@/common/components/ImgBox.vue'
import LoadingComponent from '@/common/components/LoadingComponent.vue'

export default {
  name: 'home',
  components: {
    CountDown,
    ImgBox,
    'Loading': LoadingComponent
  },
  data () {
    /*
      tab: 产品的状态选择
      stateBg: 产品状态背景色的显示
      pageSize: 需要查询的banner图数量
      bannerimg: banner图信息存放的数组
      currentPage: 当前页面的页码
      apiName: 选择查询的接口名称
      postData: 查询接口时传到后台的请求参数
      productList: 获取的产品列表信息
      total: 数据总数
      state: 点击不同产品状态查询时，需要向后台传递的产品状态
      productId: 产品id,点击立即预定时，需要传到另一页面
      noData: 暂无产品数据提示是否显示
      times: 调用倒计时插件需要传的时间值
      active: 加载动画是否显示
    */
    return {
      tab: ['全部', '预售中', '即将开始', '已结束'],
      stateBg: 0,
      bannerimg: [],
      currentPage: 1,
      postData: '',
      productList: '',
      total: 1,
      state: '',
      productId: '',
      noData: false,
      times: '',
      active: true,
      width: Number,
      height: Number,
      bannerHeight: '',
      standard: 'scaleToBox',
      screenwidth: document.body.clientWidth,
      BannerLoading: false,
      listLoading: false
    }
  },
  methods: {
    // banner图的查询
    banner () {
      let self = this
      self.BannerLoading = true
      this.myFetch({
        apiName: 'queryBanners',
        postdata: {
          'purposeType': 0,
          'pageSize': 4
        },
        success (res = []) {
          self.bannerimg = res
          if (res !== '') {
            self.active = false
          }
        },
        complete () {
          self.BannerLoading = false
        }
      })
    },
    // 产品状态点击改变时，需要向后台传递的参数state改变，同时调用查询函数
    change (index) {
      if (index === 2) {
        this.state = 0
      } else if (index === 3) {
        this.state = 2
      } else if (index === 1) {
        this.state = 1
      }
      this.stateBg = index
      this.productState = this.tab[index]
      this.queryList(1)
    },
    // 页码点击发生改变时，需要传值，同时调用查询函数
    currentChange (currentPage) {
      this.queryList(currentPage)
    },
    bannerlink (num) {
      this.productId = this.bannerimg[num].proId
      this.$router.push('/product/' + this.productId)
    },
    // 点击立即预定时，页面跳转并且传递产品id
    link (index) {
      this.productId = this.productList[index].id
      this.$router.push('/product/' + this.productId)
    },
    // 判断图片的宽高
    image (list) {
      list.forEach(function (currentValue) {
        let img = new Image()
        img.src = currentValue.fileUrl
        img.onload = function () { // 图片的宽高要做onload后才能获取到
          if (img.width > img.height) {
            currentValue.width = 280
            currentValue.height = 180
          } else {
            currentValue.width = 180
            currentValue.height = 280
          }
        }
      })
      this.productList = list
    },
    // 产品信息列表查询
    queryList (currentPage) {
      let self = this
      let apiName = ''
      if (this.stateBg === 0) {
        // 查询全部产品信息
        apiName = 'queryGoodsListAll'
        this.postData = {
          // pageSize: 页面显示几条信息,pageIndex:请求查询的页码
          'pageSize': '9',
          'pageIndex': currentPage
        }
      } else {
        // 查询某一状态的产品列表信息
        apiName = 'queryGoodsList'
        this.postData = {
          // productState: 产品状态
          'productState': this.state,
          'pageSize': '9',
          'pageIndex': currentPage
        }
      }
      // const apiLoading = this.$loading()
      self.listLoading = true
      this.myFetch({
        apiName: apiName,
        postdata: this.postData,
        success (res) {
          if (res.list.length === 0) {
            self.noData = true
          } else {
            self.currentPage = currentPage
            self.noData = false
            self.image(res.list)
            let string = ''
            let omit = '...'
            let current = ''
            self.productList.forEach(currentValue => {
              if (currentValue.productState === '即将开始') {
                currentValue.times = currentValue.presaleStartTime
              } else {
                currentValue.times = currentValue.presaleEndTime
              }
              if (currentValue.productState === '预售中') {
                currentValue.reservation = true
              } else {
                currentValue.reservation = false
              }
              if (currentValue.productName.length > 10) {
                currentValue.altName = currentValue.productName
                string = currentValue.productName.substring(0, 10)
                currentValue.productName = current.concat(string, omit)
              }
            })
          }
          self.total = res.total
        },
        complete () {
          self.listLoading = false
        }
      })
    }
  },
  mounted () {
    this.banner()
    this.queryList(1)
    // this.setSize();
    // const that = this;
    // window.addEventListener('resize', function() {
    //   that.screenWidth = window.innerWidth;
    //   that.setSize();
    // }, false);
  }
}
</script>
<style lang="scss">
  .home{
    width: 100%;
    background: $client_bg_light;
    overflow: hidden;
    .block{
      .BannerLoading{
        width: 100%;
        height: 447px;
        z-index: 99999;
        .loading-box{
          height: 447px;
        }
      }
      background: $client_tab_content_pre;
      .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0
      }
      .el-carousel__item{
        text-align: center;
        position: absolute;
        background: $client_tab_content_pre;
        img{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          height: 100%;
        }
      }
      .el-carousel__indicator{
        width: 0;
        height: 0;
        padding: 0;
        padding-right: 14px;
        padding-bottom: 30px;
        .el-carousel__button{
          width: 7px;
          height: 7px;
          border-radius: 100%;
          background: $client_bg_light;
        }
      }
      .el-carousel__indicator:nth-of-type(4){
        padding-right: 0
      }
      .is-active{
        .el-carousel__button{
          background: $client_primary_color;
        }
      }
    }
    .goods{
      margin: 0 auto;
      width: 1120px;
      padding-top: 30px;
      .title{
        float: left;
        margin-right: 12px;
        overflow: hidden;
        width:111px;
        height:33px;
        border: 1px solid #dbdbdb;
        border-radius:4px;
        text-align: center;
        cursor: pointer;
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(120,120,120,1);
        line-height:30px;
      }
      .green{
        border: 1px solid #EAEAEA;
        background:$client_primary_color;
        color:rgba(255,255,255,1)
      }
      .noData{
        clear: both;
        padding: 70px 150px;
        text-align: center;
        p{
          margin-top: 20px;
          padding-left: 30px;
          font-size: 18px;
          color: $client_tab_content_grey;
        }
      }
      .list{
        clear: both;
        .listLoading{
          clear: both;
          position: absolute;
          top: 543px;
          left: 0;
          width: 100%;
          .loading-box{
            height: 447px;
          }
        }
        .good{
          overflow: hidden;
          position: relative;
          float: left;
          margin: 33px 32px 0 0;
          width: 351px;
          height: 466px;
          padding: 36px 24px 38px 28px;
          background: rgba(255,255,255,1);
          box-shadow: 6px 0px 16px rgba(0,0,0,0.04);
          &:hover{
            box-shadow:6px 0px 30px rgba(0,0,0,0.19);
          }
          h1{
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC-Regular;
            color: rgba(0,0,0,1);
          }
          .good_img{
            position: relative;
            width: 100%;
            height: 295px;
            padding: 23px 33px;
            // background: #000;
            img{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              max-width: 260px;
              max-height: 260px;
            }
          }
          .price{
            margin-bottom: 25px;
            span{
              display: inline-block;
            }
            span:nth-of-type(1){
              margin-right: 10px;
              font-size: 26px;
              color: $client_red_color;
            }
            span:nth-of-type(2){
              font-size: 16px;
              color: #949494;
            }
            span:nth-of-type(3){
              float: right;
              width: 75px;
              height: 29px;
              text-align: center;
              border-radius: 3px;
              font-size: 14px;
              font-family: PingFangSC-Regular;
              line-height: 30px;
            }
            .stateorange{
              color: #F19F3F;
              border: 1px solid #F19F3F;
            }
            .stategreen{
              border: 1px solid rgba(89,191,198,1);
              color: rgba(89,191,198,1);
            }
            .stategray{
              border: 1px solid gray;
              color: gray;
            }
          }
          .infor{
            font-size: 16px;
            color: #000;
            font-family: PingFangSC-Regular;
            font-weight: 400;
           .number{
              float: left;
              span{
                color: $client_red_color;
                font-weight: normal;
              }
            }
            .time{
              float: right;
              i{
                font-weight: 500;
                color: #000;
              }
            }
          }
          .cover{
            position: absolute;
            top: 466px;
            left: 0;
            clear: both;
            width:351px;
            height: 233px;
            padding: 29px 50px 0px 55px;
            text-align: center;
            background: rgba(241, 240, 240, 0.95);
            .cover-price{
              margin-bottom: 17px;
              font-size: 16px;
              color: $client_red_color;
              span{
                font-size: 26px;
              }
            }
            .time{
              font-size: 16px;
              font-weight: 400;
              color: #000;
              i{
                font-weight: 500;
                color: #000;
              }
            }
            .deposit{
              margin: 22px 0 17px 0;
              overflow: hidden;
              font-size:16px;
              font-family:PingFangSC-Regular;
              color:rgba(0,0,0,1);
              line-height:30px;
              p{
                color: #000;
                font-weight: 400;
                span{
                  color: $client_red_color;
                }
              }
              p:nth-of-type(1){
                float: left;
              }
               p:nth-of-type(2){
                float: right;
              }
            }
            .el-button{
              width:252px;
              // height:45px;
              border: 0;
              background: $client_primary_color;
              text-align: center;
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:rgba(255,255,255,1);
              // line-height: 45px;
            }
            .reservationBg{
              background: gray;
            }
          }
          &:hover{
            .cover{
              transform: translateY(-233px);
              transition: all 0.5s;
            }
          }
        }
        .good:nth-of-type(3n){
          margin-right: 0
        }
        .el-pagination{
          clear: both;
          float: right;
          margin: 75px 0 93px 0;
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
            background: $client_primary_color !important;
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
  }
</style>
