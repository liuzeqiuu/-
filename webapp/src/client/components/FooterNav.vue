<template>
  <div class="box">
    <h4>相关链接：</h4>
    <nav class="clearfix">
      <ul class="links-box fl">
        <li><el-button plain>比特元官网</el-button></li>
        <li><el-button plain>区块链浏览器</el-button></li>
        <li><el-button plain>社区</el-button></li>
        <li><el-button plain>一键Token</el-button></li>
        <li><el-button plain>积分商城</el-button></li>
      </ul>
      <div class="fr">
        <qrcode-card></qrcode-card>
      </div>
    </nav>

  </div>
</template>

<script>
import QrcodeCard from '../../common/components/QrcodeCard.vue'

export default {
  name: 'FooterNav',
  data: () => {
    return {
      currentPath: ''
    }
  },
  components: {
    'qrcode-card': QrcodeCard
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box{
  width: 1135px;
  margin: 0 auto;
  padding: 10px 0;
}
h4{
  color: #878787;
  font-size: 16px;
  font-weight: normal;
  margin: 30px 0;
}
.links-box{
  padding: 0;
  margin: 0;
  clear: both;
  max-width: 450px;

  li{
    list-style: none;
    float: left;
    margin-right: 26px;
    .is-plain{
      background-color: transparent;
      border-color: #474646;
      color: #878787;
      margin-bottom: 18px;
      &:hover{
        border-color: $client_primary_color;
        color: $client_primary_color;
      }
    }
  }
}

</style>
