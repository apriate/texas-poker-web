<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus'])
const model = defineModel({ default: '' })

const focus = ref(false)

const clear = () => {
  emit('update:modelValue', '')
}

const onFocus = () => {
  focus.value = true
  emit('focus')
}
</script>

<template>
  <div class="input-container">
    <div class="input-bd" :class="{ move: focus || model !== '', focus: focus, error: error }">
      <div class="input-name">{{ text }}</div>
      <div class="input-text">
        <input :type="type" @focus="onFocus" @blur="focus = false" v-model="model" />
        <i class="iconfont icon-close close" v-show="model !== ''" @click="clear"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.input-container {
  .input-name {
    top: 12px;
    left: 10px;
    text-align: left;
    padding-left: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    transition: 300ms transform;
    z-index: 0;
    background-color: #fff;
  }

  .input-text {
    position: relative;
    display: block;
    padding: 2px;
    box-sizing: border-box;
    z-index: 1;

    input {
      width: 80vw;
      height: 20px;
      padding: 5px 10px;
      display: inline-block;
      vertical-align: top;
      line-height: 20px;
      background: transparent;
    }
  }

  .input-bd {
    margin: 4vw 0;
    border: 1px solid #bababa;
    border-radius: 4px;
    text-align: left;
    line-height: 40px;
    box-sizing: border-box;
    position: relative;
  }

  .move {
    .input-name {
      transform: translate3d(-10px, -22px, 0px) scale(0.8);
    }
  }

  .focus {
    border: 1px solid #00976e;

    .input-name {
      color: #00976e;
    }
  }

  .error {
    border: 1px solid #e8050a;

    .input-name {
      color: #e8050a;
    }
  }

  .close {
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    z-index: 9;
    right: 0;
    top: 8px;
  }
}
</style>
