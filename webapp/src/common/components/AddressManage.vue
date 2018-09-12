<template>
  <div class="addressM-box">
    <div class="box-bg" v-show="dialogVisible === true">
      <div class="addressM-inner-box">
        <div class="addressM-line-header">
          <i class="el-icon-close closeBtn" @click="$emit('onClose')"></i>
          <span class="addressM-line-title">地址管理</span>
        </div>
        <div class="addressM-line-body">
          <el-table
            :data="addressForm"
            style="width: 100%"
            max-height="180">
            <el-table-column
              prop="sign"
              label="标签"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提币地址"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                  <span class="del" @click="$emit('del')">删除</span>
              </template>
            </el-table-column>
            <el-table-column
              label="默认"
              align="center"
              >
              <template slot-scope="scope">&nbsp;
                <el-radio v-model="radio" :label="scope.$index" @change.native="getDefault(scope.$index)">&nbsp;</el-radio>
              </template>
            </el-table-column>
          </el-table>
          <button class="addBtn" @click="$emit('addressAdd')">添加地址</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  props: ['addressForm', 'dialogVisible'],
  data () {
    return {
      radio: 0
    }
  },
  methods: {
    getDefault (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">
.addressM-box{
  position: absolute;
  z-index: 200;
  display: inline-block;

.box-bg{
  z-index: 105;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.7);
  display:flex;
  align-items: center;
  justify-content: center;
}
.outBtn{
  cursor: pointer;
}
.addressM-inner-box{
  position: relative;
  z-index: 106;
  width: 700px;
  height: 388px;
  border-radius: 10px;
  background-color: #fff;
}
.addressM-line-header{
  width: 100%;
  height: 60px;
  line-height:60px;
  text-align: center;
  border-radius: 10px;
  border-bottom: 1px solid rgba(230,230,230,1);
}
.addressM-line-header span{
  position: absolute;
  font-size:20px;
  font-weight: 600;
  font-family:SourceHanSansCN-Regular;
  color:rgba(0,0,0,1);
}
.addressM-line-header .closeBtn{
  padding-right: 20px;
  float: right;
  font-size: 25px;
  line-height: 60px;
  color:rgba(192,192,192,1);
}
.addressM-line-header .closeBtn:before{
  cursor: pointer;
}
.addressM-line-body{
  height: 190px;
  padding: 40px;
  .el-table__row td{
    padding: 8px 0;
  }
}
.addBtn{
  display: block;
  width: 550px;
  height: 34px;
  margin: 38px auto 0;
  border: 1px solid #00BCD4;
  border-radius: 4px;
  cursor: pointer;
  background-color: #00BCD4;
  color: #fff;
  font-size: 14px;
}
.del{
  color: #04C3E0;
  cursor: pointer;
}
.has-gutter tr th{
  padding: 5px 0;
  background: #E6E6E6;
  color: #000;
  font-size: 14px;
  .cell{
    font-weight: 600;
  }
}
}
</style>
