<template>
  <div class="home" ref="mainBox">
    <div class="menuBtn" @click="sliderMenu(menuOpen)"></div>
    <div class="menu">
      <img src="../../assets/leftMenu.png" class="leftMenuBtn" @click="sliderMenu(menuOpen)">
      <div class="userMsg">
        <img src="../../assets/userIcon.png" class="userIcon">
        <p>150****2901</p>
        <span>实名认证：</span><span class="ident">未认证</span>
      </div>
      <div class="menuList">
        <table>
          <tr :class="{'menuActive':menuActive === 1}" @click="changePage('home')">首页</tr>
          <tr :class="{'menuActive':menuActive === 2}" @click="changePage('mysale')">我的预售</tr>
          <tr :class="{'menuActive':menuActive === 3}" @click="changePage('set')">个人中心</tr>
          <tr :class="{'menuActive':menuActive === 4}" @click="changePage('assets')">账户资产</tr>
        </table>
      </div>
    </div>
    <div class="homeContent">
      <m-navbar :isHome="true" Title="预售" hyperLink="我的预定" :Url="url" :isIcon="false"></m-navbar>
      <el-carousel trigger="click" height="38vw">
        <el-carousel-item v-for="item in imgList" :key="item.index">
          <img-box :imgPath="item.fileUrl" class="bannerImg" width="360" height="128" standard='scaleToFill'></img-box>
        </el-carousel-item>
      </el-carousel>
      <div v-infinite-scroll="loadMore" infinite-scroll-distance="10">
        <div class="mainContent">
          <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
            <el-tab-pane label="全部" name="first" >
              <m-product-box v-for="(prodBox,index) in allProductList" :key="index"
                :status="prodBox.productState"
                :value="prodBox.productPrice"
                :orderNum="prodBox.reserveSum"
                :imgPath="prodBox.fileUrl"
                :time="prodBox.presaleEndTime"
                @ToProduct="ToProduct(prodBox.id)"
              ></m-product-box>
              <div class="woods" v-if="woods === false">
                <img src="../../assets/img/m/gwc.png">
                <p>备货中，敬请期待</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="预售中" name="second">
              <m-product-box v-for="(prodBox,index) in preProductList" :key="index"
                :status="prodBox.productState"
                :value="prodBox.productPrice"
                :orderNum="prodBox.reserveSum"
                :imgPath="prodBox.fileUrl"
                :time="prodBox.presaleEndTime"
                @ToProduct="ToProduct(prodBox.id)"
              ></m-product-box>
              <div class="woods" v-if="woods === false">
                <img src="../../assets/img/m/gwc.png">
                <p>备货中，敬请期待</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="即将开始" name="third">
              <m-product-box v-for="(prodBox,index) in readyProductList" :key="index"
                :status="prodBox.productState"
                :value="prodBox.productPrice"
                :orderNum="prodBox.reserveSum"
                :imgPath="prodBox.fileUrl"
                :time="prodBox.presaleEndTime"
                @ToProduct="ToProduct(prodBox.id)"
              ></m-product-box>
              <div class="woods" v-if="woods === false">
                <img src="../../assets/img/m/gwc.png">
                <p>备货中，敬请期待</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已结束" name="fourth">
              <m-product-box v-for="(prodBox,index) in endProductList" :key="index"
                :status="prodBox.productState"
                :value="prodBox.productPrice"
                :orderNum="prodBox.reserveSum"
                :imgPath="prodBox.fileUrl"
                :time="prodBox.presaleEndTime"
                @ToProduct="ToProduct(prodBox.id)"
              ></m-product-box>
              <div class="woods" v-if="woods === false">
                <img src="../../assets/img/m/gwc.png">
                <p>备货中，敬请期待</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImgBox from '../../../common/components/ImgBox.vue'
import mProductBox from './ProductBox.vue'
import mNavbar from '../../components/mNav.vue'
import infiniteScroll from 'vue-infinite-scroll'

const FIRST_PAGE = 1

