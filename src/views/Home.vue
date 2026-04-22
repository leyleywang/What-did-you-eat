<template>
  <div class="page-container home-content">
    <header class="page-header">
      <h1 class="page-title">今天吃什么</h1>
    </header>
    
    <div v-if="meals.length === 0" class="no-meals-message">
      <div class="no-meals-icon">🍽️</div>
      <p>暂无餐单，请先添加餐单</p>
    </div>
    
    <div v-else class="carousel-container">
      <div 
        class="carousel-track"
        :class="{ marquee: isMarquee }"
        :style="{ transform: `translateX(-${currentOffset}px)` }"
      >
        <div 
          v-for="(meal, index) in displayMeals" 
          :key="`${meal.id}-${index}`" 
          class="carousel-slide"
        >
          <img 
            :src="meal.image" 
            :alt="meal.name" 
            class="carousel-image"
            @error="handleImageError"
          />
          <h2 class="carousel-name">{{ meal.name }}</h2>
          <div class="carousel-nutrition">
            <div class="nutrition-item">
              <div class="nutrition-value">{{ meal.protein }}g</div>
              <div class="nutrition-label">蛋白质</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ meal.calories }}kcal</div>
              <div class="nutrition-label">热量</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ meal.carbs }}g</div>
              <div class="nutrition-label">碳水</div>
            </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMeals, addCheckin, getTodayDateKey } from '../store'

const router = useRouter()
const meals = ref([])
const currentIndex = ref(0)
const currentOffset = ref(0)
const isMarquee = ref(false)
const showResult = ref(false)
const selectedMeal = ref(null)
const autoPlayTimer = ref(null)
const marqueeTimer = ref(null)
const slideWidth = ref(0)

const displayMeals = computed(() => {
  if (isMarquee.value) {
    return [...meals.value, ...meals.value, ...meals.value]
  }
  return meals.value
})

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSIgZmlsbD0iIzk5OTkiPu+8jTwvdGV4dD48L3N2Zz4='
}

const loadMeals = () => {
  meals.value = getMeals()
}

const startAutoPlay = () => {
  if (meals.value.length <= 1) return
  
  autoPlayTimer.value = setInterval(() => {
    if (isMarquee.value) return
    
    currentIndex.value = (currentIndex.value + 1) % meals.value.length
    updateSlidePosition()
  }, 3000)
}

const updateSlidePosition = () => {
  const container = document.querySelector('.carousel-container')
  if (container) {
    slideWidth.value = container.offsetWidth
  }
  currentOffset.value = currentIndex.value * slideWidth.value
}

const startRandom = () => {
  if (isMarquee.value || meals.value.length === 0) return
  
  isMarquee.value = true
  currentOffset.value = 0
  
  let speed = 20
  let direction = 1
  
  const runMarquee = () => {
    marqueeTimer.value = requestAnimationFrame(() => {
      const maxOffset = meals.value.length * slideWidth.value
      currentOffset.value += speed * direction
      
      if (currentOffset.value >= maxOffset * 2) {
        currentOffset.value = 0
      }
      
      if (isMarquee.value) {
        runMarquee()
      }
    })
  }
  
  runMarquee()
  
  setTimeout(() => {
    stopMarquee()
  }, 3000)
}

const stopMarquee = () => {
  isMarquee.value = false
  if (marqueeTimer.value) {
    cancelAnimationFrame(marqueeTimer.value)
  }
  
  const randomIndex = Math.floor(Math.random() * meals.value.length)
  selectedMeal.value = meals.value[randomIndex]
  currentIndex.value = randomIndex
  updateSlidePosition()
  
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
  updateSlidePosition()
  startAutoPlay()
  
  window.addEventListener('resize', updateSlidePosition)
})

onUnmounted(() => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
  if (marqueeTimer.value) {
    cancelAnimationFrame(marqueeTimer.value)
  }
  window.removeEventListener('resize', updateSlidePosition)
})
</script>
