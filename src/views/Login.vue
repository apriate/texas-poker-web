<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apis from '@/apis'
import { setToken } from '@/utils'

const router = useRouter()

const account = ref('')
const password = ref('')

const login = async () => {
  try {
    const result = await apis.login(account.value, password.value)
    const { token } = result.data
    setToken(token)
    router.push({ name: 'home' })
  } catch (e) {
    ElMessage({ type: 'error', message: 'Wrong password or account' })
  }
}

const signUp = () => {
  router.replace({ name: 'register' })
}
</script>

<template>
  <div class="login-container container">
    <div class="login-body">
      <div class="name">J-POKER</div>
      <div class="user-name input-bd">
        <div class="input-name iconfont icon-account"></div>
        <div class="input-text">
          <input type="text" v-model="account" />
        </div>
      </div>
      <div class="password input-bd">
        <div class="input-name iconfont icon-password"></div>
        <div class="input-text">
          <input type="password" v-model="password" />
        </div>
      </div>
      <div class="login-btn btn">
        <span @click="login">sign in</span>
        <b @click="signUp">sign up</b>
      </div>
    </div>
  </div>
</template>

<
<style lang="less" scoped>
.login-container {
  background: radial-gradient(#00bf86, #006a55);
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  .login-body {
    width: 85vw;
    margin: auto;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: 2px 3px 9px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    padding: 30px;
    .input-bd {
      border: 1px solid #bababa;
      border-radius: 20px;
      width: 60vw;
      margin: 30px auto;
      text-align: left;
      .input-name {
        text-align: center;
        font-size: 18px;
        color: #bababa;
      }
      input {
        height: 40px;
        background-color: transparent;
      }
    }
  }
}
</style>
