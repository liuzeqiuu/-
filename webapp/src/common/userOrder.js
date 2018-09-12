// 产品详情查询
import { formatTime } from './helper.js'
export function assignment (product, content, table) {
  product.amountPrepaid = content.amountPrepaid
  product.fileUrl = content.fileUrl
  product.id = content.orderId
  product.orderCreateTime = formatTime(content.orderCreateTime, 'yyyy年MM月dd日 hh:mm:ss')
  product.productName = content.productName
  if (content.productName.length > 20) {
    let string = ''
    let omit = '...'
    let current = ''
    product.altName = content.productName
    string = content.productName.substring(0, 20)
    product.productName = current.concat(string, omit)
  }
  product.productPrice = content.productPrice
  product.productSum = content.productSum
  product.reserveSum = content.reserveSum
  product.stateName = content.stateName
  product.statusName = content.statusName
  product.tailMoney = content.tailMoney
  product.tokenName = content.tokenName
  product.totalAmount = content.totalAmount
  product.harvestName = content.harvestName
  product.phone = content.phone
  product.operationHash = content.operationHash

  if (content.address !== undefined) {
    product.address = content.address.replace(/-/g, '')
    product.addressDetails = content.addressDetails
  }
  // 转出记录
  table.time = formatTime(content.transferTime, 'yyyy/MM/dd hh:mm:ss')
  table.place = content.transferAddress
  table.num = content.transferNum
  // 获取快递信息
  product.logisticsName = content.logisticsName
  product.logisticsCode = content.logisticsCode
  product.logisticsTime = formatTime(content.deliverTime, 'yyyy/MM/dd hh:mm:ss')
  return {
    product,
    table
  }
}
