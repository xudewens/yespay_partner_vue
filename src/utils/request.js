import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'
import Vue from 'vue'
import App from '../App.vue'

const vm = new Vue({
  router,
  render: h => h(App)
})

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['token'] = getToken() || config.data.token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.data.code === '021-001-P-010' || response.data.code === '018-001-B-000' || typeof (res) === 'string') {
      removeToken()
      sessionStorage.removeItem(process.env.VUE_APP_PARAM + '_AREA')
      sessionStorage.removeItem(process.env.VUE_APP_PARAM + '_REQUESTURL')
      localStorage.removeItem(process.env.VUE_APP_PARAM + '_MENU')
      localStorage.removeItem(process.env.VUE_APP_PARAM + '_MENUIDLIST')
      Message.error('请重新登录')
      setTimeout(() => {
        router.push({ path: '/login' })
      },1000)
      return Promise.reject('error')
    }
    // 请求不成功
    if (response.status !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return
    } else {
      if (response.data instanceof Blob) {
        return res
      }
      if (res.code !== 'undefined') {
        if (res.code !== '021-000-S-999' && res.code !== '021-000-P-009' && res.code !== '018-000-S-999' && res.code !== '018-000-P-001') {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject('error')
        } else {
          return res
        }
      } else {
        return res
      }
    }
  },
  error => {
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
