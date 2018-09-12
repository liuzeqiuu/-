<template>
  <el-container class="full">
    <el-header>
      <headerNav></headerNav>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <asideNav></asideNav>
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeaderNav from '../components/HeaderNav.vue'
import AsideNav from '../components/AsideNav.vue'

export default {
  name: 'PCLayout',
  components: {
    'headerNav': HeaderNav,
    'asideNav': AsideNav
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-header{
  padding: 0;
}
.rel_box{
  position: relative;
  overflow-x: hidden;
}
.abs_container{
  width: calc(100% - 44px);
  margin-left: 22px;
  position: absolute;
}
.header,.content,.footer{
  margin: 0 -22px;
}
.header{
  height: 64px;
  background-color: $admin_bg_dark;
  overflow: hidden;
}
.content{
  min-height: calc( 100vh - 294px);
  position: relative;
}
.footer{
  height: 230px;
  background-color: rgb(46, 46, 46);
  overflow: hidden;
}
</style>
