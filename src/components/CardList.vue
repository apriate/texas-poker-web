<script setup lang="ts">
import { mapCard } from '@/utils/map'
import CardStyle from '@/components/CardStyle.vue'
import { computed } from 'vue'

const props = defineProps({
  cardList: {
    type: Array,
    default: []
  },
  valueCards: {
    type: Array,
    default: []
  }
})

const show = computed(() => {
  return props.cardList.length !== 0
})
const isBlack = (type: string) => {
  return type === 's' || type === 'c'
}
const map = (card: string) => {
  return mapCard(card)
}

const shadow = (card: string) => {
  if (props.valueCards.length === 0 || card === '') {
    return false
  }
  return props.valueCards.indexOf(card) < 0
}
</script>

<template>
  <div class="card-container">
    <div
      class="card"
      v-for="(card, key) in cardList as any"
      v-bind:class="{ show: show, turn: show && card !== '' }"
      :key="key"
    >
      <i></i>
      <span class="card-bg red" :class="{ black: isBlack(map(card)[1]) }">
        <div class="shadow" v-show="shadow(card)"></div>
        <b class="number">{{ map(card)[0] }}</b>
        <b class="color">
          <CardStyle size="small" :type="map(card)[1]"></CardStyle>
        </b>
        <b class="color big">
          <CardStyle size="big" :type="map(card)[1]"></CardStyle>
        </b>
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
.card-container {
  .card {
    height: 60px;
    width: 40px;
    position: absolute;
    top: 0;
    left: 0;
    transform-style: preserve-3d;
    opacity: 0;
    border-radius: 5px;
    z-index: 0;

    i {
      background: url('../assets/poke.png');
      height: 60px;
      width: 40px;
      background-size: 100% 100%;
      transform: rotateY(0deg) translate3d(0px, 0px, 0px);
      backface-visibility: hidden;
      position: absolute;
      border-radius: 5px;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .card-bg {
      /*background: url("../assets/poke-icon.png");*/
      background-size: 100% 100%;
      height: 60px;
      width: 40px;
      border-radius: 5px;
      background-color: #fff;
      transform: rotateY(180deg) translate3d(0px, 0px, 0px);
      backface-visibility: hidden;
      position: absolute;
      left: 0;
      z-index: 0;
      display: flex;
      flex-direction: column;
      transform-style: preserve-3d;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

      .shadow {
        width: 40px;
        height: 60px;
        left: 0;
        top: 0;
        border-radius: 5px;
        position: absolute;
        z-index: 1;
        background: rgba(0, 0, 0, 0.4);
      }

      &.red {
        color: #e8050a;
      }

      &.black {
        color: #000;
      }

      .number {
        text-align: left;
        position: absolute;
        left: 5px;
        font-size: 16px;
        line-height: 25px;
        font-family: initial;
      }

      .color {
        position: absolute;
        left: 5px;
        top: -2px;
        font-size: 20px;
        line-height: 60px;
        font-family: Arial;
        &.big {
          left: 15px;
          font-size: 35px;
          top: 12px;
        }
      }
    }

    &.show {
      display: block;
      opacity: 1;
      transition: left 1s;
    }

    &.turn {
      animation: turn 1s forwards;
      animation-delay: 1s;
    }

    &:nth-child(1) {
      &.show {
        left: 0;
      }
    }

    &:nth-child(2) {
      &.show {
        left: 44px;
      }
    }

    &:nth-child(3) {
      &.show {
        left: 44 * 2px;
      }
    }

    &:nth-child(4) {
      &.show {
        left: 44 * 3px;
      }
    }

    &:nth-child(5) {
      &.show {
        left: 44 * 4px;
      }
    }
  }

  @keyframes turn {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(-180deg);
    }
  }
}
</style>
