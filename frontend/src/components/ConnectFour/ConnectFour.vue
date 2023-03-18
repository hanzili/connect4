<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
import Hole from './Hole.vue'
export default defineComponent({
  props: {
    userId: Number,
    board: Array<Array<number>>,
    turnId: Number,
    winnerId: Number
  },
  methods: {},
  components: {
    Hole
  }
})
</script>

<template>
  <div class="w-3/4 h-full flex flex-col justify-evenly pl-10 font-mono text-3xl font-bold">
    <div v-for="(rows,rowIndex) in board" class="flex w-full justify-evenly">
      <div v-for="(holeUserId, columnIndex) in rows" class="flex h-full" :key="rowIndex">
        <Hole :holeUserId="holeUserId" :userId="userId" :key="columnIndex"/>
      </div>
    </div>
  </div>
</template>
