/* Layout */
import Layout from '@/layout'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import { flattenTree } from '@/filters'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    area: 'ALL'
  },
  {
    path: '/',
    component: Layout,
    redirect: '/merchantManage',
    roles: ['user', 'admin'],
    hidden: true,
    area: 'ALL'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    area: 'ALL'
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [{
      path: '/blankPage',
      component: () => import('@/views/login/blankPage'),
      hidden: true
    }]
  }
]
// yesPay后台菜单
export const defaultRoutes = [
  {
    path: '/',
    component: Layout,
    title: '首页',
    id: '3',
    children: [

      {
        path: '/homePage',
        name: 'homePage',
        id: '3001',
        parentsId: '4',
        hidden: true,
        component: () => import('@/views/homePage'),
        meta: {
          // 卡商新增
          title: '首页',
          icon: 'dashboard',
          keepAlive: false
        }
      }

    ]
  },
  {
    path: '/',
    component: Layout,
    title: '卡商管理',
    id: '4',
    children: [
      {
        path: '/merchantManage',
        name: 'cardMerchantList',
        component: () => import('@/views/cardMerchant/index.vue'),
        id: '4001',
        parentsId: '4',
        meta: {
          title: '卡商管理',
          icon: 'dashboard',
          keepAlive: true
        },
        beforeEnter: (to, from, next) => {
          const roleList = JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_MENU'))
          const roleIdList = flattenTree(roleList)
          if (roleIdList.includes('10010001')) {
            next()
          } else {
            next('/blankPage')
          }
        }
      },
      {
        path: '/cardMerchant/addcardMerchant',
        name: 'AddcardMerchant',
        id: '4002',
        parentsId: '4',
        hidden: true,
        component: () => import('@/views/cardMerchant/addcardMerchant'),
        meta: {
          // 卡商新增
          title: '新增卡商',
          icon: 'dashboard',
          keepAlive: false
        }
      },
      {
        path: '/cardMerchant/addcardMerchantEdit',
        name: 'AddcardMerchant',
        id: '4003',
        parentsId: '4',
        hidden: true,
        component: () => import('@/views/cardMerchant/addcardMerchant'),
        meta: {
          // 卡商新增
          title: '编辑卡商',
          icon: 'dashboard',
          keepAlive: false
        }
      },
      {
        path: '/cardMerchant/cardMerchantCard',
        name: 'cardMerchantCard',
        component: () => import('@/views/cardMerchant/cardMerchantCard'),
        id: '4001',
        parentsId: '4',
        meta: {
          title: '卡商卡管理',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/cardMerchant/addCardMerchantCard',
        name: 'addCardMerchantCard',
        id: '4002',
        parentsId: '4',
        hidden: true,
        component: () => import('@/views/cardMerchant/addCardMerchantCard'),
        meta: {
          // 新增卡商卡新增
          title: '新增卡商卡',
          icon: 'dashboard',
          keepAlive: false
        }
      },
      {
        path: '/cardMerchant/addCardMerchantCardEdit',
        name: 'addCardMerchantCard',
        id: '4003',
        parentsId: '4',
        hidden: true,
        component: () => import('@/views/cardMerchant/addCardMerchantCard'),
        meta: {
          // 编辑卡商卡新增
          title: '编辑卡商卡',
          icon: 'dashboard',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    title: '商户管理',
    id: '5',
    roles: ['user', 'admin'],
    children: [
      {
        path: '/merchantManage/list',
        name: 'merchantManageList',
        component: () => import('@/views/merchantManage/index'),
        id: '5001',
        parentsId: '5',
        meta: {
          title: '商户管理',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/merchantManage/addMerchant',
        name: 'addMerchant',
        id: '5002',
        parentsId: '5',
        hidden: true,
        component: () => import('@/views/merchantManage/addMerchant'),
        meta: {
          // 卡商新增
          title: '新增商户',
          icon: 'dashboard',
          keepAlive: false
        }
      },
      {
        path: '/merchantManage/addMerchantEdit',
        name: 'addMerchant',
        id: '5003',
        parentsId: '5',
        hidden: true,
        component: () => import('@/views/merchantManage/addMerchant'),
        meta: {
          // 卡商新增
          title: '编辑商户',
          icon: 'dashboard',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    title: '交易管理',
    id: '6',
    roles: ['user', 'admin'],
    children: [
      {
        path: '/transactionManage/collectionOrder',
        name: 'collectionOrder',
        component: () => import('@/views/transactionManage/collectionOrder'),
        id: '6001',
        parentsId: '6',
        meta: {
          title: '收款订单',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      // {
      //   path: '/transactionManage/disbursementOrder',
      //   name: 'disbursementOrder',
      //   component: () => import('@/views/transactionManage/disbursementOrder'),
      //   id:'6002',
      //   parentsId: '6',
      //   meta: {
      //     title: '出款订单',
      //     icon: 'dashboard',
      //     keepAlive: true
      //   }
      // },
      {
        path: '/transactionManage/batchOrders',
        name: 'batchOrders',
        component: () => import('@/views/transactionManage/batchOrders'),
        id: '6002',
        parentsId: '6',
        hidden: true,
        meta: {
          title: '操作订单',
          icon: 'dashboard',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    title: '统计中心',
    id: '9',
    children: [
      {
        path: '/statisticalCenter/cardDailyReport',
        name: 'collectionOrder',
        component: () => import('@/views/statisticalCenter/cardDailyReport'),
        id: '9001',
        parentsId: '9',
        meta: {
          title: '卡交易日报表',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/statisticalCenter/merchantDailyReport',
        name: 'collectionOrder',
        component: () => import('@/views/statisticalCenter/merchantDailyReport'),
        id: '9002',
        parentsId: '9',
        meta: {
          title: '商户交易日报表',
          icon: 'dashboard',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    title: '卡源流水',
    id: '7',
    roles: ['user', 'admin'],
    children: [
      {
        path: '/cardSerial/BRISerial',
        name: 'BRISerial',
        component: () => import('@/views/cardSerial/BRISerial'),
        id: '7001',
        parentsId: '7',
        meta: {
          title: 'BRI流水',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/cardSerial/BCASerial',
        name: 'BCASerial',
        component: () => import('@/views/cardSerial/BCASerial'),
        id: '7002',
        parentsId: '7',
        meta: {
          title: 'BCA流水',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/cardSerial/CIMBSerial',
        name: 'CIMBSerial',
        component: () => import('@/views/cardSerial/CIMBSerial'),
        id: '7003',
        parentsId: '7',
        meta: {
          title: 'CIMB流水',
          icon: 'dashboard',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    title: '运营管理',
    id: '8',
    roles: ['user', 'admin'],
    children: [
      // {
      //   path: '/operationManage/InfoReview',
      //   name: 'InfoReview',
      //   component: () => import('@/views/operationManage/InfoReview'),
      //   id:'8001',
      //   parentsId: '8',
      //   meta: {
      //     title: '信息审核',
      //     icon: 'dashboard',
      //     keepAlive: true
      //   }
      // },
      {
        path: '/operationManage/channelConfig',
        name: 'channelConfig',
        component: () => import('@/views/operationManage/channelConfig'),
        id: '8001',
        parentsId: '8',
        meta: {
          title: '通道配置',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/operationManage/cardDataSyncFlow',
        name: 'cardDataSyncFlow',
        component: () => import('@/views/operationManage/cardDataSyncFlow'),
        id: '8002',
        parentsId: '8',
        meta: {
          title: '银行卡同步相关',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '/operationManage/addChannel',
        name: 'addChannel',
        id: '8002',
        parentsId: '8',
        hidden: true,
        component: () => import('@/views/operationManage/addChannel'),
        meta: {
          // 新增通道
          title: '新增通道',
          icon: 'dashboard',
          keepAlive: false
        }
      },
      {
        path: '/operationManage/addChannelEdit',
        name: 'addChannel',
        id: '8003',
        parentsId: '8',
        hidden: true,
        component: () => import('@/views/operationManage/addChannel'),
        meta: {
          // 编辑通道
          title: '编辑通道',
          icon: 'dashboard',
          keepAlive: false
        }
      }
    ]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   title: '用户管理',
  //   id: '3',
  //   roles: ['admin'],
  //   children: [
  //     {
  //       path: '/personal/addUser/INDONESIA',
  //       name: 'IDAddUser',
  //       component: () => import('@/views/personalcenter/addUser.vue'),
  //       id: '3001',
  //       parentsId: '3',
  //       meta: {
  //         title: '新建用户',
  //         icon: 'list',
  //         keepAlive: true
  //       },
  //       beforeEnter: (to, from, next) => {
  //         if (localStorage.getItem(process.env.VUE_APP_PARAM + '_USERTYPE') === 'admin') {
  //           next()
  //         } else {
  //           next('/404')
  //         }
  //       }
  //     }
  //   ],
  // },
  // 系统管理
  {
    path: '/',
    component: Layout,
    title: '系统管理',
    id: '3',
    roles: ['user', 'admin'],
    children: [
      {
        path: '/systemManage/userManage',
        name: 'staffManagement',
        component: () => import('@/views/setting/staffManagement.vue'),
        id: '3001',
        parentsId: '3',
        meta: {
          title: '员工管理',
          icon: 'list',
          keepAlive: true
        }
      },
      {
        path: '/setting/addStaff',
        name: 'addStaff',
        component: () => import('@/views/setting/addStaff.vue'),
        id: '3002',
        parentsId: '3',
        hidden: true,
        meta: {
          title: '新增员工',
          icon: 'list',
          keepAlive: true
        }
      },
      {
        path: '/setting/addStaffEdit',
        name: 'addStaff',
        component: () => import('@/views/setting/addStaff.vue'),
        id: '3003',
        parentsId: '3',
        hidden: true,
        meta: {
          title: '编辑员工',
          icon: 'list',
          keepAlive: true
        }
      },
      {
        path: '/systemManage/roleManage',
        name: 'rolesManagement',
        component: () => import('@/views/setting/rolesManagement.vue'),
        id: '3004',
        parentsId: '3',
        meta: {
          title: '角色管理',
          icon: 'list',
          keepAlive: true
        }
      },
      {
        path: '/setting/addRoles',
        name: 'addRoles',
        component: () => import('@/views/setting/addRoles.vue'),
        id: '3005',
        parentsId: '3',
        hidden: true,
        meta: {
          title: '新增角色',
          icon: 'list',
          keepAlive: true
        }
      },
      {
        path: '/setting/addRolesEdit',
        name: 'addRoles',
        component: () => import('@/views/setting/addRoles.vue'),
        id: '3005',
        parentsId: '3',
        hidden: true,
        meta: {
          title: '编辑角色',
          icon: 'list',
          keepAlive: true
        }
      },
      {
        path: '/setting/relatedEmployees',
        name: 'relatedEmployees',
        component: () => import('@/views/setting/relatedEmployees.vue'),
        id: '3006',
        parentsId: '3',
        hidden: true,
        meta: {
          title: '关联员工',
          icon: 'list',
          keepAlive: true
        }
      }
    ]
  }
]

export const asyncRoutes = []

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...defaultRoutes]
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
