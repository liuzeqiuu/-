<template>
  <div class="List">
    <p class="num line-black">{{rNum}}</p>
    <p class="status line-black">{{rStatus}}</p>
    <p class="time">{{rTime}}</p>
    <p class="sign">{{rPublickey}}</p>
  </div>
</template>

<script>
export default{
  name: 'record-list',
  props: ['num', 'status', 'time', 'publickey'],
  data () {
    return {
      rNum: this.num,
      rStatus: this.status,
      rTime: this.time,
      rPublickey: this.publickey
    }
  }
}
</script>

<style lang="scss">
.List{
  width: 100vw;
  height: 9vh;
  margin-top: 1.5vh;
  background: #fff;
}
.line-black{
  color: #000;
}
.num,.status,.time{
  display: inline-block;
  height: 8.5vw;
  line-height: 8.5vw;
}
.num{
  position: absolute;
  left: 6.7vw;
  font-size: 4.3vw;
  font-weight: 500;
}
.status{
  width: 15vw;
  text-align: center;
  margin-left: 34vw;
  font-size: 3.2vw;
  font-weight: 500;
}
.time{
  position: absolute;
  right: 3vw;
  color: $client_tab_content_sign;
  font-size: 2.9vw;
}
.sign{
  margin-left: 6.7vw;
  color: $client_tab_content_sign;
  font-size: 3.5vw;
}
</style>
