<template>
  <div class="UserOrderList">
    <div class="orderInfo">
      <span class="orderInfo-title">订单信息</span>
      <div class="orderInfo-header">
        <span class="orderInfo-header-info">订单信息</span>
        <span class="orderInfo-header-receiver">收货人</span>
        <span class="orderInfo-header-money">金额</span>
        <div class="orderInfo-header-status" @mouseover="handleSelectMouseOver">
          <el-select ref="statusSelector" automatic-dropdown v-model="postOrderdata.orderState" placeholder="选择状态" @change="searchOrderData">
            <el-option
              v-for="item in statusOptions"
              :key="item.orderState"
              :label="item.stateName"
              :value="item.orderState">
            </el-option>
          </el-select>
        </div>
        <span class="orderInfo-header-operate">操作</span>
      </div>
      <div class="rel placeholder" v-if="loadingData">
        <Loading></Loading>
      </div>
      <div class="rel placeholder flex-center f20" v-if="!loadingData && orderDatas.length===0">
        {{listDataMsg}}
      </div>
      <div class="orderInfo-detail" v-for="(item,index) in orderDatas" :key="index">
        <div class="orderInfo-detail-top">
          <span class="orderInfo-detail-top-num">订单日期：{{item.orderCreateTime}}</span>
          <span class="orderInfo-detail-top-time">订单号: {{item.orderId}}</span>
        </div>
        <div class="orderInfo-detail-content">
          <div class="orderInfo-detail-content-img">
            <img-box :imgPath='item.fileUrl' width='103' height='93' standard='scaleToBox'></img-box>
          </div>
          <div class="orderInfo-detail-content-price">
            <div class="orderInfo-detail-content-priceTitle" :title="item.productName">{{item.productName}}</div>
            <div class="orderInfo-detail-content-priceMoney">价格：{{item.productPrice}}<span class="UserOrderList-unit">{{item.tokenName}}</span></div>
            <div class="orderInfo-detail-content-priceMoney">定金：{{item.amountPrepaid}}<span class="UserOrderList-unit">{{item.tokenName}}</span></div>
            <span class="orderInfo-detail-content-priceNum">X{{item.productSum}}</span>
          </div>
          <div class="orderInfo-detail-content-receiver">
            <div class="orderInfo-detail-content-receiverStatus">
              <span>{{item.statusName}}</span>
            </div>
            <div>
              <span class="orderInfo-detail-content-receiverName">{{item.harvestName}}</span>
              <span>{{item.phone}}</span>
              <div class="orderInfo-detail-content-receiverAdress">
                <span>{{item.address}}{{item.addressDetails}}</span>
              </div>
            </div>
          </div>
          <div class="orderInfo-detail-content-money">
            <div class="orderInfo-detail-content-moneyAll">总额：{{item.totalAmount}} {{item.tokenName}}</div>
            <div>
              <span class="label" v-if="item.orderState === 1 || item.orderState === 2 || item.orderState === 3 || item.orderState === 7 ">应付尾款：{{item.tailMoney}} {{item.tokenName}}</span>
              <span class="label" v-if="item.orderState === 4 || item.orderState === 5 || item.orderState === 6 ">已付尾款：{{item.tailMoney}} {{item.tokenName}}</span>
            </div>
          </div>
          <div class="orderInfo-detail-content-status">
            {{item.stateName}}
          </div>
          <div class="orderInfo-detail-content-operate">
            <el-button
              @click="confirmReceipt(item)"
              v-if="item.orderState === 4 || item.orderState === 5 || item.orderState === 6"
              :class="{'orderInfo-detail-content-operateBtn': true, 'operateBtn-active': item.orderState === 4 || item.orderState === 6 }"
              :disabled="item.orderState === 4 || item.orderState === 6">
              确定收货
            </el-button>
            <el-button
              @click="deliveryApplication(item)"
              v-if="item.orderState === 1 || item.orderState === 7 || item.orderState === 2 || item.orderState === 3"
              :class="{'orderInfo-detail-content-operateBtn': true, 'operateBtn-active': item.orderState === 1 || item.orderState === 2 || item.orderState === 3}"
              :disabled="item.orderState === 1 || item.orderState === 2 || item.orderState === 3">
              申请提货
            </el-button>
            <div class="orderInfo-detail-content-operateCenter">
              <p @click="turnToOrderDetail(item)">订单详情</p>
              <p v-if = "item.orderState === 1 || item.orderState === 7" @click="openTransferToken(item)">转让Token</p>
            </div>
            <div @click="isUnfoldDetail(index)">
              <div class="orderInfo-detail-content-operateDetail">
                <span>查看详情</span>
                <i class="iconfont icon-open" v-if="detailSeenIndex['index'+index] !== true"></i>
                <i class="iconfont icon-arrowup" v-if="detailSeenIndex['index'+index] === true"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="orderInfo-bottom" v-if="detailSeenIndex['index'+index] === true">
          <div class="orderInfo-bottom-stepOne">
            <span>阶段一：付定金</span>
            <span class="orderInfo-bottom-stepMoney">{{item.amountPrepaid}} {{item.tokenName}}</span>
            <span class="orderInfo-bottom-stepStatus">已完成</span>
          </div>
          <div class="orderInfo-bottom-stepTwo">
            <span>阶段二：申请提货 定金支付后不退还, 请在指定时间内申请提货</span>
            <span class="orderInfo-bottom-stepMoney">{{item.tailMoney}} {{item.tokenName}}</span>
            <span class="orderInfo-bottom-stepStatus">
              <span v-if="item.orderState === 1">未开始</span>
              <span v-if="item.orderState === 7">提货中</span>
              <span v-if="item.orderState === 4 || item.orderState === 5 || item.orderState === 6">已完成</span>
              <span v-if="item.orderState === 3">订单取消</span>
              <span v-if="item.orderState === 2">订单过期</span>
            </span>
          </div>
          <div class="orderInfo-bottom-time">
            申请提货时间 {{item.carrygoodStartTime}}至 {{item.carrygoodsEndTime}}
          </div>
        </div>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-sizes="[2,5,10,20]"
        :page-size="10"
        :disabled="loadingData"
        layout="prev, pager, next, jumper, sizes"
        :total="totalAmount">
      </el-pagination>
    </div>

    <!--转让弹窗-->
    <div class="turn-dialog">
      <el-dialog
        :visible.sync="turnDialogVisible">
        <p class="title">转让<span class="title-tips">仅限转让给本平台注册用户</span></p>
        <p class="name">产品名称：<span class="name-right">{{transferTokenDialog.productName}}</span></p>
        <p class="account">转让数量：<span class="account-right">{{transferTokenDialog.amountPrepaid}} {{dialogTokenName}}</span></p>
        <p class="address">转出地址：<input type="text" placeholder="请输入转出Token地址" v-model = "transferTokenDialog.userUuid"/></p>
        <div class="tips">
          <span>转出Token地址：可在转入方（个人中心-账户资产）中查询</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="cancel" @click="cancelTransfer">取消</el-button>
          <el-button class="submit" @click="makeSureTransfer">确定</el-button>
        </span>
      </el-dialog>
    </div>

    <!--申请提货弹框-->
    <div class="delivery-dialog">
      <el-dialog
        :visible.sync="deliveryVisible"
        @close="closeDeliveryApplication">
        <div v-if="deliveryVisibleContent">
          <p class="title">申请提货</p>
          <div>
            <span class="label">收货地址：</span>
            <div class="select">
              <el-select v-model="postMakeSureDelivery.addressId" placeholder="请选择">
                <el-option
                  v-loading="loadingReceiveAddress"
                  v-for="item in receiveAddress"
                  :key="item.addressId"
                  :label="item.address"
                  :value="item.addressId">
                </el-option>
              </el-select>
            </div>
          </div>
          <div>
            <span class="label"></span>
            <span class="addAddress" @click="openReceivingAddress">+ 添加收货地址</span>
          </div>
          <div><span class="label">应付定金：</span><span>{{postMakeSureDelivery.tailMoney}} {{dialogTokenName}}</span></div>
          <div>
            <span class="label">付款方式：</span>
            <div class="input">
              <el-input
                v-loading="loadingPrice"
                placeholder="请输入内容"
                v-model="postMakeSureDelivery.currencyValue"
                :disabled="true">
              </el-input>
              <div class="delivery-dialog-select">
                <el-select v-model="postdataCurrency.currencyId"
                  @change="getselectTailMoney">
                  <el-option
                    v-for="item in currency"
                    :key="item.currencyId"
                    :label="item.currencyType"
                    :value="item.currencyId">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <el-button class="cancel" @click="closeDeliveryApplication">取消</el-button>
          <el-button class="submit" @click="makeSureDelivery" :loading="confirmDeliveryWaiting">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--添加收货地址-->
    <div class="addAddress-dialog">
      <el-dialog
        :visible.sync="addAddressVisible"
        @close="closeAddAddress">
        <p class="title">添加收货地址</p>
        <p class="tips">请准确填写收货地址, 众筹结束后不可变更</p>
        <el-form :model="addReceiverAddress" :rules="rules" :inline="true"  ref="addReceiverAddress">
          <el-form-item label="收货人：" prop="harvestName">
            <div class="input">
              <el-input v-model="addReceiverAddress.harvestName"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="收货地区：" prop="address" class="addressProof">
            <linkage v-if="addAddressVisible" @getAddress="getLinkageAddress"></linkage>
          </el-form-item>
          <el-form-item label="详细地址：" prop="addressDetails">
            <div class="input">
              <el-input v-model="addReceiverAddress.addressDetails"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <div class="input">
              <el-input v-model="addReceiverAddress.phone"></el-input>
            </div>
          </el-form-item>
        </el-form>
        <el-button class="cancel left" @click="closeAddAddress">取消</el-button>
        <el-button @click="comfirmAddAddress()" class="submit">确定</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import linkage from '../../components/linkage.vue'
