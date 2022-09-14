<template>
	<div>
		<div class="tags" ref="tags">
			<div class="tags-inner" :class="{ 'tags-lrbtn': hasOverFlow }">
				<div class="handlerMove left" @click="handlerMove(-80)">
					<Icon icon-class="fangxiang-zuo-shuangxian" :width="16" :height="16"></Icon>
				</div>
				<ul ref="tags-ul" :class="{ shrink: hasOverFlow }">
					<li class="tags-li" v-for="(item, index) in tagsList" :class="{ active: isActive(item.path) }" :key="index"
						@contextmenu.prevent="handlerShowMenu">
						<router-link :to="item.path" :id="index" class="tags-li-title">
							{{ item.title }}
						</router-link>
						<span class="tags-li-icon" @click="closeTags(''+index)">
							<SvgIcon name="close" size="12"></SvgIcon>
						</span>
					</li>
				</ul>
				<div class="handlerMove right" @click="handlerMove(80)">
					<i class="el-icon-d-arrow-right"></i>
				</div>
			</div>
		</div>
		<div class="tagItem-menu" v-show="showMenu">
			<ul class="tagItem-menu-contain">
				<li @click="closeTags(currentId)">关闭</li>
				<li @click="closeOther(currentId)">关闭其他</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref, reactive, nextTick, onBeforeMount, watch } from "vue";
import { useAppStore } from "@/stores/modules/app";
import { useRouter } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import SvgIcon from "@/components/Icon";

const router = useRouter();
const appStore = useAppStore();
const hasOverFlow = ref(false);
const showMenu = ref(false);
let tagsList: Array<{ title: string, path: string }> = reactive([]);
const currentId = ref('');
const collapse = computed(() => appStore.getSidebarCollapse);

onBeforeMount(() => {
	setTags(router.currentRoute.value);
	// 监听关闭当前页面的标签页
	// this.eventBus.$on("close_current_tags", () => {
	// 	for (let i = 0, len = this.tagsList.length; i < len; i++) {
	// 		const item = this.tagsList[i];
	// 		if (item.path === this.$route.fullPath) {
	// 			if (i < len - 1) {
	// 				this.$router.push(this.tagsList[i + 1].path);
	// 			} else if (i > 0) {
	// 				this.$router.push(this.tagsList[i - 1].path);
	// 			} else {
	// 				this.$router.push("/");
	// 			}
	// 			this.tagsList.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// });
})

onMounted(() => {
	const tagElement = document.querySelector<HTMLDivElement>(".tags");
	tagElement!.addEventListener("wheel", handlerWheel);
	window.addEventListener("resize", handlerResize);
	document.addEventListener("click", () => (showMenu.value = false));
});
onBeforeUnmount(() => {
	const tagElement = document.querySelector<HTMLDivElement>(".tags");
	tagElement!.removeEventListener("wheel", handlerWheel);
	window.removeEventListener("resize", handlerResize);
	document.removeEventListener("click", () => (showMenu.value = false));
});

watch(router.currentRoute, (newVal) => {
	setTags(newVal);
	nextTick(() => {
		handlerResize();
	});
})

