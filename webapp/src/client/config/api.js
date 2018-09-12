import { productionsApiPrefix, orderApiPrefix, authApiPrefix } from '@/common/cgi/apiPrefix.js'
import {formatTime} from '@/common/helper.js'

export const apiPrefix = ''

export default {
// 首页轮播图
  queryBanners: {
    url: `${productionsApiPrefix}/goods/queryBanners`,
    notNeedAuth: true
  },
  // 首页查询某一状态产品
  queryGoodsList: {
    url: `${productionsApiPrefix}/goods/queryGoodsList`,
    notNeedAuth: true
  },
  // 查询全部产品
  queryGoodsListAll: {
    url: `${productionsApiPrefix}/goods/queryGoodsListAll`,
    notNeedAuth: true
  },
  // 产品状态除预定成功外，商品预定详情页面将调用该接口
  orderState: {
    url: `${orderApiPrefix}/orderModule/queryFrontDeskAllXiangQingByOdrderId`
  },
  // 如果产品状态为预定成功状态，则商品详情页面调用该接口
  getOrderDetail: {
    url: `${productionsApiPrefix}/goods/getOrderDetail`
  },
  // 订单状态
  queryAllOrderState: {
    url: `${orderApiPrefix}/orderModule/queryAllOrderState`
  },
  // 客户端  预订列表
  UserOrderList: {
    url: `${orderApiPrefix}/orderModule/queryFrontDeskOrderAllReservationRecordPC`,
    dealResData ({rows, ...others}) {
      rows.forEach(item => {
        if (item.orderCreateTime) {
          item.orderCreateTime = formatTime(item.orderCreateTime, 'yyyy-MM-dd hh:mm:ss')
        }
        if (item.carrygoodStartTime) {
          let start = item.carrygoodStartTime
          start = formatTime(start * 1000, 'yyyy-MM-dd hh:mm:ss')
          start = start.split('-')[1] + '月' + start.split('-')[2].split(' ')[0] + '日' + start.split('-')[2].split(' ')[1].split(':')[0] + ':' + start.split('-')[2].split(' ')[1].split(':')[1]
          item.carrygoodStartTime = start
        }
        if (item.carrygoodStartTime) {
          let end = item.carrygoodsEndTime
          end = formatTime(end * 1000, 'yyyy-MM-dd hh:mm:ss')
          end = end.split('-')[1] + '月' + end.split('-')[2].split(' ')[0] + '日' + end.split('-')[2].split(' ')[1].split(':')[0] + ':' + end.split('-')[2].split(' ')[1].split(':')[1]
          item.carrygoodsEndTime = end
        }
      })
      return {rows, ...others}
    }
  },
  //  手机端  预定列表
  reservationRecordPhone: {
    url: `${orderApiPrefix}/orderModule/queryFrontDeskOrderAllReservationRecordPhone`,
    dealResData ({rows, ...others}) {
      rows.forEach(item => {
        if (item.orderCreateTime) {
          item.orderCreateTime = formatTime(item.orderCreateTime, 'yyyy-MM-dd hh:mm:ss')
        }
        if (item.carrygoodStartTime) {
          let start = item.carrygoodStartTime
          start = formatTime(start * 1000, 'yyyy-MM-dd hh:mm:ss')
          start = start.split('-')[1] + '月' + start.split('-')[2].split(' ')[0] + '日' + start.split('-')[2].split(' ')[1].split(':')[0] + ':' + start.split('-')[2].split(' ')[1].split(':')[1]
          item.carrygoodStartTime = start
        }
        if (item.carrygoodStartTime) {
          let end = item.carrygoodsEndTime
          end = formatTime(end * 1000, 'yyyy-MM-dd hh:mm:ss')
          end = end.split('-')[1] + '月' + end.split('-')[2].split(' ')[0] + '日' + end.split('-')[2].split(' ')[1].split(':')[0] + ':' + end.split('-')[2].split(' ')[1].split(':')[1]
          item.carrygoodsEndTime = end
        }
      })
      return {rows, ...others}
    }
  },
  applyForPicUpGoods: {
    url: `${orderApiPrefix}/orderModule/applyForPicUpGoods`
  },
  // 添加收货人地址
  insertReceivingAddress: {
    url: `${orderApiPrefix}/orderModule/insertReceivingAddress`
  },

  //  手机端添加收货人地址
  insertPhoneReceivingAddress: {
    url: `${orderApiPrefix}/orderModule/insertPhoneReceivingAddress`
  },

  // 删除收货人地址
  deleteReceivingAddressByAddressId: {
    url: `${orderApiPrefix}/orderModule/deleteReceivingAddressByAddressId`
  },
  //  设置默认收货地址
  updateIsdefaultAddress: {
    url: `${orderApiPrefix}/orderModule/updateIsdefaultAddress`
  },
  //  编辑收货地址
  updateUserAddressByAddressId: {
    url: `${orderApiPrefix}/orderModule/updateUserAddressByAddressId`
  },

  selectAllCurrencyType: {
    url: `${orderApiPrefix}/orderModule/selectAllCurrencyType`
  },

  selectTailMoney: {
    url: `${orderApiPrefix}/orderModule/selectTailMoney`
  },

  selectReceivingAddress: {
    url: `${orderApiPrefix}/orderModule/selectReceivingAddress`
    // mockLocal: true,
    // mockDataFile: 'getAddress'
  },
  updatePhoneUserAddress: {
    url: `${orderApiPrefix}/orderModule/updatePhoneUserAddressByAddressId`
  },
  // 确定 申请提货
  applyfordelivery: {
    url: `${orderApiPrefix}/orderModule/applyfordelivery`
  },

  updateStateByOrderCode: {
    url: `${orderApiPrefix}/orderModule/updateStateByOrderCode`
  },

  queryHotsaleList: {
    url: `${productionsApiPrefix}/goods/queryHotsaleList`,
    notNeedAuth: true,
    mockDataFile: 'hotsaleList'
  },
  // 商品详情
  getReceptionGoods: {
    url: `${productionsApiPrefix}/goods/getReceptionGoods`,
    notNeedAuth: true,
    method: 'GET',
    dealReqData () {
      return null
    },
    dealReqUrl (url, data) {
      return `${url}/${data.id}`
    }
  },
  // 获取商品预订信息
  getReserveInfo: {
    url: `${productionsApiPrefix}/goods/getReserveInfo`,
    notNeedAuth: true
  },

  // 立即预订商品
  goodsReserve: {
    url: `${productionsApiPrefix}/goods/goodsReserve`
  },

  // 用手机号，邮箱等获取验证码
  getVerifyCode: {
    url: `${authApiPrefix}/login/getqtcode`,
    mockLocal: false,
    mockDataFile: 'getVerifyCode',
    notNeedAuth: true
  },
  // 获取图片验证码
  getVerifyImage: {
    url: `${authApiPrefix}/login/getgraphicalcode`,
    mockLocal: false,
    mockDataFile: 'getVerifyImage',
    notNeedAuth: true
  },

  getAddress: {
    mockLocal: true,
    mockDataFile: 'getAddress'
  },

  getRegisterState: {
    url: `${authApiPrefix}/login/checkuser`,
    notNeedAuth: true,
    mockLocal: false,
    mockDataFile: 'getRegisterState'
  },

  getCodeByVoice: {
    mockLocal: true,
    mockDataFile: 'getCodeByVoice'
  },

  loginOrRegist: {
    url: `${authApiPrefix}/login/login`,
    notNeedAuth: true,
    mockLocal: false,
    mockDataFile: 'loginOrRegist'
  },

  setPassword: {
    url: `${authApiPrefix}/login/addpassword`
  },

  // 找回密码
  resetPassword: {
    mockLocal: false,
    url: `${authApiPrefix}/login/resetpassword`
  },

  // 修改密码
  updatePassword: {
    mockLocal: false,
    mockDataFile: `${authApiPrefix}/login/modifypassword`
  },

  isCaptcha: {
    mockLocal: true,
    mockDataFile: 'isCaptcha'
  },
  getAssetList: {
    mockLocal: true,
    mockDataFile: 'assetList'
  },
  getMyAssetList: {
    url: `${authApiPrefix}/bty/getUserAssets`,
    dealResData ({userTransfers, ...others}) {
      userTransfers.forEach(item => {
        item.transferTime = formatTime(item.transferTime, 'yyyy-MM-dd hh:mm:ss')
        if (item.transferType === 2) {
          item.transferType = '提币'
        } else if (item.transferType === 1) {
          item.transferType = '充币'
        }
        if (item.transferState === 0) {
          item.transferState = '充币申请中'
        } else if (item.transferState === 1) {
          item.transferState = '成功'
        } else if (item.transferState === 2) {
          item.transferState = '失败'
        }
      })
      return {userTransfers, ...others}
    }
  },
  // 充币
  getUserAdrr: {
    url: `${authApiPrefix}/bty/getUserAdrr`
  },
  getUserwithdrawMoney: {
    url: `${authApiPrefix}/bty/getUserwithdrawMoney`
  },
  //  账号信息
  getUserInfo: {
    url: `${authApiPrefix}/user/getUserInfobyUserId`,
    mockLocal: false,
    mockDataFile: 'getUserInfo'
  },
  // 修改密码
  modifypassword: {
    url: `${authApiPrefix}/login/modifypassword`
  },
  //  设置手机号码
  setUserInfo: {
    url: `${authApiPrefix}/bty/setUserInfo`
  },
  //  添加提币地址
  addUserPurseAddress: {
    url: `${authApiPrefix}/bty/addUserPurseAddress`
  },
  //  确认提币
  addUserWithMoney: {
    url: `${authApiPrefix}/bty/addUserWithMoney`
  },
  allProduct: {
    url: `${productionsApiPrefix}/goods/queryGoodsListAll`
  },
  getuserAdrs: {
    url: `${authApiPrefix}/bty/getuserAdrs`
  },
  statusProduct: {
    url: `${productionsApiPrefix}/goods/queryGoodsList`
  },
  bannerImg: {
    url: `${productionsApiPrefix}/goods/queryBanners`
    // notNeedVerify: true
  },
  logisticsTrace: {
    url: `${orderApiPrefix}/orderModule/queryFrontDeskOrderlogisticsTraceMessage`
  }
}
