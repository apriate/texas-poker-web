<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  buyInSize: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  min: {
    type: Number,
    default: 100
  },
  isHorizontal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'input'])

const rangeRound = computed(() => {
  return (props.max - props.min) / 100
})

const rangeSize = ref(0)

const getRange = () => {
  const valNum = Number(props.buyInSize)
  const size =
    valNum >= props.max
      ? props.max / rangeRound.value
      : valNum < props.min
        ? 0
        : (valNum - props.min) / rangeRound.value
  rangeSize.value = size
}

const changeRange = (val: string) => {
  const valNum = Number(val)
  const size =
    Number(val) === 0 ? props.min : Math.floor((valNum / 100) * (props.max - props.min)) + props.min
  // console.log('size', size)
  emit('update', size)
  emit('input', size)
}

watch(
  () => props.buyInSize,
  () => {
    getRange()
  }
)

onMounted(() => {
  getRange()
})
</script>

<template>
  <div class="slide-bar-container">
    <!--    <div class="value">{{raiseSize}}</div>-->
    <div class="range-body">
      <input
        type="range"
        v-model="rangeSize"
        :class="{ horizontal: !!isHorizontal }"
        @input="changeRange(($event.target as any).value)"
        @change="changeRange(($event.target as any).value)"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.slide-bar-container {
  .range-body {
    line-height: 10px;
  }

  .value {
    margin-bottom: 10px;
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 200px;
    border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/
    vertical-align: middle;
    display: inline-block;

    &.horizontal {
      transform: rotateZ(-90deg) translate3d(-50%, 0, 0);
      transform-origin: center;
      margin-left: -8px;
    }
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 30px;
    width: 30px;
    margin-top: -12px; /*使滑块超出轨道部分的偏移量相等*/
    background: #ffffff;
    border-radius: 50%; /*外观设置为圆形*/
    border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
    box-shadow: 0 0.125em 0.125em #3b4547; /*添加底部阴影*/
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 10px; /*将轨道设为圆角的*/
    box-shadow:
      0 1px 1px #def3f8,
      inset 0 0.125em 0.125em #0d1112; /*轨道内置阴影效果*/
  }
}
</style>