import LoadingComponent from '@/common/components/LoadingComponent.vue'
import ImgBox from '@/common/components/ImgBox.vue'
import { NO_DATA, SERVICE_ERR_MSG } from '@/client/constants/webapp.js'

const makeAddressDesc = (area, address) => {
  if (area.split('-').length === 2) {
    return area.split('-')[0] + area.split('-')[1] + address
  } else if (area.split('-').length === 3) {
    return area.split('-')[0] + area.split('-')[1] + area.split('-')[2] + address
  }
}

export default {
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('收货人姓名不能为空'))
      } else {
        const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,10}|[a-zA-Z]{4,20}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入2-10汉字或者4-20英文'))
        }
      }
    }
    return {
      loadingPrice: false,
      itemData: '',
      confirmDeliveryWaiting: false,
      postdataCurrency: {
        id: '',
        currencyId: ''
      },
      currency: [],
      listDataMsg: NO_DATA,
      loadingData: true,
      detailSeen: false,
      orderResponseData: '',
      turnDialogVisible: false,
      deliveryVisible: false,
      addAddressVisible: false,
      currentPage3: NaN,
      totalAmount: 1,
      detailSeenIndex: {},
      deliveryVisibleContent: true,
      postMakeSureDelivery: { // 确定申请提货
        id: '', // 订单编号
        addressId: '', // 收货地址的id
        currencyValue: '', // 付款方式的
        tailMoney: '', // 应付尾款
        currencyId: ''
      },
      postOrderdata: { // 查询订单列表
        orderState: '',
        rowNum: 10,
        page: 1
      },
      dialogTokenName: '',
      transferTokenDialog: { // 转让弹窗信息
        id: '',
        userUuid: '', // 转出地址
        amountPrepaid: '',
        productName: ''
      },
      // 添加收货地址接口
      addReceiverAddress: {
        harvestName: '',
        address: '',
        addressDetails: '',
        phone: '',
        userId: ''
      },
      input1: '',
      value: '',
      ruleForm: {
        name: '',
        address: '',
        addressDetail: '',
        phoneNumber: ''
      },
      rules: {
        harvestName: [
          {required: true, message: '收货人姓名不能为空', trigger: 'blur'},
          {validator: checkName, trigger: 'change'},
          {validator: checkName, trigger: 'blur'}
        ],
        address: [
          {required: true, message: '收货地区不能为空', trigger: 'blur'}
        ],
        addressDetails: [
          {required: true, message: '详细地址不能为空', trigger: 'blur'},
          {required: true, message: '详细地址不能为空', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入正确的手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'change'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      options: [
        {value: 1, label: 2}
      ],
      // 申请提货 => 收货地址
      receiveAddress: [],
      loadingReceiveAddress: false,
      // 申请提货弹框信息
      applyDeliveryInfo: {
        amountPrepaid: '',
        tokenName: '',
        currencyValue: ''
      },
      statusOptions: [ ],
      orderDatas: []
    }
  },
  components: {
    linkage,
    'Loading': LoadingComponent,
    ImgBox
  },
  mounted () {
    this.getOrderStatus()
    this.getOrderLists()
    this.selectAllCurrencyType()
  },
  methods: {
    handleSelectMouseOver () {
      // 手动触发选择器 展示下拉菜单
      this.$refs.statusSelector.handleFocus(new Event('focus', {'bubbles': true}))
    },
    // 获取订单状态配置项
    getOrderStatus () {
      this.myFetch({
        apiName: 'queryAllOrderState',
        postdata: {},
        success: (res) => {
          this.statusOptions = res
          this.statusOptions.unshift({orderState: '', stateName: '全部'})
        }
      })
    },
    // 获取订单列表              (已写好的参考例子)
    getOrderLists () {
      this.loadingData = true
      this.orderDatas = []
      this.postOrderdata.userId = this.$store.state.User.userId
      this.myFetch({
        apiName: 'UserOrderList',
        postdata: this.postOrderdata,
        success: ({ rows, total }) => {
          this.orderDatas = rows
          this.totalAmount = total
          this.listDataMsg = NO_DATA
        },
        complete: () => {
          this.loadingData = false
        },
        failed: (res) => {
          if (/Server Error/.test(res)) {
            this.listDataMsg = SERVICE_ERR_MSG
          }
        }
      })
    },
    // 点击查看详情下拉框 功能
    isUnfoldDetail (index) {
      if (!this.detailSeenIndex['index' + index]) {
        this.$set(this.detailSeenIndex, ('index' + index), true)
      } else if (this.detailSeenIndex['index' + index]) {
        if (this.detailSeenIndex['index' + index] === true) {
          this.detailSeenIndex['index' + index] = false
        } else if (this.detailSeenIndex['a' + index] === false) {
          this.detailSeenIndex['index' + index] = true
        }
      }
    },
    // 打开转让 token 弹窗
    openTransferToken (data) {
      this.transferTokenDialog = {
        id: data.id,
        userUuid: '',
        amountPrepaid: data.amountPrepaid,
        productName: data.productName
      }
      this.dialogTokenName = data.tokenName
      this.turnDialogVisible = true
    },
    // 确认转出token                    (补充转让失败的提示弹窗)
    makeSureTransfer () {
      let {id, userUuid, amountPrepaid} = this.transferTokenDialog
      this.myFetch({
        apiName: 'applyForPicUpGoods',
        postdata: {id, userUuid, amountPrepaid},
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '转出成功',
            type: 'success'
          })
          this.turnDialogVisible = false
          this.getOrderLists()
        }
      })
    },
    // 关闭 转出token 弹窗
    cancelTransfer () {
      this.turnDialogVisible = false
      this.transferTokenDialog = {}
    },

    // 获取申请提货  收货地址
    getReceivingAddress (userId, addressDesc) {
      this.loadingReceiveAddress = true
      this.myFetch({
        apiName: 'selectReceivingAddress',
        postdata: {
          userId: userId
        },
        success: (addressList = []) => {
          // create_time
          let addressOptions = addressList.map(item => {
            const { address, addressDetails, addressId } = item
            return { address: makeAddressDesc(address, addressDetails), addressId }
          })

          let defaultAddress = addressList.find(item => item.isdefault === 0)
          if (defaultAddress) { // 如果默认地址存在
            this.postMakeSureDelivery.addressId = defaultAddress.addressId
          }

          if (addressDesc) {
            this.postMakeSureDelivery.addressId = addressOptions.find(item => item.address === addressDesc).addressId
          }

          this.receiveAddress = addressOptions
          this.deliveryVisible = true
        },
        complete: () => {
          this.loadingReceiveAddress = false
        }
      })
    },
    // 获取币种
    selectAllCurrencyType () {
      this.myFetch({
        apiName: 'selectAllCurrencyType',
        postdata: {},
        success: (res) => {
          this.currency = res
        }
      })
    },
    // 获取申请提货的  应付值
    getselectTailMoney () {
      // 查询对应币种的订单应付
      this.loadingPrice = true
      console.log('打印一下应付值需要的参数', this.postdataCurrency)
      this.myFetch({
        apiName: 'selectTailMoney',
        postdata: this.postdataCurrency,
        success: (currencyValue) => {
          this.postMakeSureDelivery.currencyValue = currencyValue
          this.postMakeSureDelivery.currencyId = this.postdataCurrency.currencyId
          this.loadingPrice = false
        }
      })
    },
    // 打开 申请提货                             //考虑到获取数据失败的时候 => (获取失败时直接不弹出弹框, 并且提示)  &&  获取到的地址为空的时候
    deliveryApplication (order) {
      this.itemData = order

      this.postdataCurrency.id = order.id
      this.postdataCurrency.currencyId = this.currency[0].currencyId
      this.getselectTailMoney()

      this.dialogTokenName = order.tokenName

      this.postMakeSureDelivery.id = order.id
      this.postMakeSureDelivery.tailMoney = order.tailMoney

      this.addReceiverAddress.userId = order.userId

      this.getReceivingAddress(order.userId)
      this.deliveryVisible = true
    },
    // 点击 确定申请提货
    makeSureDelivery () {
      this.confirmDeliveryWaiting = true
      this.myFetch({
        apiName: 'applyfordelivery',
        postdata: this.postMakeSureDelivery,
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '成功申请提货',
            type: 'success'
          })
          this.deliveryVisible = false
          this.turnToOrderDetail(this.itemData)
        },
        complete: () => {
          this.confirmDeliveryWaiting = false
        }
      })
    },
    // 关闭申请提货弹框
    closeDeliveryApplication () {
      this.deliveryVisible = false
      this.postMakeSureDelivery = {}
      this.receiveAddress = []
      this.postdataCurrency.currencyId = ''
    },
    // 打开添加收货地址  弹框
    openReceivingAddress () {
      // this.deliveryVisibleContent = false
      this.addAddressVisible = true
    },
    // 地级选择器子组件传来的数据
    getLinkageAddress (data) {
      this.addReceiverAddress.address = data
    },
    // 点击确定 添加地址    (地址添加失败,提示弹框)
    comfirmAddAddress () {
      this.$refs['addReceiverAddress'].validate((valid) => {
        if (valid) {
          let userId = this.addReceiverAddress.userId
          this.myFetch({
            apiName: 'insertReceivingAddress',
            postdata: this.addReceiverAddress,
            success: (res) => {
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
              this.addAddressVisible = false
              // this.deliveryVisibleContent = true
              this.getReceivingAddress(userId, makeAddressDesc(this.addReceiverAddress.address, this.addReceiverAddress.addressDetails))
            }
          })
        } else {
          return false
        }
      })
    },
    // 关闭 添加地址 弹框
    closeAddAddress () {
      this.addAddressVisible = false
      this.deliveryVisibleContent = true
      this.$refs['addReceiverAddress'].resetFields()
    },
    // 确认收货
    confirmReceipt (data) {
      this.myFetch({
        apiName: 'updateStateByOrderCode',
        postdata: {
          id: data.id,
          userId: data.userId,
          tailMoney: data.tailMoney,
          amountPrepaid: data.amountPrepaid
        },
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '收货成功',
            type: 'success'
          })
          this.getOrderLists()
        }
      })
    },

    // 点击跳转  订单详情
    turnToOrderDetail (item) {
      let {id, orderState, logisticsCode, logisticsAbbreviation} = item
      if (orderState === 1) {
        this.$router.push({path: `/user/order/${id}`, query: {state: 0}})
      } else if (orderState !== 1 && logisticsCode && logisticsAbbreviation) {
        this.$router.push({path: `/user/order/${id}`, query: {code: logisticsCode, abbreviation: logisticsAbbreviation, state: 1}})
      } else {
        this.$router.push({path: `/user/order/${id}`, query: {state: 1}})
      }
    },
    searchOrderData () {
      this.postOrderdata.page = 1
      this.getOrderLists()
    },
    handleSizeChange (val) {
      this.postOrderdata.rowNum = val
      this.getOrderLists()
    },
    handleCurrentChange (val) {
      this.postOrderdata.page = val
      this.getOrderLists()
    }
  }
}
</script>

