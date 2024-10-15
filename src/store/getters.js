/*
 * @Author: xiejun jun.xie@gtechhdigi.com
 * @Date: 2024-05-17 10:55:32
 * @LastEditors: xiejun jun.xie@gtechhdigi.com
 * @LastEditTime: 2024-10-05 17:26:25
 * @FilePath: /yesPay_admin_vue - 副本/src/store/getters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  isMobile: state => state.app.isMobile
}
export default getters
