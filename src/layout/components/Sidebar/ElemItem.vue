<template v-slot="title">
  <SvgIcon class="sidebar-svg" :name="icon"></SvgIcon>
  <span>{{ title }}</span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from "@/components/Icon";

export default defineComponent({
  name: 'ElemItem',
  components: { SvgIcon },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // render() {
  //   const vnodes = []
  //   if (this.icon) {
  //     vnodes.push(h(SvgIcon, { class: "sidebar-svg", name: this.icon }))
  //   }

  //   if (this.title) {
  //     vnodes.push(h('span', { slot: "title" }, this.title))
  //   }
  //   return vnodes;
  // }
})
</script>
<style scoped lang="scss">
.sidebar-svg {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
    