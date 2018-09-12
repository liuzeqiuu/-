import Vue from 'vue'
import Router from 'vue-router'
import { sysInfo } from '../common/sysInfo'
import { getToken } from './config/tokenManager'
import { getAppPath } from '../common/helper'

Vue.use(Router)

// 动态加载组件
const mobileComponent = {
  Home: () => import('./views/mobile/Home.vue'),
  Product: () => import('./views/mobile/Product.vue'),
  ProductList: () => import('./views/mobile/ProductList.vue'),
  UserOrder: () => import('./views/mobile/UserOrder.vue'),
  UserOrderList: () => import('./views/mobile/UserOrderList.vue'),
  UserCenter: () => import('./views/mobile/UserCenter.vue'),
  ContactUs: () => import('./views/pc/ContactUs.vue'), // 共用pc版的
  Login: () => import('./views/Login.vue'),
  Charge: () => import('./views/mobile/ChargeMoney.vue'),
  Mention: () => import('./views/mobile/MentionMoney.vue'),
  reserve: () => import('./views/mobile/reserveProduct.vue'),
  UserAddress: () => import('./views/mobile/UserCenter/UserAddress.vue'),
  UserAddAddress: () => import('./views/mobile/UserCenter/AddAddress.vue'),
  UserSetPhone: () => import('./views/mobile/UserCenter/SetPhone.vue'),
  UserSetEmail: () => import('./views/mobile/UserCenter/SetEmail.vue'),
  UserSetPassword: () => import('./views/mobile/UserCenter/SetPassword.vue'),
  UserAsset: () => import('./views/mobile/UserCenter/UserAsset.vue'),
  RechargeRecord: () => import('./views/mobile/rechargeRecord.vue'),
  WithdrawRecord: () => import('./views/mobile/withdrawRecord.vue'),
  CommissionRecord: () => import('./views/mobile/CommissionRecord.vue'),
  OrderTracking: () => import('./views/mobile/orderTracking.vue'),
  Logout: () => import('./views/Logout.vue'),
  ApplicationDelivery: () => import('./views/mobile/applicationForDelivery.vue')
}
const pcComponent = {
  Home: () => import('./views/pc/Home.vue'),
  Product: () => import('./views/pc/Product.vue'),
  ProductList: () => import('./views/pc/ProductList.vue'),
  UserOrder: () => import('./views/pc/UserOrder.vue'),
  UserOrderList: () => import('./views/pc/UserOrderList.vue'),
  UserCenter: () => import('./views/pc/UserCenter.vue'),
  ContactUs: () => import('./views/pc/ContactUs.vue'),
  Login: () => import('./views/Login.vue'),
  UserAddress: () => import('../common/components/Blank.vue'),
  UserAddAddress: () => import('../common/components/Blank.vue'),
  UserSetPhone: () => import('../common/components/Blank.vue'),
  UserSetEmail: () => import('../common/components/Blank.vue'),
  UserSetPassword: () => import('../common/components/Blank.vue'),
  UserAsset: () => import('../common/components/Blank.vue'),
  Logout: () => import('./views/Logout.vue')
}

const useCom = sysInfo.type === 'mobile' ? mobileComponent : pcComponent

let routerConfig = {
  routes: [
    {
      path: '/',
      name: 'home',
      component: useCom['Home']
    },
    {
      path: '/product/:uuid',
      name: 'product',
      component: useCom['Product'],
      props: true
    },
    {
      path: '/products',
      name: 'products',
      component: useCom['ProductList']
    },
    {
      path: '/user/order/:uuid',
      name: 'userOrder',
      component: useCom['UserOrder'],
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/orders',
      name: 'userOrders',
      component: useCom['UserOrderList'],
      meta: { requiresAuth: true }
    },
    {
      path: '/user/orders/applicationDelivery',
      name: 'applicationDelivery',
      component: useCom['ApplicationDelivery']
    },
    {
      path: '/user',
      name: 'userCenter',
      component: useCom['UserCenter'],
      meta: { requiresAuth: true },
      children: [
        {
          path: 'address',
          name: 'userAddress',
          component: useCom['UserAddress']
        },
        {
          path: 'addAddress',
          name: 'userAddAddress',
          component: useCom['UserAddAddress']
        },
        {
          path: 'setPhone',
          name: 'userSetPhone',
          component: useCom['UserSetPhone']
        },
        {
          path: 'setEmail',
          name: 'userSetEmail',
          component: useCom['UserSetEmail']
        },
        {
          path: 'setPassword',
          name: 'userSetPassword',
          component: useCom['UserSetPassword']
        },
        {
          path: 'asset',
          name: 'userAsset',
          component: useCom['UserAsset']
        }
      ]
    },
    {
      path: '/contactUs',
      name: 'contactUs',
      component: useCom['ContactUs']
    },
    {
      path: '/login',
      name: 'login',
      component: useCom['Login']
    },
    {
      path: '/logout',
      name: 'logout',
      component: useCom['Logout']
    },
    {
      path: '/charge',
      name: 'Charge',
      component: useCom['Charge']
    },
    {
      path: '/mention',
      name: 'Mention',
      component: useCom['Mention']
    },
    {
      path: '/reserve/:uuid',
      name: 'reserve',
      component: useCom['reserve'],
      props: true
    },
    {
      path: '/rechargeRecord',
      name: 'rechargeRecord',
      component: useCom['RechargeRecord']
    },
    {
      path: '/withdrawRecord',
      name: 'withdrawRecord',
      component: useCom['WithdrawRecord']
    },
    {
      path: '/commissionRecord',
      name: 'commissionRecord',
      component: useCom['CommissionRecord']
    },
    {
      path: '/ordertracking',
      name: 'ordertracking',
      component: useCom['OrderTracking']
    },
    {
      path: '/test',
      component: useCom['Test']
    },
    { path: '*',
      component: () => import('./components/NotFoundComponent.vue')
    }
  ]
}

// 非debug模式 使用history
// debug模式给需要自适应终端环境的路由方式
if (process.env.VUE_APP_DEBUG_MODE === 'false') {
  routerConfig.mode = 'history'
}

let router = new Router(routerConfig)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 此处取不到store中的信息
    // 根据token判断 是否已登陆
    if (!getToken()) {
      console.log('to', to, location.href)
      next({
        path: '/login',
        query: { redirect: getAppPath(to.fullPath) }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
