<script lang="ts">
import axios from 'axios'
import GameStatus from '@/components/GameStatus/GameStatus.vue'
import ConnectFour from '@/components/ConnectFour/ConnectFour.vue'
const backendAPIURL = import.meta.env.VITE_APP_API_URL
export default {
  data() {
    return {
      board: [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1]
      ],
      roomId: Number(localStorage.getItem('roomId')) as number,
      userId: Number(localStorage.getItem('userId')) as number,
      roomCode: '',
      player1Name: '',
      player2Name: '',
      turnId: -1,
      winnerId: -1
    }
  },
  methods: {
    async loadRoom() {
      let roomId = Number(localStorage.getItem('roomId'))
      try {
        const response = await axios.get(backendAPIURL + '/rooms/' + roomId)
        console.log(response.data)
        this.roomCode = response.data.code
        this.player1Name = response.data.players[0].name
        this.player2Name = response.data.players[1].name
        const games = response.data.games
        let hasGame = false
        if (games.length > 0 && !games[games.length - 1].winnerId) hasGame = true
        if (hasGame) {
          // load the ongoing game
          const gameId = games[games.length - 1].id
          try {
            const response = await axios.get(backendAPIURL + '/games/' + gameId)
            console.log(response.data)
            this.board = JSON.parse(response.data.board)
            this.turnId = response.data.turnId
          } catch (error) {
            // this.prompt = String(error)
          }
        } else {
          // create a new game
          try {
            const response = await axios.post(backendAPIURL + '/games/', { roomId: roomId })
            console.log(response.data)
            this.board = JSON.parse(response.data.board)
            this.turnId = response.data.turnId
          } catch (error) {
            // this.prompt = String(error)
            console.log(error)
          }
        }
      } catch (error) {
        // this.prompt = String(error)
      }
    }
  },
  components: { GameStatus, ConnectFour },
  async created() {
    await this.loadRoom()
  }
}
</script>

<template>
  <div class="h-screen w-full bg-gray-100 flex">
    <GameStatus
      :code="roomCode"
      :player1Name="player1Name"
      :player2Name="player2Name"
      :userId="userId"
      :turnId="turnId"
      :winnerId="winnerId"
    />
    <ConnectFour :board="board" :userId="1" :turnId="1" :winnerId="1" />
  </div>
</template>
