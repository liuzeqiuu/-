import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import IFetch from '../common/cgi/iFetch'
import apiConfig from './config/api'
import verify from './config/api_verify'
import '../registerServiceWorker'
import ElementUI from './config/elementConfig'
import './config/element-variables.scss'
import 'normalize.css'
import '../common/styles/reset.css'
import '../common/styles/quickstyle.css'
import './assets/css/app.scss'
import './assets/css/reset-element-ui.css'
import {injectAuthHeader} from './config/tokenManager.js'

Vue.config.productionTip = (process.env.VUE_APP_DEBUG_MODE === 'false')

Vue.use(ElementUI)

// 初始化网络模块
const myFetch = new IFetch(apiConfig, verify, Vue.prototype.$serverErrNotify, injectAuthHeader)

Vue.use({
  install: (Vue) => {
    Vue.prototype.myFetch = myFetch
  }
})

export const _this = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
