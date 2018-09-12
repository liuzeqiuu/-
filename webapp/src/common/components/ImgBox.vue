<template>
  <div class="img-box">
    <!-- <img :src="src" v-show="loading === true"> -->
    <img :src="src" class="img-inner-box" v-show="loading === false">
  </div>
</template>

<script>
export default{
  props: ['imgPath', 'width', 'height', 'standard', 'standardSize', 'Rate'],
  data () {
    return {
      url: this.imgPath + '?x-oss-process=image/resize',
      change: '',
      src: require('../imgs/loading.gif'),
      loading: true,
      ImgWidth: '',
      ImgHeight: '',
      ImgStandardSize: '',
      ImgRate: ''
    }
  },
  methods: {
    operate () {
      let dpr
      if (window.devicePixelRatio > 1.5) {
        dpr = 1
      } else {
        dpr = 1
      }
      this.ImgWidth = this.width * dpr
      this.ImgHeight = this.height * dpr
      this.ImgStandardSize = this.standardSize * dpr
      this.ImgRate = this.Rate * dpr
      switch (this.standard) {
        case '':
          break
        case 'scaleToFill':
          this.change = 'm_fixed'
          break
        case 'cutting':
          this.change = 'm_fill'
          break
        case 'scaleToRate':
          this.change = 'p_' + this.ImgRate
          break
        case 'long':
          this.change = 'l_' + this.ImgStandardSize
          break
        case 'short':
          this.change = 's_' + this.ImgStandardSize
          break
        case 'scaleToBox':
          this.change = 'm_lfit'
          break
        default:
          break
      }
      this.url = this.url + (this.ImgWidth ? ',w_' + this.ImgWidth : '') + (this.ImgHeight ? ',h_' + this.ImgHeight : '') + (this.change ? ',' + this.change : '')
      this.loaderImg(this.url)
    },
    loaderImg (url) {
      var newImg = new Image()
      newImg.src = url
      newImg.onload = () => {
        this.src = newImg.src
        this.loading = false
      }
    }
  },
  mounted () {
    this.operate()
  },
  components: {
  }
}
</script>

<style>
.img-box{
  width: 100%;
  height: 100%;
  display:flex;
  align-items: center;
  justify-content: center;
}
.img-inner-box{
  max-width: 100%;
  max-height: 100%;
}
</style>
