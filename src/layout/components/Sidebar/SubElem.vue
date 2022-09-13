<template>
  <fragment>
    <template v-if="noChild">
      <router-link :to="resolvePath(item, item.path)">
        <el-menu-item :index="resolvePath(item, item.path)">
          <elem-item :icon="!!item.icon ? item.icon : ( isactive ?  defaultActiveIcon : defaultIcon)"
            :title="item.name" />
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu v-else :index="resolvePath(item, item.path)" popper-append-to-body>
      <template v-slot:title>
        <elem-item :icon="!!item.icon ? item.icon : ( isactive ?  defaultActiveIcon : defaultIcon)" :title="item.name">
        </elem-item>
      </template>
      <sub-elem v-for="child in item.children" :key="child.path" :item="child"
        :base-path="resolvePath(item, item.path)">
      </sub-elem>
    </el-submenu>
  </fragment>
</template>
<script lang="ts">
import path from "path";
import ElemItem from "./ElemItem.vue";
import { defineComponent, computed, ref } from 'vue';
import { useRoute } from 'vue-router'
export default defineComponent({
  name: "SubElem",
  components: { ElemItem },
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const route = useRoute()
    const isactive = ref(false);
    const defaultIcon = "start", defaultActiveIcon = "full-start";

    const noChild = computed(() => !props.item.children || !props.item.children.length);

    function resolvePath(route:any, routePath:string) {
      const curLevelPath =
        routePath.indexOf("/") === 0 ? routePath.slice(1) : routePath;
      const resolvePath = path.resolve(props.basePath, curLevelPath);
      if (noChild) {
        isactive.value = route.path === resolvePath
      } else {
        isactive.value = route.path.startsWith(resolvePath);
      }
      return resolvePath;
    }

    return {
      isactive,
      defaultIcon,
      defaultActiveIcon,
      noChild,
      resolvePath
    }
  }
});
</script>