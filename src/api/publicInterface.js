import request from '@/utils/request'
// 公共接口


// 查询导出列表
export function query_ExportDatas(data) {
  return request({
    url: '/export/queryExportDatas',
    method: 'post',
    data
  })
}

// 文件下载
export function downLoad(data) {
  return request({
    url: '/export/downLoad',
    method: 'post',
    responseType: 'blob',
    timeout: 60000,
    data
  })
}

// 密码生成
export function password_general(data) {
  return request({
    url: '/common/generic/pw',
    method: 'post',
    data
  })
}

// 修改登录密码
export function update_LoginPassword(data) {
  return request({
    url: '/sysUser/updateLoginPassword',
    method: 'post',
    data
  })
}

// 获取当地时间
export function get_LocalDate(data) {
  return request({
    url: '/common/getLocalDate',
    method: 'post',
    data
  })
}
