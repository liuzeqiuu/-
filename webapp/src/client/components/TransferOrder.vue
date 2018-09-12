<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :class="dialogClassName"
        center>
        转让Token

        <div slot="footer" class="dialog-footer">
            <div class="button" @click="dialogVisible = false">
                <span class="button-cancel">取消</span>
            </div>
            <div class="button-line"></div>
            <div class="button">
                <router-link to="/login">去登录</router-link>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default{
  name: 'TransferOrder',
  props: {
    dialogVisible: Boolean,
    dialogClassName: String
  },
  data () {
    return {

    }
  },
  mounted () {
    // mobile dialogClassName = m-dialog
    // dialogClassName = pc-dialog
    // header titlie close
    // body p h4 clon
    // body input lable
    // footer button
  }
}
</script>
<style lang="scss" scoped>

</style>
