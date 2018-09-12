<template>
    <router-view/>
</template>

<script>
// import { sysInfo } from '../common/sysInfo'

const PCLayout = () => import('./layout/pc.vue')
// const MobileLayout = () => import('./layout/mobile.vue')

export default {
  name: 'App',
  components: {
    // 'layout': sysInfo.type === 'mobile' ? MobileLayout : PCLayout
    'layout': PCLayout
  }
}
</script>

<style lang="scss">

</style>
