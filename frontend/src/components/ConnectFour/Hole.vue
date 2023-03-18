<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    userId: Number,
    holeUserId: Number
  },
  data() {
    return {
      color: this.getColor()
    }
  },
  methods: {
    getColor() {
      console.log("userId"+this.userId);
      console.log("holeUserId"+this.holeUserId);
      if (this.holeUserId === -1) return ''
      else if (this.userId === this.holeUserId) return 'bg-red-300'
      else return 'bg-yellow-300'
    }
  }
})
</script>

<template>
  <div class="w-28 h-28">
    <div class="rounded-full w-full h-full border border-gray-500" :class="color"></div>
  </div>
</template>
