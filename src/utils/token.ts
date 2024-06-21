// 用户token封装
const TOKENKEY = 'token'

const getToken = () => {
  return localStorage.getItem(TOKENKEY)
}

const setToken = (token: string) => {
  localStorage.setItem(TOKENKEY, token)
}

const removeToken = () => {
  localStorage.removeItem(TOKENKEY)
}

export { getToken, setToken, removeToken }
