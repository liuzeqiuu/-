<template>
  <div class="test">
    <t-scroll class="wrapper"
      :pullup='true'
      :pulldown='true'
      :pullDownRefresh='true'
      @scrollToEnd='pullup'
      @pulldown='refresh'>
      <ul class="testul">
        <li v-for="(item,index) in tests" class="testli" :key="index">{{item}}</li>
      </ul>
    </t-scroll>
  </div>
</template>

<script>
import TScroll from '../../../common/components/Scroll.vue'

export default{
  data () {
    return {
      tests: ['语文', '数学', '英语', '科学', '物理', '化学', '生物', '语文', '数学', '英语', '科学', '物理', '化学', '生物', '语文', '数学', '英语', '科学', '物理'],
      testg: ['语文', '数学', '英语', '科学', '物理', '化学', '生物', '语文', '数学', '英语', '科学', '物理', '化学', '生物', '语文', '数学', '英语', '科学', '物理']
    }
  },
  methods: {
    pullup () {
      console.log('加载')
      this.tests = this.tests.concat('测试1', '测试2', '测试3')
    },
    refresh () {
      setTimeout(() => {
        console.log('刷新')
        this.tests = this.testg
      }, 1000)
    },
    test () {
      console.log('滚动')
    }
  },
  components: {
    TScroll
  }
}
</script>

<style>
.test{
  height: 100vh;
  overflow: hidden;
}
.wrapper{
  height: 100vh;
  background: #ccc
}
.testul{
  /*background: #999*/
  text-align: center;
}
.testli{
  height: 60px;
  line-height: 60px;
  margin-top: 5px;
  background: #999
}
</style>