export default {
  name: 'home',
  directives: {infiniteScroll},
  data () {
    return {
      woods: true,
      url: '/user/orders',
      imgList: [],
      status: '',
      allProductList: [],
      preProductList: [],
      readyProductList: [],
      endProductList: [],
      activeName: 'first',
      menuOpen: false,
      menuActive: 1,
      page: FIRST_PAGE,
      loadingData: false,
      noMoreData: false,
      total: 0,
      changeTab: 'first'
    }
  },
  computed: {
    disableScrollListen () {
      return this.loadingData || this.noMoreData
    }
  },
  methods: {
    ToProduct (id) {
      this.$router.push({path: `/product/${id}`})
    },
    loadMore () {
      // 加载更多
      if (this.changeTab === 'first') {
        this.getAllProduct(this.page + 1)
      } else {
        this.getStatusProduct(this.page + 1, this.changeTab)
      }
    },
    sliderMenu: function (open) {
      this.$refs.mainBox.style.transition = 'all .4s'
      if (open === false) {
        this.$refs.mainBox.style.transform = 'translateX(61.5vw)'
        this.menuOpen = true
      } else {
        this.$refs.mainBox.style.transform = 'translateX(0)'
        this.menuOpen = false
      }
    },
    changePage: function (router) {
      switch (router) {
        case 'home':
          this.$router.push({path: '/'})
          this.menuActive = 1
          break
        case 'mysale':
          this.$router.push({path: '/user/orders'})
          this.menuActive = 2
          break
        case 'set':
          this.$router.push({path: '/user'})
          this.menuActive = 3
          break
        case 'assets':
          this.$router.push({path: '/user/asset'})
          this.menuActive = 4
          break
        default:
          break
      }
    },
    getAllProduct (page) {
      if (this.disableScrollListen) { this.loadingData = true }
      let loadingLayer = null
      // console.log('test')
      if (page === FIRST_PAGE) {
        loadingLayer = this.$loading()
      }
      this.myFetch({
        apiName: 'allProduct',
        postdata: { pageSize: 10, pageIndex: page },
        success: ({total, list = []}) => {
          if (page === FIRST_PAGE) {
            this.allProductList = list
            // console.log(list)
          } else {
            this.allProductList = [...this.allProductList, ...list]
          }
          this.page = page
          if (total <= this.allProductList.length) {
            this.noMoreData = true
          }
          this.total = total
          if (this.allProductList.length === 0) {
            this.woods = false
          } else {
            this.woods = true
          }
        },
        complete: () => {
          this.loadingData = false
          loadingLayer && loadingLayer.close()
        }
      })
    },
    getStatusProduct (page, changeTab) {
      // console.log(changeTab)
      if (this.disableScrollListen) { this.loadingData = true }
      let loadingLayer = null
      // console.log('test')
      if (page === FIRST_PAGE) {
        loadingLayer = this.$loading()
      }
      if (changeTab === 'second') {
        this.myFetch({
          apiName: 'statusProduct',
          postdata: { pageSize: 10, pageIndex: page, productState: 1 },
          success: ({total, list = []}) => {
            if (page === FIRST_PAGE) {
              this.preProductList = list
              // console.log(list)
            } else {
              this.preProductList = [...this.preProductList, ...list]
            }
            this.page = page
            if (total <= this.preProductList.length) {
              this.noMoreData = true
            }
            this.total = total
            if (this.preProductList.length === 0) {
              this.woods = false
            } else {
              this.woods = true
            }
          },
          complete: () => {
            this.loadingData = false
            loadingLayer && loadingLayer.close()
          }
        })
      } else if (changeTab === 'third') {
        this.myFetch({
          apiName: 'statusProduct',
          postdata: { pageSize: 10, pageIndex: page, productState: 0 },
          success: ({total, list = []}) => {
            if (page === FIRST_PAGE) {
              this.readyProductList = list
            } else {
              this.readyProductList = [...this.readyProductList, ...list]
            }
            this.page = page
            if (total <= this.readyProductList.length) {
              this.noMoreData = true
            }
            this.total = total
            if (this.readyProductList.length === 0) {
              this.woods = false
            } else {
              this.woods = true
            }
          },
          complete: () => {
            this.loadingData = false
            loadingLayer && loadingLayer.close()
          }
        })
      } else {
        this.myFetch({
          apiName: 'statusProduct',
          postdata: { pageSize: 10, pageIndex: page, productState: 2 },
          success: ({total, list = []}) => {
            if (page === FIRST_PAGE) {
              this.endProductList = list
            } else {
              this.endProductList = [...this.endProductList, ...list]
            }
            this.page = page
            if (total <= this.endProductList.length) {
              this.noMoreData = true
            }
            this.total = total
            if (this.endProductList.length === 0) {
              this.woods = false
            } else {
              this.woods = true
            }
          },
          complete: () => {
            this.loadingData = false
            loadingLayer && loadingLayer.close()
          }
        })
      }
    },
    getBanner () {
      this.myFetch({
        apiName: 'bannerImg',
        postdata: {purposeType: 1, pageSize: 4},
        success: (res) => {
          this.imgList = res
        }
      })
    },
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.getAllProduct(FIRST_PAGE)
      } else {
        this.changeTab = tab.name
        this.getStatusProduct(FIRST_PAGE, this.changeTab)
      }
    }
  },
  mounted () {
    this.getAllProduct(FIRST_PAGE)
    this.getStatusProduct(FIRST_PAGE)
    this.getBanner()
  },
  components: {
    mNavbar,
    mProductBox,
    ImgBox
  }
}
</script>

