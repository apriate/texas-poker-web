export enum PlayerType {
  READY,
  SIT_DOWN,
  GAMING
}

export interface IPlayer {
  counter: number
  nickName: string
  actionSize: number
  actionCommand: string
  type: string
  userId?: string
  handCard?: string[] | string
  buyIn: number
  status: number
  income?: number
  isSit: boolean
  delayCount: number
}

export interface IPlayerHandCard extends IPlayer {
  command?: string
  commonCard?: string
}

export interface ICommandList extends IPlayer {
  commonCard: string
  pot: number
}
