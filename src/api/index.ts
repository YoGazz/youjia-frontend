import api from './request'
import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  User, 
  UserQuery, 
  PageResponse,
  ApiResponse
} from '@/types/api'

// 认证相关API
export const authApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return api.post('/auth/login', data)
  },

  // 用户注册
  register: (data: RegisterRequest): Promise<ApiResponse<User>> => {
    return api.post('/auth/register', data)
  }
}

// 用户管理相关API
export const userApi = {
  // 获取用户信息
  getUserById: (userId: number): Promise<ApiResponse<User>> => {
    return api.get(`/users/${userId}`)
  },

  // 获取所有用户
  getAllUsers: (): Promise<ApiResponse<User[]>> => {
    return api.get('/users')
  },

  // 条件搜索用户
  searchUsers: (query: UserQuery): Promise<ApiResponse<PageResponse<User>>> => {
    return api.post('/users/search', query)
  },

  // 更新用户信息
  updateUser: (userId: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put(`/users/${userId}`, data)
  },

  // 删除用户
  deleteUser: (userId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/users/${userId}`)
  },

  // 更新用户状态
  updateUserStatus: (userId: number, status: string): Promise<ApiResponse<User>> => {
    return api.patch(`/users/${userId}/status`, null, {
      params: { status }
    })
  }
}