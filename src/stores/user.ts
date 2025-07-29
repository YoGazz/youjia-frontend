import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userApi } from '@/api'
import type { User, UserQuery, PageResponse } from '@/types/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const pagination = ref({
    page: 0,
    size: 10,
    total: 0,
    totalPages: 0
  })
  const isLoading = ref(false)

  // 获取所有用户
  const getAllUsers = async () => {
    isLoading.value = true
    try {
      const response = await userApi.getAllUsers()
      if (response.success && response.data) {
        users.value = response.data
        return true
      } else {
        ElMessage.error(response.msg || '获取用户列表失败')
        return false
      }
    } catch (error: any) {
      ElMessage.error('获取用户列表失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 条件搜索用户
  const searchUsers = async (query: UserQuery) => {
    isLoading.value = true
    try {
      const response = await userApi.searchUsers(query)
      if (response.success && response.data) {
        const pageData: PageResponse<User> = response.data
        users.value = pageData.content
        pagination.value = {
          page: pageData.page,
          size: pageData.size,
          total: pageData.totalElements,
          totalPages: pageData.totalPages
        }
        return true
      } else {
        ElMessage.error(response.msg || '搜索用户失败')
        return false
      }
    } catch (error: any) {
      ElMessage.error('搜索用户失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 获取单个用户详情
  const getUserById = async (userId: number) => {
    isLoading.value = true
    try {
      const response = await userApi.getUserById(userId)
      if (response.success && response.data) {
        currentUser.value = response.data
        return response.data
      } else {
        ElMessage.error(response.msg || '获取用户详情失败')
        return null
      }
    } catch (error: any) {
      ElMessage.error('获取用户详情失败')
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户信息
  const updateUser = async (userId: number, userData: Partial<User>) => {
    isLoading.value = true
    try {
      const response = await userApi.updateUser(userId, userData)
      if (response.success && response.data) {
        // 更新本地用户列表
        const index = users.value.findIndex(u => u.id === userId)
        if (index !== -1) {
          users.value[index] = response.data
        }
        ElMessage.success('用户信息更新成功')
        return true
      } else {
        ElMessage.error(response.msg || '更新用户信息失败')
        return false
      }
    } catch (error: any) {
      ElMessage.error('更新用户信息失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 删除用户
  const deleteUser = async (userId: number) => {
    isLoading.value = true
    try {
      const response = await userApi.deleteUser(userId)
      if (response.success) {
        // 从本地列表中移除
        users.value = users.value.filter(u => u.id !== userId)
        ElMessage.success('用户删除成功')
        return true
      } else {
        ElMessage.error(response.msg || '删除用户失败')
        return false
      }
    } catch (error: any) {
      ElMessage.error('删除用户失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户状态
  const updateUserStatus = async (userId: number, status: string) => {
    isLoading.value = true
    try {
      const response = await userApi.updateUserStatus(userId, status)
      if (response.success && response.data) {
        // 更新本地用户列表
        const index = users.value.findIndex(u => u.id === userId)
        if (index !== -1) {
          users.value[index] = response.data
        }
        ElMessage.success('用户状态更新成功')
        return true
      } else {
        ElMessage.error(response.msg || '更新用户状态失败')
        return false
      }
    } catch (error: any) {
      ElMessage.error('更新用户状态失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    currentUser,
    pagination,
    isLoading,
    getAllUsers,
    searchUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserStatus
  }
})