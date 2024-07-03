<script setup lang="ts">
import { onMounted, ref, watch, computed, type PropType } from 'vue'

import CardList from '@/components/CardList.vue'
import BuyIn from '@/components/BuyIn.vue'

import { ILinkNode } from '@/utils/link'
import { PokerStyle } from '@/utils/poker-style'
// import map from '@/utils/map'

import { IPlayer } from '@/interface/IPlayer'
import ISit from '@/interface/ISit'
import { IRoom } from '@/interface/IRoom'

const props = defineProps({
  msg: {
    type: String,
    default: ''
  },
  currPlayer: {
    type: Object as PropType<IPlayer>,
    default: {}
  },
  commonCard: {
    type: Array as PropType<string[]>,
    default: []
  },
  sitLink: {
    type: Object as PropType<ILinkNode<ISit>>,
    default: {}
  },
  handCard: {
    type: Array as PropType<string[]>,
    default: []
  },
  winner: {
    type: Array as PropType<IPlayer[][]>,
    default: []
  },
  isPlay: { type: Boolean },
  roomConfig: {
    type: Object as PropType<IRoom>,
    default: {}
  },
  actionUserId: { type: String },
  valueCards: {
    type: Array,
    default: []
  },
  time: {
    type: Number,
    default: 30
  }
})

const emit = defineEmits(['buyIn', 'delay', 'sit', 'update:sitLink'])

const sitLinkNode = ref<any>('')
const showBuyIn = ref(false)
const currSit = ref<ISit>()

watch(
  () => props.sitLink,
  (val: ILinkNode<ISit>) => {
    sitLinkNode.value = val
  }
)

const buyIn = (size: number) => {
  showBuyIn.value = false
  props.currPlayer.counter += Number(size)
  emit('buyIn', Number(size))
  sitDown(currSit.value!)
}

const showHandCard = (sit: ISit) => {
  return sit.player?.userId === props.currPlayer?.userId
}

const PokeStyle = (cards: string[]) => {
  if (props.commonCard.length === 0) {
    return ''
  }
  const commonCard = props.commonCard || []
  let handCard = props.handCard || []
  if (cards) {
    handCard = cards
  }
  const card = [...handCard, ...commonCard]
  const style = new PokerStyle(card, props.roomConfig.isShort)
  return style.getPokerStyleName()
}

// const handCardString = () => {
//   return mapCard(props.handCard)
// }

// const mapCard = (cards: string[]) => {
//   return map(cards)
// }

const hasSit = () => {
  return !!sitList.value.find((s) => s.player && s.player.userId === props.currPlayer?.userId)
}

const delayTime = () => {
  if (props.currPlayer.delayCount > 0) {
    // emit('update:time', props.time  + 60);
    emit('delay')
  }
}

const sitDown = (sit: ISit) => {
  if (!sit.player && (!props.isPlay || !hasSit)) {
    if (props.currPlayer.counter <= 0) {
      showBuyIn.value = true
      currSit.value = sit
      return
    }
    let sitNode = sitLinkNode.value
    for (let i = 0; i < 9; i++) {
      if (sitNode) {
        const next = sitNode.next
        if (sitNode.node.player?.nickName === props.currPlayer?.nickName) {
          delete sitNode.node.player
        }
        sitNode = next as ILinkNode<ISit>
      }
    }
    for (let i = 0; i < 9; i++) {
      if (sitNode) {
        const next = sitNode.next
        if (sit.position === sitNode.node.position) {
          sitNode.node.player = props.currPlayer as IPlayer
          emit('update:sitLink', sitNode)
          emit('sit', sitNode)
          break
        }
        sitNode = next as ILinkNode<ISit>
      }
    }
  }
}

const sitList = computed(() => {
  const sitMap: ISit[] = []
  if (sitLinkNode.value && Object.keys(sitLinkNode.value).length !== 0) {
    let link = sitLinkNode.value
    for (let i = 0; i < 9; i++) {
      if (link.node.player && link.node.player.userId === props.currPlayer?.userId) {
        sitLinkNode.value = link
        break
      }
      const next = link.next
      link = next as ILinkNode<ISit>
    }
    let sitNode = sitLinkNode.value
    for (let i = 0; i < 9; i++) {
      const next = sitNode.next
      sitMap.push(sitNode.node)
      sitNode = next as ILinkNode<ISit>
    }
    console.log('sit', sitMap)
    return sitMap
  }
  return []
})

onMounted(() => {
  sitLinkNode.value = props.sitLink
})
</script>

