// API相关类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  msg: string
  timestamp?: string
}

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  realName?: string
  phone?: string
  avatar?: string
  status: UserStatus
  role: UserRole
  createTime?: string
  updateTime?: string
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISABLED = 'DISABLED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  email: string
}

export interface LoginResponse {
  user: User
  token: {
    authorization: string
    jti: string
    access_token: string
    refresh_token?: string
    expires_in: number
  }
}

// 分页相关类型
export interface PageRequest {
  page: number
  size: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

// 用户查询类型
export interface UserQuery extends PageRequest {
  realName?: string
  status?: UserStatus
  role?: UserRole
}