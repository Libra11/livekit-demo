<!--
 * @Author: Libra
 * @Date: 2023-08-09 11:25:47
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <div class=" my-2 px-2 py-5">
    <div class="p-1" v-if="!message.isMe">
      <div class=" text-xs text-blue-400">{{ message.name }}</div>
      <div class="break-words">{{ message.content }}</div>
    </div>
    <div class="text-right p-1" v-else-if="message.isMe">
      <div class=" text-xs text-red-400">{{ message.name }}</div>
      <div class="break-words">{{ message.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  name: string,
  content: string,
  isMe: boolean
}
defineProps<{
  message: Message
}>()
</script>


<style lang="scss" scoped>

</style>