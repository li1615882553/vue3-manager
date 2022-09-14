<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :collapse="sidebarCollapse" :default-active="$route.path" background-color="#324157"
      active-text-color="#20a0ff" text-color="#bfcbd9">
      <sub-elem v-for="route in menus" :key="route.path" :item="route" :basePath="curSystem">
      </sub-elem>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SubElem from "./SubElem.vue";
import { useAppStore } from "@/stores/modules/app";
import { useMenuStore } from '@/stores/modules/menu';
export default defineComponent({
  components: { SubElem },
  setup() {
    const appStore = useAppStore();
    const menuStore = useMenuStore();

    const curSystem = computed(() => appStore.getCurSystem);
    const menus = computed(() => {
      const curSys = appStore.getCurSystem;
      var menuTemp = [];
      if (curSys && menuStore.getMenus[curSys] &&
        menuStore.getMenus[curSys][0] &&
        menuStore.getMenus[curSys][0]['children']
      ) {
        menuTemp = menuStore.getMenus[curSys][0]['children'];
      }
      return menuTemp;
    });
    const sidebarCollapse =  computed(() => appStore.getSidebarCollapse);

    return {
      curSystem,
      menus,
      sidebarCollapse
    }
  }
});
</script>

<style scoped lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar>ul {
  height: 100%;
}
</style>
