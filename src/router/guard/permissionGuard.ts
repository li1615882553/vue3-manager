import type { Router } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useMenuStore } from '@/stores/modules/menu';
import { useAppStore } from '@/stores/modules/app';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import cookieAuthInfo from "@/util/cookie";
import { getSystemFromPath } from "@/util";
import FrmConfig from "@/config";


export function createPermissionGuard(router: Router) {
  const menuStore = useMenuStore();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const NEEDNOT_AUTH = ['/login', '/404']
  const NEEDNOT_REDIRECT = ['/404', '/', '/401', '/logout']

  function beforAuthGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    //有token 或者 没有token跳转的是不需要登陆信息的页面则 允许跳转
    if (cookieAuthInfo.token || NEEDNOT_AUTH.indexOf(to.path) !== -1) {
      return next();
    }
    //没有token,则跳往登录页
    nextLogin(next, to.path);
  }

  //拦截登陆也的路由
  //拦截起始页的路由, 跳转到第一个业务系统
  async function startPathGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    if (to.path !== "/") {
      return next();
    }
    let href = menuStore.getDefaultHref;
    if (!href) {
      try {
        await menuStore.getYwxt()
        const redirect = to.query.redirect && decodeURIComponent(to.query['redirect'] as string)
        next(redirect || menuStore.getDefaultHref!)
        return;
      } catch (e) {
        return next('/401');
      }
    }
    from.path === href ? next(false) : next(href)
  }

  async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    if (NEEDNOT_AUTH.indexOf(to.path) !== -1) {
      return next()
    }

    if (!userStore.getUserInfo && !(await recoverUserInfo())) {
      return nextLogin(next, to.path)
    }
    return next();
  }

  //切换系统时调用
  async function changeSysGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const toSysName = getSystemFromPath(to.path)
    const currSysName = appStore.getCurSystem;
    const toSysConfig = FrmConfig.sysConfig[toSysName]
    const currSysConfig = currSysName && FrmConfig.sysConfig[currSysName]

    if (!toSysConfig) {
      currSysConfig && currSysConfig.leave && (await currSysConfig.leave());
      next();
      return;
    }

    appStore.changeSys(toSysConfig);
    await menuStore.obtainMenus({ name: toSysName });

    currSysConfig && currSysConfig.leave && (await currSysConfig.leave())
    toSysConfig.enter && (await toSysConfig.enter())
    to.path === `/${toSysName}` && toSysConfig.startPage !== '/' ? next(`/${toSysName}${toSysConfig.startPage}`) : next()

    next();
  }

  //验证信息失败,退汇登录页
  function nextLogin(next: NavigationGuardNext, path: string) {
    userStore.clearUserConfig();
    if (NEEDNOT_REDIRECT.indexOf(path) !== -1) {
      return next('/login');
    }
    next({
      path: '/login',
      query: {
        redirect: encodeURIComponent(path)
      }
    })
  }

  async function recoverUserInfo() {
    try {
      await userStore.recoverUserInfo(cookieAuthInfo.token!);
      await menuStore.getYwxt();
      return true;
    } catch (err) {
      return false
    }
  }

  router.beforeEach(beforAuthGuard);
  router.beforeEach(startPathGuard);
  router.beforeEach(authGuard);
  router.beforeEach(changeSysGuard);
}