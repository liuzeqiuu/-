<template>
  <div class="address-picker">
    <transition name="fade">
      <div class="mask" @click="cancel" v-if="addressShow"></div>
    </transition>
    <transition name="animate">
      <div class="picker" v-if="addressShow">
        <div class="picker-head">
          <div><span @click="cancel">取消</span></div>
          <div>所在地区</div>
          <div><span @click="ok">确定</span></div>
        </div>
        <div class="picker-wrap">
          <div class="content">
            <div class="content-item" :class="{w50:hasTown}" v-picker.province="{set: set}" ref="province">
              <div class="picker-item">
                <div class="item" v-for="(val,index) of address" :class="{color: index === pIndex}" :key="val.name">{{val.name}}</div>
              </div>
            </div>
            <div class="content-item" :class="{w50:hasTown}" v-picker.city="{set: set}" ref="city">
              <div class="picker-item">
                <div class="item" v-for="(val,index) of city" :class="{color: index === cIndex}" :key="index">{{val.name?val.name:val}}</div>
              </div>
            </div>
            <div class="content-item" :class="{w50:hasTown}" v-picker.town="{set: set}" ref="town">
              <div class="picker-item">
                <div class="item" v-for="(val,index) of town" :class="{color: index === tIndex}" :key="val">{{val}}</div>
              </div>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import address from './address-data'
export default{
  props: {
    addressShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      address: address,
      pIndex: 0,
      cIndex: 0,
      tIndex: 0
    }
  },
  computed: {
    province () {
      return this.address[this.pIndex].name
    },
    city () {
      return this.address[this.pIndex].cityList.length === 1 ? this.address[this.pIndex].cityList[0].areaList : this.address[this.pIndex].cityList
    },
    town () {
      return this.address[this.pIndex].cityList.length === 1 ? [] : this.address[this.pIndex].cityList[this.cIndex].areaList
    },
    hasTown () {
      return this.address[this.pIndex].cityList.length === 1
    }
  },
  methods: {
    ok () {
      let pro = this.province
      let cit = this.city[this.cIndex].name || this.city[this.cIndex]
      let tow = this.town[this.tIndex] ? this.town[this.tIndex] : ''
      // 每次点击确定事件，将地址选择器重置到初始状态
      this.pIndex = 0
      this.cIndex = 0
      this.$emit('ok', {province: pro, city: cit, town: tow})
    },
    cancel () {
      // 每次点击取消事件，将地址选择器重置到初始状态
      this.pIndex = 0
      this.cIndex = 0
      this.$emit('cancel')
    },
    set (name, index) {
      if (name === 'province') {
        this.pIndex = index
      } else if (name === 'city') {
        this.cIndex = index
      } else {
        this.tIndex = index
      }
    }
  },
  watch: {
    pIndex () {
      this.cIndex = 0
      this.tIndex = 0
      this.$refs.city.children[0].style.transform = 'translateY(0)'
      this.$refs.town.children[0].style.transform = 'translateY(0)'
    },
    cIndex () {
      this.tIndex = 0
      this.$refs.town.children[0].style.transform = 'translateY(0)'
    }
  },
  directives: {
    picker: {
      bind (el, binding) {
        let startY = ''
        let differY = ''
        let currentY = 0
        let len = el.children[0].children.length
        let dom = el.children[0]
        let index = 0
        let maxY = -(len - 1)
        const itemHeight = 42
        el.addEventListener('touchstart', (e) => {
          e.preventDefault()
          if (dom.style.transform === 'translateY(0px)') {
            currentY = 0
            maxY = -(el.children[0].children.length - 1)
          }
          let ev = e.touches[0]
          startY = ev.clientY
        })
        el.addEventListener('touchmove', (e) => {
          e.preventDefault()
          let ev = e.touches[0]
          differY = ev.clientY - startY
          dom.style.transition = 'transform 0s'
          dom.style.transform = `translateY(${currentY * itemHeight + differY}px)`
        })
        el.addEventListener('touchend', (e) => {
          e.preventDefault()
          let ev = e.changedTouches[0]
          differY = ev.clientY - startY
          dom.style.transition = 'transform .3s'
          // 移动距离超过一个单位
          if (differY <= -itemHeight) {
            currentY += Math.floor(differY / itemHeight)
            if (currentY <= maxY)currentY = maxY
          } else if (differY >= itemHeight) {
            currentY += Math.floor(differY / itemHeight)
            if (currentY >= 0)currentY = 0
          }
          dom.style.transform = `translateY(${currentY * itemHeight}px)`
          // 记录当前位移在数组中的索引,必须取整，否则会出现浮点数
          index = Math.floor(Math.abs(currentY / 1))
          let name
          if (binding.modifiers.province) {
            name = 'province'
          } else if (binding.modifiers.city) {
            name = 'city'
          } else if (binding.modifiers.town) {
            name = 'town'
          }
          binding.value.set(name, index)
        })
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{
  transition: all .3s linear;
}
.fade-enter,.fade-leave-to{
  opacity: 1;
}
.animate-enter-active,.animate-leave-active{
  transition: all .3s;
}
.animate-enter,.animate-leave-to{
  transform:translateY(100%);
}
.w50{
  width: 50% !important;
}
.w0{
  width:0% !important;
}
.mask{
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.6);
}
.picker .color{
  color: #6189ea;
  font-weight: bold;
}
.picker{
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 10;
  width: 100%;
  height: 275px;
  background: #fff;
}
.picker-head{
  display: flex;
  justify-content: space-around;
  padding: 0px 12px;
  height: 40px;
  font-size: 14px;
  background: #f3f3f3;
}
.picker-head div{
  flex-grow: .4;
  line-height: 40px;
  text-align: center;
  color: #333;
}
.picker-head div:nth-child(1){
  text-align: left;
  color: #9f9f9f;
}

.picker-head div:nth-child(3){
  text-align: right;
  color: #6189ea;
}
.picker-wrap{
  position: relative;
  height: 235px;
}
.content{
  display: flex;
  width: 100%;
  height: 100%;
}
.content-item{
  width: 33.33%;
  height: 100%;
  overflow: hidden;
  transition: width .3s;
}
.picker-item{
  position: relative;
  z-index: 10;
  width: 100%;
  top: 92.5px;
}
.item{
  flex-grow: 3;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  color: #707274;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  transform-origin: 50% 50% 0;
  transform: scale(.85);
  transition: .3s;
}
.item.color{
  transform: scale(1);
}
.line{
  position: absolute;
  top: 50%;
  left: 0px;
  margin-top: -25px;
  width: 100%;
  height: 42px;
  border-top: 1px solid #f1f1f1;
  border-bottom: 1px solid #f1f1f1;
}
</style>
