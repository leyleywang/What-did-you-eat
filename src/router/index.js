import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Menu from '../views/Menu.vue'
import Checkin from '../views/Checkin.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu,
    meta: { title: '餐单' }
  },
  {
    path: '/checkin',
    name: 'Checkin',
    component: Checkin,
    meta: { title: '打卡' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '我的' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
