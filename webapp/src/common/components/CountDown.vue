<template>
<div class="timeBox" v-if="showBanner">
  <p class="countdown" v-if="isOver === false">{{day}}<i v-if="showDay === true">天</i>{{hour}}<i v-if="showHour === true">时</i>{{min}}<i>分</i>{{sec}}<i>秒</i></p>
  <p v-if="isOver === true" class="lt1">活动已结束</p>
</div>
</template>

<script>
export default{
  props: ['times'],
  data () {
    return {
      showBanner: false,
      day: '',
      hour: '',
      min: '',
      sec: '',
      isOver: false,
      showDay: true,
      showHour: true
    }
  },
  methods: {
    timeDown (timestamp) {
      let self = this
      let timer = setInterval(function () {
        let nowTime = new Date()
        let endTime = new Date(timestamp * 1000)
        let t = endTime.getTime() - nowTime.getTime()
        if (t > 0) {
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          if (day > 0) {
            self.day = day
            self.hour = hour
            self.min = min
            self.sec = sec
            self.isOver = false
          }
          if (day <= 0 && hour > 0) {
            self.hour = hour
            self.min = min
            self.sec = sec
            self.showDay = false
            self.isOver = false
          }
          if (day <= 0 && hour <= 0) {
            self.min = min
            self.sec = sec
            self.showDay = false
            self.showHour = false
            self.isOver = false
          }
        } else {
          clearInterval(timer)
          self.isOver = true
        }
        self.showBanner = true
      }, 1000)
    }
  },
  mounted () {
    this.timeDown(this.times)
  },
  watch: {
    times: function (val) {
      this.timeDown(val)
    }
  }
}
</script>

<style>
.countdown{
  width: auto;
  margin: 0 auto;
}
.countdown i{
  font-style:normal;
  font-weight: 400;
  color: #000;
  display: inline-block;
  margin-right: 4px;
  margin-left: 2px;
}
.countdown i:last-child{
  margin-right: 0;
}
</style>
