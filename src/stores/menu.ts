import { defineStore } from 'pinia';
import { ywxtMenus, getMenus } from "@/api/menu";

interface menuState {
  menus: { [key: string]: any },
  defaultHref: null | string,
  ywxt: []
}

export const useMenuStore = defineStore('menu', {
  state: (): menuState => {
    return {
      menus: {},
      defaultHref: null,
      ywxt: []
    }
  },
  getters:{
    getMenus():menuState['menus'] {
      return this.menus;
    }
  },
  actions: {
    setYWXT(ywxts:any){
      this.ywxt = ywxts || [];
      if (!ywxts || !ywxts.length) {
        this.defaultHref = null
        return
      }
      this.defaultHref = `/${ywxts[0].path}`
    },
    obtainMenus(sysInfo: { name: string }) {
      return getMenus(sysInfo.name).then(data => {
        this.menus[sysInfo.name] = data;
      })
    },
    getYwxt() {
      return ywxtMenus().then((ywxts:any) => {
        if (!ywxts) {
          this.setYWXT(ywxts)
          throw new Error('未能正确获取业务系统')
        }
        this.setYWXT(ywxts)
        return ywxts
      })
    }
  }
})