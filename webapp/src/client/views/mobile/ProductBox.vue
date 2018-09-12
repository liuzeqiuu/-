<template>
  <div class="box" @click="$emit('ToProduct')">
    <p class="status" :class="{'pre-sale':pStatus=='预售中','ready':pStatus=='即将开始','end':pStatus=='已结束'}">{{pStatus}}</p>
    <div class="img-box">
      <!-- <img :src="image"> -->
      <img-box :imgPath="image" standard='scaleToBox' width="160" height="103"></img-box>
    </div>
    <p class="value pre-sale">{{value}} token</p>
    <div class="order">{{orderNum}}<i>人预定</i></div>
    <time-down :times="pTime" class="countdown"></time-down>
  </div>
</template>

<script>
import ImgBox from '../../../common/components/ImgBox.vue'
import timeDown from '../../../common/components/CountDown.vue'
export default {
  name: 'pro-box',
  props: ['status', 'value', 'orderNum', 'time', 'imgPath'],
  data () {
    return {
      pStatus: this.status,
      pValue: this.value,
      pOrderNum: this.orderNum,
      pTime: this.time,
      image: this.imgPath,
      downTime: ''
    }
  },
  components: {
    timeDown,
    ImgBox
  }
}
</script>

<style scoped lang="scss">
  .box{
    background: #fff;
    padding: 12px;
    box-sizing: border-box;
  }
  .status{
    text-align: right;
    font-size:3.2vw;
    font-family:PingFangSC-Regular;
  }
  .img-box{
    width: 40vw;
    height: 14vh;
    margin: 1vh auto .5vh;
    text-align: center;
  }
  .img-box img{
    max-width: 40vw;
    max-height: 14vh;
  }
  .countdown{

  }
  i{
    margin:0 1.5vw 0 .3vw;
    line-height: 3vh;
    font-style:normal;
    color: #000;
    font-weight: 400;
  }
  .value{
    margin-top: 2vw;
    text-align: center;
    font-size:3.5vw;
    font-weight: 400;
    margin: 7px 0 7px;
    line-height: 1;
  }
  .pre-sale{
    color:$client_tab_content_pre;
  }
  .ready{
    color:$client_tab_content_ready;
  }
  .end{
    color:$client_tab_content_end;
  }
  .countdown,.order{
    text-align: center;
  }
  .order{
    color: $client_tab_content_red;
    line-height: 1;
    margin: 7px 0 7px;
  }
  .countdown{
    color: $client_tab_content_grey;
  }
</style>
