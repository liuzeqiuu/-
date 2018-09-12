class IFetch {
  constructor (apiConfig, verify, alertServerErrMsg, injectAuth) {
    if (!apiConfig) {
      throw new Error('apiConfig is required, please refer to the api_config_demo.js file')
    }

    if (!verify) {
      throw new Error('verify is required, please refer to the verify_demo.js file')
    }

    this.apiConfig = apiConfig
    this.verify = verify

    if (!alertServerErrMsg) {
      console.info('better alert better experience~')
      alertServerErrMsg = window.alert
    }

    if (injectAuth) {
      this.injectAuth = injectAuth
    }

    this.alertServerErrMsg = alertServerErrMsg

    return this.doFetch.bind(this)
  }

  parseJSON (response) {
    return response.json()
  }

  checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  doFetch (config = {}) {
    // 去配置表中找，如果找到，加入默认配置
    console.log('config.apiName', config.apiName)
    if (config.apiName && this.apiConfig[config.apiName]) {
      config = { ...this.apiConfig[config.apiName], ...config }
    }

    const { success,
      error,
      failed,
      complete,
      httpHeaders = {},
      method,
      dealReqUrl,
      dealReqData,
      dealResData,
      mockLocal,
      mockDataFile,
      dealReqConfig,
      notNeedAuth,
      notNeedVerify } = config

    let { url, postdata } = config

    if (mockLocal) {
      try {
        let res = require(`./debugdata/${mockDataFile}.js`)
        res = res.default.data
        setTimeout(() => {
          if (notNeedVerify) {
            success && success(res)
          } else {
            this.verify(res, success, error, dealResData, this.alertServerErrMsg)
          }
        }, 300)
      } catch (error) {
        if (failed) {
          failed(error)
        } else {
          throw error
        }
      }
      complete && complete()
      return
    }

    if (!url) {
      return console.error('please set request url or apiName')
    }

    if (dealReqUrl) {
      url = dealReqUrl(url, postdata)
    }

    if (dealReqData) {
      postdata = dealReqData(postdata)
    }

    if (method === 'GET' && postdata) {
      let queryArr = []
      Object.keys(postdata).forEach(q => queryArr.push(`${q}=${postdata[q]}`))
      url = `${url}?${queryArr.join('&')}`
      postdata = false
    }

    let requestConfig = {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...httpHeaders
      },
      redirect: 'follow'
      // credentials: 'include'
    }

    if (!notNeedAuth && this.injectAuth) {
      requestConfig = this.injectAuth(requestConfig)
    }

    if (dealReqConfig) {
      requestConfig = dealReqConfig(requestConfig)
    }

    if (postdata) {
      // 如果 Content-Type 是 form-data ，不需要转换成json格式
      if (requestConfig.headers['Content-Type'] && /json/.test(requestConfig.headers['Content-Type'])) {
        requestConfig['body'] = JSON.stringify(postdata)
      } else {
        requestConfig['body'] = postdata
      }
    }

    let r = fetch(url, requestConfig).then(this.checkStatus)
      .then(this.parseJSON)
      .then((data) => {
        complete && complete()

        if (notNeedVerify) {
          dealResData && dealResData(data)
          success && success(data)
          return null
        } else {
          return this.verify(data, success, error, dealResData, this.alertServerErrMsg)
        }
      })
      .catch(e => {
        console.log(e, 'catch error!')
        complete && complete()
        if (failed) {
          failed(e)
        } else {
          this.alertServerErrMsg(e.message)
        }
      })

    return r
  }
}

export default IFetch
