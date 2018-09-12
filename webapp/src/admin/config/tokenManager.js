import { getCurrentOrigin } from '@/common/helper.js'

const sessionTokenKey = `${getCurrentOrigin()}.token`

let tokenInRam = getToken()

/**
 * 将token保存在session和内存中
 *
 * @param {string} token
 */
export function saveToken (token) {
  sessionStorage.setItem(sessionTokenKey, token)
  tokenInRam = token
}

/**
 * 取token 优先从内存中取，再从sessionStorage中取
 *
 * @returns
 */
export function getToken () {
  return tokenInRam || sessionStorage.getItem(sessionTokenKey)
}

// export function getRoute () {
//   return route
// }
/**
 * 清空token
 *
 * @export
 */
export function removeToken () {
  tokenInRam = null
  sessionStorage.removeItem(sessionTokenKey)
}

/**
 * 注入身份信息到网络请求中
 *
 * @export
 * @param {Object} config
 * @returns
 */
export function injectAuthHeader (config) {
  // 在请求头中注入 认证信息

  if (tokenInRam) {
    const { headers, ...others } = config
    return {
      headers: {
        'Authorization': `Bearer ${tokenInRam}`,
        ...headers
      },
      ...others
    }
  } else {
    return config
  }
}