<style lang="scss">
.home{
  background:#F4F4F4;
  padding-bottom:2vh;
  .woods{
    margin:15vh auto 0;
    text-align:center;
    img{
      width:40vw;
    }
    p{
      margin-top: 20px;
      color:#A5A5A5;
      font-size:16px;
    }
  }
}
.bannerImg{
  position: absolute;
  left:50%;
  transform:translateX(-50%);
  height: 100%;
  .img-inner-box{
    height: 100%;
    width: 100%;
  }
}
.menuBtn{
  z-index: 10000;
  position: absolute;
  top: 1.5vh;
  left: 1.8vw;
  width: 8vw;
  height: 4vh;
}
.menu{
  z-index: 10001;
  position: absolute;
  left: -61.5vw;
  top: 0;
  bottom: 0;
  // z-index: 11;
  width: 61.5vw;
  height: auto;
  min-height: 100vh;
  background: #2A2B2D;
  overflow-y: hidden;
}
.userMsg{
  height: 25.6vh;
  width: 100%;
  color: #B1B1B1;
  font-size: 3.5vw;
  line-height: 3vh;
  text-align: center;
  border-bottom: .3vw solid #3B3C3F;
  p{
    margin-top: 1vw;
  }
  .userIcon{
    margin-top: 8vh;
    width: 12vw;
  }
  .ident{
    color: #59BFC6;
  }
}
.menuList{
  width: 100%;
  // background: #eee;
  table{
    width: 100%;
    tr{
      height: 8.5vh;
      text-align: center;
      line-height: 8.5vh;
      color: #B1B1B1;
      font-size: 4vw;
      border-bottom: .3vw solid #3B3C3F;
    }
  }
  .menuActive{
    background:#59BFC6;
    color: #fff;
  }
}
.leftMenuBtn{
  position: absolute;
  top: 2vh;
  left: 2vw;
  height: 4vh;
}
  .el-carousel__button{
    width: 1.3vw;
    height: 1.3vw;
    border-radius: 5vw;
  }
  .el-tabs__nav{
    padding: 0 5vw;
  }
  .el-tabs__active-bar{
    margin-left: 5vw;
    height: 0.4vh;
    background-color: $client_primary_color;
  }
  .el-tabs__item{
    height: 6.4vh;
    line-height: 6.4vh;
    color: $client_tab_color;
  }
  .el-tabs__item.is-active{
    color: $client_primary_color;
  }
  .el-tabs__nav-scroll{
    background: #fff;
    height: 6.4vh;
  }
  .el-tabs__nav-wrap::after{
    height: 0;
  }
  .homeContent .el-tabs__header{
    margin-bottom: 0;
  }
  .homeContent .el-tabs__content{
    margin: 0 12px 12px;
  }
  .homeContent .el-tab-pane{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .mainContent .box{
    width: calc(50% - 6px);
    margin-top: 12px;
  }
.img-inner-box{
  // width: 100%;
  // height: 100%;
}
</style>
