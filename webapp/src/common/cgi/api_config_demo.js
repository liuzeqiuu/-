/*
 * 使用iFetch的配置样例
 * let myFetch = new IFetch( api_config , verify , alertServerErrMsg )
 * myFetch({
 *  apiName: 'myapi',
 *  success( res ){
 *      do something with res
 *  }
 * })
 */
const apiPrefix = 'https://mapi.bityuan.com'

export default {

  myapi: {

    url: `${apiPrefix}/book`,
    method: 'GET',

    // 不走业务代码验证
    notNeedVerify: true,

    // 开启本地数据mock
    mockLocal: true,
    mockDataFile: 'banner',

    // 处理请求的url
    dealReqUrl: (url, postdata) => {
      return `${url}/${postdata.id}`
    },

    // 处理请求的body部分data
    dealReqData: (postdata) => {
      return false
    },

    // 处理接口返回的数据
    dealResData: ({ time, ...others }) => {
      return { time: time * 1000, ...others }
    }
  },

  test: {
    url: `${apiPrefix}/v1/article/category-list?cid=9`,
    method: 'GET',

    // 不走业务代码验证
    notNeedVerify: true,

    // 开启本地数据mock
    mockLocal: false,
    mockDataFile: 'banner',

    // 处理请求的url
    dealReqUrl: (url, postdata) => {
      return `${url}/${postdata.id}`
    },

    // 处理请求的body部分data
    dealReqData: (postdata) => {
      return false
    },

    // 处理接口返回的数据
    dealResData: ({ time, ...others }) => {
      return { time: time * 1000, ...others }
    }
  }

}
