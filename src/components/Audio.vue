<script setup lang="ts">
import { watch, ref, onBeforeUpdate } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  play: {
    type: Boolean,
    default: false
  }
})
const list = ref(['click', 'raise', 'fold', 'income'])
const audioRefs: any = ref([])

const setRef = (el: any) => {
  if (el) audioRefs.value.push(el)
}

const requireAudio = (path: string) => {
  return new URL(`../assets/mp3/${path}`, import.meta.url).href
}

watch(
  () => props.play,
  (val: boolean) => {
    if (val) {
      const index = list.value.findIndex((item) => item === props.type)
      const audio = audioRefs.value[index!]
      audio.play()
    }
  }
)

// 更新之前重置ref
onBeforeUpdate(() => {
  audioRefs.value = []
})
</script>

<template>
  <div class="audio-container">
    <template v-for="(item, i) in list" :key="i">
      <audio v-if="item === props.type" :ref="setRef" controls>
        <source :src="requireAudio(`${item}.mp3`)" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </template>
  </div>
</template>

<style scoped lang="less">
.audio-container {
  position: absolute;
  z-index: -99;
  display: none;
}
</style>
