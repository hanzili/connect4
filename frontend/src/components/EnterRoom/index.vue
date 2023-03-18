<script lang="ts">
import axios from 'axios'
const backendAPIURL = import.meta.env.VITE_APP_API_URL
export default {
  data() {
    return {
      name: '',
      roomCode: '',
      prompt: ''
    }
  },
  methods: {
    async createRoom() {
      console.log(this.name)
      if (this.name) {
        try {
          const response = await axios.post(backendAPIURL + '/rooms')
          const code = response.data.code
          try {
            const response = await axios.post(backendAPIURL + '/players', {
              name: this.name,
              code: code
            })
            localStorage.setItem('userId', response.data.id)
            localStorage.setItem('roomId', response.data.roomId)
          } catch (error) {
            this.prompt = String(error)
          }
        } catch (error) {}
      }
    },
    async joinRoom() {
      if (this.name && this.roomCode) {
        try {
          const response = await axios.post(backendAPIURL + '/players', {
            name: this.name,
            code: this.roomCode
          })
          console.log(response.data)
          localStorage.setItem('userId', response.data.id)
          localStorage.setItem('roomId', response.data.roomId)
        } catch (error) {
          this.prompt = String(error)
        }
      }
    }
  }
}
</script>

<template>
  <div
    class="w-9/12 bg-gray-200 rounded-lg h-4/5 flex flex-col justify-center items-center m-auto font-mono"
  >
    <div class="text-5xl mb-10 font-bold">Connect Four</div>
    <div class="mb-10 flex flex-col justify-center w-1/3">
      <div>Your Name:</div>
      <input class="px-5 py-3 text-lg rounded-lg" v-model="name" />
    </div>
    <div class="mb-10 flex flex-col justify-center w-1/3">
      <div>Room Code:</div>
      <input class="px-5 py-3 text-lg rounded-lg" v-model="roomCode" />
    </div>
    <div class="mb-10 flex w-1/3 justify-evenly">
      <button class="bg-gray-300 rounded-lg p-3 text-lg mr-3" @click="createRoom">
        Create Room
      </button>
      <button class="bg-gray-300 rounded-lg p-3 text-lg" @click="joinRoom">Join Room</button>
    </div>
    <div class="text-md text-red-500">{{ prompt }}</div>
  </div>
</template>
