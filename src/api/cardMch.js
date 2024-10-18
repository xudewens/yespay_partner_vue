import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 登出
export function logout() {
  return request({
    url: '/signOut',
    method: 'post'
  })
}

// 获取谷歌验证器图片
export function user_googleAuthenticator(data) {
  return request({
    url: '/googleAuthenticatorImage',
    method: 'get',
    responseType: 'blob',
    data
  })
}

// 绑定谷歌验证码
export function googleAuthenticator_bind(data) {
  return request({
    url: '/v1/user/bindGoogleAuth',
    method: 'post',
    data
  })
}

// 获取银行卡列表
export function getCardList(data) {
  return request({
    url: '/v1/data/cardList',
    method: 'post',
    data
  })
}

// 获取银行卡交易统计
export function dealerSummary(data) {
  return request({
    url: '/v1/data/dealerSummary',
    method: 'post',
    data
  })
}

// 订单查询
export function search_order(data) {
  return request({
    url: '/v1/data/page',
    method: 'post',
    data
  })
}

// 修改登录密码
export function updateLoginPassword(data) {
  return request({
    url: '/v1/user/updateLoginPassword',
    method: 'post',
    data
  })
}