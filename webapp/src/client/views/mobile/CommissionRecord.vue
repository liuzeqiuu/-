<template>
  <div class="commissionRecord">
    <m-navbar Title="委托记录" ></m-navbar>
    <div class="noRecord" v-show="RecordShow === false">
      <img src="../../assets/commision.png" height="170">
      <h1>暂无委托记录</h1>
    </div>
    <div class="RecordList" v-show="RecordShow === true">

    </div>
  </div>
</template>

<script>
import mNavbar from '../../components/mNav.vue'
export default{
  data () {
    return {
      RecordShow: true
    }
  },
  methods: {

  },
  mounted () {

  },
  components: {
    mNavbar
  }
}
</script>

<style lang="scss">
  .noRecord{
    margin-top: 13.8vh;
    text-align: center;
    h1{
      margin-top: 8vh;
      font-size: 5.3vw;
      color: #69788C;
    }
  }
</style>
