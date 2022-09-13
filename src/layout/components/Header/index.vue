<template>
  <div class="header">
    <div class="collapse-btn" @click="collapseChage">
      <SvgIcon v-if="sidebarCollapse" name="flod"></SvgIcon>
      <SvgIcon v-else name="unflod"></SvgIcon>
    </div>
    <div class="logo">{{ sysTitle }}</div>
		<div class="system-list">
			<div
				v-for="system of subSystems"
				:key="system.path"
				:class="{ 'is-active': curSystem == system.path }"
			>
				<router-link :to="`/${system.path}`">
					<div class="svg-container">
						<SvgIcon
							:name="system.icon"
							:height="35"
							:width="35"
						></SvgIcon>
					</div>
					<span>{{ system.title }}</span>
				</router-link>
			</div>
		</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 全屏显示 -->
				<div class="btn-fullscreen" @click="handleFullScreen">
					<el-tooltip
						effect="dark"
						:content="fullscreen ? `取消全屏` : `全屏`"
						placement="bottom"
					>
						<i class="el-icon-rank"></i>
					</el-tooltip>
				</div>
				<!-- 消息中心 -->
				<div class="btn-bell">
					<el-tooltip
						effect="dark"
						:content="message ? `有${message}条未读消息` : `消息中心`"
						placement="bottom"
					>
						<router-link to="/tabs">
							<i class="el-icon-bell"></i>
						</router-link>
					</el-tooltip>
					<span class="btn-bell-badge" v-if="message"></span>
				</div>
				<!-- 用户头像 -->
				<div class="user-avator">
					<SvgIcon name="user"></SvgIcon>
				</div>
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<i class="el-icon-caret-bottom"></i>
					</span>
					<el-dropdown-menu>
						<a
							href="https://github.com/li1615882553/vue-manager"
							target="_blank"
						>
							<el-dropdown-item>项目仓库</el-dropdown-item>
						</a>
						<el-dropdown-item divided command="logout">
							退出登录
						</el-dropdown-item>
					</el-dropdown-menu>
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

    const username = computed(() => userStore.getUserInfo?.username)
    const subSystems = computed(() => appStore.getSubSystems);
    const curSystem = computed(() => appStore.getCurSystem);
    const sysTitle = computed(() => appStore.getSubSystems.filter(sys => sys.path === appStore.getCurSystem)[0]?.title) 
    const sidebarCollapse =  computed(() => appStore.getSidebarCollapse);

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
      let element:any = document.documentElement;
      if (fullscreen.value) {
        if (element.exitFullscreen) {
          element.exitFullscreen();
        } else if (element.webkitCancelFullScreen) {
          element.webkitCancelFullScreen();
        } else if (element.mozCancelFullScreen) {
          element.mozCancelFullScreen();
        } else if (element.msExitFullscreen) {
          element.msExitFullscreen();
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
<style lang="scss" scoped>
.content-box {
  display: flex;
  flex-direction: column;
}
</style>
  