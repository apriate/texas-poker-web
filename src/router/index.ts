import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 导入页面
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Game from '@/views/Game.vue'

import apis from '@/apis'
import cookie from 'js-cookie'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'home',
      needLogin: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'login'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: 'create account'
    }
  },
  {
    path: '/game/:roomNumber/:isOwner?',
    name: 'game',
    component: Game,
    meta: {
      title: 'game',
      needLogin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(''),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

// @ts-ignore
router.beforeEach(async (to, from, next) => {
  // 设置title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 登录拦截
  if (to.meta.needLogin) {
    try {
      const result = await apis.checkLogin()
      console.log(result)
      cookie.set('user_id', result.data.userId)
      next()
    } catch (e) {
      await router.replace({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
