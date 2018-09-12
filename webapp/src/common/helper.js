/**
 * 计算绝对路径
 *
 * @export
 * @param {string} [path='']
 * @returns
 */
export function getAppPath (path = '') {
  path = path.replace(/^\//, '')
  return `${window.location.protocol}//${window.location.host}/${path}`
}

/**
 * 获取当前origin
 *
 * @export
 * @returns
 */
export function getCurrentOrigin () {
  return `${window.location.protocol}//${window.location.host}`
}

/**
 * 获取一个在某范围内的整数
 *
 * @export
 * @param {*} min
 * @param {*} max
 * @returns
 */
export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 格式化时间
 *
 * @param {date} date
 * @param {string} format
 * @returns
 */
export function formatTime (date, format) {
  if (typeof date === 'number') {
    date = new Date(date)
  } else if (typeof date === 'string') {
    // ios 中使用 new Date( yyyy-MM-dd hh:mm:ss:SS ) 时间格式字符串不能精确到 小时以后
    var dateArr = date.split(/[- :]/)
    var now = new Date()
    date = new Date(dateArr[0] || now.getFullYear()
      , dateArr[1] && parseInt(dateArr[1]) ? parseInt(dateArr[1]) - 1 : (now.getMonth() - 1)
      , dateArr[2] || 1
      , dateArr[3] || 0
      , dateArr[4] || 0
      , dateArr[5] || 0
    )
  } else {
    console.error('wrong format')
    return 'wrong format'
  }

  if (format === 'timestamp') return +date

  var map = {
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds(), // 秒
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
    'W': '星期' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()] // 星期
  }
  format = format.replace(/([yMdhmsqSW])+/g, function (all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return format
}

export function productStatus2Word (status) {
  return ['提货中', '待发货', '已发货', '订单过期'][status]
}

export function productStatus2Step (status, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].status === status) {
      return array[i].step
    }
  }
}

/**
 * 传入vue实例 后退或者跳回首页
 *
 * @export
 * @param {*} vm
 */
export function jumpBackOrHome (vm) {
  const redirect = vm.$router.query && vm.$router.query.redirect
  if (redirect) {
    location.href = decodeURIComponent(redirect)
  } else if (window.history.length > 1) {
    vm.$router.go(-1)
  } else {
    vm.$router.push({path: '/'})
  }
}
