/**
 * 数据脱敏
 *
 * @export
 * @param {String} data
 * @param {mobile|email|id} type
 */
export function dataDesensitize (data, type) {
  switch (type) {
    // 11位手机号脱敏
    case 'mobile':
      return data.replace(/(\d{3})\d+(\d{4})$/, '$1****$2')
      // 邮箱账户脱敏
    case 'email':
      return data.replace(/(\w{1})\w+@(\.*?)/, '$1***@$2')
    default:
      return data
  }
}

/**
 * 手机号脱敏
 * 返回 123****1234
 * @export
 * @param {Number} mobile
 * @returns
 */
export function mobileDes (mobile) {
  return dataDesensitize(String(mobile), 'mobile')
}

/**
 * 邮箱账户脱敏
 * 返回 a****@qwe.com
 * @export
 * @param {*} email
 * @returns
 */
export function emailDes (email) {
  return dataDesensitize(email, 'email')
}