function handlerWheel(e: WheelEvent) {
	const ulElement = document.querySelector(".tags ul");
	const scrollWidth = ulElement!.scrollWidth;
	const clientWidth = ulElement!.clientWidth;
	if (scrollWidth > clientWidth) {
		if (e.deltaY < 0) {
			ulElement!.scrollLeft +=
				scrollWidth - clientWidth > 20 ? 20 : scrollWidth - clientWidth;
		} else {
			ulElement!.scrollLeft -=
				scrollWidth - clientWidth > 20 ? 20 : scrollWidth - clientWidth;
		}
	}
}
async function handlerResize() {
	await judgeLRBtn();
	nextTick(() => {
		scrollToActive();
	});
}
function scrollToActive() {
	const activeLi = document.querySelector<HTMLElement>(".tags-li.active")!;
	const ulElement = document.querySelector<HTMLElement>(".tags ul")!;
	// 向前改变scrollLeft
	if (ulElement.scrollLeft > activeLi.offsetLeft) {
		ulElement.scrollLeft = activeLi.offsetLeft;
		if (hasOverFlow) {
			ulElement.scrollLeft -= 20;
		}
	} else if (
		activeLi.offsetLeft >
		ulElement.clientWidth - activeLi.clientWidth
	) {
		// 向后改变 scrollLeft
		ulElement.scrollLeft =
			activeLi.offsetLeft - ulElement.clientWidth + activeLi.clientWidth;
	}
};
function judgeLRBtn() {
	nextTick(() => {
		const ulElement = document.querySelector<HTMLElement>(".tags ul")!;
		if (ulElement.scrollWidth === ulElement.clientWidth) {
			hasOverFlow.value = false;
		} else {
			hasOverFlow.value = true;
		}
	});
};
function isActive(path: string) {
	return path === router.currentRoute.value.fullPath;
};
// 关闭单个标签
function closeTags(currentId: string) {
	const delItem = tagsList.splice(+currentId, 1)[0];
	const item = tagsList[+currentId] ? tagsList[+currentId] : tagsList[+currentId - 1];
	if (item) {
		delItem.path === router.currentRoute.value.fullPath && router.push(item.path);
	} else {
		router.push("/");
	}
	judgeLRBtn();
}
// 关闭其他标签
function closeOther(currentId: string) {
	tagsList = tagsList.slice(+currentId, +currentId + 1);
	hasOverFlow.value = false;
};
// 设置标签
function setTags(route: RouteLocationNormalizedLoaded) {
	const isExist = tagsList.some((item) => {
		return item.path === route.fullPath;
	});
	if (!isExist) {
		tagsList.push({
			title: route.meta.title as string,
			path: route.fullPath,
			// name: route.matched[1].components && route.matched[1].components.default.name,
		});
	}
	// this.eventBus.$emit("tags", this.tagsList);
};
function handlerMove(value: number) {
	const ulElement = document.querySelector<HTMLElement>(".tags ul")!;
	if (
		ulElement.scrollLeft < 0 || ulElement.scrollLeft > ulElement.scrollWidth - ulElement.clientWidth
	)
		return;
	if (value < 0) {
		ulElement.scrollLeft += Math.max(value, -1 * ulElement.scrollLeft);
	} else {
		ulElement.scrollLeft += Math.min(
			value,
			ulElement.scrollWidth - ulElement.clientWidth
		);
	}
};
function handlerShowMenu(event:MouseEvent) {
	currentId.value = (event.target as any).id;
	// 使用在当前relative相对位置确定菜单位置
	const menuContain = document.querySelector<HTMLElement>(".tagItem-menu")!;
	if (event.pageX + 80 > document.body.clientWidth) {
		menuContain.style.left =
			document.body.clientWidth - 80 - (collapse.value ? 65 : 250) + "px";
	} else {
		menuContain.style.left =
			event.pageX - (collapse.value ? 65 : 250) + "px";
	}
	showMenu.value = true;
};
</script>


<style lang="scss" scoped>
.tagItem-menu {
	z-index: 1000;
	position: absolute;
	top: 30px;

	.tagItem-menu-contain {
		background-color: #fff;
		width: 80px;
		padding: 5px 10px;
		font-size: 14px;
		line-height: 20px;

		& li {
			list-style-type: none;
		}

		& li:hover {
			cursor: pointer;
			background-color: #242f42;
			color: #ffffff;
		}
	}
}

.tags {
	position: relative;
	height: 32px;
	background: #fff;
	overflow: hidden;
	box-shadow: 0 5px 10px #ddd;

	.tags-inner {
		//在此层中产生滑动条
	}

	.tags-lrbtn {
		& div {
			visibility: visible;
		}
	}
}

.tags ul {
	display: flex;
	flex-wrap: nowrap;
	box-sizing: border-box;
	overflow-x: auto;
	overflow-y: hidden;
	height: 100%;
	width: 100%;
}

.shrink {
	width: calc(100% - 40px) !important;
	margin-left: 20px;
}

.tags-li {
	position: relative;
	list-style-type: none;
	flex: 0 1;
	margin: 3px 5px 2px 3px;
	border-radius: 3px;
	font-size: 12px;
	cursor: pointer;
	height: 23px;
	line-height: 23px;
	border: 1px solid #e9eaec;
	background: #fff;
	padding: 0 5px 0 12px;
	vertical-align: middle;
	color: #666;
	-webkit-transition: all 0.3s ease-in;
	-moz-transition: all 0.3s ease-in;
	transition: all 0.3s ease-in;

	.tags-li-icon {
		position: absolute;
		right: 5px;
		top: 0;
		box-sizing: border-box;
		height: 12px;
		width: 12px;
		text-align: center;

		.el-icon-close:hover {
			border-radius: 50%;
			background-color: #2d8cf0;
		}
	}
}

.tags-li:not(.active):hover {
	background: #f8f8f8;
}

.tags-li.active {
	color: #fff;
	background-color: #2d8cf0;
}

.tags-li-title {
	width: 200px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-right: 15px;
	color: #666;
}

.tags-li.active .tags-li-title {
	color: #fff;
}

.handlerMove {
	position: absolute;
	width: 20px;
	visibility: hidden;
	top: 7px;
}

.left {}

.right {
	right: 0px;
}
</style>
