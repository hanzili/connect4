<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    player1Name: String,
    player2Name: String,
    userId: Number,
    code: String,
    turnId: Number,
    winnerId: Number
  },
  methods: {}
})
</script>

<template>
  <div
    class="w-1/4 bg-gray-200 h-full flex flex-col justify-evenly pl-10 font-mono text-3xl font-bold"
  >
    <div>Room code: {{ code }}</div>
    <div>Player 1: {{ player1Name }}</div>
    <div v-if="player2Name">
      <div>Player 2: {{ player2Name }}</div>
      <div v-if="winnerId!==-1 && winnerId === userId">You win!</div>
      <div v-else-if="winnerId!==-1">You lose!</div>
      <div v-else>
        <div v-if="userId === turnId">Your turn!</div>
        <div v-else>Waiting for opponent to move...</div>
      </div>
    </div>
    <div v-else>Waiting for player2 to join...</div>
  </div>
</template>
