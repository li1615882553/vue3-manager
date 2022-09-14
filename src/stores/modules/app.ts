import { defineStore } from 'pinia'

interface sysInfo{
  name:string,
  path:string,
  title: string,
  icon: string
}
interface appState {
  curSys?: string,
  sysInfos: Array<sysInfo>,
  sidebar: boolean
}

export const useAppStore = defineStore('app', {
  state: (): appState => {
    return {
      curSys: undefined,
      sysInfos: [],
      sidebar: false
    }
  },
  getters: {
    getSubSystems(): appState['sysInfos'] {
      return this.sysInfos;
    },
    getCurSystem(): appState['curSys'] {
      return this.curSys;
    },
    getSidebarCollapse(): appState['sidebar'] {
      console.log(`sidebar  ${this.sidebar}`)
      return this.sidebar;
    }
  },
  actions: {
    changeSys(sysInfo: sysInfo) {
      if (!this.sysInfos.filter(i => i.name === sysInfo.name).length) {
        this.sysInfos.push(sysInfo);
      }
      this.curSys = sysInfo.name;
    },
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
    clearSysInfo() {
      this.curSys = undefined;
      this.sysInfos = [];
    }
  }
})