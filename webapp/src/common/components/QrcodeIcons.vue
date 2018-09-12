<template>
  <div class="contact-card">
      <i class="iconfont icon-weixin"></i>
      <i class="iconfont icon-qq"></i>
      <i class="iconfont icon-twitter"></i>
      <i class="iconfont icon-ai-connection"></i>
      <i class="iconfont icon-redditalien"></i>
  </div>
</template>

<script>
export default {
  name: 'QrcodeIcons'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contact-card{
    font-size: 20px;
    color: #878787;
    text-align: center;
    padding: 0 20px;
    i.active{
      color: $client_primary_color;
    }
    i{
      margin-left: 20px;
      font-size: 22px;
    }
    i:first-child{
      margin-left: 0;
    }
}
</style>
