<script setup lang="ts">
import { IPlayer } from '@/interface/IPlayer'
import { type PropType } from 'vue'

const show = defineModel('show', { default: false })
defineProps({
  players: {
    type: Array as PropType<IPlayer[]>,
    default: []
  }
})
</script>

<template>
  <div class="record-container" v-show="show">
    <div class="shadow" @click="show = false"></div>
    <div class="body">
      <div class="title">record</div>
      <ul>
        <li>
          <i>nickName</i>
          <i>buy in</i>
          <i>counter</i>
          <i>income</i>
        </li>
        <li v-for="player in players">
          <i>{{ player.nickName }}</i>
          <i>{{ player.buyIn }}</i>
          <i>{{ player.counter }}</i>
          <i>{{ player.counter - player.buyIn }}</i>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
.record-container {
  width: 80vw;
  height: 100vh;
  color: #fff;
  background: #2a2a2a;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;

  .shadow {
    background: rgba(0, 0, 0, 0.3);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 1;
  }

  .body {
    position: relative;
    z-index: 9;
  }

  .title {
    color: #fff;
    text-align: left;
    line-height: 30px;
    padding: 5px 10px;
    border-bottom: 1px solid #fff;
  }

  ul {
    li {
      display: flex;

      i {
        flex: 1;
        padding: 5px 10px;
        font-size: 16px;
        line-height: 20px;
        display: inline-block;
        font-style: normal;
        font-size: 12px;
      }
    }
  }
}
</style>
