<script setup lang="ts">
import CardList from '@/components/CardList.vue'
import { computed, type PropType } from 'vue'

const props = defineProps({
  commonCard: {
    type: Object,
    default: {}
  },
  valueCards: {
    type: Object as PropType<string[]>,
    default: []
  }
})

const commonCardMap = computed(() => {
  const arr = []
  if (props.commonCard.length !== 0) {
    for (let i = 0; i < 5; i++) {
      if (props.commonCard[i]) {
        arr.push(props.commonCard[i])
      } else {
        arr.push('')
      }
    }
  }
  return arr
})
</script>

<template>
  <div class="container">
    <div class="common-card-container">
      <CardList :card-list="commonCardMap" :value-cards="valueCards"></CardList>
    </div>
  </div>
</template>

<style scoped lang="less">
.common-card-container {
  position: absolute;
  top: 50vh;
  left: 50%;
  margin: -38px -114px;

  .card {
    height: 60px;
    width: 40px;
    position: absolute;
    top: 0;
    left: 0;
    transform-style: preserve-3d;
    opacity: 0;
    border-radius: 5px;

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

      &.red {
        color: #e8050a;
      }

      &.black {
        color: #000;
      }

      .number {
        text-align: left;
        position: absolute;
        z-index: -2;
        left: 5px;
        font-size: 16px;
      }

      .color {
        flex: 1;
        font-size: 28px;
        line-height: 60px;
      }
    }

    &.show {
      display: block;
      opacity: 1;
      transition: left 1s;
    }

    &.turn {
      animation: turnA 2s forwards;
      animation-delay: 2s;
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

  @keyframes turnA {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(-180deg);
    }
  }
}
</style>
