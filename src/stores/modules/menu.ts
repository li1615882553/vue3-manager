import { defineStore } from 'pinia';
import { ywxtMenus, getMenus } from "@/api/menu";
interface Iywxt {
  hidden: boolean,
  icon: string,
  path: string,
  title: string
}
interface menuState {
  menus: { [key: string]: any },
  defaultHref?: string,
  ywxt: Array<Iywxt>
}

export const useMenuStore = defineStore('menu', {
  state: (): menuState => {
    return {
      menus: {},
      defaultHref: undefined,
      ywxt: []
    }
  },
  getters: {
    getMenus(): menuState['menus'] {
      return this.menus;
    },
    getDefaultHref(): menuState['defaultHref'] {
      return this.defaultHref;
    },
    getYwxt(): menuState['ywxt'] {
      return this.ywxt;
    }
  },
  actions: {
    setYWXT(ywxts: any) {
      this.ywxt = ywxts || [];
      if (!ywxts || !ywxts.length) {
        this.defaultHref = undefined
        return
      }
      this.defaultHref = `/${ywxts[0].path}`
    },
    obtainMenus(sysInfo: { name: string }) {
      return getMenus(sysInfo.name).then(data => {
        this.menus[sysInfo.name] = data;
      })
    },
    obtainYwxt() {
      return ywxtMenus().then((ywxts: any) => {
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