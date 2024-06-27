import { computed } from 'vue'
import { defineStore } from 'pinia'
import apis from '@/apis'
import { getToken } from '@/utils'

export const useUserStore = defineStore('user', () => {
  const isLogin = computed(() => {
    const token = getToken()

    return !!token
  })

  const checkLogin = async () => {
    return await apis.checkLogin()
  }

  return {
    isLogin,
    checkLogin
  }
})
