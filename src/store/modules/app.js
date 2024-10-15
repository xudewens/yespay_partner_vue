
import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get(process.env.VUE_APP_PARAM + '_sidebarStatus') ? !!+Cookies.get(process.env.VUE_APP_PARAM + '_sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get(process.env.VUE_APP_PARAM + '_size') || 'medium',
  isMobile: false
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set(process.env.VUE_APP_PARAM + '_sidebarStatus', 1)
    } else {
      Cookies.set(process.env.VUE_APP_PARAM + '_sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set(process.env.VUE_APP_PARAM + '_sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set(process.env.VUE_APP_PARAM + '_size', size)
  },
  setIsMobile: (state, value) => {
    state.isMobile = value
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  updateIsMobile({ commit }, value) {
    commit('setIsMobile', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
