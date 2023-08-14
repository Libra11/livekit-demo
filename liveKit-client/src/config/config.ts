/*
 * @Author: Libra
 * @Date: 2023-08-03 15:56:41
 * @LastEditors: Libra
 * @Description:
 */
const WEBSOCKET_URL = process.env.NODE_ENV === 'production' ? 'wss://livekit.jusbin.cn' : 'ws://127.0.0.1:7880'

export { WEBSOCKET_URL }
