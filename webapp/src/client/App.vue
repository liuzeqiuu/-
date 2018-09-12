<template>
  <layout>
    <router-view/>
    <!-- <debuginfo/> -->
  </layout>
</template>
<script>
import { sysInfo } from '../common/sysInfo'

const PCLayout = () => import('./layout/pc.vue')
const MobileLayout = () => import('./layout/mobile.vue')

const DebugInfo = () => import('@/common/components/DebugInfo.vue')
const Blank = () => import('@/common/components/Blank.vue')
console.log('process.env.VUE_APP_DEBUG_INFO', process.env.VUE_APP_DEBUG_INFO)
export default {
  name: 'App',
  components: {
    'layout': sysInfo.type === 'mobile' ? MobileLayout : PCLayout,
    'debuginfo': (process.env.VUE_APP_DEBUG_INFO === 'true') ? DebugInfo : Blank
  }
}
</script>
