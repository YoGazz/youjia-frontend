import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api'
import type { User, LoginRequest, RegisterRequest } from '@/types/api'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  // 初始化用户信息
  const initUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('解析用户信息失败:', e)
        localStorage.removeItem('user')
      }
    }
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    isLoading.value = true
    try {
      const response = await authApi.login(loginData)
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token.access_token
        
        // 保存到本地存储
        localStorage.setItem('token', response.data.token.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        ElMessage.success('登录成功')
        return true
      } else {
        ElMessage.error(response.msg || '登录失败')
        return false
      }
    } catch (error: any) {
      const message = error.response?.data?.msg || '登录失败，请检查网络连接'
      ElMessage.error(message)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const register = async (registerData: RegisterRequest) => {
    isLoading.value = true
    try {
      const response = await authApi.register(registerData)
      if (response.success) {
        ElMessage.success('注册成功，请登录')
        return true
      } else {
        ElMessage.error(response.msg || '注册失败')
        return false
      }
    } catch (error: any) {
      const message = error.response?.data?.msg || '注册失败，请检查网络连接'
      ElMessage.error(message)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.success('已退出登录')
  }

  // 检查是否已登录
  const isAuthenticated = () => {
    return !!token.value && !!user.value
  }

  // 初始化
  initUser()

  return {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  }
})