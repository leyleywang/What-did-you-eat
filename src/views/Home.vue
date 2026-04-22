<template>
  <div class="page-container home-content">
    <header class="page-header">
      <h1 class="page-title">今天吃什么</h1>
    </header>
    
    <div v-if="meals.length === 0" class="no-meals-message">
      <div class="no-meals-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      </div>
      <p>暂无餐单，请先添加餐单</p>
    </div>
    
    <div v-else class="carousel-container">
      <div class="carousel-slide current-slide" :style="getSlideStyle(0)">
        <Transition name="fade">
          <img 
            :key="currentIndex"
            :src="meals[currentIndex]?.image" 
            :alt="meals[currentIndex]?.name" 
            class="carousel-image"
            @error="handleImageError"
          />
        </Transition>
        <h2 class="carousel-name">{{ meals[currentIndex]?.name }}</h2>
        <div class="carousel-nutrition">
          <div class="nutrition-item">
            <div class="nutrition-value">{{ meals[currentIndex]?.protein }}g</div>
            <div class="nutrition-label">蛋白质</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ meals[currentIndex]?.calories }}kcal</div>
            <div class="nutrition-label">热量</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ meals[currentIndex]?.carbs }}g</div>
            <div class="nutrition-label">碳水</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="start-btn-container" v-if="meals.length > 0">
      <button 
        class="start-btn" 
        @click="startRandom"
        :disabled="isMarquee"
      >
        {{ isMarquee ? '随机中...' : '开始' }}
      </button>
    </div>
    
    <div v-if="showResult" class="result-overlay" @click.self="closeResult">
      <div class="result-card">
        <button class="result-close" @click="closeResult">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h3 class="result-title">🎉 今天就吃这个！</h3>
        <img 
          :src="selectedMeal.image" 
          :alt="selectedMeal.name" 
          class="result-image"
          @error="handleImageError"
        />
        <h2 class="result-name">{{ selectedMeal.name }}</h2>
        <p class="result-ingredients">{{ selectedMeal.ingredients.join('、') }}</p>
        <div class="result-stats">
          <div class="nutrition-item">
            <div class="nutrition-value">{{ selectedMeal.protein }}g</div>
            <div class="nutrition-label">蛋白质</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ selectedMeal.calories }}kcal</div>
            <div class="nutrition-label">热量</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ selectedMeal.carbs }}g</div>
            <div class="nutrition-label">碳水</div>
          </div>
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary" @click="tryAgain">再试一次</button>
          <button class="btn btn-primary" @click="checkinMeal">打卡</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getMeals, addCheckin, getTodayDateKey } from '../store'

const router = useRouter()
const meals = ref([])
const currentIndex = ref(0)
const isMarquee = ref(false)
const showResult = ref(false)
const selectedMeal = ref(null)
const autoPlayTimer = ref(null)
const marqueeInterval = ref(null)

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSIgZmlsbD0iIzk5OTkiPu+8jTwvdGV4dD48L3N2Zz4='
}

const getSlideStyle = (index) => {
  return {
    opacity: 1,
    transform: 'translateX(0)',
    transition: isMarquee.value ? 'none' : 'all 0.3s ease'
  }
}

const loadMeals = () => {
  meals.value = getMeals()
}

const startAutoPlay = () => {
  if (meals.value.length <= 1) return
  
  autoPlayTimer.value = setInterval(() => {
    if (isMarquee.value) return
    currentIndex.value = (currentIndex.value + 1) % meals.value.length
  }, 3000)
}

const startRandom = () => {
  if (isMarquee.value || meals.value.length === 0) return
  
  isMarquee.value = true
  
  let speed = 80
  
  marqueeInterval.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % meals.value.length
  }, speed)
  
  setTimeout(() => {
    stopMarquee()
  }, 3000)
}

const stopMarquee = () => {
  isMarquee.value = false
  if (marqueeInterval.value) {
    clearInterval(marqueeInterval.value)
    marqueeInterval.value = null
  }
  
  const randomIndex = Math.floor(Math.random() * meals.value.length)
  selectedMeal.value = meals.value[randomIndex]
  currentIndex.value = randomIndex
  
  showResult.value = true
}

const closeResult = () => {
  showResult.value = false
  selectedMeal.value = null
}

const tryAgain = () => {
  closeResult()
  setTimeout(() => {
    startRandom()
  }, 100)
}

const checkinMeal = () => {
  if (selectedMeal.value) {
    const todayKey = getTodayDateKey()
    addCheckin({
      dateKey: todayKey,
      mealId: selectedMeal.value.id,
      meal: selectedMeal.value
    })
    closeResult()
    router.push('/checkin')
  }
}

onMounted(() => {
  loadMeals()
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
  if (marqueeInterval.value) {
    clearInterval(marqueeInterval.value)
  }
})
</script>

<style scoped>
.carousel-slide {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.current-slide {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.result-card {
  position: relative;
}

.result-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
}

.result-close:hover {
  color: var(--text-primary);
  background-color: var(--border-color);
}
</style>
