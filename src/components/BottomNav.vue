<template>
  <nav class="bottom-nav">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path" 
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <span class="nav-icon">
        <component :is="item.icon" :class="{ 'icon-active': isActive(item.path) }" />
      </span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { h, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const IconHome = () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
  h('polyline', { points: '9 22 9 12 15 12 15 22' })
])

const IconMenu = () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M12 2H2v20l4-4h16V2H12z' }),
  h('path', { d: 'M22 2H2v20l4-4h16V2z' }),
  h('path', { d: 'M9 10h6' }),
  h('path', { d: 'M9 14h6' })
])

const IconCheck = () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
  h('polyline', { points: '22 4 12 14.01 9 11.01' })
])

const IconUser = () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: '12', cy: '7', r: '4' })
])

const navItems = [
  { path: '/', label: '首页', icon: IconHome },
  { path: '/menu', label: '餐单', icon: IconMenu },
  { path: '/checkin', label: '打卡', icon: IconCheck },
  { path: '/profile', label: '我的', icon: IconUser }
]

const isActive = (path) => {
  return computed(() => route.path === path)
}
</script>

<style scoped>
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  transition: all 0.2s ease;
}

.icon-active {
  stroke: var(--primary-color);
}
</style>
