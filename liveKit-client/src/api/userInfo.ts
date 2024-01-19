import fetch from '@/request'

type UserInfo = {
	name: string
	email: string
	phone: string
	id: string
}

// 用户信息
function getUserInfo() {
	return fetch<UserInfo>(`/user/user_info`)
}

export { getUserInfo }
export type { UserInfo }
