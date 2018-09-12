import { formatTime } from '@/common/helper.js'
import { onlineWords } from '@/common/constants/status.js'
import { productionsApiPrefix, orderApiPrefix, authApiPrefix } from '@/common/cgi/apiPrefix.js'

export const apiPrefix = ''

export default {
  // 后台图片接口连接
  fileupload: {
    url: `${productionsApiPrefix}/fileUpload/uploadFile`,

    // 上传文件干掉请求header种的content-type https://segmentfault.com/a/1190000010205162
    dealReqConfig ({ headers, ...others }) {
      delete headers['Content-Type']
      return { headers: headers, ...others }
    }
  },

  productList: {
    url: `${productionsApiPrefix}/backstage/listGoods`,
    // notNeedVerify: true,
    // 处理接口返回的数据
    dealResData: ({ list = [], ...others }) => {
      list.forEach(item => {
        item.presaleEndTime = item.presaleEndTime * 1000
        item.presaleStartTime = item.presaleStartTime * 1000
        const presaleEndTimeString = formatTime(item.presaleEndTime, 'yyyy-MM-dd')
        const presaleStartTimeString = formatTime(item.presaleStartTime, 'yyyy-MM-dd')
        // 预售 开始 - 结束
        item.presaletime = `${presaleStartTimeString} - ${presaleEndTimeString}`

        item.carrygoodsEndTime = item.carrygoodsEndTime * 1000
        item.carrygoodsStartTime = item.carrygoodsStartTime * 1000
        const carrygoodsEndTimeString = formatTime(item.carrygoodsEndTime, 'yyyy-MM-dd')
        const carrygoodsStartTimeString = formatTime(item.carrygoodsStartTime, 'yyyy-MM-dd')
        item.carrytime = `${carrygoodsStartTimeString} - ${carrygoodsEndTimeString}`
        item.onlineWords = onlineWords(item.isonline)
        item.isonline = Number(item.isonline)
        return item
      })
      return { list, ...others }
    }
  },

  goodsOnOff: {
    url: `${productionsApiPrefix}/backstage/onOffGoods`
  },

  deleteGoods: {
    url: `${productionsApiPrefix}/backstage/deleteGoods`
  },
  operator: {
    url: `${productionsApiPrefix}/backstage/listOperator`,
    method: 'GET'
  },

  businessName: {
    url: `${productionsApiPrefix}/backstage/listBusiness`,
    method: 'GET'
  },

  getGoods: {
    url: `${productionsApiPrefix}/backstage/getGoods`,
    method: 'GET',
    // 处理请求的url
    dealReqUrl: (url, postdata) => {
      return `${url}/${postdata.id}`
    }
    // 处理请求的body部分data
  },

  savegoods: {
    url: `${productionsApiPrefix}/backstage/saveGoods`
  },

  updateGoods: {
    url: `${productionsApiPrefix}/backstage/updateGoods`
  },
  orderlist: {
    url: `${orderApiPrefix}/orderModule/queryAllOrder`,
    dealResData ({rows, ...others}) {
      rows.forEach(item => {
        item.orderCreateTime = formatTime(item.orderCreateTime, 'yyyy-MM-dd hh:mm:ss')
      })
      return {rows, ...others}
    },
    dealReqData (postdata) {
      const defaultData = {
        orderId: '',
        username: '',
        userPhone: '',
        productName: '',
        orderState: '',
        startTime: '',
        endTime: '',
        rowNum: 10,
        page: 1
      }
      return {...defaultData, ...postdata}
    }
  },
  // 订单管理  获取订单状态信息
  queryAllOrderState: {
    url: `${orderApiPrefix}/orderModule/queryAllOrderState`
  },
  OrderParticulars: {
    url: `${orderApiPrefix}/orderModule/queryOrderParticulars`
  },
  OrderBlockInfo: {
    url: `${orderApiPrefix}/orderModule/queryOrderBolockChainParticularsInfo`
  },

  deleteOrderByOrderCode: {
    url: `${orderApiPrefix}/orderModule/deleteOrderByOrderCode`
  },

  queryOrderList: {
    url: `${productionsApiPrefix}/backstage/queryOrderList`,
    dealResData ({list, ...others}) {
      // console.log("处理之前的数据",list)
      list.forEach(item => {
        if (!item.deliverTime) {
          item.deliverTime = ''
        } else {
          item.deliverTime = formatTime(item.deliverTime, 'yyyy-MM-dd hh:mm:ss')
        }
        item.takeTime = formatTime(item.takeTime, 'yyyy-MM-dd hh:mm:ss')
        item.orderCreateTime = formatTime(item.orderCreateTime, 'yyyy-MM-dd hh:mm:ss')
      })
      return {list, ...others}
    },
    dealReqData (postdata) {
      const defaultData = {
        pageIndex: '1',
        pageSize: '10',
        logisticsCode: '',
        orderCode: '',
        harvestName: '',
        shipmentsState: '',
        deliverStartTime: '',
        deliverEndTime: '',
        takeStartTime: '',
        takeEndTime: '',
        orderState: ''
      }
      return {...defaultData, ...postdata}
    }
  },
  // 发货管理  点击发货
  deliverGoods: {
    url: `${productionsApiPrefix}/backstage/deliverGoods`
  },
  // 编辑物流
  updatelogistics: {
    url: `${productionsApiPrefix}/backstage/updatelogistics`
  },
  // 添加商家
  addBusinessInfo: {
    url: `${authApiPrefix}/business/addBusiness`,

    // 不走业务代码验证
    notNeedVerify: true
  },
  // 获取商家币种信息
  getBusinessCoinInfo: {
    url: `${authApiPrefix}/business/getBusinessInfo`
  },
  // 编辑商家
  editBusinessInfo: {
    url: `${authApiPrefix}/business/modifyBusiness`
  },
  // 删除商家
  delBusiness: {
    url: `${authApiPrefix}/business/deleteBusiness`
  },
  // 查询用户列表
  searchUserList: {
    url: `${authApiPrefix}/user/getUserList`
  },
  // 冻结用户/恢复用户
  freezeUser: {
    url: `${authApiPrefix}/user/modifyUserState`
  },
  // 删除用户
  delUser: {
    url: `${authApiPrefix}/user/deleteUser`
  },
  // 获取币种ID
  searchCoinId: {
    url: `${authApiPrefix}/business/getCurrencylist`
  },
  // 删除文件
  deleteFile: {
    url: `${productionsApiPrefix}/backstage/deleteFile`
  },
  // 查询商家信息
  searchBusinessInfo: {
    url: `${authApiPrefix}/business/getBusinessList`
  },
  // 充币接口
  deposit: {
    url: `${authApiPrefix}/bty/getBusinessAdrr`
  },
  // 提币接口
  withdraw: {
    url: `${authApiPrefix}/bty/addBusinessWithMoney`
  },
  // 提币信息接口
  withdrawMsg: {
    url: `${authApiPrefix}/bty/getwithdrawMoney`
  },
  // 获取提币地址
  withdrawAddress: {
    url: `${authApiPrefix}/bty/getBusinessAdrs`
  },
  // 添加提币地址
  addAddress: {
    url: `${authApiPrefix}/bty/addBusinessPurseAddress`,
    notNeedVerify: true
  },
  // 获取矿工费信息
  feeList: {
    url: ``
  },
  // 获取手机区号
  telArea: {
    url: ``
  },
  // 手机验证接口
  telValidate: {
    url: ``
  },
  // 邮箱验证接口
  emailValidate: {
    url: ``
  },
  // 发送验证码
  SendCode: {
    url: `${authApiPrefix}/login/getcode`
  },
  // 发送邮箱验证码
  emailSendCode: {
    url: ``
  },
  // 商家账户资产查询
  bussinessAccountAssets: {
    url: `${authApiPrefix}/bty/getBusinessAssets`,
    headers: {

    }
  },
  // 充值记录查询
  depositRecord: {
    url: ``
  },
  // 提币记录查询
  withdrawRecord: {
    url: ``
  },
  //
  allRecord: {
    url: ``
  },
  // 注册接口
  register: {
    url: ``
  },
  // 超管登录接口
  adminLogin: {
    url: `${authApiPrefix}/login/loginadmin`
    // notNeedAuth: true,
    // mockLocal: false,
    // mockDataFile: 'loginOrRegist'
  },
  // 商家登录接口
  businessLogin: {
    url: `${authApiPrefix}/login/loginbusiness`
  },
  // 获取当前商家个人信息接口
  businessInfo: {
    url: `${authApiPrefix}/login/getCurrentuser`
  }
}
