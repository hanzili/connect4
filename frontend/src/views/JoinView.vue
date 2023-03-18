<script lang="ts">
import axios from 'axios'
import EnterRoom from '@/components/EnterRoom/EnterRoom.vue'
export default {
  data() {
    return {}
  },
  methods: {},
  components: { EnterRoom },
}
</script>

<template>
  <div class="h-screen m-auto items-center w-full bg-gray-100 flex">
    <EnterRoom />
  </div>
</template>
