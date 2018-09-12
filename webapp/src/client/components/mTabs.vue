<template>
  <div class="mTabs">
    <div class="tabs-box">
      <ul>
        <li v-for="(tab,index) in tabs" :key="index" @click="tabClick(tab,index)" :class="{'activeColor': tabIndex == index}">{{tab.label}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabIndex: 0
    }
  },
  props: {
    tabs: {
      type: Array,
      default: function () { // 不传值时的默认值
        return [
          {value: 0, label: '选项一'},
          {value: 1, label: '选项二'},
          {value: 2, label: '选项三'},
          {value: 3, label: '选项四'},
          {value: 4, label: '选项五'}
        ]
      }
    }
  },
  methods: {
    tabClick (tab, index) {
      this.$emit('onTabClick', tab.value)
      if (this.tabIndex !== index) {
        this.tabIndex = index
        this.$emit('onTabChange', tab.value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.mTabs{
  .tabs-box{
    height: 11.34vw;
    background: #fff;
    font-size: 3.74vw;
    ul{
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 100%;
      border-top: 1px solid #E2E2E2;
      border-bottom: 1px solid #E2E2E2;
    }
    li{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 12.95vw;
      font-weight: 500;
    }
    .activeColor{
      color: #59BFC6;
      border-bottom: 0.667vw solid #59BFC6;
    }
  }
}
</style>
