/*
* 验证约定的后端返回代码
*/
const SUCCESS_CODE = 200
const NOT_LOGIN_CODE = 401

export default (body, success, error, dealResData, alertServerErrMsg) => {
  if (body.code === SUCCESS_CODE) {
    let data = body.data || body.value
    if (dealResData) {
      data = dealResData(data)
    }
    success && success(data)
  } else if (body.code === NOT_LOGIN_CODE) {
    // 无身份
    if (error) {
      error(body)
    } else {
      location.href = '/login'
    }
  } else if (error) {
    error(body)
  } else {
    alertServerErrMsg(body.resultMsg)
  }
  return null
}
