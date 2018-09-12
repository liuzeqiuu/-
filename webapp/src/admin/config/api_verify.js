/*
* 验证约定的后端返回代码
*/
export const SUCCESS_CODE = 200
const NOT_LOGIN_CODE = 401

export default (body, success, error, dealResData, alertServerErrMsg) => {
  if (body.code === SUCCESS_CODE) {
    // 后端约定的返回内容
    let data = body.value || body.data
    if (dealResData) {
      data = dealResData(data)
    }
    success && success(data)
  } else if (body.code === NOT_LOGIN_CODE) {
    // 无身份
    if (error) {
      error(body)
    } else {
      location.href = '/admin.html/#/login'
    }
  } else if (error) {
    error(body)
  } else {
    alertServerErrMsg(body.resultMsg)
  }
  return null
}
