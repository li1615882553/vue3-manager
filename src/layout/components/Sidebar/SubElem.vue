<template>
  <template v-if="noChild">
    <router-link :to="resolvePath(item, item.path)">
      <el-menu-item :index="resolvePath(item, item.path)">
        <!-- <SvgIcon class="sidebar-svg" :name="!!item.icon ? item.icon : ( isactive ?  defaultActiveIcon : defaultIcon)">
        </SvgIcon>
        <template v-slot:title>
          <span>{{ item.name }}</span>
        </template> -->

        <elem-item :icon="!!item.icon ? item.icon : ( isactive ?  defaultActiveIcon : defaultIcon)"
          :title="item.name" />
      </el-menu-item>
    </router-link>
  </template>
  <el-sub-menu v-else :index="resolvePath(item, item.path)">
    <template v-slot:title>
      <elem-item :icon="!!item.icon ? item.icon : ( isactive ?  defaultActiveIcon : defaultIcon)" :title="item.name">
      </elem-item>
    </template>
    <sub-elem v-for="child in item.children" :key="child.path" :item="child" :basePath="resolvePath(item, item.path)">
    </sub-elem>
  </el-sub-menu>
</template>
<script lang="ts">
import ElemItem from "./ElemItem.vue";
import { defineComponent, computed, ref } from 'vue';
import { useRoute } from 'vue-router'
import { combinPath } from "@/util";
import SvgIcon from "@/components/Icon";
export default defineComponent({
  name: "SubElem",
  components: { ElemItem, SvgIcon },
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

    function resolvePath(routeItem: any, routePath: string) {
      const basePath = props.basePath[0] === "/" ? props.basePath : `/${props.basePath}`;
      const routerPath = combinPath(basePath, routePath);
      if (noChild.value) {
        isactive.value = route.path === routerPath
      } else {
        isactive.value = route.path.startsWith(routerPath);
      }
      return routerPath;
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