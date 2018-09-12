<template>
  <div class="ordertracking">
    <m-header Title="订单跟踪"></m-header>
    <div class="order">
      <p>运单号: {{ this.code }}</p>
      <p>国内承运人: {{ this.name }}</p>
      <p>发货时间: {{ this.time }}</p>
    </div>
    <div class="logis">
      <div v-show="shownologis" class="shownologis">
        暂无轨迹消息
      </div>
      <div :key="item.id" v-for="(item,index) in logistrance" class="logisPart" v-show="!shownologis">
        <div class="font">
          <i class="iconfont icon-icon-test9" v-show="index === 0"></i>
          <i class="iconfont icon-icon-test8" v-show="index !== 0"></i>
        </div>
        <div class="content">
          <p>{{ item.AcceptStation }}</p>
          <p>{{ item.AcceptTime }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from '../../components/mNav.vue'

export default {
  props: ['uuid'],
  components: {
    mHeader
  },
  data () {
    return {
      code: '',
      Abbreviation: '',
      name: '',
      time: '',
      logistrance: '',
      shownologis: false
    }
  },
  methods: {
    query () {
      let self = this
      this.myFetch({
        apiName: 'logisticsTrace',
        postdata: {
          logisticsCode: this.code,
          logisticsAbbreviation: this.Abbreviation
        },
        success (value) {
          if (value.length === 0) {
            self.shownologis = true
          } else {
            self.logistrance = value.reverse()
            self.shownologis = false
          }

          console.log(value)
        }
      })
    }
  },
  mounted () {
    let { code, abbreviation, name, time } = this.$route.query
    this.code = code
    this.Abbreviation = abbreviation
    this.name = name
    this.time = time
    this.query()
  }
}
</script>

<style scoped lang="scss">
.ordertracking{
  .order{
    margin: 2.7vw 0;
    height: 31.8vw;
    width: 100%;
    padding: 4.6vw 6.6vw;
    background: #fff;
    font-size: 3.5vw;
    line-height: 8vw;
    color: rgba(95,96,106,1);
    p{
      font-weight: 400;
    }
  }
  .logis{
    padding: 0 6.6vw;
    font-size: 3.5vw;
    background: #fff;
    overflow: hidden;
    .shownologis{
      padding:3.4vw 0 ;
      font-size: 2.8vw;
    }
    .logisPart{
      padding:3.4vw 0 ;
      .font{
        float: left;
        margin-right: 4vw;
        i{
          position: relative;
          display: inline-block;
          width: 5.5vw;
          height: 5.5vw;
          border-radius: 100%;
          text-align: center;
          line-height: 6vw;
          font-size: 2.8vw;
          color: #fff;
        }
        .icon-icon-test9{
          background: $client_primary_color;
        }
        .icon-icon-test8{
          background: #d1d1d1;
        }
        i:after{
          content: ' ';
          position: absolute;
          top: 5.5vw;
          left: 2.525vw;
          height: 30vw;
          width: 1px;
          background: #d4d4d4;
        }
      }
      .content{
        float: left ;
        p{
          color: #999;
          width: 77.3vw;
        }
        p:nth-of-type(1){
          margin-bottom: 3.4vw;
        }
        p:nth-of-type(2){
          margin-bottom: 10.2vw;
        }
      }
    }
  }
}
</style>
