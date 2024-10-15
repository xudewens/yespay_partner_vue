import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }

// 角色创建
export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}

// 角色分页
export function role_page(data) {
  return request({
    url: '/role/page',
    method: 'post',
    data
  })
}

// 更新用户对应角色
export function updateUserRole(data) {
  return request({
    url: '/role/updateUserRole',
    method: 'post',
    data
  })
}

// 更新角色对应用户
export function updateRoleUser(data) {
  return request({
    url: '/role/updateRoleUser',
    method: 'post',
    data
  })
}

// 角色更新
export function updateRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data
  })
}

// 查询角色详情数据
export function get_roleInfo(id) {
  const url = '/role/getById/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 获取用户权限树
export function get_permissionTree(id) {
  const url = '/role/getPermissionTreeByUserId/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 查询角色和相关用户数据
export function get_roleUser(id) {
  const url = '/role/getRoleUserById/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 获取用户角色列表
export function get_listRoleByUserId(id) {
  const url = '/role/listRoleByUserId/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 用户分页
export function user_page(data) {
  return request({
    url: '/user/page',
    method: 'post',
    data
  })
}

// 用户创建
export function user_addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

// 查询用户详情数据
export function get_userDetail(id) {
  const url = '/user/getDetailById/' + id
  return request({
    url: url,
    method: 'get',
    params: {  
      
    }
  })
}

// 谷歌验证器解绑
export function user_unbind(data) {
  return request({
    url: '/user/admin/unbind',
    method: 'post',
    data
  })
}

// 管理员修改登陆密码（编辑员工）
export function updateUser(data) {
  return request({
    url: '/user/admin/updateUser',
    method: 'post',
    data
  })
}