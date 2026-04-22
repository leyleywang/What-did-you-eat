<template>
  <div id="app">
    <router-view />
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { initializeDefaultData } from './store'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()

const showBottomNav = computed(() => {
  return true
})

initializeDefaultData()
</script>
