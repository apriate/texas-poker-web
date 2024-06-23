import axios from 'axios'
import domain from './domain'
import { getToken, removeToken } from './token'
import router from '@/router'

const requestInstance = axios.create({
  baseURL: domain.url,
  timeout: 5000
})

requestInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

requestInstance.interceptors.response.use(
  (response) => {
    if ((response as any).data.code !== '000000') {
      return Promise.reject(response)
    }
    return response.data
  },
  (error) => {
    console.log(`${error.config.url} 接口请求异常`)
    // token过期
    if (error.response.status === 401) {
      removeToken()
      router.replace('/login')
    }
    // 错误提示;
    return Promise.reject(error)
  }
)

export { requestInstance as request }
