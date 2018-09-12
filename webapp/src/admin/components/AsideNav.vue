<template>
  <el-menu
    :class="['aside-navi',{'collapsed': isCollapse}]"
    :default-active="computedActiveIndex"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    router
    active-text-color="#ffd04b">
    <el-menu-item index="/center/products" v-if="ident === 'admin'">
      <i class="el-icon-menu"></i>
      <span slot="title">产品管理</span>
    </el-menu-item>
    <el-menu-item index="/center/orders">
      <i class="el-icon-menu"></i>
      <span slot="title">订单管理</span>
    </el-menu-item>
    <el-menu-item index="/center/deliveries"  v-if="ident === 'admin'">
      <i class="el-icon-menu"></i>
      <span slot="title">发货管理</span>
    </el-menu-item>
<!--     <el-menu-item index="/user">
      <i class="el-icon-setting"></i>
      <span slot="title">用户管理</span>
    </el-menu-item> -->
    <el-submenu index="/center/user">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span solt="title">用户管理</span>
      </template>
      <el-menu-item index="/center/user">
        <i class="el-icon-setting"></i>
        <span slot="title">用户列表</span>
      </el-menu-item>
      <el-menu-item index="/center/userInfo">
        <i class="el-icon-setting"></i>
        <span slot="title">用户信息</span>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="/center/BusinessManage"  v-if="ident === 'admin'">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span solt="title">商家管理</span>
      </template>
      <el-menu-item index="/center/BusinessManage">
        <i class="el-icon-setting"></i>
        <span slot="title">商家列表</span>
      </el-menu-item>
      <el-menu-item index="/center/addBusiness">
        <i class="el-icon-setting"></i>
        <span slot="title">添加商家</span>
      </el-menu-item>
<!--       <el-menu-item index="/center/Edit">
        <i class="el-icon-setting"></i>
        <span slot="title">编辑</span>
      </el-menu-item> -->
    </el-submenu>
    <el-menu-item index="/center/business"  v-if="ident === 'business'">
      <i class="el-icon-setting"></i>
      <span slot="title">商家信息</span>
    </el-menu-item>
    <el-radio-group v-model="isCollapse" size="mini" class="collapse-group">
      <el-radio-button :label="false" v-show="isCollapse">展开</el-radio-button>
      <el-radio-button :label="true"  v-show="!isCollapse">收起</el-radio-button>
    </el-radio-group>
  </el-menu>
</template>

<script>
import { sysInfo } from '@/common/sysInfo'
export default {
  name: 'AsideNav',
  data: () => {
    return {
      ident: '',
      business: '',
      currentPath: '',
      isCollapse: sysInfo.clientWidth < 1440
    }
  },
  computed: {
    computedActiveIndex: function () {
      const likeProduct = /product/i
      const likeOrder = /order/i
      const currentPath = this.currentPath
      if (likeProduct.test(currentPath)) {
        return '/products'
      } else if (likeOrder.test(currentPath)) {
        return '/orders'
      } else {
        return currentPath
      }
    }
  },
  mounted () {
    this.currentPath = this.$route.path || '/'
    this.ident = sessionStorage.getItem('Ident')
  },
  methods: {
    handleSelect (index, indexPath) {
      // 菜单激活回调
    },
    handleOpen (key, keyPath) {
      // sub-menu 展开的回调
      // this.$router.push({path:'/BusinessManage'})
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // sub-menu 收起的回调
      console.log(key, keyPath)
    }
  },
  watch: {
    $route () {
      console.log('nav', this.$route.query.ident)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.aside-navi{
  height: 100%;
  width: 200px;
  &.collapsed{
    width: auto;
  }
}
.collapse-group{
  position: fixed;
  bottom: 200px;
}
</style>
<style>
.collapse-group .el-radio-button__inner{
  width: 64px;
  background: rgba(255,255,255,0.4);
  border: none;
  color: #fff;
}
</style>
