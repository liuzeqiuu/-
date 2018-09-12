<template>
  <div class="rel_box">
    <div class="abs_container">
<!--       <header class="header">
        <m-navbar isHome="1" hTitle="上海" hLink="我的预定" :linkUrl="url"></m-navbar>
      </header> -->
      <div>
        <slot></slot>
      </div>
<!--       <footer class="footer">
        <footerNav></footerNav>
      </footer> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'MobileLayout',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.rel_box{
  height:auto;
  min-height:100vh;
  background:#F4F4F4;
}
</style>
