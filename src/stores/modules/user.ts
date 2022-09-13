import { defineStore } from 'pinia';
import cookieAuthInfo from "@/util/cookie";
import { login as userLogin, logout as userLogout, getUserInfo } from "@/api/user";
import { router } from '@/router';
import { useMenuStore } from "./menu";
import { useAppStore } from "./app";

const LOGOUT_TIMEOUT = 600000; // 10min 
const CHECK_TIMEOUT_FREQUENCY = 2000;

interface userState {
  userInfo?: {username:string, token:string},
  clockStartTime: null,
  clockhandle: null,
  delayLogoutCb: null
}

export const useUserStore = defineStore('user', {
  state: (): userState => {
    return {
      userInfo: undefined,
      clockStartTime: null,
      clockhandle: null,
      delayLogoutCb: null
    }
  },
  getters:{
    getUserInfo():userState['userInfo']{
      return this.userInfo;
    }
  },
  actions: {
    login(loginInfo: { username: string, password: string }) {
      return userLogin(loginInfo).then(res => configUserinfo.call(this, res))
    },
    logout() {
      userLogout();
      window.setTimeout(() => {
        clearUserConfig.call(this);
        router.replace('/login');
      }, 0);
    },
    clearUserConfig() {
      clearUserConfig.call(this);
    },
    recoverUserInfo(token: string) {
      return getUserInfo(token).then(userinfo => {
        configUserinfo.call(this, userinfo);
      })
    }
  }
})

//开启自动退出定时器
function startClock(this: any) {
  const lougoutCb = delayLogout.bind(this);
  if (this.delayLogoutCb) {
    window.removeEventListener('click', this.delayLogoutCb, true)
  }
  window.addEventListener('click', lougoutCb, true);
  this.delayLogoutCb = lougoutCb;
  return window.setInterval(checkClock.bind(this), CHECK_TIMEOUT_FREQUENCY);
}

function delayLogout(this: any) {
  this.clockStartTime = Date.now();
}

function checkClock(this:any) {
  if (Date.now() - this.clockStartTime < LOGOUT_TIMEOUT) {
    return;
  }
  router.replace('/logout');
}

//清除当前用户登陆信息
function clearUserConfig(this:any) {
  if(this.delayLogoutCb){
    window.removeEventListener('click', this.delayLogoutCb, true);
    this.delayLogoutCb = null;
  }
  this.clockStartTime = 0;
  if(this.clockhandle){
    window.clearInterval(this.clockhandle);
  }
  this.clockhandle = null;
  this.userinfo = null;
  useMenuStore().setYWXT(null);
  useAppStore().clearSysInfo();
  cookieAuthInfo.token = undefined;
  cookieAuthInfo.username = undefined;
}

//配置用户的登陆信息
function configUserinfo(this: any, res: any) {
  this.clockStartTime = Date.now();
  if (this.clockhandle) {
    window.clearInterval(this.clockhandle);
  }
  this.clockhandle = startClock.call(this);
  this.userInfo = res;

  cookieAuthInfo.token = res.token;
  cookieAuthInfo.username = res.username;
  return this.userInfo;
}