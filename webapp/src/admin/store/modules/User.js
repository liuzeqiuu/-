import {removeToken} from '@/client/config/.js'

/*
 * mutations
 */
export const UPDATE_USER_MUTATION = 'UPDATE'

/*
 * 存储在sessionStorage中的key
 */
const USER_STORAGE_KEY = `user@admin`

/*
 * 初始化的状态
 */
const defaultState = {
  userId: 0,
  username: '',
  hasPwd: false,
  account: '',
  last_login: 0,
  token: '',
  registered: false
}

/*
 * 启动时尝试在sessionStorage中取信息
 */
const userInfoInSession = getUserInfoInSession() || {}

const state = {...defaultState, ...userInfoInSession}

const mutations = {
  [UPDATE_USER_MUTATION] (state, userInfo = {}) {
    let keys = Object.keys(userInfo)
    keys.forEach(key => {
      state[key] = userInfo[key]
    })
    setUserInfoInSession(state)
  }
}

const actions = {
  LOGOUT ({commit}) {
    // 注销登陆状态
    // 删除token
    // 初始化用户信息
    removeToken()
    commit(UPDATE_USER_MUTATION, defaultState)
  }
}

const getters = {
  hasLogin: state => {
    // 判断是否已经登陆
    // 还有一种判断登陆状态的方式，根据是否有token
    console.log('hasLogin', state.userId)
    return !!state.userId
  }
}

/**
 * 保存userinfo在session中
 *
 * @export
 * @param {*} [info={}]
 */
export function setUserInfoInSession (info = {}) {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(info))
}

/**
 * 获取session中的userinfo
 *
 * @export
 * @returns
 */
export function getUserInfoInSession () {
  let user = sessionStorage.getItem(USER_STORAGE_KEY)
  if (user) {
    return JSON.parse(user)
  } else {
    return null
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
