const STORAGE_KEYS = {
  MEALS: 'fitness_meals',
  CHECKINS: 'fitness_checkins',
  USER: 'fitness_user'
}

const defaultMeals = [
  {
    id: '1',
    name: '鸡胸肉蔬菜沙拉',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grilled%20chicken%20breast%20salad%20with%20fresh%20vegetables%20tomatoes%20cucumbers%20lettuce%20healthy%20fitness%20food&image_size=square',
    ingredients: ['鸡胸肉200g', '生菜100g', '番茄50g', '黄瓜50g', '橄榄油5g'],
    protein: 55,
    calories: 280,
    carbs: 8
  },
  {
    id: '2',
    name: '三文鱼糙米饭',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grilled%20salmon%20fillet%20with%20brown%20rice%20steamed%20broccoli%20healthy%20fitness%20meal&image_size=square',
    ingredients: ['三文鱼150g', '糙米100g', '西兰花100g', '柠檬1片'],
    protein: 40,
    calories: 450,
    carbs: 35
  },
  {
    id: '3',
    name: '牛肉西兰花',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stir%20fried%20beef%20with%20broccoli%20chinese%20style%20healthy%20protein%20meal&image_size=square',
    ingredients: ['牛里脊150g', '西兰花200g', '大蒜3瓣', '生抽5ml'],
    protein: 45,
    calories: 320,
    carbs: 12
  },
  {
    id: '4',
    name: '鸡蛋蛋白燕麦粥',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=oatmeal%20porridge%20with%20egg%20whites%20blueberries%20healthy%20breakfast%20bowl&image_size=square',
    ingredients: ['燕麦50g', '蛋白4个', '蓝莓30g', '牛奶100ml'],
    protein: 35,
    calories: 380,
    carbs: 45
  },
  {
    id: '5',
    name: '虾仁藜麦沙拉',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cooked%20shrimp%20quinoa%20salad%20with%20avocado%20cherry%20tomatoes%20fresh%20herbs&image_size=square',
    ingredients: ['虾仁150g', '藜麦80g', '牛油果半个', '樱桃番茄50g'],
    protein: 38,
    calories: 420,
    carbs: 30
  }
]

const defaultUser = {
  id: '1',
  username: '健身达人',
  avatar: null
}

function initializeDefaultData() {
  const meals = localStorage.getItem(STORAGE_KEYS.MEALS)
  if (!meals) {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(defaultMeals))
  }
  
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  if (!user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser))
  }
}

function getMeals() {
  const meals = localStorage.getItem(STORAGE_KEYS.MEALS)
  return meals ? JSON.parse(meals) : []
}

function saveMeals(meals) {
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals))
}

function addMeal(meal) {
  const meals = getMeals()
  meal.id = Date.now().toString()
  meals.push(meal)
  saveMeals(meals)
  return meal
}

function deleteMeal(mealId) {
  const meals = getMeals()
  const filteredMeals = meals.filter(m => m.id !== mealId)
  saveMeals(filteredMeals)
}

function getCheckins() {
  const checkins = localStorage.getItem(STORAGE_KEYS.CHECKINS)
  return checkins ? JSON.parse(checkins) : []
}

function saveCheckins(checkins) {
  localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins))
}

function addCheckin(checkin) {
  const checkins = getCheckins()
  checkin.id = Date.now().toString()
  checkin.createdAt = new Date().toISOString()
  checkins.push(checkin)
  saveCheckins(checkins)
  return checkin
}

function getUser() {
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : defaultUser
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function getTodayDateKey() {
  return formatDate(new Date())
}

export {
  initializeDefaultData,
  getMeals,
  saveMeals,
  addMeal,
  deleteMeal,
  getCheckins,
  saveCheckins,
  addCheckin,
  getUser,
  saveUser,
  formatDate,
  getTodayDateKey,
  defaultMeals
}
