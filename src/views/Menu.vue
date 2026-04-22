<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">餐单管理</h1>
    </header>
    
    <div v-if="meals.length === 0" class="empty-state">
      <div class="empty-state-icon">📋</div>
      <p class="empty-state-text">暂无餐单，点击右下角按钮添加</p>
    </div>
    
    <div v-else class="meal-list">
      <div v-for="meal in meals" :key="meal.id" class="meal-item card">
        <img 
          :src="meal.image" 
          :alt="meal.name" 
          class="meal-image"
          @error="handleImageError"
        />
        <div class="meal-info">
          <div class="meal-name">{{ meal.name }}</div>
          <div class="meal-ingredients">{{ meal.ingredients.join('、') }}</div>
          <div class="meal-nutrition">
            <div class="nutrition-item">蛋白质 <span>{{ meal.protein }}g</span></div>
            <div class="nutrition-item">热量 <span>{{ meal.calories }}kcal</span></div>
            <div class="nutrition-item">碳水 <span>{{ meal.carbs }}g</span></div>
          </div>
        </div>
        <button class="delete-btn" @click="confirmDelete(meal)">🗑️</button>
      </div>
    </div>
    
    <button class="fab" @click="showAddModal = true">+</button>
    
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">添加餐单</h3>
          <button class="modal-close" @click="closeAddModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">餐单名称</label>
            <input 
              v-model="newMeal.name" 
              type="text" 
              placeholder="请输入餐单名称"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">餐单图片</label>
            <div v-if="!newMeal.image" class="upload-btn" @click="triggerImageUpload">
              <div class="upload-btn-icon">📷</div>
              <div class="upload-btn-text">点击上传图片</div>
            </div>
            <div v-else class="upload-preview">
              <img :src="newMeal.image" alt="预览" />
              <button class="upload-preview-remove" @click="clearImage">×</button>
            </div>
            <input 
              type="file" 
              ref="imageInput" 
              @change="handleImageUpload"
              accept="image/*"
              style="display: none;"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">食材（每行一个）</label>
            <textarea 
              v-model="newMeal.ingredientsText" 
              rows="4" 
              placeholder="例如：&#10;鸡胸肉200g&#10;生菜100g&#10;番茄50g"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">蛋白质含量 (g)</label>
            <input 
              v-model.number="newMeal.protein" 
              type="number" 
              min="0"
              placeholder="请输入蛋白质含量"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">热量 (kcal)</label>
            <input 
              v-model.number="newMeal.calories" 
              type="number" 
              min="0"
              placeholder="请输入热量"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">碳水化合物 (g)</label>
            <input 
              v-model.number="newMeal.carbs" 
              type="number" 
              min="0"
              placeholder="请输入碳水化合物"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="closeAddModal">取消</button>
          <button class="btn btn-primary" @click="addMeal">添加</button>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal-content" style="max-width: 320px;">
        <div class="modal-header">
          <h3 class="modal-title">确认删除</h3>
          <button class="modal-close" @click="showDeleteConfirm = false">×</button>
        </div>
        <div class="modal-body" style="text-align: center;">
          <p>确定要删除「{{ mealToDelete?.name }}」吗？</p>
          <p style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">此操作不可恢复</p>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showDeleteConfirm = false">取消</button>
          <button class="btn btn-danger" @click="deleteMeal">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMeals, addMeal as saveMeal, deleteMeal as removeMeal } from '../store'

const meals = ref([])
const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const mealToDelete = ref(null)
const imageInput = ref(null)

const newMeal = ref({
  name: '',
  image: '',
  ingredientsText: '',
  protein: 0,
  calories: 0,
  carbs: 0
})

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iIGZpbGw9IiM5OTk55L+M8C90ZXh0Pjwvc3ZnPg=='
}

const loadMeals = () => {
  meals.value = getMeals()
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      newMeal.value.image = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  newMeal.value.image = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  resetNewMeal()
}

const resetNewMeal = () => {
  newMeal.value = {
    name: '',
    image: '',
    ingredientsText: '',
    protein: 0,
    calories: 0,
    carbs: 0
  }
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const addMeal = () => {
  if (!newMeal.value.name.trim()) {
    alert('请输入餐单名称')
    return
  }
  
  const ingredients = newMeal.value.ingredientsText
    .split('\n')
    .map(i => i.trim())
    .filter(i => i.length > 0)
  
  if (ingredients.length === 0) {
    alert('请至少输入一种食材')
    return
  }
  
  const meal = {
    name: newMeal.value.name,
    image: newMeal.value.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSIgZmlsbD0iIzk5OTkiPu+8jTwvdGV4dD48L3N2Zz4=',
    ingredients,
    protein: Number(newMeal.value.protein) || 0,
    calories: Number(newMeal.value.calories) || 0,
    carbs: Number(newMeal.value.carbs) || 0
  }
  
  saveMeal(meal)
  loadMeals()
  closeAddModal()
}

const confirmDelete = (meal) => {
  mealToDelete.value = meal
  showDeleteConfirm.value = true
}

const deleteMeal = () => {
  if (mealToDelete.value) {
    removeMeal(mealToDelete.value.id)
    loadMeals()
  }
  showDeleteConfirm.value = false
  mealToDelete.value = null
}

onMounted(() => {
  loadMeals()
})
</script>
