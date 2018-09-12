/* 商品状态 */
export const PRODUCT_NOT_START = 1
export const PRODUCT_ON_SALE = 2
export const PRODUCT_WAITING_CONFIRM = 3
export const PRODUCT_STOP_SALE = 4

export const PRODUCT_NOT_START_LABEL = '即将开始'
export const PRODUCT_ON_SALE_LABEL = '预售中'
export const PRODUCT_WAITING_CONFIRM_LABEL = '提货中'
export const PRODUCT_STOP_SALE_LABEL = '已结束'

/* 订单状态 */
export const ORDER_WAITING_CONFIRM = 1
export const ORDER_OUT_DATE = 2
export const ORDER_TRANSFERED = 3
export const ORDER_WAITING_DELIVERY = 4
export const ORDER_WAITING_ARRIVED = 5
export const ORDER_WAITING_DELIVERY_CONFIRM = 6
export const ORDER_WAITING_CONFIRM_DELIVERY = 7

export const ORDER_WAITING_CONFIRM_LABEL = '待提货'
export const ORDER_OUT_DATE_LABEL = '订单过期'
export const ORDER_TRANSFERED_LABEL = '订单已转让'
export const ORDER_WAITING_DELIVERY_LABEL = '待发货'
export const ORDER_WAITING_ARRIVED_LABEL = '已发货'
export const ORDER_WAITING_DELIVERY_CONFIRM_LABEL = '已确认收货'
export const ORDER_WAITING_CONFIRM_DELIVERY_LABEL = '提货中'

export function onlineWords (data) {
  if (data === '0') {
    // 上线
    data = '未上线'
  } else {
    // 下线
    data = '已上线'
  }
  return data
}
