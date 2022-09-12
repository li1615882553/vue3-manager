<template>
  <div class="wrapper">
    <Header></Header>
    <Sidebar></Sidebar>
    <div class="content-box" :class="{ 'content-collapse': sidebarCollapse }">
      <transition name="move" mode="out-in">
        <keep-alive :include="tagsList">
          <router-view></router-view>
        </keep-alive>
      </transition>
      <el-backtop target=".content"></el-backtop>
    </div>
  </div>
</template>
<script>
import Header from "./components/Header/index.vue";
import Sidebar from "./components/Sidebar/index.vue";
import { reactive, computed, defineComponent } from "vue";
import { useAppStore } from "@/stores/app";


export default defineComponent({
  name: "Layout",
  components: { Header, Sidebar },
  setup() {
    const appStore = useAppStore();
    
    const tagsList = reactive([]);
    const sidebarCollapse =  computed(() => appStore.getSidebarCollapse);

    return {
      tagsList,
      sidebarCollapse
    }
  },
})
</script>
<style lang="scss" scoped>
.content-box {
  display: flex;
  flex-direction: column;
}
</style>
