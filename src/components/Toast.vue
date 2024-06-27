<script setup lang="ts">
import { ref, watch } from 'vue'

const show = defineModel('show')
const emit = defineEmits(['close'])

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  timeOut: {
    type: Number,
    default: 3000
  }
})
const Time: any = ref()

watch(
  () => show.value,
  () => {
    if (show.value) {
      close()
    }
  }
)

const close = () => {
  window.clearTimeout(Time.value)
  Time.value = setTimeout(() => {
    show.value = false
    emit('close')
  }, props.timeOut || 0)
}
</script>

<template>
  <div class="toast-container">
    <div class="toast-body" v-show="show">
      {{ text }}
    </div>
  </div>
</template>

<style scoped lang="less">
.toast-container {
  .toast-body {
    padding: 4px 10px;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    color: #fff;
    font-size: 12px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 4px;
    line-height: 16px;
  }
}
</style>
