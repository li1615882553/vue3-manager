import type { RouteRecordRaw } from "vue-router";
import type { App } from 'vue';

import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/layout/index.vue";

const subSysRouterMeta = import.meta.glob('@/systems/**/router/*.ts', { eager: true });
const subSysRouter = Object.keys(subSysRouterMeta).map(path => {
  const keys = path.split('/')[2];
  const value: any = subSysRouterMeta[path];  // 返回引入的信息
  return value.default[0];
})

const allRouter = [].concat(...subSysRouter);
// 无需权限的路由
const withoutAuthorityRoot: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/404',
    component: () => import('../views/errorPage/404.vue')
  },
  {
    path: '/logout',
    component: () => import('../views/logout/index.vue')
  }
]
const layoutRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => Layout,
    children: [
      ...allRouter
    ]
  },
  {
    name: 'NotFound',
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]
const routers = withoutAuthorityRoot.concat(layoutRouter)

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers
})

// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router);
}
