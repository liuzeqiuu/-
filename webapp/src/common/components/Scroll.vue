<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default{
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    /**
       * 点击列表是否派发click事件
       */
    click: {
      type: Boolean,
      default: true
    },
    /**
       * 是否开启横向滚动
       */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
       * 是否派发滚动事件
       */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
       * 列表的数据
       */
    data: {
      type: Array,
      default: null
    },
    /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
    pulldown: {
      type: Boolean,
      default: false
    },
    // 下拉刷新，上拉加载
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    /**
       * 是否派发列表滚动开始的事件
       */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
       * 当数据更新后，刷新scroll的延时。
       */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        pullDownRefresh: this.pullDownRefresh
      })

      // 派发滚动事件
      if (this.listenScroll) {
        let self = this
        this.scroll.on('scroll', (pos) => {
          console.log(pos)
          self.$emit('scroll', pos)
        })
      }

      // 派发滚动到底部事件，上拉加载更多
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
            this.scroll.refresh()
          }
        })
      }

      // 派发顶部下拉事件，下拉刷新页面
      // if (this.pulldown) {
      //   this.scroll.on('touchEnd', (pos) => {
      //     // 下拉
      //     if(pos.y > 30){
      //       this.$emit('pulldown')
      //       this.scroll.refresh()
      //     }
      //   })
      // }

      // 派发顶部下拉刷新页面事件
      if (this.pullDownRefresh) {
        this.scroll.on('pullingDown', () => {
          this.$emit('pulldown')
          this.scroll.finishPullDown()
          this.scroll.refresh()
        })
      }
      // 派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>
