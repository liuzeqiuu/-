<template>
  <div class="address">
    <div class="chooseAddress">
      <div class="header">
        <span>选择地址</span>
      </div>
      <div class="selected-address">
        <span v-show="selectedProvinceName">{{selectedProvinceName}}</span>
        <span v-show="selectedCityName">{{selectedCityName}}</span>
        <span v-show="selectedCountyName">{{selectedCountyName}}</span>
      </div>
      <div class="box">
        <div class="addres-level province">
          <p v-for="(item,index) in province"
            @click="getCity(item,index)"
            :key="index"
            :class="{'activeColor': index === provinceIndex}">{{item.value}}</p>
        </div>
        <div class="addres-level city">
          <p v-for="(item,index) in showCity"
            @click="getCounty(item,index)"
            :key="index"
            :class="{'activeColor': index === cityIndex}">{{item.value}}</p>
        </div>
        <div class="addres-level county" >
          <p v-for="(item,index) in showCounty"
            @click="enSureAddress(item,index)"
            :key="index"
            :class="{'activeColor': index === countyIndex}">{{item.value}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapJson from './map.json'
export default {
  data () {
    return {
      provinceIndex: -1, // 省份index,用于绑定样式
      cityIndex: -1, // 市级
      countyIndex: -1, // 县级
      address: [], // 全部地址字段, 用于接收请求得到的地址
      province: [], // 省份名称
      city: [], // 城市名称, 用于渲染市级栏
      showCity: [],
      county: [], // 县级
      showCounty: [],
      finalAddress: { // 选中后的地址
        province: '',
        city: '',
        county: ''
      }
    }
  },
  created () {
    this.getAddressData()
  },
  mounted () {

  },
  computed: {
    selectedProvinceName () {
      const {province, provinceIndex} = this
      if (!province.length) return ''
      if (!provinceIndex) return ''
      if (!province[provinceIndex]) return ''
      return province[provinceIndex].value
    },
    selectedCityName () {
      const {city, cityIndex} = this
      if (!city.length) return ''
      if (!cityIndex) return ''
      if (!city[cityIndex]) return ''
      return city[cityIndex].value
    },
    selectedCountyName () {
      const {county, countyIndex} = this
      if (!county.length) return ''
      if (!countyIndex) return ''
      if (!county[countyIndex]) return ''
      return county[countyIndex].value
    }
  },
  methods: {
    getAddressData () {
      var data = mapJson
      // 省市区数据分类
      for (var item in data) {
        if (item.match(/0000$/)) { // 省
          this.province.push({id: item, value: data[item], children: []})
        } else if (item.match(/00$/)) { // 市
          this.city.push({id: item, value: data[item], children: []})
        } else { // 区
          this.county.push({id: item, value: data[item]})
        }
      }
      // 分类市级
      for (var index in this.province) {
        for (var index1 in this.city) {
          if (this.province[index].id.slice(0, 2) === this.city[index1].id.slice(0, 2)) {
            this.province[index].children.push(this.city[index1])
          }
        }
      }
      // 分类区级
      for (var item1 in this.city) {
        for (var item2 in this.county) {
          if (this.county[item2].id.slice(0, 4) === this.city[item1].id.slice(0, 4)) {
            this.city[item1].children.push(this.county[item2])
          }
        }
      }
    },
    getCity (province, index) {
      this.showCity = province.children
      this.finalAddress.province = province.value
      this.provinceIndex = index
      this.showCounty = []
      this.cityIndex = -1
      this.countyIndex = -1
    },
    getCounty (city, index) {
      this.showCounty = city.children
      this.finalAddress.city = city.value
      this.cityIndex = index
      this.countyIndex = -1
    },
    enSureAddress (county, index) {
      this.finalAddress.county = county.value
      this.countyIndex = index
      this.$emit('change', this.finalAddress)
    }
  }
}
</script>

<style scoped lang="scss">
.address{
  .chooseAddress{
    height: 65.82vw;
    background: #fff;
    font-family:PingFangSC-Regular;
    font-size: 3.47vw;
    color: #5F606A;
    .header{
      border-bottom: 1px solid #EBEBEB;
      height: 10.68vw;
      line-height: 10.68vw;
      text-align: center;
    }
    .box{
      height: 90%;
      //white-space:nowrap;
      //overflow-x: auto;
      display: flex;
    }
    .addres-level{
      /*display: inline-block;
      margin-bottom: 1vw;
      padding: 1vw 0px;
      overflow-y: auto;
      height: 90%;
      line-height: 6.67vw;*/
      padding: 1vw 4px;
      overflow-y: auto;
      height: 90%;
      line-height: 6.67vw;
      flex: 1 0 33%;
    }
    .province{
      margin-left: 4vw;
      min-width: 38.6vw;
    }
    .city{
      margin-left: 1vw;
      min-width: 31.8vw;
    }
    .county{
      margin-left:1vw;
      min-width: 17.6vw;
    }
    .addres-level::-webkit-scrollbar {
      width: 0px;
    }
    .addres-level::-webkit-scrollbar {
        display: none;
    }
    .activeColor{
      color: #59BFC6;
    }
  }
}
</style>
