<template>
  <h1>
    <SvgIcon name="dayin"></SvgIcon>
    This is admin module's hello! 
  </h1>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SvgIcon from "@/components/Icon";
export default defineComponent({
  name: "Hello",
  components: { SvgIcon },
  setup(){

  }
})
</script>
<style scoped lang="scss">

</style>