<script setup lang="ts">
import range from '@/components/Range.vue'
import { onMounted, ref, watch } from 'vue'

const showBuyIn = defineModel('showBuyIn')
const props = defineProps({
  max: {
    type: Number,
    default: 1000
  },
  min: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['update:showBuyIn', 'buyIn'])

const buyInSize = ref(0)

watch(buyInSize, () => {
  const val = buyInSize.value
  buyInSize.value = val > props.max ? props.max : val < props.min ? props.min : val
})

const getBuyInSize = (val: string) => {
  buyInSize.value = Number(val)
}

const closeBuyIn = () => {
  emit('update:showBuyIn', false)
}

const buyIn = async () => {
  closeBuyIn()
  emit('buyIn', buyInSize.value)
}

onMounted(() => {
  buyInSize.value = props.min
})
</script>

<template>
  <div class="buy-in" v-show="showBuyIn">
    <div class="shadow" @click="closeBuyIn"></div>
    <div class="buy-in-body">
      <div class="input-bd">
        <div class="input-name">
          <span>buy in: </span><input type="number" v-model="buyInSize" />
        </div>
        <range :max="max" :min="min" :buyInSize="buyInSize" @update="getBuyInSize"></range>
      </div>
      <div class="btn"><span @click="buyIn">buy in</span></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.buy-in {
  position: fixed;
  z-index: 99;

  .shadow {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }

  .buy-in-body {
    z-index: 99;
    position: fixed;
    left: 50%;
    top: 50%;
    margin: -100px -150px;
    width: 300px;
    border-radius: 12px;
    box-sizing: border-box;
    background: #fff;
    padding: 20px;
  }

  .input-text {
    input {
      width: 100px;
    }
  }
  .input-name {
    margin-bottom: 15px;
    font-size: 20px;
    text-align: center;
    input {
      width: 70px;
      font-size: 20px;
    }
  }
  .btn {
    margin-top: 20px;
  }
}
</style>
