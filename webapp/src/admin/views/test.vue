<template>
  <div>
    <button @click="showWithdrawDialog()">点击打开</button>
    <with-dialog
      :dialogVisible="showWithdraw"
      @onClose="handleCloseWithDrawDialog"
      @submit="withdraw"
      :loading="loading"
      :addressForm="addF"
      :feeForm="fee"
      email="123@qq.com"
      :newAddress="newadd"
                  ></with-dialog><button @click="addC()" class="add">添加C</button>
                                  <button @click='addD()' class="add">添加D</button>

  </div>
</template>

<script>
import withDialog from '../../common/components/WithDraw.vue'
export default{
  data () {
    return {
      showWithdraw: false,
      loading: false,
      newadd: '',
      addF: [{
        purseAdr: 'sdfasdfasdfasf'
      }],
      fee: [{
        minerMoney: 'asdfasdfsa'
      }]
    }
  },
  methods: {
    showWithdrawDialog () {
      this.showWithdraw = true
    },
    handleCloseWithDrawDialog () {
      this.showWithdraw = false
    },
    withdraw (form) {
      console.log(form, form.fee)
      this.loading = true
    },
    addC () {
      this.addF.push({
        purseAdr: 'cccccccc'
      })
      this.newadd = 'cccccccc'
    },
    addD () {
      this.addF.push({
        purseAdr: 'dddddddd'
      })
      this.newadd = 'dddddddd'
    }
  },
  mounted () {

  },
  components: {
    withDialog
  }
}
</script>

<style>
.add{
  position: relative;
  z-index: 20000;
}
</style>
