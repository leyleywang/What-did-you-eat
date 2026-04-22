<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">打卡记录</h1>
    </header>
    
    <div v-if="groupedCheckins.length === 0" class="empty-state">
      <div class="empty-state-icon">📝</div>
      <p class="empty-state-text">暂无打卡记录，去首页随机选餐吧</p>
    </div>
    
    <div v-else>
      <div 
        v-for="group in groupedCheckins" 
        :key="group.dateKey" 
        class="day-section"
      >
        <div class="day-header">{{ formatDisplayDate(group.dateKey) }}</div>
        
        <div class="card" style="margin-top: 0;">
          <div v-for="checkin in group.checkins" :key="checkin.id" class="meal-item" style="margin-bottom: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
            <img 
              :src="checkin.meal.image" 
              :alt="checkin.meal.name" 
              class="meal-image"
              @error="handleImageError"
            />
            <div class="meal-info">
              <div class="meal-name">{{ checkin.meal.name }}</div>
              <div class="meal-ingredients">{{ checkin.meal.ingredients.join('、') }}</div>
              <div class="meal-nutrition">
                <div class="nutrition-item">蛋白质 <span>{{ checkin.meal.protein }}g</span></div>
                <div class="nutrition-item">热量 <span>{{ checkin.meal.calories }}kcal</span></div>
                <div class="nutrition-item">碳水 <span>{{ checkin.meal.carbs }}g</span></div>
              </div>
            </div>
          </div>
          
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-value">{{ group.stats.totalProtein }}g</div>
              <div class="stat-label">总蛋白质</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ group.stats.totalCalories }}kcal</div>
              <div class="stat-label">总热量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ group.stats.totalCarbs }}g</div>
              <div class="stat-label">总碳水</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCheckins, getTodayDateKey } from '../store'

const checkins = ref([])

const groupedCheckins = computed(() => {
  const groups = {}
  
  checkins.value.forEach(checkin => {
    if (!groups[checkin.dateKey]) {
      groups[checkin.dateKey] = {
        dateKey: checkin.dateKey,
        checkins: [],
        stats: {
          totalProtein: 0,
          totalCalories: 0,
          totalCarbs: 0
        }
      }
    }
    
    groups[checkin.dateKey].checkins.push(checkin)
    
    if (checkin.meal) {
      groups[checkin.dateKey].stats.totalProtein += checkin.meal.protein || 0
      groups[checkin.dateKey].stats.totalCalories += checkin.meal.calories || 0
      groups[checkin.dateKey].stats.totalCarbs += checkin.meal.carbs || 0
    }
  })
  
  return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey))
})

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iIGZpbGw9IiM5OTk55L+M8C90ZXh0Pjwvc3ZnPg=='
}

const formatDisplayDate = (dateKey) => {
  const today = getTodayDateKey()
  const yesterday = getYesterdayDateKey()
  
  if (dateKey === today) {
    return '今天 ' + dateKey
  } else if (dateKey === yesterday) {
    return '昨天 ' + dateKey
  }
  
  return dateKey
}

const getYesterdayDateKey = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

const loadCheckins = () => {
  checkins.value = getCheckins()
}

onMounted(() => {
  loadCheckins()
})
</script>
