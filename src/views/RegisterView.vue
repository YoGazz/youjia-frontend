<template>
  <div class="register-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>
    
    <div class="register-wrapper">
      <div class="register-card">
        <!-- Logo和标题 -->
        <div class="register-header">
          <div class="logo-container">
            <div class="logo-icon">
              <el-icon size="36"><UserFilled /></el-icon>
            </div>
          </div>
          <h2>用户注册</h2>
          <p>创建您的佑珈测试管理系统账号</p>
        </div>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
              clearable
              class="input-with-icon"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              prefix-icon="Message"
              size="large"
              clearable
              class="input-with-icon"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
              clearable
              class="input-with-icon"
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              prefix-icon="Lock"
              size="large"
              show-password
              clearable
              class="input-with-icon"
              @keyup.enter="handleRegister"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-btn"
              :loading="authStore.isLoading"
              @click="handleRegister"
            >
              <span v-if="!authStore.isLoading">
                <el-icon class="btn-icon"><Check /></el-icon>
                创 建 账 号
              </span>
              <span v-else>注册中...</span>
            </el-button>
          </el-form-item>
          
          <el-form-item class="register-footer">
            <router-link to="/login" class="login-link">
              <el-icon><ArrowLeft /></el-icon>
              已有账号？立即登录
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { User, Lock, Message, UserFilled, Check, ArrowLeft } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { RegisterRequest } from '@/types/api'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const registerFormRef = ref<InstanceType<typeof ElForm>>()

// 注册表单数据
const registerForm = reactive<RegisterRequest>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 自定义验证规则
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z0-9_]+$/, 
      message: '用户名只能包含字母、数字和下划线', 
      trigger: 'blur' 
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6-20个字符', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, 
      message: '密码必须包含字母和数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    // 验证表单
    await registerFormRef.value.validate()
    
    // 执行注册
    const success = await authStore.register(registerForm)
    if (success) {
      // 注册成功，跳转到登录页
      router.push('/login')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 如果已经登录，直接跳转到首页
if (authStore.isAuthenticated()) {
  router.push('/')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 8%;
  animation-delay: 4s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 40%;
  right: 20%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(180deg);
  }
}

.register-wrapper {
  position: relative;
  z-index: 1;
}

.register-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  padding: 48px 36px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
}

.register-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  box-shadow: 0 8px 16px rgba(82, 196, 26, 0.3);
}

.register-header h2 {
  color: #303133;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #52c41a, #73d13d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.register-header p {
  color: #666;
  font-size: 15px;
  margin: 0;
  font-weight: 400;
}

.register-form {
  width: 100%;
}

.input-with-icon {
  margin-bottom: 20px;
}

.input-with-icon :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.input-with-icon :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.15);
  border-color: #52c41a;
}

.input-with-icon :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.25);
  border-color: #52c41a;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
}

.register-btn:active {
  transform: translateY(0);
}

.btn-icon {
  margin-right: 6px;
}

.register-footer {
  text-align: center;
  margin-bottom: 0;
}

.login-link {
  color: #52c41a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
}

.login-link:hover {
  background: rgba(82, 196, 26, 0.1);
  color: #73d13d;
  text-decoration: none;
}

.login-link .el-icon {
  margin-right: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 16px;
  }
  
  .register-card {
    max-width: 100%;
    padding: 36px 28px;
    border-radius: 12px;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  
  .register-header h2 {
    font-size: 22px;
  }
  
  .register-header p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 32px 24px;
  }
  
  .logo-icon {
    width: 56px;
    height: 56px;
  }
  
  .register-header h2 {
    font-size: 20px;
  }
  
  .register-btn {
    height: 44px;
    font-size: 15px;
  }
  
  .input-with-icon {
    margin-bottom: 18px;
  }
  
  .floating-shape {
    display: none;
  }
}

@media (max-width: 360px) {
  .register-card {
    padding: 28px 20px;
  }
}
</style>