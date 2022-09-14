<template>
  <div class="login-wrap bruce" v-loading="loading">
    <div class="ms-login" v-if="retrieve">
      <div class="title">登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="0px">
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" show-password v-model="ruleForm.password" @keyup.enter.native="login">
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login(ruleFormRef)">登录</el-button>
      <el-button v-if="false" type="text" @click="retrieve = false">找回密码</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const ruleFormRef = ref<FormInstance>()
    let loading = ref(false);
    // 是否是找回密码
    const retrieve = ref(true);
    const ruleForm = reactive({
      username: "",
      password: "",
    });
    const rules = reactive<FormRules>({
      username: [{ required: true, message: "请输入账号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    })

    async function login(formEl: FormInstance | undefined) {
      if (loading.value || !formEl) return;
      await formEl!.validate((valid, fields) => {
        if (valid) {
          loading.value = true;
          userStore.login(ruleForm).then(() => {
            debugger
            loading.value = false;
            router.replace({
              path: "/",
              query: {
                redirect: router.currentRoute.value.query.redirect || "",
              },
            });
          }).catch((err) => {
            loading.value = false;
          })
        }
      })
    }

    return {
      ruleFormRef,
      loading,
      retrieve,
      ruleForm,
      rules,
      login
    }
  }
});
</script>
<style scoped>
.login-wrap {
  width: 100%;
  height: 100vh;
  z-index: 100 !important;
}

.title {
  font-size: 25px;
  text-align: center;
  color: rgb(73, 73, 77);
  margin-bottom: 10px;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: auto;
  padding: 30px;
  border-radius: 15px;
  background: rgba(250, 250, 250, 0.3);
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  -webkit-animation: fadenum 1.5s ease;
  -moz-animation: fadenum 1.5s ease;
  animation: fadenum 1.5s ease;
}

.links {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background: rgba(250, 250, 250, 0.4);
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  color: #666;
  font-size: 12px;
}

a {
  color: #409eff;
  text-decoration: none;
}

a:visited {
  color: #409eff;
  text-decoration: none;
}
</style>