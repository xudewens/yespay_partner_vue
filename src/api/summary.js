import request from '@/utils/request'

// 统计中心-卡交易日报表
export function dayReport(data) {
  return request({
    url: '/summary/center/card/dayReport',
    method: 'post',
    data
  })
}

// 日报表详情
export function dayReport_detail(data) {
  return request({
    url: '/summary/center/card/dayReport/detail',
    method: 'post',
    data
  })
}

// 卡交易日报表-导出
export function dayReport_export(data) {
  return request({
    url: '/summary/center/card/dayReport/export',
    method: 'post',
    data
  })
}

// 查询导出订单数据
export function getOrderPayExcel(data) {
  return request({
    url: '/summary/center/card/dayReport/exportList',
    method: 'post',
    data
  })
}

// 统计中心-商户交易日报表
export function mchDailyTradePage(data) {
  return request({
    url: '/mchDailyTradeStatistics/page',
    method: 'post',
    data
  })
}

// 商户日报表详情
export function mchDailyTradePage_detail(data) {
  return request({
    url: '/mchDailyTradeStatistics/detail',
    method: 'post',
    data
  })
}

// 商户交易日报表-导出
export function mchDailyTrade_export(data) {
  return request({
    url: '/mchDailyTradeStatistics/export',
    method: 'post',
    data
  })
}

// 查询商户导出订单数据
export function mchDayReportExcel(data) {
  return request({
    url: '/mchDailyTradeStatistics/mchDayReport/exportList',
    method: 'post',
    data
  })
}
