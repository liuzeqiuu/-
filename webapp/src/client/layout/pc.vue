<template>
  <div class="rel_box">
    <div class="abs_container">
      <header class="header">
        <navibar></navibar>
      </header>
      <div class="content">
        <slot></slot>
      </div>
      <footer class="footer">
        <footerNav></footerNav>
      </footer>
    </div>
  </div>
</template>

<script>
import Navibar from '../components/Navibar.vue'
import FooterNav from '../components/FooterNav.vue'

export default {
  name: 'PCLayout',
  props: {
    msg: String
  },
  components: {
    'navibar': Navibar,
    'footerNav': FooterNav
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.rel_box{
  position: relative;
  overflow-x: hidden;
}
.abs_container{
  width: calc(100vw - 44px);
  margin-left: 22px;
}
.header,.content,.footer{
  margin: 0 -22px;
}
.header{
  height: 64px;
  overflow: hidden;
}
.content{
  min-height: calc( 100vh - 294px);
  position: relative;
}
.footer{
  height: 230px;
  background-color: $client_bg_dark;
  overflow: hidden;
}
</style>
