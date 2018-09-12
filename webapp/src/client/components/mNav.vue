<template>
    <div class="header">
        <div class="tip">
          <div class="homeList" v-if="Home == true">
          </div>
          <div class="back" v-if="Home != true" @click="back()">
          </div>
        </div>
        <div class="link">
          <!-- <router-link :to="{path:hUrl}" v-if="isIcon != true">{{link}}</router-link> -->
          <span @click="tohUrl" v-if="isIcon != true">{{link}}</span>
          <router-link :to="{path:hUrl}" v-if="isIcon == true"><img :src="imgPath" class="nav-right-icon"></router-link>
        </div>
        <div class="title">{{hTitle}}</div>
    </div>
</template>

<script>
export default {
  name: 'prop-event',
  props: ['isHome', 'Title', 'hyperLink', 'Url', 'isIcon', 'imgPath', 'closeRouter', 'isLogin'],
  data () {
    return {
      Home: this.isHome,
      hTitle: this.Title,
      link: this.hyperLink,
      hUrl: this.Url,
      icon: this.isIcon,
      image: this.imgPath,
      close: this.closeRouter,
      login: this.isLogin
      // catalogShow: false
    }
  },
  methods: {
    back: function () {
      if (this.close === true) {
        this.$emit('statusBack')
      } else {
        if (window.history.length > 1) {
          this.$router.go(-1)
        } else {
          this.$router.push({path: '/'})
        }
      }
    },
    tohUrl: function () {
      if (this.$store.state.User.userId === 0) {
        this.$emit('notLogin')
      } else {
        this.$router.push({path: this.hUrl})
      }
    },
    catalogOpen: function () {
      // this.catalogShow = !this.catalogShow
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="scss">

  .header{
    height: 44px;
    width: 100vw;
    background: #fff;
    .homeList,.back{
      height: 44px;
    }
    .tip{
      position: absolute;
      display: inline-block;
      height: 44px;
      width: 8vw;
      margin-left: 2vw;
      line-height: 44px;
    }
    .homeList{
      background: url('../assets/catalog.png') no-repeat center center;

    }
    .back{
      background: url('../assets/back.png') no-repeat center center;
    }
    .catalog{
      z-index:10;
      position:absolute;
      top:44px;
      width:35vw;
      height:40vh;
      background:#fff;
      table{
        width:100%;
      }
      .first-level{
        width:35vw;
        height: 4vh;
        text-align:center;
        line-height: 4vh;
        border-bottom: .25vh solid #ccc;
        // background: #ccc;
      }
    }
  }
  .title{
    display: table;
    width: 100vw;
    height: 44px;
    margin: 0 auto;
    line-height: 44px;
    text-align: center;
    color: #000;
    font-size: 4.5vw;
    font-weight: 400;
    font-family: PingFangSC-Regular;
  }
  .link{
    position: absolute;
    display: inner-block;
    left: 80vw;
    height: 44px;
    padding-right: 3.5vw;
    line-height: 44px;
    a{
      font-size: 3.7vw;
      color:rgba(89,191,198,1);
    }
  }
  .nav-right-icon{
    margin-top: 1.9vh;
    height: 3.2vh;
  }
</style>
