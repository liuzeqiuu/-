<template>
  <div :class="['loading-box',{'active':show}]">
      <span></span>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style scoped lang="scss">
@mixin keyframes($animation-name) {
    @keyframes #{$animation-name} {
      @content;
    }
  }

  @include keyframes(rotate-loading) {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

.loading-box{
    position: absolute;
    z-index: -2;
    background-color: rgba(255, 255, 255, .8);
    top: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active{
        z-index: 2;
        opacity: 1;
    }
  }

.loading-box>span {
    box-sizing: border-box;
    display: inline-block;
    border: 4px solid transparent;
    width: 40px;
    height: 40px;
    margin: -2px 30px;
    vertical-align: middle;
    background-color: transparent;
    color: transparent;
    cursor: default;
    border-radius: 100%;
    -webkit-animation: rotate-loading 1.5s linear 0s infinite normal;
    animation: rotate-loading 1.5s linear 0s infinite normal;
    border-left-color: rgb(0, 152, 212);
    border-right-color: rgb(0, 152, 212);
}
</style>
