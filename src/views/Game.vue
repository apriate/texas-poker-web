<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import io from 'socket.io-client'

import SitList from '@/components/SitList.vue'
import CommonCard from '@/components/CommonCard.vue'
import BuyIn from '@/components/BuyIn.vue'
import Toast from '@/components/Toast.vue'
import Record from '@/components/Record.vue'
import Notice from '@/components/Notice.vue'
import IAudio from '@/components/Audio.vue'
import SendMsg from '@/components/SendMsg.vue'
import ActionDialog from '@/components/Action.vue'
import GameRecord from '@/components/GameRecord.vue'

import { ILinkNode, Link } from '@/utils/link'
import { PokerStyle } from '@/utils/poker-style'
import domain from '@/utils/domain'
import { getRoomConfig, getToken } from '@/utils/token'

import service from '@/service'

import { IPlayer } from '@/interface/IPlayer'
import ISit from '@/interface/ISit'
import { IRoom } from '@/interface/IRoom'
import { IGameRecord } from '@/interface/IGameRecord'

// enum ECommand {
//   CALL = 'call',
//   ALL_IN = 'allin',
//   RAISE = 'raise',
//   CHECK = 'check',
//   FOLD = 'fold'
// }

interface IMsg {
  action: string
  clients: string[]
  target: string
  message?: any
  data: any
}

const GAME_BASE_SIZE = 1
const ACTION_TIME = 30

const route = useRoute()
const router = useRouter()

const socket = ref<any>(null)
// in the room user
// have a sit user
const players = ref<IPlayer[]>([])
const userInfo = ref<any>([])
const joinMsg = ref('')
const handCard = ref([])
const commonCard = ref([])
const pot = ref(0)
const slidePots = ref([])
const prevSize = ref(0)
const winner = ref<IPlayer[][]>([])
const showBuyIn = ref(false)
const showSetting = ref(false)
const sitLink = ref<any>({})
const gaming = ref(false)
const sitList = ref<ISit[]>([])
const actionUserId = ref<any>('')
const showAllin = ref(false)
const showMsg = ref(false)
const playIncome = ref(false)
const msg = ref('')
const time = ref(ACTION_TIME)
const timeSt = ref(0)
const commandRecordList = ref([])
const actionEndTime = ref(0)
const showCommandRecord = ref(false)
const gameList = ref<IGameRecord[]>([])
const currGameIndex = ref(0)
const audioStatus = ref(true)
const roomConfig = ref<IRoom>({
  isShort: false,
  smallBlind: 1
})
const messageList = ref<any[]>([])
const showRecord = ref(false)

const msgListReverse = computed(() => {
  const msg = JSON.parse(JSON.stringify(messageList.value))
  return msg.reverse()
})

const isPlay = computed(() => {
  return gaming.value || pot.value !== 0
})

const roomId = computed(() => {
  return route.params.roomNumber
})

const isOwner = computed(() => {
  return !!route.params.isOwner
})

const gameOver = computed(() => {
  return winner.value.length !== 0
})

const isAction = computed(() => {
  return userInfo.value && userInfo.value.userId === actionUserId.value
})

const valueCards = computed(() => {
  if (gameOver.value && winner.value[0] && winner.value[0][0].handCard) {
    const handCards = winner.value[0][0].handCard
    const style = new PokerStyle([...handCards, ...commonCard.value], roomConfig.value.isShort)
    return style.getPokerValueCard()
  } else {
    return []
  }
})

const gamePlayers = computed(() => {
  if (!isPlay.value) {
    return []
  }
  return sitList.value.filter((s) => s.player && s.player.status === 1)
})

const sitPlayers = computed(() => {
  return sitList.value.filter((s) => s.player && s.player.userId)
})

const hasSit = computed(() => {
  return !!sitList.value.find((s) => s.player && s.player.userId === currPlayer.value?.userId)
})

const currPlayer = computed(() => {
  return players.value.find((u: IPlayer) => userInfo.value.userId === u.userId)
})

const minActionSize = computed(() => {
  return prevSize.value <= 0 ? baseSize.value * 2 : prevSize.value * 2
})

const baseSize = computed(() => {
  return roomConfig.value.smallBlind || GAME_BASE_SIZE
})

watch(players, () => {
  console.log('player change-------')
  sitList.value = sitList.value.map((sit: ISit) => {
    const player = players.value.find(
      (p) => sit.player && p.userId === sit.player.userId && sit.player.counter > 0
    )
    return Object.assign({}, {}, { player, position: sit.position }) as ISit
  })
  initSitLink()
})

