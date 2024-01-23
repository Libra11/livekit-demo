/*
 * @Author: Libra
 * @Date: 2023-03-06 10:21:05
 * @LastEditTime: 2023-05-26 13:50:30
 * @LastEditors: Libra
 * @Description: 路由
 */
import whiteList from '@/utils/whiteList'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useToken } from '@/composables/useVar'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/user-center',
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/LoginView.vue'),
	},
	{
		path: '/join',
		name: 'Join',
		component: () => import('../views/JoinView.vue'),
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('../views/AboutView.vue'),
	},
	{
		path: '/user-center',
		name: 'Center',
		redirect: '/user-center/user-info',
		component: () => import('../views/UserCenterView.vue'),
		children: [
			{
				path: 'user-info',
				name: 'UserInfo',
				component: () => import('../views/UserInfoView.vue'),
			},
			{
				path: 'create-meet',
				name: 'CreateMeet',
				component: () => import('../views/CreateMeetView.vue'),
			},
			{
				path: 'meet-config',
				name: 'MeetConfig',
				component: () => import('../views/MeetConfigView.vue'),
			},
			{
				path: 'join-meet',
				name: 'JoinMeet',
				component: () => import('../views/JoinMeetView.vue'),
			},
			{
				path: 'meet-arrangement',
				name: 'MeetArrangement',
				component: () => import('../views/MeetArrangementView.vue'),
			},
			{
				path: 'meet-history',
				name: 'MeetHistory',
				component: () => import('../views/MeetHistoryView.vue'),
			},
			{
				path: 'contacts',
				name: 'Contacts',
				component: () => import('../views/Contacts.vue'),
			},
		],
	},
	{
		path: '/invite/:link',
		name: 'Invite',
		component: () => import('../views/InviteJoinView.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

router.beforeEach((to, from, next) => {
	// 检查 token 是否存在
	const token = useToken().value
	// 检查路由名称是否在白名单中
	if (whiteList.includes(to.name as string)) {
		next()
	} else if (token) {
		// 如果 token 存在且不在白名单中，继续访问
		next()
	} else {
		// 如果 token 不存在且不在白名单中，重定向到首页
		next(`/login?redirect=${to.path}`)
	}
})

export default router
