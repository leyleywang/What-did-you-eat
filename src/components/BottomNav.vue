<template>
  <nav class="bottom-nav">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path" 
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/menu', label: '餐单', icon: '📋' },
  { path: '/checkin', label: '打卡', icon: '✓' },
  { path: '/profile', label: '我的', icon: '👤' }
]

const isActive = (path) => {
  return computed(() => route.path === path)
}
</script>
