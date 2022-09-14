<template>
	<div>
		<div class="tags" ref="tags">
			<div class="tags-inner" :class="{ 'tags-lrbtn': hasOverFlow }">
				<div class="handlerMove left" @click="handlerMove(-80)">
					<Icon icon-class="fangxiang-zuo-shuangxian" :width="16" :height="16"></Icon>
				</div>
				<ul ref="tags-ul" :class="{ shrink: hasOverFlow }">
					<li class="tags-li" v-for="(item, index) in tagsList" :class="{ active: isActive(item.path) }"
						:key="index" @contextmenu.prevent="handlerShowMenu">
						<router-link :to="item.path" :id="index" class="tags-li-title">
							{{ item.title }}
						</router-link>
						<span class="tags-li-icon" @click="closeTags(index)">
							<i class="el-icon-close"></i>
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

<script>
export default {
	inject: ["eventBus"],

	data() {
		return {
			tagsList: [],
			hasOverFlow: false,
			showMenu: false,
			currentId: null,
		};
	},
	computed: {
		collapse() {
			return this.$store.getters.sidebarCollapse;
		},
	},
	mounted() {
		const tagElement = document.querySelector(".tags");
		tagElement.addEventListener("mousewheel", this.handlerWheel);
		window.addEventListener("resize", this.handlerResize);
		document.addEventListener("click", () => (this.showMenu = false));
		// // 阻止全局右键菜单事件
		// window.oncontextmenu = function () {
		//   return false;
		// }
	},
	beforeDestroyed() {
		const tagElement = document.querySelector(".tags");
		tagElement.removeEventListener("mousewheel", this.handlerWheel);
		window.removeEventListener("resize", this.handlerResize);
		document.removeEventListener("click", () => (this.showMenu = false));
	},
	methods: {
		isActive(path) {
			return path === this.$route.fullPath;
		},
		// 关闭单个标签
		closeTags(index) {
			const delItem = this.tagsList.splice(index, 1)[0];
			const item = this.tagsList[index]
				? this.tagsList[index]
				: this.tagsList[index - 1];
			if (item) {
				delItem.path === this.$route.fullPath && this.$router.push(item.path);
			} else {
				this.$router.push("/");
			}
			this.judgeLRBtn();
		},
		// 关闭全部标签
		// closeAll() {
		// 	this.tagsList = [];
		// 	this.$router.push("/");
		// 	this.hasOverFlow = false;
		// },
		// 关闭其他标签
		closeOther(currentId) {
			this.tagsList = this.tagsList.slice(+currentId, +currentId + 1);
			this.hasOverFlow = false;
		},
		// 设置标签
		setTags(route) {
			const isExist = this.tagsList.some((item) => {
				return item.path === route.fullPath;
			});
			if (!isExist) {
				this.tagsList.push({
					title: route.meta.title,
					path: route.fullPath,
					name: route.matched[1].components.default.name,
				});
			}
			this.eventBus.$emit("tags", this.tagsList);
		},
		handleTags(command) {
			command === "other" ? this.closeOther() : this.closeAll();
		},
		handlerWheel(e) {
			const ulElement = document.querySelector(".tags ul");
			const scrollWidth = ulElement.scrollWidth;
			const clientWidth = ulElement.clientWidth;
			if (scrollWidth > clientWidth) {
				if (e.wheelDeltaY < 0) {
					ulElement.scrollLeft +=
						scrollWidth - clientWidth > 20 ? 20 : scrollWidth - clientWidth;
				} else {
					ulElement.scrollLeft -=
						scrollWidth - clientWidth > 20 ? 20 : scrollWidth - clientWidth;
				}
			}
		},
		judgeLRBtn() {
			this.$nextTick(() => {
				const ulElement = document.querySelector(".tags ul");
				if (ulElement.scrollWidth === ulElement.clientWidth) {
					this.hasOverFlow = false;
				} else {
					this.hasOverFlow = true;
				}
			});
		},
		scrollToActive() {
			const activeLi = document.querySelector(".tags-li.active");
			const ulElement = document.querySelector(".tags ul");
			// console.log('改变前',activeLi.offsetLeft, activeLi.clientWidth, ulElement.scrollWidth, ulElement.clientWidth, ulElement.scrollLeft)
			// 向前改变scrollLeft
			if (ulElement.scrollLeft > activeLi.offsetLeft) {
				ulElement.scrollLeft = activeLi.offsetLeft;
				if (this.hasOverFlow) {
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
			// console.log('改变后', activeLi.offsetLeft, ulElement.scrollWidth, ulElement.clientWidth, ulElement.scrollLeft)
		},
		async handlerResize() {
			await this.judgeLRBtn();
			this.$nextTick(() => {
				this.scrollToActive();
			});
		},
		handlerMove(value) {
			const ulElement = document.querySelector(".tags ul");
			if (
				ulElement.scrollLeft < 0 ||
				ulElement.scrollLef > ulElement.scrollWidth - ulElement.clientWidth
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
		},
		handlerShowMenu(event) {
			this.currentId = event.target.id;
			// 使用在当前relative相对位置确定菜单位置
			const menuContain = document.querySelector(".tagItem-menu");
			if (event.pageX + 80 > document.body.clientWidth) {
				menuContain.style.left =
					document.body.clientWidth - 80 - (this.collapse ? 65 : 250) + "px";
			} else {
				menuContain.style.left =
					event.pageX - (this.collapse ? 65 : 250) + "px";
			}

			this.showMenu = true;
		},
	},
	watch: {
		$route(newValue) {
			this.setTags(newValue);
			this.$nextTick(() => {
				this.handlerResize();
			});
		},
	},
	created() {
		this.setTags(this.$route);
		// 监听关闭当前页面的标签页
		this.eventBus.$on("close_current_tags", () => {
			for (let i = 0, len = this.tagsList.length; i < len; i++) {
				const item = this.tagsList[i];
				if (item.path === this.$route.fullPath) {
					if (i < len - 1) {
						this.$router.push(this.tagsList[i + 1].path);
					} else if (i > 0) {
						this.$router.push(this.tagsList[i - 1].path);
					} else {
						this.$router.push("/");
					}
					this.tagsList.splice(i, 1);
					break;
				}
			}
		});
	},
};
</script>


<style lang="scss" scoped>
.tagItem-menu {
	z-index: 1000;
	position: absolute;
	top: 30px;

	.tagItem-menu-contain {
		background-color: #efefef;
		width: 80px;
		padding: 5px 10px;
		font-size: 14px;
		line-height: 20px;

		& li {
			list-style-type: none;
		}

		& li:hover {
			cursor: pointer;
			background-color: #2d8cf0;
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
			background-color: #242f42;
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
