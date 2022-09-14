<template>
	<div class="header">
		<div class="collapse-btn" @click="collapseChage">
			<SvgIcon v-if="sidebarCollapse" name="flod"></SvgIcon>
			<SvgIcon v-else name="unflod"></SvgIcon>
		</div>
		<div class="logo">{{ sysTitle }}</div>
		<div class="system-list">
			<div v-for="system of subSystems" :key="system.path" :class="{ 'is-active': curSystem == system.path }">
				<router-link :to="`/${system.path}`">
					<div class="svg-container">
						<SvgIcon :name="system.icon" :size="35"></SvgIcon>
					</div>
					<span>{{ system.title }}</span>
				</router-link>
			</div>
		</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 全屏显示 -->
				<div class="btn-fullscreen" @click="handleFullScreen">
					<el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
						<SvgIcon name="full-screen" :size="30"></SvgIcon>
					</el-tooltip>
				</div>
				<!-- 消息中心 -->
				<div class="btn-bell">
					<el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
						<SvgIcon name="bell" :size="25"></SvgIcon>
					</el-tooltip>
					<span class="btn-bell-badge" v-if="message"></span>
				</div>
				<!-- 用户头像 -->
				<div class="user-avator">
					<SvgIcon name="user" :size="30"></SvgIcon>
				</div>
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<i class="el-icon-caret-bottom"></i>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<a href="https://github.com/li1615882553/vue3-manager" target="_blank">
								<el-dropdown-item>项目仓库</el-dropdown-item>
							</a>
							<el-dropdown-item divided command="logout">
								退出登录
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useAppStore } from "@/stores/modules/app";
import { useMenuStore } from "@/stores/modules/menu";
import { useUserStore } from "@/stores/modules/user";
import SvgIcon from "@/components/Icon";

export default defineComponent({
	name: "Header",
	components: { SvgIcon },
	setup() {
		const fullscreen = ref(false);
		const message = ref(2);
		const router = useRouter();
		const appStore = useAppStore();
		const userStore = useUserStore();
		const menuStore = useMenuStore();

		const username = computed(() => userStore.getUserInfo?.username)
		const subSystems = computed(() => menuStore.getYwxt);
		const curSystem = computed(() => appStore.getCurSystem);
		const sysTitle = computed(() => menuStore.getYwxt.filter(sys => sys.path === appStore.getCurSystem)[0]?.title)
		const sidebarCollapse = computed(() => appStore.getSidebarCollapse);

		function handleCommand(command: string) {
			if (command == "logout") {
				ElMessageBox.confirm("即将退出系统，是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					router.push("/logout");
				})
					.catch(() => { });
			}
		}
		// 侧边栏折叠
		function collapseChage() {
			appStore.toggleSidebar();
		}
		// 全屏事件
		function handleFullScreen() {
			let element: any = document.documentElement;
			if (fullscreen.value) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if ((document as any).webkitCancelFullScreen) {
					(document as any).webkitCancelFullScreen();
				} else if ((document as any).mozCancelFullScreen) {
					(document as any).mozCancelFullScreen();
				} else if ((document as any).msExitFullscreen) {
					(document as any).msExitFullscreen();
				}
			} else {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					// IE11
					element.msRequestFullscreen();
				}
			}
			fullscreen.value = !fullscreen.value;
		}

		return {
			fullscreen,
			message,
			username,
			sysTitle,
			curSystem,
			subSystems,
			sidebarCollapse,
			handleCommand,
			collapseChage,
			handleFullScreen
		}
	},
})
</script>
<style scoped lang="scss">
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
}

.collapse-btn {
	float: left;
	padding: 0 21px;
	cursor: pointer;
	line-height: 70px;
}

.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}

.system-list {
	float: left;
	height: 70px;
	display: flex;
	align-items: center;
	user-select: none;
	cursor: pointer;

	>div {
		margin-left: 20px;
		overflow: hidden;

		.svg-container {
			text-align: center;
		}

		.svg-container {
			width: 35px;
			margin: auto;
			overflow: hidden;
			margin-bottom: -5px;

			& svg {
				transform: translateX(-35px);
				filter: drop-shadow(35px 0 #eee);
			}
		}

		&:hover .svg-container svg {
			transform: translateX(0px);
		}

		&:hover span {
			color: #1499e0;
		}

		span {
			color: #eee;
		}
	}

	& span {
		font-size: 14px;
		color: #fff;
	}

	.is-active {
		.svg-container svg {
			transform: translateX(0px);
		}

		span {
			color: #1499e0;
		}
	}
}

.header-right {
	float: right;
	padding-right: 50px;
}

.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}

.btn-fullscreen {
	margin-right: 5px;
	font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
	position: relative;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
}

.btn-bell-badge {
	position: absolute;
	right: 0;
	top: -2px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}

.user-name {
	margin-left: 10px;
}

.user-avator {
	margin-left: 20px;
}

.user-avator img {
	display: block;
	width: 40px;
	height: 40px;
	border-radius: 50%;
}

.el-dropdown-link {
	color: #fff;
	cursor: pointer;
}

.el-dropdown-menu__item {
	text-align: center;
}
</style>
  