watch(isPlay, (val) => {
  if (val) {
    clearTimeout(timeSt.value)
    doCountDown()
  }
})

watch(actionUserId, () => {
  if (isPlay.value && actionEndTime.value) {
    console.log('action player change-------', actionEndTime.value)
    const now = Date.now()
    time.value = Math.floor((actionEndTime.value - now) / 1000)
    clearTimeout(timeSt.value)
    doCountDown()
  }
})

const init = () => {
  joinMsg.value = ''
  handCard.value = []
  commonCard.value = []
  pot.value = 0
  prevSize.value = 0
  time.value = ACTION_TIME
  winner.value = []
  showBuyIn.value = false
  initSitLink()
}

const sendMsgHandle = (msgInfo: string) => {
  const msg = `${userInfo.value.nickName}:${msgInfo}`
  emit('broadcast', { msg })
}

const showCounterRecord = () => {
  showRecord.value = true
  showSetting.value = false
}

const doCountDown = () => {
  if (time.value <= 0) {
    clearTimeout(timeSt.value)
    return
  }
  // @ts-ignore
  timeSt.value = setTimeout(() => {
    const now = Date.now()
    time.value = Math.floor((actionEndTime.value - now) / 1000)
    doCountDown()
  }, 1000)
}

const PokeStyle = (cards: string[]) => {
  if (commonCard.value.length === 0 || !cards) {
    return ''
  }
  const commonCards = commonCard.value || []
  const card = [...cards, ...commonCards]
  const style = new PokerStyle(card, roomConfig.value.isShort)
  return style.getPokerStyleName()
}

const showBuyInDialog = () => {
  showBuyIn.value = true
  showSetting.value = false
}

const sitListMap = () => {
  let node = sitLink.value
  const sit = []
  for (let i = 0; i < 9; i++) {
    sit.push(node.node)
    node = node.next
  }
  return sit
}

const sitDown = () => {
  emit('sitDown', { sitList: sitListMap() })
}

const delay = () => {
  emit('delayTime')
}

const action = (command: string) => {
  if (command === 'fold') {
    clearTimeout(timeSt.value)
  }
  if (command === 'allin') {
    showAllin.value = true
    setTimeout(() => {
      showAllin.value = false
    }, 3000)
  }
  emit('action', { command })
  // isAction = false;
  // isRaise = false;
}

