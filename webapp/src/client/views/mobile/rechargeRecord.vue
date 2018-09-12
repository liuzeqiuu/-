<template>
  <div class="rechargeRecord">
    <m-navbar Title="充币记录"></m-navbar>
    <div class="noRecord" v-show="RecordShow === false">
      <img src="../../assets/rec.png" height="170">
      <h1>暂无充币记录</h1>
    </div>
    <div class="RecordList" v-show="RecordShow === true" v-for="(item,index) in rList" :key='index'>
      <re-list :num="item.num" :status="item.status" :time="item.time" :publickey="item.publickey"></re-list>
    </div>
  </div>
</template>

<script>
import reList from './rechargeList.vue'
import mNavbar from '../../components/mNav.vue'
export default{
  data () {
    return {
      RecordShow: true,
      rList: [
        {
          num: 1000,
          status: '充币成功',
          time: '10点29分',
          publickey: 'sdfqiewfsdjhxkcjvhaegfsidfhdsofaholskjdhvxhkv'
        },
        {
          num: 1000,
          status: '充币成功',
          time: '10点29分',
          publickey: 'sdfqiewfsdjhxkcjvhaegfsidfhdsofaholskjdhvxhkv'
        },
        {
          num: 1000,
          status: '充币成功',
          time: '10点29分',
          publickey: 'sdfqiewfsdjhxkcjvhaegfsidfhdsofaholskjdhvxhkv'
        },
        {
          num: 1000,
          status: '充币成功',
          time: '10点29分',
          publickey: 'sdfqiewfsdjhxkcjvhaegfsidfhdsofaholskjdhvxhkv'
        }
      ]
    }
  },
  methods: {

  },
  mounted () {

  },
  components: {
    mNavbar,
    reList
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
      color: $client_tab_content_cord;
    }
  }
</style>
