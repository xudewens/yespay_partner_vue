import request from '@/utils/request'
/* eslint-disable */

// 获取服务
export function user_getCountryUrl(data) {
  return request({
    url: '/user/getCountryUrl',
    method: 'post',
    data
  })
}

// 获取谷歌验证器
export function user_googleAuthenticator(data) {
  return request({
    url: '/user/googleAuthenticator/image',
    method: 'get',
    responseType: 'blob',
    data
  })
}

// 绑定谷歌验证码
export function googleAuthenticator_bind(data) {
  return request({
    url: '/user/auth/googleAuthenticator/bind',
    method: 'post',
    data
  })
}

// 修改登录密码
export function updateLoginPassword(data) {
  return request({
    url: '/user/updateLoginPassword',
    method: 'post',
    data
  })
}

// 新增用户-只有管理员可用
export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}



