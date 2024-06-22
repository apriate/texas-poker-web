import { request } from '@/utils/request'

export default {
  // 注册
  register: ({ account = '', password = '', nickName = '' }) => {
    return request({
      url: '/auth/register',
      method: 'POST',
      data: { account, password, nickName }
    })
  },

  // 登录
  login: (account: string, password: string) => {
    return request({
      url: '/auth/login',
      method: 'POST',
      data: { account, password }
    })
  },

  // 校验是否登录
  checkLogin: () => {
    return request({
      url: '/user',
      method: 'POST'
    })
  },

  // 创建房间
  createRoom: (isShort: boolean, smallBlind: number, time: number) => {
    return request({
      url: '/game/room',
      method: 'POST',
      data: { isShort, smallBlind, time }
    })
  },

  // 查找房间
  findRoom: (roomNumber: string) => {
    return request({
      url: '/game/room/find',
      method: 'POST',
      data: { roomNumber }
    })
  },

  // 买入
  buyIn: (buyInSize: number) => {
    return request({
      url: '/game/buyIn',
      method: 'POST',
      data: { buyInSize }
    })
  },

  // 房间手牌记录
  commandRecordList: (roomNumber: string, gameId: number) => {
    return request({
      url: '/game/record/find/commandRecord',
      method: 'POST',
      data: { roomNumber, gameId }
    })
  },

  // 手牌记录
  gameRecordList: (roomNumber: string) => {
    return request({
      url: '/game/record/find/gameRecord',
      method: 'POST',
      data: { roomNumber }
    })
  },

  // 近7天手牌记录
  selfPast7DayGame: (userID: number) => {
    return request({
      url: '/game/record/find/selfPast7DayGame',
      method: 'POST',
      data: { userID }
    })
  }
}