<style scoped lang="scss">
.placeholder{
  height: 235px;
  background-color: $client_bg_white;
}
.UserOrderList{
  box-sizing: border-box;
  min-height: calc( 100vh - 294px);
  background: $client_bg_light_grey;
  overflow: auto;
  padding-bottom: 109px;
  .UserOrderList-unit{
    display: inline-block;
    margin-left: 7px;
    font-size: 14px;
    font-family: $PF_Regular;
    color: $font_deeper_grey;
  }
  .orderInfo{
    width: 1200px;
    margin: auto;
    overflow: hidden;
  }
  .orderInfo-title{
    display: inline-block;
    margin: 24px 0px;
    font-size: 16px;
    font-family: $PF_Regular;
    font-weight: $YH_big;
    color: $font_deep_black;
  }
  .orderInfo-header{
    height: 48px;
    line-height: 48px;
    background: $client_bg_white;
    font-size: 14px;
    font-family: $SHSC_Regular;
    color: $font_deep_black;
    border: 1px solid $client_border_Lightgrey;
  }
  .orderInfo-header-info{
    margin: 0px 350px 0px 34px;
  }
  .orderInfo-header-receiver{
    margin-right: 280px;
  }
  .orderInfo-header-money{
    margin-right: 111px;
  }
  .orderInfo-header-status{
    display: inline-block;
    width: 126px;
    text-align: center;
  }
  .orderInfo-header-operate{
    margin: 0px 36px 0px 110px;
  }
  .orderInfo-detail{
    margin-top: 12px;
    min-height: 235px;
    border: 1px solid $client_border_Lightgrey;
    background: $font_light_white;
  }
  .orderInfo-detail-top{
    font-size: 12px;
    font-family: $PF_Regular;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid $client_border_Lightgrey;
  }
  .orderInfo-detail-top-num{
    margin-left: 15px;
  }
  .orderInfo-detail-top-time{
    margin-left: 31px;
  }
  .orderInfo-detail-content{
    height: 183px;
  }
  .orderInfo-detail-content-img{
    box-sizing: border-box;
    float: left;
    margin: 23px 0px 0px 15px;
    padding: 10px;
    width: 125px;
    height: 115px;
    border: 1px solid $client_border_Lightgrey;
  }
  .orderInfo-detail-content-price{
    position: relative;
    box-sizing: border-box;
    float: left;
    margin: 23px 0px 0px 28px;
    padding: 9px 0px;
    text-align: left;
    width: 217px;
    height: 115px;
  }
  .orderInfo-detail-content-priceNum{
    position: absolute;
    top: 2px;
    right: -37px;
  }
  .orderInfo-detail-content-priceTitle{
    display: -webkit-box; // 用来限制在一个块元素显示的文本的行数
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 217px;
    height: 41px;
    font-family: $PF_Regular;
    font-weight: $YH_bold;
    font-size: 16px;
    color: $font_deep_black;
  }
  .orderInfo-detail-content-priceMoney{
    margin: 9px 0px;
    font-size: 14px;
    color: $font_deeper_grey;
  }
  .orderInfo-detail-content-receiver{
    float: left;
    box-sizing: border-box;
    margin: 23px 0px 0px 35px;
    width: 240px;
    height: 115px;
    font-size: 14px;
    color: $font_deep_black;
    font-family: $PF_Regular;
  }
  .orderInfo-detail-content-receiverStatus{
    margin: 0px 0px 30px 18px;
    width: 80px;
    height: 26.5px;
    line-height: 25px;
    text-align: center;
    border: 1px solid $font_deep_red;
    color: $font_deep_red;
    border-radius: 4px;
    font-family: $PF_Light;
    font-size: 12px;
  }
  .orderInfo-detail-content-receiverName{
    margin-right: 20px;
  }
  .orderInfo-detail-content-receiverAdress{
    margin-top: 19px;
    margin-bottom: 9px;
  }
  .orderInfo-detail-content-money{
    float: left;
    margin: 80px 0px 0px 76px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    width: 180px;
    .label{
      margin-left: -28px;
    }
  }
  .orderInfo-detail-content-moneyAll{
    margin-bottom: 19px;
  }
  .orderInfo-detail-content-status{
    float:left;
    margin: 90px 0px 0px 27px;
    font-family: $PF_Light;
    font-size: 14px;
    color: $font_deep_red;
  }
  .orderInfo-detail-content-operate{
    position: relative;
    float: right;
    margin-top: 18px;
    margin-right: 34px;
    width: 92px;
    height:150px;
    text-align: center;
  }
  .orderInfo-detail-content-operateCenter{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 18px;
    height: 50%;
    text-align: left;
  }
  .orderInfo-detail-content-operateCenter p{
    margin-left: 17px;
    font-family: $PF_Regular;
    width:100%;
    font-size: 14px;
    line-height: 0px;
    font-weight: $YH_big;
    color: $font_deep_blue;
  }
  .orderInfo-detail-content-operateCenter p:hover{
    cursor: pointer;
  }
  .orderInfo-detail-content-operateBtn{
    width: 92px;
    height: 30px;
    line-height: 30px;
    background: $client_primary_color;
    border-radius: 4px;
    color: $font_light_white;
    font-family: $PF_Regular;
    font-size: 12px;
  }
  .operateBtn-active{
    background: $client_tab_content_end;
  }
  .orderInfo-detail-content-operateDetail{
    position: absolute;
    left: 0px;
    bottom: 0px;
    right: 0px;
    font-size: 14px;
    font-family: $SHSC_Regular;
    cursor: pointer;
  }
  .orderInfo-detail-content-operate .iconfont{
    position: absolute;
    top: 1px;
    right: -5px;
    cursor: pointer;
  }
  .orderInfo-bottom{
    position: relative;
    bottom: 0px;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 1;
    padding: 22px 20px 27px 16px;
    border-top: 1px solid #fff;
    animation: down 0.6s;
    -webkit-animation: down 0.6s;
    animation-fill-mode: forwards;
  }
  @keyframes down {
    from {
        height: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        border-top-color: #fff
      }
    to {
        height: 120px;
        padding-top: 22px;
        padding-bottom: 27px;
        border-top-color: $client_border_Lightgrey
      }
  }
  .orderInfo-bottom-stepOne{
    width: 90%;
    position:absolute;
    left: 16px;
    bottom: 70px;
    font-family: $PF_Regular;
    font-size: 14px;
    color: $font_deep_black;
  }
   .orderInfo-bottom-stepTwo{
    width: 90%;
    position:absolute;
    bottom: 25px;
    left: 16px;
    font-family: $PF_Regular;
    font-size: 14px;
    color: $font_deep_black;
  }
  .orderInfo-bottom-stepMoney{
    position: absolute;
    left: 719px;
  }
  .orderInfo-bottom-stepStatus{
    position: absolute;
    left: 930px;
  }
  .orderInfo-bottom-time{
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 82px;
    min-height: 52px;
    text-align: center;
    font-family: $PF_Regular;
    font-size: 12px;
    color: $font_deep_black;
    line-height: 20px;
  }
}
</style>
<style lang="scss">
.UserOrderList .orderInfo-header .el-input__inner{
  border: 1px solid #fff;
  color: $font_deep_black;
}
.UserOrderList .el-select input::-webkit-input-placeholder { /* WebKit browsers */
  color: $font_deep_black;
}
.UserOrderList .el-select input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: $font_deep_black;
}
.UserOrderList .el-select input::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: $font_deep_black;
}
.UserOrderList .el-select input:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: $font_deep_black;
}
.UserOrderList .el-select-dropdown__item{
  color: $font_deep_black;
}
.UserOrderList .el-select .el-input .el-select__caret{
  color: $font_deep_black;
}
.UserOrderList .el-button{
  padding: 0px;
}
.UserOrderList .turn-dialog .el-dialog{
  width: 506px;
  .title{
    margin-bottom: 45px;
    font-family: $PF_Light;
    font-size:16px;
    font-weight: $YH_big;
    color: $font_deep_black;
  }
  .title-tips{
    display: inline-block;
    margin-left: 13px;
    font-family: $PF_Light;
    font-size: 14px;
    color: $font_light_grey;
  }
  .name{
    margin-bottom: 33px;
    font-family: $PF_Light;
    font-size: 14px;
    font-weight: $YH_bold;
    color: $font_deep_black;
  }
  .name-right,.account-right{
    margin-left: 10px;
    font-family: $PF_Light;
    font-size: 14px;
    font-weight: $YH_bold;
    color: $font_deep_black;
  }
  .account{
    margin-bottom: 19px;
    font-family: $PF_Light;
    font-size: 14px;
    font-weight: $YH_bold;
    color: $font_deep_black;
  }
  .address{
    font-family: $PF_Light;
    font-size: 14px;
    font-weight: $YH_bold;
    color: $font_deep_black;
    input{
      margin-left: 10px;
      width: 316px;
      height: 30px;
    }
  }
  .tips{
    margin-top: 14px;
    margin-left: 79px;
    width: 300px;
    height: 39px;
  }
}
.UserOrderList .el-dialog{
  .cancel{
    padding: 0px 20px;
    width: 193px;
    height: 35px;
  }
  .submit{
    padding: 0px 20px;
    color: $font_light_white;
    background: $client_primary_color;
    width: 193px;
    height: 35px;
  }
}
.UserOrderList  .el-dialog__header{
  padding: 0px;
}
.UserOrderList .turn-dialog .el-dialog__body{
  padding: 34px 0px 0px 56px;
}
.UserOrderList .turn-dialog .el-dialog__footer{
  text-align: center;
  padding: 29px 0px 47px 0px;
}
.UserOrderList .delivery-dialog .el-dialog{
  width: 488px;
  padding-bottom: 40px;
  .el-dialog__body{
    padding: 32px 0px 0px 44px;
  }
  .delivery-loadding{
    width: 100%;
    height: 235px;
  }
  .title{
    margin-bottom: 33px;
    font-family: $PF_Light;
    font-weight: $YH_big;
    font-size: 16px;
    color: $font_deep_black;
  }
  .select{
    display: inline-block;
    margin-bottom: 13px;
    width: 312px;
    height: 30px;
    .el-input__icon{
      line-height: 30px;
    }
    .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
  }
  .addAddress{
    display: inline-block;
    margin-bottom: 16px;
    font-family: $PF_Regular;
    font-weight: $YH_bold;
    font-size: 14px;
    color: $client_primary_color;
  }
  .addAddress:hover{
    cursor: pointer;
  }
  .input{
    position: relative;
    display: inline-block;
    margin: 23px 0px;
    width: 312px;
    height: 30px;
    .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
    .delivery-dialog-select{
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      .el-input__icon{
        line-height: 30px;
      }
    }
  }
  .label{
    display: inline-block;
    width: 91px;
  }
}
.UserOrderList .addAddress-dialog .el-dialog{
  width: 475px;
  .title{
    margin-bottom: 20px;
    font-family: $PF_Light;
    font-size: 16px;
    font-weight: $YH_big;
  }
  .tips{
    margin-bottom: 25px;
    font-family: $PF_Regular;
    font-size: 14px;
    color: $font_light_grey;
  }
  .input{
    display: inline-block;
    height: 30px;
    width: 312px;
  }
  .addressProof .el-form-item__error{
    position: relative;
    margin-right: 12px;
    text-align: right;
  }
  .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
  .select{
    display: inline-block;
    margin-right: 12px;
    width: 96px;
    height: 30px;
  }
  .el-form-item{
    margin-bottom: 5px;
  }
  .el-form-item__label{
    width: 95px;
    text-align: left;
  }
  .el-dialog__body{
    padding: 27px 0px 40px 38px;

  }
  .left{
    margin-top: 20px;
    margin-left: 11px;
  }
  .el-form-item__error{
    line-height: 30px;
    right: 10px;
    left: auto;
    top: 0;
  }
}
.UserOrderList .el-pagination{
    margin: 40px auto 0px auto;
    text-align: center;
  }
</style>
