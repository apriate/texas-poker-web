<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import apis from '@/apis'

const router = useRouter()

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  account: '',
  nickName: '',
  password: '',
  confirm: ''
})

// 自定义规则
// @ts-ignore
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.confirm !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('confirm')
    }
    callback()
  }
}

// 自定义规则
// @ts-ignore
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

// 表单规则对象
const rules = ref<FormRules<typeof ruleForm>>({
  account: [{ required: true, message: 'Please input the account', trigger: 'blur' }],
  nickName: [{ required: true, message: 'Please input the nickName', trigger: 'blur' }],
  password: [{ validator: validatePass }],
  confirm: [{ validator: validatePass2 }]
})

const register = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      try {
        await apis.register(ruleForm)
        ElMessage({ type: 'success', message: 'sign successful' })
        setTimeout(() => {
          router.replace({ name: 'login' })
        }, 2000)
      } catch (error) {
        ElMessage({ type: 'error', message: (error as any).data.msg })
      }
    }
  })
}
</script>

<template>
  <div class="register-container container">
    <div class="register-body">
      <div class="logo">Texas POKER</div>
      <div class="title">Create Account</div>
      <el-form
        class="form"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item prop="account" label="account">
          <el-input v-model="ruleForm.account" clearable />
        </el-form-item>
        <el-form-item prop="nickName" label="nickName">
          <el-input v-model="ruleForm.nickName" clearable />
        </el-form-item>
        <el-form-item prop="password" label="password">
          <el-input v-model="ruleForm.password" type="password" clearable />
        </el-form-item>
        <el-form-item prop="confirm" label="confirm">
          <el-input v-model="ruleForm.confirm" type="password" clearable />
        </el-form-item>
        <el-button type="primary" size="large" class="register-btn" @click="register(ruleFormRef)"
          >submit</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
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
    margin-bottom: 3vh;
  }

  .form {
    .el-form-item {
      height: 40px;
    }
  }

  .register-btn {
    background-color: #00976e;
    width: 100%;
  }
}
</style>