<template>
  <div class="sit-list-container">
    <div class="sit-list">
      <div class="sit" v-for="(sit, key) in sitList" :key="key" @click="sitDown(sit)">
        <div class="default" v-show="!sit.player">
          <i>sit</i>
        </div>
        <div class="sit-player" v-if="sit.player">
          <div class="player" :class="{ fold: sit.player.status === -1 }">
            <div class="count-down" v-show="actionUserId === sit.player.userId">{{ time }}</div>
            <div class="user-name" v-show="sit.player.nickName">
              {{ sit.player.nickName }}
            </div>
            <div class="icon iconfont icon-user-avatar"></div>
            <div
              class="counter"
              :class="{
                isAction: actionUserId === sit.player.userId,
                'close-time-out': time > 0 && time < 10 && actionUserId === sit.player.userId
              }"
              v-show="sit.player.counter >= 0 || sit.player.actionCommand === 'allin'"
            >
              {{ sit.player.counter || 0 }}
            </div>
            <div class="action-size" v-show="sit.player.actionSize > 0">
              {{ sit.player.actionSize }}
            </div>
            <div class="action-command" v-show="sit.player.actionCommand">
              {{ sit.player.actionCommand }}
            </div>
            <div class="type" v-show="sit.player.type">
              {{ sit.player.type }}
            </div>
            <div
              class="hand-card"
              v-show="
                !!!currPlayer ||
                (sit.player.userId !== currPlayer.userId &&
                  sit.player.handCard &&
                  sit.player.handCard.length !== 0)
              "
            >
              <CardList
                :cardList="sit.player.handCard as string[]"
                :valueCards="valueCards!"
              ></CardList>
            </div>
            <div
              class="card-style"
              v-show="
                !!!currPlayer ||
                (sit.player.userId !== currPlayer.userId &&
                  sit.player.handCard &&
                  sit.player.handCard.length !== 0)
              "
            >
              {{ PokeStyle(sit.player.handCard as string[]) }}
            </div>
          </div>
          <div class="cards" v-show="showHandCard(sit)">
            <div class="hand-card">
              <cardList :cardList="handCard" :valueCards="valueCards"></cardList>
              <div
                class="delay-time"
                v-show="
                  time < 15 && sit.player.delayCount > 0 && actionUserId === sit.player.userId
                "
                @click="delayTime"
              >
                <i class="iconfont icon-clock"></i>
                <span>{{ sit.player.delayCount }}</span>
              </div>
            </div>
            <div class="ready" v-show="handCard && handCard.length === 0">ready</div>
            <div class="card-style" v-if="commonCard && commonCard.length > 0">
              {{ PokeStyle([]) }}
            </div>
          </div>
          <div class="win" v-show="sit.player.income">
            <!--            <span>win!</span>-->
            <span>{{ `+${sit.player.income}` }}</span>
          </div>
        </div>
      </div>
    </div>
    <BuyIn
      v-model:showBuyIn="showBuyIn"
      :min="0"
      :max="roomConfig.smallBlind * 2000"
      @buyIn="buyIn"
    ></BuyIn>
  </div>
</template>

