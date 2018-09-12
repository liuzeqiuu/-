<template>
  <div class="linkage">
    <div class="select">
      <el-select
        v-model="sheng"
        @change="choseProvince"
        placeholder="省级地区">
        <el-option
          v-for="item in province"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

    <div class="select">
      <el-select
        v-model="shi"
        @change="choseCity"
        placeholder="市级地区">
        <el-option
          v-for="item in shi1"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

    <div class="select">
      <el-select
        v-model="qu"
        @change="choseBlock"
        placeholder="区级地区">
        <el-option
          v-for="item in qu1"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

  </div>
</template>

<script>
import mapJson from './map.json'
export default {
  data () {
    return {
      mapJson: '../static/json/map.json',
      province: '',
      sheng: '',
      shengName: '',
      shi: '',
      shiName: '',
      shi1: [],
      qu: '',
      quName: '',
      qu1: [],
      city: '',
      block: ''
    }
  },
  props: {
    existAddress: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 加载china地点数据，三级
    getCityData: function () {
      let that = this
      var data = mapJson
      that.province = []
      that.city = []
      that.block = []
      // 省市区数据分类
      for (var item in data) {
        if (item.match(/0000$/)) { // 省
          that.province.push({id: item, value: data[item], children: []})
        } else if (item.match(/00$/)) { // 市
          that.city.push({id: item, value: data[item], children: []})
        } else { // 区
          that.block.push({id: item, value: data[item]})
        }
      }
      // 分类市级
      for (var index in that.province) {
        for (var index1 in that.city) {
          if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
            that.province[index].children.push(that.city[index1])
          }
        }
      }
      // 分类区级
      for (var item1 in that.city) {
        for (var item2 in that.block) {
          if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
            that.city[item1].children.push(that.block[item2])
          }
        }
      }
    },
    // 选省
    choseProvince: function (e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shengName = this.province[index2].value
          this.shi1 = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.qu1 = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.qu1[0].id
        }
      }
      let data
      if (this.shengName === this.shi) {
        data = this.shengName + '-' + this.qu
      } else {
        data = this.shengName + '-' + this.shi + '-' + this.qu
      }
      this.$emit('getAddress', data)
    },
    // 选市
    choseCity: function (e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.shiName = this.city[index3].value
          this.qu1 = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.qu1[0].id
          // console.log(this.E)
          let data
          if (this.shengName === this.shi) {
            data = this.shengName + '-' + this.qu
          } else {
            data = this.shengName + '-' + this.shiName + '-' + this.qu
          }
          this.$emit('getAddress', data)
        }
      }
    },
    // 选区
    choseBlock: function (e) {
      this.E = e
      for (let i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.quName = this.qu1[i].value
        }
      }
      let data
      if (this.shengName === this.shi) {
        data = this.shengName + '-' + this.qu
      } else {
        data = this.shengName + '-' + this.shiName + '-' + this.quName
      }
      this.$emit('getAddress', data)
    }
  },
  // watch: {
  //   existAddress: function (address) {
  //     console.log('改变了', address)
  //     if (address) {
  //       this.getCityData()
  //       let sheng, shi, qu
  //       if (address.split('-').length === 2) {
  //         sheng = address.split('-')[0]
  //         shi = address.split('-')[0]
  //         qu = address.split('-')[1]
  //       } else if (address.split('-').length === 3) {
  //         sheng = address.split('-')[0]
  //         shi = address.split('-')[1]
  //         qu = address.split('-')[2]
  //       }
  //       let selectSheng = this.province.find(item => item.value === sheng)
  //       this.sheng = selectSheng.id
  //       this.shi1 = selectSheng.children
  //       let selectShi = this.shi1.find(item => item.value === shi)
  //       this.shi = selectShi.id
  //       this.qu1 = selectShi.children
  //       this.qu = this.qu1.find(item => item.value === qu).id
  //     } else{
  //       console.log("进来了")
  //     }
  //   }
  // },
  created: function () {
    this.getCityData()
    if (this.existAddress) {
      console.log('打印此时的this.existAddress', this.existAddress)
      let address = this.existAddress
      let sheng, shi, qu
      if (address.split('-').length === 2) {
        sheng = address.split('-')[0]
        shi = address.split('-')[0]
        qu = address.split('-')[1]
      } else if (address.split('-').length === 3) {
        sheng = address.split('-')[0]
        shi = address.split('-')[1]
        qu = address.split('-')[2]
      }
      let selectSheng = this.province.find(item => item.value === sheng)
      this.sheng = selectSheng.id
      this.shi1 = selectSheng.children
      let selectShi = this.shi1.find(item => item.value === shi)
      this.shi = selectShi.id
      this.qu1 = selectShi.children
      this.qu = this.qu1.find(item => item.value === qu).id
    } else if (!this.existAddress) {
      console.log('打印此时的this.existAddress', this.existAddress)
    }
  }
}
</script>

<style scoped>
.select{
  display: inline-block;
  height: 30px;
  width: 96px;
  height: 30px;
}
</style>
<style>
 .linkage .el-input__inner{
   height: 30px;
   line-height: 30px;
   font-family: PingFangSC-Regular;
   font-size: 12px;
 }
 .linkage .el-input__icon{
   line-height: 30px;
 }
</style>
