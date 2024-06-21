<script setup lang="ts">
import apis from '@/apis'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import XInput from '@/components/XInput.vue'

const router = useRouter()

const form: any = ref({
  userAccount: '',
  nickName: '',
  password: '',
  confirm: ''
})
let errorData = ref<string[]>([])

const valid = () => {
  const errorArr: string[] = []
  for (const formKey in form.value) {
    if (form.value[formKey] === '') {
      errorArr.push(formKey)
    }
  }
  // confirm password
  if (form.value.password !== form.value.confirm) {
    errorArr.push('confirm')
    errorArr.push('password')
  }
  errorData.value = errorArr
}

const removeValid = (validName: string) => {
  errorData.value = errorData.value.join(',').replace(validName, '').split(',')
}

const register = async () => {
  try {
    valid()
    if (errorData.value.join('') === '') {
      await apis.register(form)
      ElMessage({ type: 'success', message: 'sign successful' })
      setTimeout(() => {
        router.replace({ name: 'login' })
      }, 2000)
    }
  } catch (error) {
    ElMessage({ type: 'error', message: (error as any).message })
  }
}
</script>

<template>
  <div class="register-container container">
    <div class="register-body">
      <div class="logo">J-POKER</div>
      <div class="title">Create Account</div>
      <div class="user-name">
        <XInput
          v-model="form.userAccount"
          text="account"
          @focus="removeValid('userAccount')"
          :error="errorData.indexOf('userAccount') > -1"
        ></XInput>
      </div>
      <div class="user-name">
        <XInput
          v-model="form.nickName"
          text="nickName"
          @focus="removeValid('nickName')"
          :error="errorData.indexOf('nickName') > -1"
        ></XInput>
      </div>
      <div class="password">
        <XInput
          v-model="form.password"
          text="password"
          type="password"
          @focus="removeValid('password')"
          :error="errorData.indexOf('password') > -1"
        ></XInput>
      </div>
      <div class="confirm">
        <XInput
          v-model="form.confirm"
          text="confirm"
          type="password"
          @focus="removeValid('confirm')"
          :error="errorData.indexOf('confirm') > -1"
        ></XInput>
      </div>
      <div class="register-btn">
        <div class="s-btn btn"><span @click="register">submit</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  padding: 20px;
  margin: auto;

  .logo {
    text-align: left;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 700;
  }

  .title {
    text-align: left;
    margin-bottom: 5vh;
  }

  .register-btn {
    width: 50vw;
    float: right;
    margin: auto;
  }
}
</style>
