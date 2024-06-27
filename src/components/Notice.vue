<script setup lang="ts">
import { type PropType } from 'vue'

defineProps({
  messageList: {
    type: Array as PropType<any[]>,
    default: []
  }
})
</script>

<template>
  <div class="notice-container">
    <div class="notice-body">
      <template v-for="(message, key) in messageList" :key="key">
        <i v-if="message !== ''" :style="{ top: `${message.top}vh` }">{{ message.message }}</i>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.notice-container {
  .notice-body {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    i {
      position: absolute;
      top: 20px;
      left: 0;
      transform: translate3d(100vw, 0, 0);
      z-index: 10;
      animation: 8s move linear forwards;
      color: #fff;
      padding: 4px;
      font-size: 12px;
      font-style: normal;
      border-radius: 2px;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
  @keyframes move {
    0% {
      transform: translate3d(100vw, 0, 0);
    }
    99% {
      transform: translate3d(-198px, 0px, 0px);
      opacity: 1;
    }
    100% {
      transform: translate3d(-200px, 0px, 0px);
      opacity: 0;
    }
  }
}
</style>
