/*
* 验证约定的后端返回代码
*/
const SUCCESS_CODE = 0
const NOT_LOGIN_CODE = 1

export default (body, success, error, dealResData, alertServerErrMsg) => {
  if (body.errcode === SUCCESS_CODE) {
    let data = body.data
    if (dealResData) {
      data = dealResData(data)
    }
    success && success(data)
  } else if (body.errcode === NOT_LOGIN_CODE) {
    // 无身份
    error && error(body)
  } else if (error) {
    error(body)
  } else {
    alertServerErrMsg(body.errmsg)
  }
  return null
}