const socketInit = () => {
  const token = getToken()
  const roomConfigStore = getRoomConfig()
  roomConfig.value = JSON.parse(roomConfigStore)
  socket.value = io(`${domain.url}/socket`, {
    // 实际使用中可以在这里传递参数
    query: {
      room: roomId.value,
      token,
      roomConfig: roomConfigStore
    },
    transports: ['websocket']
  })
  console.log('#init,', socket.value)
  socket.value.on('connect', () => {
    const id: string = socket.value.id
    console.log('#connect,', id, socket.value)

    // 监听自身 id 以实现 p2p 通讯
    socket.value.on(id, (msg: any) => {
      console.log('#receive,', msg)
      const data = msg.data
      if (data.action === 'handCard') {
        console.log('come in handCard =========', data)
        handCard.value = data.payload.handCard
        console.log('come in handCard =========', handCard)
      }
      if (data.action === 'userInfo') {
        userInfo.value = data.payload.userInfo
      }
      if (data.action === 'sitList') {
        sitList.value = data.payload.sitList
        initSitLink()
      }
      if (data.action === 'gameInfo') {
        const payload = data.payload
        players.value = payload.data.players
        pot.value = payload.data.pot || 0
        prevSize.value = payload.data.prevSize
        commonCard.value = payload.data.commonCard
        actionEndTime.value = payload.data.actionEndTime
        console.log('msg.data.currPlayer.userId', msg.data)
        actionUserId.value = payload.data.currPlayer.userId
        // isAction = !!(userInfo.value
        //   && userInfo.value.userId === payload.data.currPlayer.userId);
      }

      // room time out
      if (data.action === 'deny') {
        ElMessage('room is close')
        setTimeout(() => {
          router.replace({ name: 'home' })
        }, 1000)
      }
    })
  })

  // 接收在线用户信息
  socket.value.on('online', (msg: IMsg) => {
    console.log('#online,', msg)
    if (msg.action === 'sitList') {
      console.log(msg.data, 'sit')
      sitList.value = msg.data.sitList
      initSitLink()
    }
    if (msg.action === 'join') {
      joinMsg.value = msg.data
    }
    if (msg.action === 'players') {
      players.value = msg.data.players
    }
    if (msg.action === 'actionComplete') {
      commonCard.value = msg.data.commonCard
      slidePots.value = msg.data.slidePots
      actionEndTime.value = msg.data.actionEndTime || Date.now() + 30 * 1000
      console.log('players', msg.data)
    }
    if (msg.action === 'gameInfo') {
      players.value = msg.data.players
      pot.value = msg.data.pot || 0
      roomConfig.value.smallBlind = msg.data.smallBlind
      prevSize.value = msg.data.prevSize
      actionUserId.value = msg.data.currPlayer.userId
      actionEndTime.value = msg.data.actionEndTime
      // isAction = !!(userInfo && userInfo.userId === msg.data.currPlayer.userId);
      sitList.value = msg.data.sitList
      console.log('gameInfo', msg.data)
      console.log('handCard', handCard.value)
    }

    if (msg.action === 'gameOver') {
      console.log('gameOver', msg.data)
      clearTimeout(timeSt.value)
      actionUserId.value = '0'
      winner.value = msg.data.winner
      commonCard.value = msg.data.commonCard
      const allPlayers = msg.data.allPlayers
      allPlayers.forEach((winner: IPlayer) => {
        players.value.forEach((p) => {
          if (winner.userId === p.userId) {
            p.handCard = winner.handCard
            p.counter = winner.counter
            p.income = winner.income
          }
        })
      })
      // income music
      playIncome.value = true
      setTimeout(() => {
        playIncome.value = false
      }, 1000)
    }

    if (msg.action === 'newGame') {
      init()
    }

    if (msg.action === 'pause') {
      players.value = msg.data.players
      sitList.value = msg.data.sitList
      console.log('players', players.value)
      gaming.value = false
      init()
    }

    if (msg.action === 'delayTime') {
      actionEndTime.value = msg.data.actionEndTime
      const now = Date.now()
      time.value = Math.floor((actionEndTime.value - now) / 1000)
      // if (currPlayer?.userId !== actionUserId) {
      //   time += 60;
      // }
    }

    if (msg.action === 'broadcast') {
      messageList.value.push({
        message: msg.message.msg || '',
        top: Math.random() * 50 + 10
      })
    }
  })

  // 系统事件
  socket.value.on('disconnect', (msg: IMsg) => {
    ElMessage('room is disconnect')
    console.log('#disconnect', msg)
  })

  socket.value.on('disconnecting', () => {
    ElMessage('room is disconnecting')
    console.log('#disconnecting')
  })

  socket.value.on('error', (error: IMsg) => {
    ElMessage('room is error')
    console.log('#error', error.message)
  })
}

const buyIn = (size: number) => {
  if (size <= 0) {
    ElMessage('buy in size too small')
    return
  }

  try {
    console.log('come in buyIn ==================', size)
    showMsg.value = true
    msg.value = hasSit.value && isPlay.value ? `已补充买入 ${size},下局生效` : `已补充买入 ${size}`
    emit('buyIn', {
      buyInSize: size
    })
  } catch (e) {
    console.log(e)
  }
}

const standUp = () => {
  // player in the game
  if (currPlayer.value && currPlayer.value.status === 1) {
    ElMessage('sorry, please fold you hand!')
    return
  }
  emit('standUp')
  showSetting.value = false
}

const closeAudio = () => {
  audioStatus.value = !audioStatus.value
}

const play = () => {
  if (sitPlayers.value.length >= 2) {
    gaming.value = true
    emit('playGame')
  } else {
    ElMessage('no enough player')
    console.log('no enough player')
  }
}

const emit = (eventType: string, data: any = {}) => {
  socket.value.emit(eventType, {
    target: '',
    payload: {
      ...data
    }
  })
}

const initSitLink = () => {
  const sitListMap = sitList.value || []
  if (sitListMap.length === 0) {
    for (let i = 0; i < 9; i++) {
      const sit = {
        player: null,
        position: i + 1
      }
      sitListMap.push(sit)
    }
  }
  let link = new Link<ISit>(sitListMap).link
  for (let i = 0; i < 9; i++) {
    if (link.node.player && link.node.player.userId === currPlayer.value?.userId) {
      sitLink.value = link
      return
    }
    const next = link.next
    link = next as ILinkNode<ISit>
  }
  sitLink.value = link
}

