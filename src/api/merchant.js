import request from '@/utils/request'

// 商户列表
export function mchInfo_table(data) {
  return request({
    url: '/mchInfo/page',
    method: 'post',
    data
  })
}


// 添加商户
export function mchInfo_addMch(data) {
  return request({
    url: '/mchInfo/addMch',
    method: 'post',
    data
  })
}

// 更新商户
export function mchInfo_updateMch(data) {
  return request({
    url: '/mchInfo/updateMch',
    method: 'post',
    data
  })
}
