<template>
  <div>
      <h1>404</h1>
      <h2>
        <router-link to="/">back home</router-link>
      </h2>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1{
    font-size: 48px;
    text-align: center;
}
h2{
    text-align: center;
}
</style>
