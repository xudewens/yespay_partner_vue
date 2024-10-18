import { login, logout} from '@/api/cardMch'
// logout
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import MD5 from 'crypto-js/md5'
import { flattenTree } from '@/filters'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, googleCode } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: MD5(password).toString().toUpperCase(),
        googleCode: googleCode || undefined
      }).then(response => {
        // 登录成功并且已绑定谷歌验证码
        console.log(response,'======response====')
        if (response.code === '021-000-S-999' && response.data.bindGoogle) {
          // const menuIds =  flattenTree(response.data.permissionTree)
          Cookies.set(process.env.VUE_APP_PARAM + '_TOKEN', response.data.token) // token
          localStorage.setItem(process.env.VUE_APP_PARAM + '_USERNAME', username) // 用户名
          // localStorage.setItem(process.env.VUE_APP_PARAM + '_USERTYPE', username === 'admin' ? username : 'user') // 用户身份 response.data.userType
          // localStorage.setItem(process.env.VUE_APP_PARAM + '_MENU', JSON.stringify(response.data.permissionTree)) // 菜单
          localStorage.setItem(process.env.VUE_APP_PARAM + '_USERID', response.data.userId) // 用户名
          localStorage.setItem('TimeZone', response.data.timeZone) // 登录时区
          // localStorage.setItem(process.env.VUE_APP_PARAM + '_MENUIDLIST',JSON.stringify(menuIds)) // 用户名
          resolve()
        } else {
          resolve(response)
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      sessionStorage.removeItem(process.env.VUE_APP_PARAM + '_AREA')
      sessionStorage.removeItem(process.env.VUE_APP_PARAM + '_REQUESTURL')
      localStorage.removeItem(process.env.VUE_APP_PARAM + '_MENU')
      localStorage.removeItem(process.env.VUE_APP_PARAM + '_MENUIDLIST')
      localStorage.removeItem('TimeZone') // 登录时区
      // dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
