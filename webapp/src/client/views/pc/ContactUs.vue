<template>
    <div class="ContactUs">
        <div id="map"></div>
        <div class="info">
          <div class="flex-center">
            <i class="iconfont icon-dizhi1"></i>
            <p class="place">杭州市西湖区马腾路19号东部软件园6号楼6层</p>
          </div>
          <div class="flex-center">
            <i class="iconfont icon-dianhua"></i>
            <p class="phone">866-540-3229 <br>866-540-3229</p>
          </div>
          <div class="flex-center">
            <p class="kefu">客服<br>bityuankefu</p>
            <img src="../../assets/img/kefu.png" alt="">
          </div>
        </div>
        <div class="about">
          <h1>CONTACT US</h1>
          <h2>关于我们</h2>
          <p>
            比特元是一个数字货币的开放平台，主要目的是设计一种可以方便的自我更新的系统，从而逐渐超越原地踏步不前的比特币。比特元一直致力于用去中心化的自治模式解决区块链的治理问题，利益相关者共同制定社区运营规则。<br>
            在比特元平台上，可以实现支付、接受、贮存多种货币，支持钱包找回、抵押发币、跨链币币交易等功能，各行各业都可以存储数据、进行撮合交易。
          </p>
        </div>
    </div>
</template>
<script>
import {initializeBMap} from '../../../common/baidu-map.js'
export default {
  name: 'contactUs',
  data () {
    return {
      ak: 'pB1bhqFh3pLk7BNszv80e7yjG8r5Fq6b'
    }
  },
  mounted () {
    var _this = this
    initializeBMap(_this.ak).then(BMap => {
      this.map(BMap)
    })
  },
  methods: {
    map (BMap) {
      var map = new BMap.Map('map')
      var point = new BMap.Point(120.152379, 30.28515)
      // 将标注添加到地图中
      map.centerAndZoom(point, 15)
      // map.centerAndZoom(point, 16);
      map.enableScrollWheelZoom(false)
      var vectorMarker = new BMap.Marker(new BMap.Point(point.lng, point.lat), {
      // 指定Marker的icon属性为Symbol
        icon: new BMap.Symbol(window.BMap_Symbol_SHAPE_POINT, {
          scale: 1, // 图标缩放大小
          fillColor: '#BB3331', // 填充颜色
          fillOpacity: 1// 填充透明度
        })
      })
      var opts = {
        width: 320, // 信息窗口宽度
        height: 8, // 信息窗口高度
        title: '杭州市西湖区马腾路19号东部软件园6-6' // 信息窗口标题
      }
      map.addOverlay(vectorMarker)
      map.setViewport({center: new BMap.Point(120.152379, 30.28515)})
      var infoWindow = new BMap.InfoWindow(' ', opts) // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point) // 开启信息窗口
    }
  }
}
</script>

<style lang="scss">
  .ContactUs{
    width: 100%;
    background: #F7F7F7;
    position: relative;
    overflow: hidden;
    #map{
      width: 100%;
      height: 500px;
      font-size:15px;
      color:rgba(51,51,51,1);
      line-height:60px;
      text-align: center !important;
      .BMap_bubble_title{
        padding-top: 17px;
      }
      .anchorBL{
        display:none;
      }
    }
    .info{
      position: relative;
      // top: 393px;
      // left: 50%;
      // margin-left: -585px;
      margin: -107px auto 0;
      z-index: 999;
      max-width:1169px;
      // height:136px;
      // padding: 50px 107px 50px 50px;
      padding: 50px;
      display: flex;
      align-items:center;
      justify-content: space-between;
      flex-wrap: wrap;
      background:rgba(255,255,255,1);
      box-shadow:8px 0px 33px rgba(0,0,0,0.13);
      i{
        display: inline-block;
        margin-right: 28px;
        width:39px;
        height:39px;
        border-radius: 100%;
        background:#59BFC6;
        text-align: center;
        line-height: 39px;
        font-size: 20px;
        color: #fff;
      }
      p{
        display: inline-block;
      }
      .place{
        // margin-right: 157px;
        width:241px;
        font-size:15px;
        font-family:STHeitiSC-Light;
        color:rgba(51,51,51,1);
        line-height:20px;
      }
      .phone{
        // margin-right: 208px;
        font-size:16px;
        font-family:ArialMT;
        color:rgba(51,51,51,1);
        line-height:24px;
      }
      .kefu{
        margin-right: 21px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(154,154,154,1);
        line-height:32px;
      }
    }
    .about{
      margin: 0 auto;
      margin-top: 145px;
      max-width: 1169px;
      h1{
        text-align: left;
        font-size:48px;
        font-family:MyriadPro-Regular;
        color:rgba(89,191,198,1);
      }
      h2{
        margin: 39px 0  74px 0;
        text-align: left;
        font-size:24px;
        font-family:STHeitiSC-Light;
        color:rgba(102,102,102,1);
      }
      p{
        padding-bottom: 193px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(159,159,159,1);
        line-height:30px;
      }
    }
  }
</style>
