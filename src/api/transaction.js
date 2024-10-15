import request from '@/utils/request'

// 订单列表
export function orderPay(data) {
  return request({
    url: '/orderPay/page',
    method: 'post',
    data
  })
}

// 订单状态枚举
export function orderStatus() {
  return request({
    url: '/orderPay/orderStatus',
    method: 'get',
    params: {  }
  })
}

// 批量退单
export function batchChargebackPay(data) {
  return request({
    url: '/orderPay/batchChargebackPay',
    method: 'post',
    data
  })
}

// 批量补单
export function batchFillingPay(data) {
  return request({
    url: '/orderPay/batchFillingPay',
    method: 'post',
    data
  })
}

// 批量补发通知
export function batchNotifyMerchant(data) {
  return request({
    url: '/orderPay/batchNotifyMerchant',
    method: 'post',
    data
  })
}

// 跟新银行卡信息
export function update_card(data) {
  return request({
    url: '/orderPay/matchingRule',
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

// 订单操作记录查询
export function listOrderOperationLog(platOrderNum) {
  return request({
    url: '/orderPay/listOrderOperationLog/' + platOrderNum,
    method: 'get',
    params: { 
    
     }
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

// 通道类型枚举
export function channelType() {
  return request({
    url: '/channel/channelType',
    method: 'get',
    params: {  }
  })
}

// 订单匹配规则枚举

export function matchingRule() {
  return request({
    url: '/orderPay/matchingRule',
    method: 'get',
    params: {  }
  })
}

// 银行卡信息详情
export function get_cardInfo(id) {
  return request({
    url: '/cardInfo/getById',
    method: 'get',
    params: {  
      id,
    }
  })
}

// 订单操作枚举
export function orderOperation() {
  return request({
    url: '/orderPay/orderOperation',
    method: 'get',
    params: {  }
  })
}