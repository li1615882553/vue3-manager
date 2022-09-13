<template>
  <h1>
    This is blog module's hello! 
    {{ $store.getters.curSys }}
    {{ curSys }}
  </h1>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Hello',
  created() {
  },
  computed:{
    ...mapGetters('app',[
      'curSys'
    ])
  }
}
</script>