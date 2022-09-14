<template>
  <div class="wrapper">
    <Header></Header>
    <Sidebar></Sidebar>
    <div class="content-box" :class="{ 'content-collapse': sidebarCollapse }">
      <Tags></Tags>
      <RouterView v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </RouterView>
      <el-backtop target=".content"></el-backtop>
    </div>
  </div>
</template>
<script>
import Header from "./components/Header/index.vue";
import Sidebar from "./components/Sidebar/index.vue";
import Tags from "./components/Tags/index.vue";
import { reactive, computed, defineComponent } from "vue";
import { useAppStore } from "@/stores/modules/app";

export default defineComponent({
  name: "Layout",
  components: { Header, Sidebar, Tags },
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
