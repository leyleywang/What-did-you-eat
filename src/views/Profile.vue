<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">我的</h1>
    </header>
    
    <div class="card">
      <div class="avatar-upload">
        <div v-if="user.avatar" class="avatar-preview-container" @click="triggerAvatarUpload">
          <img :src="user.avatar" alt="头像" class="avatar-preview" />
          <div class="avatar-edit-icon">📷</div>
        </div>
        <div v-else class="avatar-placeholder" @click="triggerAvatarUpload">
          👤
        </div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">点击更换头像</p>
        <input 
          type="file" 
          ref="avatarInput" 
          @change="handleAvatarUpload"
          accept="image/*"
          style="display: none;"
        />
      </div>
    </div>
    
    <div class="card" style="padding: 0; overflow: hidden;">
      <div class="user-info-row" @click="showEditUsername = true">
        <span class="user-info-label">用户名</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="user-info-value">{{ user.username }}</span>
          <span class="edit-icon">›</span>
        </div>
      </div>
    </div>
    
    <div class="card" style="padding: 0; overflow: hidden;">
      <div class="user-info-row">
        <span class="user-info-label">版本信息</span>
        <span class="user-info-value">v1.0.0</span>
      </div>
    </div>
    
    <div class="version-info">
      <p>今天吃什么 - 健身餐</p>
      <p style="margin-top: 4px;">© 2026 All Rights Reserved</p>
    </div>
    
    <div v-if="showEditUsername" class="modal-overlay" @click.self="showEditUsername = false">
      <div class="modal-content" style="max-width: 320px;">
        <div class="modal-header">
          <h3 class="modal-title">修改用户名</h3>
          <button class="modal-close" @click="showEditUsername = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">新用户名</label>
            <input 
              v-model="editUsernameValue" 
              type="text" 
              placeholder="请输入新用户名"
              maxlength="20"
              @keyup.enter="saveUsername"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showEditUsername = false">取消</button>
          <button class="btn btn-primary" @click="saveUsername">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUser, saveUser } from '../store'

const user = reactive({
  username: '',
  avatar: null
})

const avatarInput = ref(null)
const showEditUsername = ref(false)
const editUsernameValue = ref('')

const loadUser = () => {
  const userData = getUser()
  user.username = userData.username
  user.avatar = userData.avatar
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      user.avatar = event.target.result
      saveUserData()
    }
    reader.readAsDataURL(file)
  }
}

const openEditUsername = () => {
  editUsernameValue.value = user.username
  showEditUsername.value = true
}

const saveUsername = () => {
  if (!editUsernameValue.value.trim()) {
    alert('用户名不能为空')
    return
  }
  
  user.username = editUsernameValue.value.trim()
  saveUserData()
  showEditUsername.value = false
}

const saveUserData = () => {
  saveUser({
    id: '1',
    username: user.username,
    avatar: user.avatar
  })
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.avatar-preview-container {
  position: relative;
  cursor: pointer;
}

.avatar-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--primary-color);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-placeholder {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.avatar-placeholder:hover {
  opacity: 0.8;
}
</style>
