# 🔌 API使用示例

## 📋 实际代码示例

### 示例1：登录功能完整实现

#### 1. 后端接口文档
```
POST /api/auth/login
请求参数:
{
  "username": "string",
  "password": "string"
}

成功响应:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}

失败响应:
{
  "code": 400,
  "message": "用户名或密码错误",
  "data": null
}
```

#### 2. 前端实现

**更新类型定义 (`src/types/api.ts`)**：
```typescript
// 基础响应格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResponse {
  token: string
  user: User
}

// 用户信息
export interface User {
  id: number
  username: string
  email: string
  role: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}
```

**更新API接口 (`src/api/index.ts`)**：
```typescript
import api from './request'
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types/api'

export const authApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return api.post('/auth/login', data)
  },
  
  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return api.get('/auth/me')
  },
  
  // 用户登出
  logout: (): Promise<ApiResponse<void>> => {
    return api.post('/auth/logout')
  }
}
```

**更新认证Store (`src/stores/auth.ts`)**：
```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api'
import type { User, LoginRequest } from '@/types/api'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)

  // 初始化用户信息
  const initUser = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        currentUser.value = JSON.parse(userStr)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('user')
      }
    }
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    try {
      isLoading.value = true
      
      const response = await authApi.login(loginData)
      
      if (response.code === 200) {
        const { token: newToken, user } = response.data
        
        // 保存到本地存储
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(user))
        
        // 更新状态
        token.value = newToken
        currentUser.value = user
        
        ElMessage.success(response.message || '登录成功')
        return response
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      ElMessage.error(error.message || '登录失败，请重试')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      // 调用后端登出接口（可选）
      await authApi.logout()
    } catch (error) {
      console.error('登出接口调用失败:', error)
    } finally {
      // 清除本地数据
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // 重置状态
      token.value = null
      currentUser.value = null
      
      ElMessage.success('已退出登录')
    }
  }

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    try {
      const response = await authApi.getCurrentUser()
      if (response.code === 200) {
        currentUser.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败，可能token已过期
      logout()
    }
  }

  // 初始化
  initUser()

  return {
    token,
    currentUser,
    isLoading,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser
  }
})
```

**更新登录页面 (`src/views/LoginView.vue`)**：
```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/api'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>()

// 登录表单数据
const loginForm = reactive<LoginRequest>({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  try {
    // 验证表单
    await loginFormRef.value?.validate()
    
    // 调用登录接口
    await authStore.login(loginForm)
    
    // 登录成功，跳转到首页
    router.push('/')
    
  } catch (error) {
    // 错误已在store中处理，这里不需要额外处理
    console.error('登录处理失败:', error)
  }
}
</script>
```

### 示例2：用户列表页面

#### 1. 后端接口文档
```
GET /api/users?page=1&size=10&keyword=admin&status=active
响应格式:
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "role": "admin",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

#### 2. 前端实现

**更新类型定义**：
```typescript
export interface UserQuery {
  page?: number
  size?: number
  keyword?: string
  status?: string
  role?: string
}

export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
}
```

**更新API接口**：
```typescript
export const userApi = {
  // 获取用户列表
  getUsers: (query: UserQuery = {}): Promise<ApiResponse<PageResponse<User>>> => {
    return api.get('/users', { params: query })
  },
  
  // 创建用户
  createUser: (data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.post('/users', data)
  },
  
  // 更新用户
  updateUser: (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put(`/users/${id}`, data)
  },
  
  // 删除用户
  deleteUser: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/users/${id}`)
  },
  
  // 更新用户状态
  updateUserStatus: (id: number, status: string): Promise<ApiResponse<User>> => {
    return api.patch(`/users/${id}/status`, { status })
  }
}
```

**用户管理页面 (`src/views/UserManagement.vue`)**：
```vue
<template>
  <div class="user-management">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索用户名或邮箱"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="激活" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="showAddDialog = true">添加用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card">
      <el-table :data="users" :loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="toggleUserStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '激活' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api'
import type { User, UserQuery } from '@/types/api'

// 响应式数据
const loading = ref(false)
const users = ref<User[]>([])
const showAddDialog = ref(false)

// 搜索表单
const searchForm = reactive<UserQuery>({
  keyword: '',
  status: '',
  role: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    
    const query: UserQuery = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    
    const response = await userApi.getUsers(query)
    
    if (response.code === 200) {
      const { list, total } = response.data
      users.value = list
      pagination.total = total
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
    ElMessage.error(error.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUsers()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    role: ''
  })
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  fetchUsers()
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.page = 1
  fetchUsers()
}

// 编辑用户
const editUser = (user: User) => {
  // 实现编辑逻辑
  ElMessage.info(`编辑用户: ${user.username}`)
}

// 切换用户状态
const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? '激活' : '禁用'
    
    await ElMessageBox.confirm(`确定要${action}用户 ${user.username} 吗？`, '确认操作')
    
    const response = await userApi.updateUserStatus(user.id, newStatus)
    
    if (response.code === 200) {
      user.status = newStatus
      ElMessage.success(`${action}成功`)
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('更新用户状态失败:', error)
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 删除用户
const deleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗？`, '确认删除', {
      type: 'warning'
    })
    
    const response = await userApi.deleteUser(user.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchUsers() // 重新获取列表
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 页面加载时获取数据
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
```

## 🔧 错误处理最佳实践

### 1. 统一错误处理

创建 `src/utils/errorHandler.ts`：
```typescript
import { ElMessage } from 'element-plus'

export interface ApiError {
  code: number
  message: string
  details?: any
}

export const handleApiError = (error: any) => {
  console.error('API错误:', error)
  
  if (error.response) {
    // HTTP错误
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        ElMessage.error(data.message || '请求参数错误')
        break
      case 401:
        ElMessage.error('登录已过期，请重新登录')
        // 跳转到登录页
        window.location.href = '/login'
        break
      case 403:
        ElMessage.error('没有权限执行此操作')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      default:
        ElMessage.error(data.message || '请求失败')
    }
  } else if (error.request) {
    // 网络错误
    ElMessage.error('网络连接失败，请检查网络')
  } else {
    // 其他错误
    ElMessage.error(error.message || '未知错误')
  }
}
```

### 2. 在API调用中使用

```typescript
import { handleApiError } from '@/utils/errorHandler'

const fetchData = async () => {
  try {
    loading.value = true
    const response = await userApi.getUsers()
    // 处理成功响应
  } catch (error) {
    handleApiError(error)
  } finally {
    loading.value = false
  }
}
```

## 📝 总结

通过以上示例，您可以：

1. **理解API接口的完整调用流程**
2. **掌握错误处理的最佳实践**
3. **学会在Vue组件中正确使用API**
4. **了解如何处理分页、搜索等常见功能**

记住：
- 始终进行错误处理
- 显示加载状态提升用户体验
- 使用TypeScript确保类型安全
- 遵循统一的代码规范

---

**💡 提示：建议先从简单的接口开始，逐步掌握后再处理复杂的业务逻辑。**
