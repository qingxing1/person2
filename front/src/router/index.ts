import { shallowRef } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Layout from '../layout/index.vue'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  }
]

/** 使用 shallowRef 消除 警告 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: shallowRef(Layout),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/boke',
    component: shallowRef(Layout),
    redirect: '/boke/info',
    meta: { title: '博客', icon: 'permission' },
    children: [
      {
        path: '/boke/info',
        name: 'boke_info',
        component: () => import('@/views/boke/index.vue'),
        meta: { title: '博客列表', icon: 'boke' }
      },{
        path: '/boke/tag',
        name: 'boke_manage',
        component: () => import('@/views/boke/BokeManage.vue'),
        meta: { title: '标签管理', icon: 'boke' }
      }
    ]
  },
  {
    path: '/method',
    component: shallowRef(Layout),
    redirect: '/method/info',
    meta: { title: '算法', icon: 'computed' },
    children: [
      {
        path: '/method/info',
        name: 'method_info',
        component: () => import('@/views/method/index.vue'),
        meta: { title: '算法集合', icon: 'computed' }
      },
      {
        path: '/method/manage',
        name: 'method_manage',
        component: () => import('@/views/method/MethodManage.vue'),
        meta: { title: '分类设置', icon: 'computed' }
      }
    ]
  },
  {
    path: '/perm',
    component: shallowRef(Layout),
    name: 'perm',
    redirect: '/perm/users',
    meta: { title: '权限管理', icon: 'permission' },
    children: [
      {
        path: 'users',
        component: () => import('@/views/permission/users/index.vue'),
        name: 'perm_users',
        meta: { title: '用户管理' }
      },
      {
        path: 'depts',
        component: () => import('@/views/permission/depts/index.vue'),
        name: 'perm_depts',
        meta: { title: '部门管理' }
      },
      {
        path: 'posts',
        component: () => import('@/views/permission/posts/index.vue'),
        name: 'perm_posts',
        meta: { title: '岗位管理' }
      },
      {
        path: 'roles',
        component: () => import('@/views/permission/roles/index.vue'),
        name: 'perm_roles',
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/system',
    component: shallowRef(Layout),
    meta: { title: '系统设置', icon: 'system' },
    name: 'system',
    redirect: '/system/menus',
    children: [
      {
        path: 'menus',
        component: () => import('@/views/system/menus/index.vue'),
        name: 'system_menus',
        meta: { title: '资源管理' }
      },
      {
        path: 'oss',
        component: () => import('@/views/system/oss/index.vue'),
        name: 'system_oss',
        meta: { title: '文件列表' }
      }
    ]
  },
  {
    path: '/person',
    component: shallowRef(Layout),
    meta: { title: '个人信息', icon: 'person' },
    name: 'person',
    redirect: '/person/info',
    children: [
      {
        path: 'info',
        component: () => import('@/views/person/info/index.vue'),
        name: 'person_info',
        meta: { title: '信息设置' }
      },
      {
        path: 'message',
        component: () => import('@/views/person/information/index.vue'),
        name: 'person_information',
        meta: { title: '信息留言' }
      },
      {
        path: 'collect',
        component: () => import('@/views/person/collect/index.vue'),
        name: 'person_collect',
        meta: { title: '收藏管理' }
      }
    ]
  },
  {
    path: '/front',
    name: 'front',
    beforeEnter() {
      // 跳转到外部地址
      window.location.href = 'http://qiao252423.top'
    },
    component: () => import('@/views/front/index.vue'), // 需要提供一个组件，但实际不会被渲染
    meta: { title: '前端展示', icon: 'front' }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
