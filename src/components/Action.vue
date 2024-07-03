<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'

import Range from '@/components/Range.vue'
import IAudio from '@/components/Audio.vue'
import { IPlayer } from '@/interface/IPlayer'

const props = defineProps({
  isAction: {
    type: Boolean,
    default: false
  },
  minActionSize: {
    type: Number,
    default: 0
  },
  pot: {
    type: Number,
    default: 0
  },
  prevSize: {
    type: Number,
    default: 0
  },
  baseSize: {
    type: Number,
    default: 0
  },
  isPreFlop: {
    type: Boolean,
    default: false
  },
  isTwoPlayer: {
    type: Boolean,
    default: false
  },
  currPlayer: {
    type: Object as PropType<IPlayer>,
    default: {}
  },
  audioStatus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['action'])

const isRaise = ref(false)
const raiseSize = ref(0)
const actioned = ref(false)
const playClick = ref(false)
const playRaise = ref(false)
const playFold = ref(false)

// const raiseSizeMap = ref({
//   firsAction: {
//     two: 2,
//     three: 3,
//     four: 4,
//   },
//   other: {
//     oneThirdPot: 0.5,
//     halfPot: 0.75,
//     pot: 1,
//   },
// })

watch(
  () => props.isAction,
  (val: boolean) => {
    actioned.value = !val
    playClick.value = false
    playRaise.value = false
    playFold.value = false
  }
)

watch(
  () => raiseSize.value,
  (val: number) => {
    raiseSize.value = val > props.currPlayer.counter ? props.currPlayer.counter : val
  }
)

const raiseSizeMap = computed(() => {
  let size = props.pot > props.baseSize * 4 ? props.pot : props.baseSize * 2
  if (props.prevSize > 1) {
    size = props.prevSize * 4
  }
  return size === props.baseSize * 2 ? [size, 2 * size, 3 * size] : [0.5 * size, 0.75 * size, size]
})

const canActionSize = computed(() => {
  return Number(props.currPlayer && props.currPlayer.counter + props.currPlayer.actionSize)
})

const action = (command: string) => {
  if (command.indexOf('raise') > -1 || command === 'allin' || command === 'call') {
    playRaise.value = true
  }
  if (command === 'fold' || command === 'check') {
    playFold.value = true
  }
  if (!actioned.value) {
    actioned.value = true
    emit('action', command)
    isRaise.value = false
    actioned.value = false
  }
}

const raise = (size: number) => {
  action(`raise:${Math.floor(size)}`)
}

const showActionSize = (multiple: number) => {
  return (
    props.currPlayer &&
    props.currPlayer.counter > Math.floor(multiple) &&
    props.prevSize * 2 <= Math.floor(multiple * props.pot) &&
    props.baseSize * 2 <= Math.floor(multiple * props.pot)
  )
}

const otherSizeHandle = () => {
  isRaise.value = true
  raiseSize.value = props.minActionSize
}

const getActionSize = (size: number) => {
  if (size > props.minActionSize) {
    raiseSize.value = size
  } else {
    ElMessage({ type: 'error', message: 'raise size too small' })
  }
}

const addSize = () => {
  if (raiseSize.value === props.currPlayer?.counter) {
    action('allin')
  } else {
    action(`raise:${raiseSize.value}`)
  }
}

const showActionBtn = (type: string) => {
  // check
  if ('check' === type) {
    return (
      props.prevSize <= 0 ||
      (props.isPreFlop &&
        props.isTwoPlayer &&
        props.currPlayer?.type === 'd' &&
        props.prevSize === props.baseSize * 2) ||
      (props.currPlayer?.type === 'bb' && props.prevSize === props.baseSize * 2 && props.isPreFlop)
    )
  }
  // raise
  if ('raise' === type) {
    return canActionSize.value > props.prevSize * 2
  }
  // call
  if ('call' === type) {
    return (
      canActionSize.value > props.prevSize &&
      props.prevSize > 0 &&
      !(
        (props.isPreFlop &&
          props.isTwoPlayer &&
          props.currPlayer?.type === 'd' &&
          props.prevSize === 2 * props.baseSize) ||
        (props.currPlayer?.type === 'bb' &&
          props.prevSize === 2 * props.baseSize &&
          props.isPreFlop)
      )
    )
  }
  return true
}
</script>

<template>
  <div class="action-container">
    <div class="action" v-show="isAction">
      <div class="action-type action-btn">
        <span @click="action('fold')">fold</span>
        <span @click="action('check')" v-show="showActionBtn('check')">check</span>
        <span @click="action('call')" v-show="showActionBtn('call')">call</span>
        <span @click="otherSizeHandle()" v-show="showActionBtn('raise')">more</span>
        <span @click="action('allin')" v-show="!showActionBtn('raise')">allin</span>
      </div>
      <div class="raise-size">
        <div class="not-allin" v-show="showActionBtn('raise')">
          <i v-for="size in raiseSizeMap" @click="raise(size)" v-show="showActionSize(size)">
            {{ Math.floor(size) }}</i
          >
        </div>
      </div>
      <div class="action-other-size" v-if="isRaise">
        <div class="action-other-size-body">
          <div class="size" v-show="currPlayer && raiseSize < currPlayer.counter">
            <input type="number" v-model="raiseSize" />
          </div>
          <div class="size" v-show="currPlayer && raiseSize === currPlayer.counter">Allin</div>
          <Range
            :max="currPlayer && currPlayer.counter"
            :min="0"
            :is-horizontal="true"
            :buyInSize="raiseSize"
            @update="getActionSize"
          ></Range>
          <div class="btn" @click="addSize">ok</div>
        </div>
        <div class="shadow" @click="isRaise = false"></div>
      </div>
      <div>
        <IAudio :play="playClick && audioStatus" type="click"></IAudio>
        <IAudio :play="playFold && audioStatus" type="fold"></IAudio>
        <IAudio :play="playRaise && audioStatus" type="raise"></IAudio>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.action-container {
  .action {
    position: absolute;
    color: #fff;
    width: 80vw;
    top: 65vh;
    left: 50%;
    transform: translateX(-50%);

    .raise-size {
      position: absolute;
      top: -7vh;
      left: 50%;
      width: 53vw;
      margin-left: -26.4vw;
      text-align: center;

      i {
        padding: 2px;
        width: 24px;
        height: 24px;
        display: inline-block;
        font-style: normal;
        font-size: 10px;
        line-height: 24px;
        border-radius: 50%;
        color: #fff;
        border: 1px solid #fff;
        background: rgba(0, 0, 0, 0.2);
        margin: 10px;
        vertical-align: middle;
      }
    }

    .action-btn {
      span {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        padding: 2px;
        text-align: center;
        margin: 0 10px;
        line-height: 40px;
        border: 1px solid #fff;
        font-size: 14px;
        display: inline-block;
      }
    }

    .action-other-size {
      background-color: rgba(0, 0, 0, 0);
      position: fixed;
      width: 50vw;
      height: 30vh;
      right: -16px;
      top: -35vh;
      z-index: 90;

      .shadow {
        position: absolute;
        top: -30vh;
        width: 99vw;
        height: 100vh;
        right: -5vw;
        z-index: 8;
        overflow: hidden;
        background: linear-gradient(-70deg, black, transparent);
      }

      .action-other-size-body {
        z-index: 9;
        position: absolute;
        width: 50vw;
        height: 30vh;
        .size {
          input {
            background: transparent;
            font-size: 20px;
            width: 50px;
            text-align: center;
            color: #fff;
          }
        }
        .btn {
          position: absolute;
          top: 34vh;
          left: 20vw;
          border: 1px solid #fff;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.4);
          padding: 5px;
          font-size: 12px;
          width: 20px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
