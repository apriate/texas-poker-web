<script setup lang="ts">
import { type PropType } from 'vue'

defineProps({
  msgList: {
    type: Array as PropType<string[]>,
    default: []
  },
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="list-container" v-show="show">
    <ul>
      <li v-for="msg in msgList">{{ (msg as any).message }}</li>
    </ul>
  </div>
</template>

<style lang="less">
.list-container {
  background: #f5f5f5;
  position: absolute;
  bottom: 45px;
  padding: 10px 0;
  ul {
    height: 100px;
    width: 100vw;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 0 12px;
    li {
      list-style: none;
      line-height: 20px;
      text-align: left;
      font-size: 12px;
      color: #2f2f2f;
    }
  }
}
</style>
