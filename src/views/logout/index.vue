<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/modules/user";
export default defineComponent({
  name: 'Logout',
  setup() {
    const userState = useUserStore();
    userState.logout();
  }
})
</script>

