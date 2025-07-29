<template>
  <div class="user-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>用户管理</h2>
        <p>管理系统用户信息</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
      </div>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="search-section">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="姓名">
          <el-input
            v-model="searchForm.realName"
            placeholder="请输入姓名"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="激活" value="ACTIVE" />
            <el-option label="未激活" value="INACTIVE" />
            <el-option label="禁用" value="DISABLED" />
          </el-select>
        </el-form-item>

        <el-form-item label="角色">
          <el-select
            v-model="searchForm.role"
            placeholder="选择角色"
            clearable
            style="width: 150px"
          >
            <el-option label="管理员" value="ADMIN" />
            <el-option label="普通用户" value="USER" />
            <el-option label="访客" value="GUEST" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表表格 -->
    <div class="table-section">
      <el-table
        v-loading="userStore.isLoading"
        :data="userStore.users"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="username" label="用户名" width="120" />

        <el-table-column prop="email" label="邮箱" width="200" />

        <el-table-column prop="realName" label="真实姓名" width="120">
          <template #default="{ row }">
            {{ row.realName || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="手机号" width="130">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getRoleType(row.role)"
              size="small"
            >
              {{ getRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              <el-icon><EditPen /></el-icon>
              编辑
            </el-button>

            <el-button
              :type="row.status === 'ACTIVE' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              <el-icon v-if="row.status === 'ACTIVE'"><Lock /></el-icon>
              <el-icon v-else><Unlock /></el-icon>
              {{ row.status === 'ACTIVE' ? '禁用' : '启用' }}
            </el-button>

            <el-popconfirm
              title="确定要删除这个用户吗？"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="searchForm.page"
          v-model:page-size="searchForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="userStore.pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </div>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
      @close="handleCloseEdit"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.username"
            :disabled="isEdit"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="editForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item label="真实姓名">
          <el-input
            v-model="editForm.realName"
            placeholder="请输入真实姓名"
          />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input
            v-model="editForm.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" style="width: 100%">
            <el-option label="管理员" value="ADMIN" />
            <el-option label="普通用户" value="USER" />
            <el-option label="访客" value="GUEST" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" style="width: 100%">
            <el-option label="激活" value="ACTIVE" />
            <el-option label="未激活" value="INACTIVE" />
            <el-option label="禁用" value="DISABLED" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="userStore.isLoading"
            @click="handleSaveEdit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElForm } from 'element-plus'
import { Search, Refresh, Plus, EditPen, Delete, Lock, Unlock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { User, UserQuery, UserStatus, UserRole } from '@/types/api'

const userStore = useUserStore()

// 搜索表单
const searchForm = reactive<UserQuery>({
  page: 1,
  size: 20,
  realName: '',
  status: undefined,
  role: undefined
})

// 编辑对话框相关
const editDialogVisible = ref(false)
const isEdit = ref(false)
const editFormRef = ref<InstanceType<typeof ElForm>>()
const editForm = reactive<Partial<User>>({
  username: '',
  email: '',
  realName: '',
  phone: '',
  role: 'USER',
  status: 'ACTIVE'
})

// 编辑表单验证规则
const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 新增用户
const handleAdd = () => {
  isEdit.value = false
  Object.assign(editForm, {
    username: '',
    email: '',
    realName: '',
    phone: '',
    role: 'USER',
    status: 'ACTIVE'
  })
  editDialogVisible.value = true
}

// 搜索用户
const handleSearch = async () => {
  // 将页码转换为0基础索引
  const query: UserQuery = {
    ...searchForm,
    page: searchForm.page - 1
  }
  await userStore.searchUsers(query)
}

// 重置搜索条件
const handleReset = () => {
  searchForm.realName = ''
  searchForm.status = undefined
  searchForm.role = undefined
  searchForm.page = 1
  handleSearch()
}

// 编辑用户
const handleEdit = (user: User) => {
  isEdit.value = true
  Object.assign(editForm, user)
  editDialogVisible.value = true
}

// 保存编辑
const handleSaveEdit = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    if (isEdit.value && editForm.id) {
      const success = await userStore.updateUser(editForm.id, editForm)
      if (success) {
        editDialogVisible.value = false
        handleSearch() // 刷新列表
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 关闭编辑对话框
const handleCloseEdit = () => {
  editDialogVisible.value = false
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
}

// 切换用户状态
const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
  const success = await userStore.updateUserStatus(user.id, newStatus)
  if (success) {
    handleSearch() // 刷新列表
  }
}

// 删除用户
const handleDelete = async (userId: number) => {
  const success = await userStore.deleteUser(userId)
  if (success) {
    handleSearch() // 刷新列表
  }
}

// 获取状态标签类型
const getStatusType = (status: UserStatus) => {
  switch (status) {
    case 'ACTIVE': return 'success'
    case 'INACTIVE': return 'warning'
    case 'DISABLED': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: UserStatus) => {
  switch (status) {
    case 'ACTIVE': return '激活'
    case 'INACTIVE': return '未激活'
    case 'DISABLED': return '禁用'
    default: return '未知'
  }
}

// 获取角色标签类型
const getRoleType = (role: UserRole) => {
  switch (role) {
    case 'ADMIN': return 'danger'
    case 'USER': return 'primary'
    case 'GUEST': return 'info'
    default: return 'info'
  }
}

// 获取角色文本
const getRoleText = (role: UserRole) => {
  switch (role) {
    case 'ADMIN': return '管理员'
    case 'USER': return '普通用户'
    case 'GUEST': return '访客'
    default: return '未知'
  }
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 页面加载时获取用户列表
onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.user-management {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.header-left h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.header-left p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.header-right .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.header-right .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.search-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  border: none;
}

.search-form {
  margin: 0;
}

.table-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
}

.pagination-section {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 20px;
  }

  .header-left h2 {
    font-size: 24px;
  }

  .header-left p {
    font-size: 14px;
  }

  .search-form {
    flex-direction: column;
    gap: 16px;
  }

  .search-form .el-form-item {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .search-form .el-input,
  .search-form .el-select {
    width: 100% !important;
  }

  .table-section {
    overflow-x: auto;
  }

  .el-table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 16px;
  }

  .header-left h2 {
    font-size: 20px;
  }

  .search-section {
    padding: 16px;
  }

  .table-section {
    padding: 16px;
  }
}
</style>
