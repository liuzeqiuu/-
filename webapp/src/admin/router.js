import Vue from 'vue'
import Router from 'vue-router'
// import { sysInfo } from '../common/sysInfo'

Vue.use(Router)

// 管理端主要在pc上使用极少涉及到需要在mobile上单独适配的
// 动态加载组件
// const mobileComponent = {
//   Login: () => import('./views/mobile/Login.vue')
// }
const pcComponent = {
  // Test: () => import('./views/test.vue'),
  Login: () => import('./views/Login.vue'),
  Main: () => import('./views/Main.vue'),
  Logout: () => import('./views/Logout.vue'),
  Product: () => import('./views/Product.vue'),
  ProductList: () => import('./views/ProductList.vue'),
  Order: () => import('./views/Order.vue'),
  OrderList: () => import('./views/OrderList.vue'),
  DeliveryList: () => import('./views/DeliveryList.vue'), // 物流
  User: () => import('./views/User.vue'), // 物流
  Business: () => import('./views/Business.vue'), // 商家管理
  AddBusiness: () => import('./views/AddBusiness.vue'), // 添加商家
  BusinessManage: () => import('./views/BusinessManage.vue'), // 商家管理
  UserInfo: () => import('./views/UserInfo.vue'), // 用户信息
  Edit: () => import('./views/Edit.vue') // 编辑商家
}

// const useCom = sysInfo.type === 'mobile' ? mobileComponent : pcComponent

const useCom = pcComponent

let routerConfig = {
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: useCom['Login'],
      meta: { notRequiresAuth: true }
    },
    {
      path: '/center',
      component: useCom['Main'],
      children: [
        {
          path: '/',
          redirect: 'products'
        },
        {
          path: 'product', // 新建一个product
          name: 'product',
          component: useCom['Product']
        },
        {
          path: 'product/:uuid',
          name: 'product',
          component: useCom['Product'],
          props: true
        },
        {
          path: 'products',
          name: 'products',
          component: useCom['ProductList']
        },
        {
          path: 'order/:uuid',
          name: 'order',
          component: useCom['Order'],
          props: true
        },
        {
          path: 'orders',
          name: 'orders',
          component: useCom['OrderList']
        },
        {
          path: 'deliveries',
          name: 'deliveryList',
          component: useCom['DeliveryList']
        },
        {
          path: 'user',
          name: 'User',
          component: useCom['User']
        },
        {
          path: 'logout',
          name: 'logout',
          component: useCom['Logout'],
          meta: { notRequiresAuth: true }
        },
        {
          path: 'business',
          name: 'business',
          component: useCom['Business']
        },
        {
          path: 'addBusiness',
          name: 'addBusiness',
          component: useCom['AddBusiness']
        },
        {
          path: 'BusinessManage',
          name: 'BusinessManage',
          component: useCom['BusinessManage']
        },
        {
          path: 'UserInfo',
          name: 'UserInfo',
          component: useCom['UserInfo']
        },
        {
          path: 'Edit',
          name: 'Edit',
          component: useCom['Edit']
        },
        { path: '*',
          component: () => import('./components/NotFoundComponent.vue')
        }
      ]
    }
  ]
}

// 非debug模式 使用history
// debug模式给需要自适应终端环境的路由方式
// if (process.env.VUE_APP_DEBUG_MODE === 'false') {
//   routerConfig.mode = 'history'
// }

let router = new Router(routerConfig)

let hasLogin = true

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.notRequiresAuth)) {
    next()
  } else {
    if (!hasLogin) {
      next({
        path: '/login',
        query: { '/login': to.fullPath }
      })
    } else {
      next()
    }
  }
})

export default router
