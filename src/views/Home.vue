<script setup lang="ts">
import { ref } from 'vue'
import { IGameRecord } from '@/interface/IGameRecord'
import GameRecord from '@/components/GameRecord.vue'
import service from '@/service'
import { useRouter } from 'vue-router'
import { setRoomConfig } from '@/utils/token'

const roomNumber = ref()
const isJoin = ref(false)
const showBtn = ref(true)
const isError = ref(false)
const isShort = ref(false)
const smallBlind = ref(1)
const showRoomConfig = ref(false)
const showRecord = ref(false)
const commandList = ref([])
const currGameIndex = ref(0)
const gameList = ref<IGameRecord[]>([])

const router = useRouter()

const createRoom = async () => {
  try {
    // 有效期参数默认设置为3600000
    const result = await service.createRoom(isShort.value, smallBlind.value, 360000)
    const { roomNumber } = result.data
    const roomConfig = {
      isShort: isShort.value,
      smallBlind: smallBlind.value
    }

    setRoomConfig(JSON.stringify(roomConfig))
    router.push({ name: 'game', params: { roomNumber, isOwner: '1' } })
  } catch (e) {
    console.log(e)
    ElMessage({ type: 'error', message: 'create room error' })
  }
}

const joinRoom = () => {
  isJoin.value = true
  showBtn.value = false
}

const getRecord = async (index: number) => {
  try {
    console.log('ccc')
    let gameId = 0
    if (!index) {
      const result = await service.gameRecordList('889008')
      gameList.value = Object.values(result.data)
      gameId = gameList.value[gameList.value.length - 1].gameId
      currGameIndex.value = gameList.value.length
      console.log('ccc len', gameList.value.length)
    } else {
      currGameIndex.value = index
    }
    console.log(gameId, 'ccc11')
    gameId = gameList.value[index].gameId
    const { data } = await service.commandRecordList('889008', gameId)
    commandList.value = data.commandList
    showRecord.value = true
    console.log(data)
  } catch (e) {
    console.log(e)
    ElMessage({ type: 'error', message: 'can`t find the command record list' })
  }
}

const selfPast7DayGame = async () => {
  try {
    const { data } = await service.selfPast7DayGame()
    data.forEach((v: IGameRecord) => {
      gameList.value.push({ gameId: v.gameId })
    })
    currGameIndex.value = data.length
    commandList.value = data[data.length - 1].gameCommandList
    showRecord.value = true
  } catch (e) {
    console.log(e)
    ElMessage({ type: 'error', message: 'can`t find the command record list' })
  }
  console.log('selfPast7DayGame')
}

const go = async () => {
  const number = roomNumber.value

  try {
    const { data } = await service.findRoom(number)
    if (data) {
      const roomConfig = {
        isShort: isShort.value,
        smallBlind: smallBlind.value
      }

      setRoomConfig(JSON.stringify(roomConfig))
      router.push({ name: 'game', params: { roomNumber: number } })
    } else {
      ElMessage({ type: 'error', message: 'can`t find the room' })
    }
  } catch (e) {
    ElMessage({ type: 'error', message: 'can`t find the room' })
  }
}
</script>

<template>
  <div class="home-container container">
    <div class="room-btn" v-show="showBtn">
      <div class="room-config" v-show="showRoomConfig">
        <div class="room-config-shadow" @click="showRoomConfig = false"></div>
        <div class="room-config-body">
          <h1>room config</h1>
          <div class="input-bd">
            <div class="input-name">smallBlind:</div>
            <div class="input-text">
              <input type="number" v-model="smallBlind" />
            </div>
          </div>
          <div class="input-bd">
            <div class="input-name">isShort:</div>
            <div class="input-text">
              <input type="checkbox" v-model="isShort" />
            </div>
          </div>
          <div class="btn" @click="createRoom"><span>create</span></div>
        </div>
      </div>

      <div class="create-room btn" @click="showRoomConfig = true"><span>create room</span></div>
      <div class="btn" @click="joinRoom"><span>join room</span></div>
      <div class="btn" @click="getRecord(0)"><span>test record</span></div>
      <div class="btn" @click="selfPast7DayGame()"><span>7 day history</span></div>
    </div>

    <div class="room-number" v-show="isJoin">
      <div class="room-input inline">
        <div class="input-bd" :class="{ error: isError }">
          <div class="input-name iconfont icon-password"></div>
          <div class="input-text">
            <input type="number" @focus="isError = false" v-model="roomNumber" />
          </div>
        </div>
      </div>
      <div class="room-btn inline">
        <span @click="go">go</span>
      </div>
    </div>

    <GameRecord
      v-model="showRecord"
      :game-list="gameList"
      :curr-game-index="currGameIndex"
      @getRecord="getRecord"
      :command-list="commandList"
    ></GameRecord>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  .room-config {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    .room-config-shadow {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 9;
      background-color: rgba(0, 0, 0, 0.3);
    }
    .room-config-body {
      position: absolute;
      background-color: #fff;
      border-radius: 8px;
      left: 50%;
      top: 50%;
      z-index: 99;
      width: 230px;
      min-height: 200px;
      transform: translate3d(-50%, -50%, 0);
      h1 {
        font-size: 16px;
        text-align: center;
        line-height: 40px;
      }
      .input-bd {
        display: flex;
        .input-name {
          width: 20vw;
          text-align: right;
        }
        .input-text {
          margin-left: 8px;
          line-height: 30px;
          input {
            width: 10vw;
            min-width: 10vw;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            border-bottom: 1px solid #bababa;
            &[type='checkbox'] {
              width: 4vw;
              height: 4vw;
              min-width: auto;
              min-height: auto;
            }
          }
        }
      }
    }
  }

  .room-btn {
    flex: 1;

    .btn {
      width: 50vw;
      margin: 30px auto;
    }
  }

  .room-number {
    line-height: 40px;
    text-align: center;
    width: 100%;
    .error {
      border: 1px solid #e8050a;
    }
    .input-bd {
      border: 1px solid #bababa;
      border-radius: 4px;
      input {
        border-radius: 8px;
      }
    }
    .room-btn {
      height: 30px;
      margin-top: 0;

      span {
        margin: 0;
        line-height: 30px;
        height: 30px;
        font-size: 12px;
        color: #fff;
        background-color: #00976e;
        border-radius: 8px;
        padding: 0 20px;
        display: block;
      }
    }

    .inline {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>
