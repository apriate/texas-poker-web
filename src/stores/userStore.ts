import { computed } from 'vue'
import { defineStore } from 'pinia'
import service from '@/service'
import { getToken } from '@/utils/token'

export const useUserStore = defineStore('user', () => {
  const isLogin = computed(() => {
    const token = getToken()

    return !!token
  })

  const checkLogin = async () => {
    return await service.checkLogin()
  }

  return {
    isLogin,
    checkLogin
  }
})
