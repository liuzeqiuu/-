<template>
    <div class="qrcode-card clean">
        <qrcode class="fl" :imgSrc="qrcodeImgSrc" :imgDesc="qrcodeImgDesc"></qrcode>
        <div class="fl ml60">
            <tel></tel>
            <hr>
            <qrcode-icons @select="handleIconSelect" :activeIndex="activeIndex"></qrcode-icons>
        </div>
    </div>
</template>

<script>
import Qrcode from './Qrcode.vue'
import QrcodeIcons from './QrcodeIcons.vue'
import Tel from './Tel.vue'

export default {
  name: 'QrcodeCard',
  data () {
    return {
      activeIndex: 0,
      qrcodeImgSrc: 0,
      qrcodeImgDesc: 0
    }
  },
  components: {
    'tel': Tel,
    'qrcode-icons': QrcodeIcons,
    'qrcode': Qrcode
  },
  methods: {
    handleIconSelect (index) {
      // 处理点击小图标
      // 更换二维码
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode-card{
    hr{
      border: 0 none;
      height: 1px;
      background-color: #474747;
      margin-top: 26px;
      margin-bottom: 20px;
    }
}
</style>
