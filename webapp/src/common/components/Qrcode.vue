<template>
  <div class="qrbox">
      <img :src="imgsrc" :alt="imgdesc">
      <p>{{ imgdesc }}</p>
  </div>
</template>

<script>

const wechatQrcode = {
  src: require('../imgs/test_qrcode.jpg'),
  desc: '添加客服微信'
}

export default {
  name: 'Qrcode',
  data: () => {
    return {
      imgsrc: wechatQrcode.src,
      imgdesc: wechatQrcode.desc
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.qrbox{
  width: 93px;
  img{
      width: 100%;
      height: auto;
      vertical-align: top;
  }
  p{
      margin: 18px 0;
      font-size: 12px;
      color: #878787;
      text-align: center;
  }
}
</style>
