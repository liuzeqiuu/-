<template>
    <div class="tc">注销登录...</div>
</template>
<script>
import {jumpBackOrHome} from '@/common/helper.js'
export default {
  mounted () {
    // 注销
    this.$store.dispatch('User/LOGOUT').then(res => {
      jumpBackOrHome(this)
    })
  }
}
</script>