<style scoped lang="less">
.sit-list-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  height: 100vh;
  width: 100vw;

  .sit-list {
    position: relative;
    width: 100vw;
    height: 620 / 6.67vh;
    padding: 10px;
    margin: 0 15px;
    box-sizing: border-box;

    .sit {
      position: absolute;
      font-size: 12px;

      .default {
        i {
          width: 45 / 3.75vw;
          height: 45 / 3.75vw;
          border-radius: 50%;
          border: 1px solid #bababa;
          display: block;
          font-style: normal;
          font-size: 20px;
          line-height: 45 / 3.75vw;
          color: #fff;
        }
      }

      .player {
        position: relative;

        .icon {
          width: 45 / 3.75vw;
          height: 45 / 3.75vw;
          font-size: 45px;
          line-height: 45 / 3.75vw;
          border-radius: 50%;
          margin-bottom: 2px;
        }

        .user-name {
          width: 45 / 3.75vw;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .count-down {
          height: 7vh;
          line-height: 9vh;
          width: 12vw;
          position: absolute;
          left: 0;
          top: 14px;
          color: #fff;
          font-weight: 700;
          font-size: 20px;
          background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.3), transparent);
        }

        .counter {
          background-color: rgba(0, 0, 0, 0.6);
          color: #fff;
          font-weight: 600;
          font-size: 12px;
          border-radius: 2px;

          &.isAction {
            box-shadow: 0px 0px 6px 4px;
          }

          &.close-time-out {
            animation: 300ms timeOut infinite;
          }
        }

        .action-command {
          top: 15 / 6.67vh;
          left: 45 / 3.75vw;
          padding: 1px 8px;
          border-radius: 9px;
          color: #ffffff;
          background-color: #2c3e50;
          text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
          position: absolute;
        }

        .card-style {
          color: #fff;
        }

        .type {
          background-color: #fff;
          color: #2b2b2b;
          border-radius: 50%;
          padding: 2px;
          width: 15 / 3.75vw;
          height: 15px;
          line-height: 16px;
          position: absolute;
          top: 53 / 6.67vh;
          left: 38 / 3.75vw;
          font-size: 12px;
          transform: scale(0.8);
        }

        .action-size {
          background: rgba(0, 0, 0, 0.3) url('../assets/gold.svg') center left no-repeat;
          background-size: contain;
          border-radius: 2px;
          padding: 1px 4px 1px 12px;
          text-align: center;
          min-width: 35 / 3.75vw;
          color: #fff;
          font-weight: 600;
          position: absolute;
          top: 35 / 6.67vh;
          left: 40 / 3.75vw;
        }

        &.fold {
          opacity: 0.4;
        }
      }

      .delay-time {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        min-width: 24vw;
        min-height: 10vh;
        background: radial-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0) 70%);
        i {
          color: #fff;
          font-size: 30px;
        }
        span {
          font-size: 12px;
          color: #fff;
          margin-left: 2px;
          font-weight: 600;
        }
      }

      .hand-card {
        position: absolute;
        top: 1vh;
      }

      &:nth-child(1) {
        left: 100 / 3.75vw;
        top: 460 / 6.67vh;

        .action-command {
          left: -22 / 3.75vw;
        }

        .type {
          left: -16 / 3.75vw;
        }

        .action-size {
          top: -5 / 6.67vh;
          left: 57 / 3.75vw;
          padding-right: 15px;
          text-align: right;
        }
      }

      &:nth-child(2) {
        left: 0;
        top: 330 / 6.67vh;
      }

      &:nth-child(3) {
        left: 0;
        top: 210 / 6.67vh;
      }

      &:nth-child(4) {
        left: 0;
        top: 100 / 6.67vh;
      }

      &:nth-child(5) {
        left: 75 / 3.75vw;
        top: 0;
      }

      &:nth-child(6) {
        left: 240 / 3.75vw;
        top: 0;
      }

      &:nth-child(7) {
        left: 296 / 3.75vw;
        top: 100 / 6.67vh;
      }

      &:nth-child(8) {
        left: 296 / 3.75vw;
        top: 210 / 6.67vh;
      }

      &:nth-child(9) {
        left: 296 / 3.75vw;
        top: 330 / 6.67vh;
      }

      &:nth-child(6),
      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9) {
        .action-command {
          left: -22 / 3.75vw;
        }

        .type {
          left: -16 / 3.75vw;
        }

        .action-size {
          background-position: right;
          left: -40 / 3.75vw;
          padding-left: 1px;
          padding-right: 17px;
          text-align: right;
        }

        .hand-card {
          left: -3vh;
          top: 0;
        }
      }

      .cards {
        position: absolute;
        left: 52 / 3.75vw;
        top: 20 / 6.67vh;
        min-width: 60 / 3.75vw;
        min-height: 60 / 6.67vh;
        line-height: 60 / 6.67vh;

        .ready {
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
        }

        .card-style {
          position: absolute;
          color: #fff;
          font-size: 14px;
          bottom: -48px;
          width: 22vw;
          text-align: center;
          font-weight: 700;
        }
      }

      .win {
        position: absolute;
        z-index: 8;
        left: 0;
        top: 4vh;
        font-size: 20px;
        color: rgba(255, 209, 0, 0.99);
        font-weight: 600;
        animation: fadeOut 4s forwards;
        background-image: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
      }
    }
  }

  @keyframes fadeOut {
    0% {
      transform: translate3d(2px, 0, 0);
      opacity: 1;
    }
    30% {
      transform: translate3d(2px, 0, 0);
      opacity: 1;
    }
    to {
      transform: translate3d(2px, -15px, 0);
      opacity: 0;
    }
  }
  @keyframes timeOut {
    0% {
      box-shadow: none;
    }
    100% {
      box-shadow: 0px 0px 6px 4px;
    }
  }
}
</style>