const getRecord = async (index: number) => {
  try {
    let gameId = 0
    if (!index) {
      const result = await service.gameRecordList(roomId.value as string)
      gameList.value = Object.values(result.data)
      gameId = gameList.value[gameList.value.length - 1].gameId
      currGameIndex.value = gameList.value.length
      console.log('ccc len', gameList.value.length)
    } else {
      currGameIndex.value = index
      gameId = gameList.value[index - 1].gameId
    }
    console.log(gameId, 'ccc11')
    const { data } = await service.commandRecordList(roomId.value as string, gameId)
    commandRecordList.value = data.commandList
    showCommandRecord.value = true
    console.log(data)
  } catch (e) {
    console.log(e)
    ElMessage('can`t find the room')
  }
}

try {
  socketInit()
  if (!sitLink.value) {
    initSitLink()
  }
} catch (e) {
  console.log(e)
}
</script>

<template>
  <div class="game-container container">
    <SitList
      :sitLink="sitLink"
      :currPlayer="currPlayer"
      :commonCard="commonCard"
      @sit="sitDown"
      @buyIn="buyIn"
      :isPlay="isPlay"
      :valueCards="valueCards"
      :roomConfig="roomConfig"
      @delay="delay"
      :time="time"
      :winner="winner"
      :actionUserId="actionUserId"
      :hand-card="handCard"
    ></SitList>
    <CommonCard :commonCard="commonCard" :valueCards="valueCards"></CommonCard>
    <Notice :message-list="messageList"></Notice>
    <div class="winner-poke-style" v-show="gameOver && winner[0][0].handCard!.length > 0">
      {{ PokeStyle(winner[0] && winner[0][0] && (winner[0][0].handCard as string[])) }} WIN!!
    </div>
    <div class="game-body">
      <div class="pot">pot: {{ pot }}</div>
      <div class="roomId">No.:{{ roomId }}</div>
      <div class="btn play" v-show="isOwner && !isPlay"><span @click="play">play game</span></div>
    </div>
    <div class="game-record iconfont icon-record" @click="getRecord(0)"></div>
    <ActionDialog
      :base-size="baseSize"
      :curr-player="currPlayer"
      :is-action="isAction"
      :is-pre-flop="commonCard.length === 0"
      :min-action-size="minActionSize"
      :is-two-player="gamePlayers.length === 2"
      :pot="pot"
      :audio-status="audioStatus"
      :prev-size="prevSize"
      @action="action"
    ></ActionDialog>
    <div class="setting">
      <div class="iconfont icon-setting setting-btn" @click="showSetting = true"></div>
      <div class="setting-body" :class="{ show: showSetting }">
        <i @click="showBuyInDialog()">buy in</i>
        <i @click="standUp()">stand Up</i>
        <i @click="showCounterRecord">counter record</i>
        <i @click="closeAudio()">audio ({{ `${audioStatus ? 'open' : 'close'}` }})</i>
      </div>
    </div>
    <BuyIn v-model:showBuyIn="showBuyIn" :min="0" :max="baseSize * 2000" @buyIn="buyIn"></BuyIn>
    <Toast v-model:show="showMsg" :text="msg"></Toast>
    <Record :players="players" v-model:show="showRecord"></Record>
    <SendMsg @send="sendMsgHandle" :msg-list="msgListReverse"></SendMsg>
    <IAudio :play="playIncome && audioStatus" type="income"></IAudio>
    <GameRecord
      v-model="showCommandRecord"
      :game-list="gameList"
      @getRecord="getRecord"
      :curr-game-index="currGameIndex"
      :command-list="commandRecordList"
    ></GameRecord>
  </div>
</template>

<style lang="less" scoped>
.game-container {
  background: radial-gradient(#00bf86, #006a55);
  background-size: 100% 100%;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .winner-poke-style {
    position: absolute;
    top: 55vh;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    z-index: 0;
    font-size: 14px;
    color: #fff;
  }

  .game-body {
    position: absolute;
    top: 38vh;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 0;

    .roomId {
      margin-top: 10px;
      font-size: 14px;
    }
  }

  .setting {
    left: 0;
    top: 0;
    position: absolute;

    .setting-btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #fff;
      top: 10px;
      left: 0;
      position: absolute;
      font-size: 20px;
      color: #898888;
      border-radius: 0 10px 10px 0;
    }

    .setting-body {
      position: absolute;
      left: 0;
      top: 0;
      transform: translate3d(-150px, 0px, 0px);
      z-index: 1;
      transition: transform 0.5s;

      i {
        display: block;
        width: 100px;
        height: 20px;
        padding: 4px;
        font-style: normal;
        text-align: left;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        margin: 1px 0;
      }

      &.show {
        transform: translate3d(0, 0, 0);
      }
    }
  }
  .game-record {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 36px;
    color: #fff;
  }
}
</style>
