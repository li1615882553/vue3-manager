<template>
	<div class="content">
		<RouterView>
			<transition name="fade-transform" mode="out-in">
				<component :is="Component" />
			</transition>
		</RouterView>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "Layout"
});
</script>