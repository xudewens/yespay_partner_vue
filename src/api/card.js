import request from '@/utils/request'

// 卡商列表
export function dealerInfo_table(data) {
  return request({
    url: '/dealerInfo/page',
    method: 'post',
    data
  })
}

// 新增卡商
export function add_dealerInfo(data) {
  return request({
    url: '/dealerInfo/addDealer',
    method: 'post',
    data
  })
}

// 编辑卡商
export function update_dealerInfo(data) {
  return request({
    url: '/dealerInfo/updateDealer',
    method: 'post',
    data
  })
}

// 卡商卡列表
export function cardInfo_table(data) {
  return request({
    url: '/cardInfo/page',
    method: 'post',
    data
  })
}

// 添加银行卡
export function add_card(data) {
  return request({
    url: '/cardInfo/addCard',
    method: 'post',
    data
  })
}

// 更新银行卡信息
export function update_card(data) {
  return request({
    url: '/cardInfo/updateCard',
    method: 'post',
    data
  })
}

// 卡流水分页
export function cardFlow_page(data) {
  return request({
    url: '/cardFlow/page',
    method: 'post',
    data
  })
}
// 导出
export function writeCardFlowExcel(data) {
  return request({
    url: '/cardFlow/writeCardFlowExcel',
    method: 'post',
    data
  })
}

// 查询导出列表
export function getCardFlowExcel(data) {
  return request({
    url: '/cardFlow/getCardFlowExcel',
    method: 'post',
    data
  })
}

// 更新银行卡 流水同步状态

export function updateCardDataSync(data) {
  return request({
    url: '/cardInfo/updateCardDataSync',
    method: 'post',
    data
  })
}

// 更新银行卡规则信息
export function update_cardRule(data) {
  return request({
    url: '/cardInfo/updateCardRule',
    method: 'post',
    data
  })
}

// 银行卡业务类型枚举
export function bankCardBiz() {
  return request({
    url: '/cardInfo/bankCardBiz',
    method: 'get',
    params: {  }
  })
}

// 银行卡状态枚举
export function bankCardState() {
  return request({
    url: '/cardInfo/bankCardState',
    method: 'get',
    params: {  }
  })
}

// 银行卡主体枚举
export function bankCardSubject() {
  return request({
    url: '/cardInfo/bankCardSubject',
    method: 'get',
    params: {  }
  })
}

// 银行枚举
export function bankEnum() {
  return request({
    url: '/cardInfo/bankEnum',
    method: 'get',
    params: {  }
  })
}

// 银行卡信息详情
export function get_cardInfo(id) {
  const url = '/cardInfo/getById/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 银行卡信息详情
export function listByChannelId(id) {
  const url = 'cardInfo/listByChannelId/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 银行卡规则信息详情
export function get_cardRule(id) {
  const url = '/cardInfo/getRuleById/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 订单匹配规则枚举
export function get_matchingRule(id) {
  return request({
    url: '/orderPay/matchingRule',
    method: 'get',
    params: {  
      id,
    }
  })
}


// 管理员用户操作记录查询
export function get_userOperationLogList(id) {
  const url = '/user/userOperationLogList/' + id
  return request({
    url: url,
    method: 'get',
    params: {  

    }
  })
}


// 管理员账户操作枚举
export function get_adminOperation() {
  const url = '/user/adminOperation'
  return request({
    url: url,
    method: 'get',
    params: {  

    }
  })
}

// 订单导出
export function writeOrderPayExcel(data) {
  return request({
    url: '/orderPay/writeOrderPayExcel',
    method: 'post',
    data
  })
}

// 查询订单导出列表
export function getOrderPayExcel(data) {
  return request({
    url: '/orderPay/getOrderPayExcel',
    method: 'post',
    data
  })
}

// 卡流水分页 - 顶部汇总
export function cardFlow_summary(data) {
  return request({
    url: '/cardFlow/page/summary',
    method: 'post',
    data
  })
}

// 订单查询-上方汇总统计
export function orderPay_summary(data) {
  return request({
    url: '/orderPay/page/summary',
    method: 'post',
    data
  })
}

// 银行流水同步记录查询
export function cardDataSyncFlowPage(data) {
  return request({
    url: '/cardInfo/cardDataSyncFlowPage',
    method: 'post',
    data
  })
}