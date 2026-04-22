<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">餐单管理</h1>
    </header>
    
    <div v-if="meals.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <p class="empty-state-text">暂无餐单，点击下方按钮添加</p>
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
        <button class="delete-btn" @click="confirmDelete(meal)" title="删除">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="add-btn-container">
      <button class="add-btn" @click="showAddModal = true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>添加餐单</span>
      </button>
    </div>
    
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">添加餐单</h3>
          <button class="modal-close" @click="closeAddModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
              <div class="upload-btn-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <div class="upload-btn-text">点击上传图片</div>
            </div>
            <div v-else class="upload-preview">
              <img :src="newMeal.image" alt="预览" />
              <button class="upload-preview-remove" @click="clearImage">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
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
          <button class="modal-close" @click="showDeleteConfirm = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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

<style scoped>
.add-btn-container {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  width: 100%;
  max-width: 430px;
  padding: 0 16px;
}

.add-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--border-color);
  color: var(--text-primary);
}

.upload-btn-icon {
  color: var(--primary-color);
}

.upload-preview-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: var(--danger-color);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.upload-preview-remove:hover {
  background-color: #d32f2f;
}
</style>
