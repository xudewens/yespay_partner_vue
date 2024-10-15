import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import config from './baseurl.js'
import './icons'
import './permission'
import * as filters from './filters'
import '@/styles/index.scss'
import './directive/search/search.css'
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
Vue.use(ElementUI)
import moment from 'moment'
Vue.prototype.$moment = moment
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import copyTable from './directive/copyTable/copyTable' // 点击单元格复制
Vue.use(copyTable)
import { formatCheck } from './utils/formatVerification.js' // 密码格式校验
Vue.prototype.$formatCheck = formatCheck
import { preventReClick } from './utils/preventReClick' // 防止请求按钮重复点击
Vue.use(preventReClick)
import exportDownload from './components/Export/exportDownload.vue' // 导出组件
Vue.component('exportDownload', exportDownload)
Vue.use(exportDownload)

Vue.config.productionTip = false
Vue.prototype.baseUrl = config.baseUrl

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.filter('formatNumber', function(value) {
  if (isNaN(value)) {
    return value;
  }
  
  let formattedNumber = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  if (Number.isInteger(value)) {
    return formattedNumber; // 整数，直接返回千分位格式
  } else {
    if (value % 1 === 0) {
      return formattedNumber; // 小数点后面都是0，返回整数千分位格式
    } else {
      return value.toLocaleString(); // 小数点后面不全是0，返回原数的千分位格式
    }
  }
});

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
