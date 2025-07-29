<template>
  <div class="register-container">
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
          <h2>创建您的账户</h2>
          <p>开启全新体验</p>
          <div class="wave-animation">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
            <div class="center-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧注册区域 -->
    <div class="register-section">
      <div class="register-card">
        <div class="register-header">
          <h3>创建账户</h3>
          <p>填写以下信息完成注册</p>
        </div>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <div class="form-row">
            <el-form-item prop="username" class="form-item">
              <label class="form-label">用户名</label>
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                size="large"
                clearable
                class="form-input"
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item prop="email" class="form-item">
              <label class="form-label">邮箱地址</label>
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱地址"
                size="large"
                clearable
                class="form-input"
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item prop="password" class="form-item">
              <label class="form-label">密码</label>
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
                clearable
                class="form-input"
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item prop="confirmPassword" class="form-item">
              <label class="form-label">确认密码</label>
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                size="large"
                show-password
                clearable
                class="form-input"
                @keyup.enter="handleRegister"
              />
            </el-form-item>
          </div>

          <div class="terms-section">
            <el-checkbox v-model="agreeTerms" class="terms-checkbox">
              我已阅读并同意
              <a href="#" class="terms-link">服务条款</a>
              和
              <a href="#" class="terms-link">隐私政策</a>
            </el-checkbox>
          </div>

          <el-button
            type="primary"
            size="large"
            class="register-btn"
            :loading="authStore.isLoading"
            :disabled="!agreeTerms"
            @click="handleRegister"
          >
            {{ authStore.isLoading ? '注册中...' : '创建账户' }}
          </el-button>

          <div class="divider">
            <span>或</span>
          </div>

          <div class="login-section">
            <span class="login-text">已有账号？</span>
            <router-link to="/login" class="login-link">
              立即登录
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
import { ElForm } from 'element-plus'
// 移除了图标导入，现在使用纯CSS动画
import { useAuthStore } from '@/stores/auth'
import type { RegisterRequest } from '@/types/api'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const registerFormRef = ref<InstanceType<typeof ElForm>>()

// 同意条款
const agreeTerms = ref(false)

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
  background: #f8fafc;
}

/* 左侧品牌区域 */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
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

.wave-animation {
  position: relative;
  height: 180px;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wave {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: waveExpand 4s ease-out infinite;
}

.wave-1 {
  width: 40px;
  height: 40px;
  animation-delay: 0s;
}

.wave-2 {
  width: 40px;
  height: 40px;
  animation-delay: 1.3s;
}

.wave-3 {
  width: 40px;
  height: 40px;
  animation-delay: 2.6s;
}

.center-dot {
  position: relative;
  z-index: 1;
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: dotPulse 4s ease-in-out infinite;
}

@keyframes waveExpand {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

/* 右侧注册区域 */
.register-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
}

.register-card {
  width: 100%;
  max-width: 420px;
}

.register-header {
  margin-bottom: 32px;
}

.register-header h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.register-header p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}

.register-form {
  width: 100%;
}

.form-row {
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 0;
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
  border-color: #52c41a;
}

.form-input :deep(.el-input__wrapper.is-focus) {
  border-color: #52c41a;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.1);
}

.form-input :deep(.el-input__inner) {
  font-size: 16px;
  color: #1f2937;
}

.form-input :deep(.el-input__inner::placeholder) {
  color: #9ca3af;
}

.terms-section {
  margin-bottom: 24px;
}

.terms-checkbox {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.terms-link {
  color: #52c41a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #389e0d;
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: #52c41a;
  border: none;
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.register-btn:hover:not(:disabled) {
  background: #389e0d;
  transform: translateY(-1px);
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
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

.login-section {
  text-align: center;
}

.login-text {
  color: #6b7280;
  font-size: 14px;
}

.login-link {
  color: #52c41a;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #389e0d;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .register-container {
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

  .register-section {
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

  .wave-animation {
    height: 120px;
    margin-top: 32px;
  }

  .wave {
    border-width: 1px;
  }

  .center-dot {
    width: 8px;
    height: 8px;
  }

  .register-section {
    padding: 32px 20px;
  }

  .register-header h3 {
    font-size: 24px;
  }

  .register-header p {
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

  .wave-animation {
    display: none;
  }

  .register-section {
    padding: 24px 16px;
  }

  .register-header h3 {
    font-size: 22px;
  }

  .form-input :deep(.el-input__wrapper) {
    height: 44px;
    padding: 10px 14px;
  }

  .register-btn {
    height: 44px;
    font-size: 15px;
  }

  .form-row {
    margin-bottom: 16px;
  }

  .terms-checkbox {
    font-size: 13px;
  }
}
</style>
