import cookie from 'js-cookie'

enum KeyEnum {
  TOKENKEY = 'token', // 用户token
  ROOMCONFIGKEY = 'roomConfig' // 房间配置
}

const getKey = (key: KeyEnum) => {
  return cookie.get(key) || localStorage.getItem(key) || ''
}

const removeKey = (key: KeyEnum) => {
  cookie.remove(key)
  localStorage.removeItem(key)
}

const setKey = (key: KeyEnum, value: string) => {
  cookie.set(key, value, { expires: 1 })
  localStorage.setItem(key, value)
}

const getToken = () => {
  return getKey(KeyEnum.TOKENKEY)
}

const setToken = (token: string) => {
  setKey(KeyEnum.TOKENKEY, token)
}

const removeToken = () => {
  removeKey(KeyEnum.TOKENKEY)
}

const getRoomConfig = () => {
  return getKey(KeyEnum.ROOMCONFIGKEY)
}

const setRoomConfig = (roomConfig: string) => {
  setKey(KeyEnum.ROOMCONFIGKEY, roomConfig)
}

const removeRoomConfig = () => {
  removeKey(KeyEnum.ROOMCONFIGKEY)
}

export { KeyEnum, getToken, setToken, removeToken, getRoomConfig, setRoomConfig, removeRoomConfig }
