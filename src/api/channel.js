import request from '@/utils/request'

// 添加通道
export function addChannel(data) {
  return request({
    url: '/channel/addChannel',
    method: 'post',
    data
  })
}

// 查询所有通道
export function allChannel(data) {
  return request({
    url: '/channel/allChannel',
    method: 'post',
    data
  })
}

// 查询通道列表
export function channel_page(data) {
  return request({
    url: '/channel/page',
    method: 'post',
    data
  })
}

// 更新通道和银行卡绑定状态
export function channelCardUpdate(data) {
  return request({
    url: '/channel/channelCardUpdate',
    method: 'post',
    data
  })
}

// 商户和通道绑定列表更新
export function mchChannelUpdate(data) {
  return request({
    url: '/channel/mchChannelUpdate',
    method: 'post',
    data
  })
}

// 更新通道
export function updateChannel(data) {
  return request({
    url: '/channel/updateChannel',
    method: 'post',
    data
  })
}

// 通道类型枚举
export function get_channelType() {
  return request({
    url: '/channel/channelType',
    method: 'get',
    params: {  
 
    }
  })
}

// 通道对应商户信息
export function listByChannelId(id) {
  return request({
    url: '/mchInfo/listByChannelId/' + id,
    method: 'get',
    params: {  
 
    }
  })
}

// 通道对应商户信息
export function getcardInfoChannelId(id) {
  return request({
    url: '/cardInfo/listByChannelId/' + id,
    method: 'get',
    params: {  
 
    }
  })
}