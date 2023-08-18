<!--
 * @Author: Libra
 * @Date: 2023-08-04 15:07:17
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="bar flex-c absolute bottom-6 z-10 mx-4 h-14 rounded-lg px-2 shadow-lg transition-all">
		<drop-button
			muteIcon="shexiangtou_guanbi"
			unmuteIcon="shexiangtou"
			:devices="cameraList"
			:switchDevice="switchCamera"
			:enabledClick="unmuteCamera"
			:disabledClick="muteCamera"
		/>
		<drop-button
			class="mx-3"
			muteIcon="jingyin"
			unmuteIcon="maikefeng2"
			:devices="micList"
			:switchDevice="switchMic"
			:enabledClick="unmuteMic"
			:disabledClick="muteMic"
		/>
		<el-dropdown @command="changeLayout">
      <el-button>
        <i class="iconfont icon-bujufangshi"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="EquallyDivided">等分</el-dropdown-item>
          <el-dropdown-item command="MainAndAside">右侧</el-dropdown-item>
          <el-dropdown-item command="MainAndTop">顶部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
		<switch-button :value="screen" icon="pingmu-screen" @switch="screenShare" />
		<switch-button :value="message" icon="message" @switch="showMessage" />
		<!-- </el-card> -->
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DropButton from './DropButton.vue'
import type LibraLiveKit from '@/livekit'
import type { LocalTrack } from 'livekit-client'
import SwitchButton from './SwitchButton.vue'
import emitter from '@/utils/mitt'
import type { ILayout } from '@/store/modules/user'

const props = defineProps<{
	llk: LibraLiveKit | null
	videoTrack: LocalTrack | null
	audioTrack: LocalTrack | null
	screenTrack: LocalTrack | null
}>()

onMounted(async () => {
	await getDevices()
})

const muteCamera = async () => {
	await props.videoTrack?.mute()
}
const unmuteCamera = async () => {
	await props.videoTrack?.unmute()
}
const muteMic = async () => {
	await props.audioTrack?.mute()
}
const unmuteMic = async () => {
	await props.audioTrack?.unmute()
}

/**
 * devices
 */
const cameraList = ref<Array<MediaDeviceInfo>>([])
const micList = ref<Array<MediaDeviceInfo>>([])

// get devices
const getDevices = async () => {
	await getCameraDevices()
	await getMicDevices()
}

const getCameraDevices = async () => {
	const devices = await props.llk?.getLocalDevices('video')
	if (!devices) return
	cameraList.value = devices
}

const getMicDevices = async () => {
	const devices = await props.llk?.getLocalDevices('audio')
	if (!devices) return
	micList.value = devices
}
// switch camera
const switchCamera = async (device: MediaDeviceInfo) => {
	await props.llk?.switchLocalDevice('video', device.deviceId)
}
// switch mic
const switchMic = async (device: MediaDeviceInfo) => {
	await props.llk?.switchLocalDevice('audio', device.deviceId)
}

/**
 * screen
 */
const screen = ref(false)
const screenShare = async (value: boolean) => {
	value ? await startScreenShare() : await stopScreenShare()
	screen.value = value
}
const startScreenShare = async () => {
	await props.llk?.createScreenTrack()
}
const stopScreenShare = async () => {
	await props.llk?.stopScreenTrack()
}

/**
 * message
 */
const message = ref(false)
const showMessage = (value: boolean) => {
  message.value = value
  emitter.emit('showMessage', value)
}

/**
 * layout
 */
const changeLayout = (command: ILayout) => {
	console.log(command)
	emitter.emit('changeLayout', command)
}
</script>

<style scoped></style>
