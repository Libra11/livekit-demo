<!--
 * @Author: Libra
 * @Date: 2023-05-26 18:22:36
 * @LastEditTime: 2023-06-01 09:44:17
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <el-card class="w-full h-full relative cursor-pointer">
    <div class=" absolute top-2 left-2 bg-[rgba(255,255,255,0.5)] px-2 rounded-full backdrop-blur-sm text-sm text-slate-700 flex-c" v-if="!isMe">
      <i class="iconfont icon-maikefeng text-primary-color" v-if="!isSpeaking"></i>
      <i class="iconfont icon-maikefeng1 text-success-color" v-else></i>
      <span class=" ml-1">{{ username }}</span>
    </div>  
    <div class=" absolute top-2 left-2 bg-primary-color px-4 rounded-full text-sm" v-else>
      本人
    </div>  
    <video class="w-full" :id="`v${id.toString()}`">
  </video>
  </el-card>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isMe: {
    type: Boolean,
    required: true,
  },
  isSpeaking: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>