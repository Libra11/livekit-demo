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
		<drop-image-button
			class="mx-3"
			muteIcon="guanbixunibeijing"
			unmuteIcon="kaiqixunibeijing"
			:images="imageList"
			:switchBackground="switchBackground"
			:enabledClick="enableVirtualBackground"
			:disabledClick="disableVirtualBackground"
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
import DropImageButton from './DropImageButton.vue'
import type LibraLiveKit from '@/livekit'
import type { LocalTrack } from 'livekit-client'
import SwitchButton from './SwitchButton.vue'
import emitter from '@/utils/mitt'
import { BackgroundBlur, VirtualBackground } from '@livekit/track-processors'

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

const blur = BackgroundBlur(10, { delegate: 'GPU' })

const enableVirtualBackground = async () => {
	if (props.videoTrack?.getProcessor()?.name !== 'background-blur') {
		await props.videoTrack?.setProcessor(blur)
	}
}

const disableVirtualBackground = async () => {
	if (props.videoTrack?.getProcessor()) {
		await props.videoTrack?.stopProcessor()
	}
}

const switchBackground = async (image: string) => {
	const processor = VirtualBackground(image)
	await props.videoTrack?.setProcessor(processor)
}

/**
 * devices
 */
const cameraList = ref<Array<MediaDeviceInfo>>([])
const micList = ref<Array<MediaDeviceInfo>>([])

const imageList = ref<Array<string>>([])

// get devices
const getDevices = async () => {
	await getCameraDevices()
	await getMicDevices()
	getImageList()
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

const getImageList = () => {
	const images = [new URL('../assets/background/1.jpg', import.meta.url).href]
	imageList.value = images
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
	await props.llk?.restartCameraTrack()
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
const changeLayout = (command: string) => {
	console.log(command)
	emitter.emit('changeLayout', command)
}
</script>

<style scoped></style>
