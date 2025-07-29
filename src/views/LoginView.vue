<template>
  <div class="login-container">
    <!-- 左侧品牌区域 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-logo">
          <div class="logo-circle">
            <el-icon size="32"><Setting /></el-icon>
          </div>
          <h1>TestPro</h1>
        </div>
        <div class="brand-description">
          <h2>欢迎使用 TestPro</h2>
          <p>简单、高效、专业</p>
          <div class="geometric-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="login-section">
      <div class="login-card">
        <div class="login-header">
          <h3>登录账户</h3>
          <p>欢迎回来，请输入您的登录信息</p>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username" class="form-item">
            <label class="form-label">用户名</label>
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              clearable
              class="form-input"
            />
          </el-form-item>

          <el-form-item prop="password" class="form-item">
            <label class="form-label">密码</label>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              clearable
              class="form-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberMe" class="remember-me">
              记住我
            </el-checkbox>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>

          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="authStore.isLoading"
            @click="handleLogin"
          >
            {{ authStore.isLoading ? '登录中...' : '登录' }}
          </el-button>

          <div class="divider">
            <span>或</span>
          </div>

          <div class="register-section">
            <span class="register-text">还没有账号？</span>
            <router-link to="/register" class="register-link">
              立即注册
            </router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus'
import { Setting, Check } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/api'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>()

// 记住我选项
const rememberMe = ref(false)

// 登录表单数据
const loginForm = reactive<LoginRequest>({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6-20个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 验证表单
    await loginFormRef.value.validate()

    // 执行登录
    const success = await authStore.login(loginForm)
    if (success) {
      // 登录成功，跳转到首页
      router.push('/')
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
.login-container {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
}

/* 左侧品牌区域 */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 500px;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
}

.logo-circle {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.brand-logo h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.brand-description h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.brand-description p {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.geometric-shapes {
  position: relative;
  height: 200px;
  margin-top: 60px;
  overflow: hidden;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: geometricFloat 6s ease-in-out infinite;
}

.shape-1 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  top: 20px;
  left: 15%;
  animation-delay: 0s;
}

.shape-2 {
  width: 40px;
  height: 40px;
  top: 80px;
  right: 20%;
  animation-delay: 1.5s;
  transform: rotate(45deg);
}

.shape-3 {
  width: 50px;
  height: 50px;
  bottom: 40px;
  left: 25%;
  animation-delay: 3s;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.shape-4 {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  top: 140px;
  right: 30%;
  animation-delay: 4.5s;
}

.shape-5 {
  width: 45px;
  height: 45px;
  top: 30px;
  right: 10%;
  animation-delay: 2s;
  clip-path: polygon(30% 0%, 0% 50%, 30% 100%, 100% 50%);
}

@keyframes geometricFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
    opacity: 0.8;
  }
  66% {
    transform: translateY(-10px) rotate(240deg);
    opacity: 0.4;
  }
}

/* 右侧登录区域 */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  margin-bottom: 32px;
}

.login-header h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-shadow: none;
  transition: all 0.2s ease;
  padding: 12px 16px;
  height: 48px;
}

.form-input :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

.form-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input :deep(.el-input__inner) {
  font-size: 16px;
  color: #1f2937;
}

.form-input :deep(.el-input__inner::placeholder) {
  color: #9ca3af;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.remember-me {
  font-size: 14px;
  color: #374151;
}

.forgot-password {
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #4f46e5;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: #667eea;
  border: none;
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.login-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #9ca3af;
  font-size: 14px;
  position: relative;
}

.register-section {
  text-align: center;
}

.register-text {
  color: #6b7280;
  font-size: 14px;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }

  .brand-section {
    flex: none;
    min-height: 40vh;
    padding: 40px 20px;
  }

  .brand-content {
    max-width: 100%;
  }

  .brand-description h2 {
    font-size: 28px;
  }

  .brand-description p {
    font-size: 16px;
  }

  .login-section {
    flex: none;
    padding: 40px 20px;
  }
}

@media (max-width: 768px) {
  .brand-section {
    min-height: 30vh;
    padding: 32px 20px;
  }

  .brand-logo h1 {
    font-size: 28px;
  }

  .logo-circle {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }

  .brand-description h2 {
    font-size: 24px;
  }

  .brand-description p {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .geometric-shapes {
    height: 120px;
    margin-top: 32px;
  }

  .shape {
    transform: scale(0.8);
  }

  .login-section {
    padding: 32px 20px;
  }

  .login-header h3 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .brand-section {
    min-height: 25vh;
    padding: 24px 16px;
  }

  .brand-logo {
    flex-direction: column;
    margin-bottom: 24px;
  }

  .logo-circle {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .brand-logo h1 {
    font-size: 24px;
  }

  .brand-description h2 {
    font-size: 20px;
  }

  .geometric-shapes {
    display: none;
  }

  .login-section {
    padding: 24px 16px;
  }

  .login-header h3 {
    font-size: 22px;
  }

  .form-input :deep(.el-input__wrapper) {
    height: 44px;
    padding: 10px 14px;
  }

  .login-btn {
    height: 44px;
    font-size: 15px;
  }
}
</style>
