import fetch from '@/request'

type LoginData = {
	token: string
}

type RegisterData = {}

// 邮箱注册
function emailRegister(email: string, password: string) {
	const formData = new FormData()
	formData.append('email', email)
	formData.append('password', password)
	return fetch<RegisterData>(`/register/email`, { method: 'POST', formData })
}

// 邮箱登录
function emailLogin(email: string, password: string) {
	const formData = new FormData()
	formData.append('email', email)
	formData.append('password', password)
	return fetch<LoginData>(`/login/email`, { method: 'POST', formData })
}

// 手机号注册发送验证码
function registerCode(phone: string) {
	const formData = new FormData()
	formData.append('phone', phone)
	return fetch<RegisterData>(`/register/code`, { method: 'POST', formData })
}

// 手机号登录发送验证码
function loginCode(phone: string) {
	const formData = new FormData()
	formData.append('phone', phone)
	return fetch<RegisterData>(`/login/code`, { method: 'POST', formData })
}

// 验证码登录
function codeLogin(phone: string, code: string) {
	const formData = new FormData()
	formData.append('phone', phone)
	formData.append('code', code)
	return fetch<LoginData>(`/login/verify`, { method: 'POST', formData })
}

export { emailRegister, emailLogin, registerCode, loginCode, codeLogin }
