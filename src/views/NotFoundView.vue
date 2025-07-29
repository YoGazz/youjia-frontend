<template>
  <div class="not-found">
    <!-- 背景动画装饰 -->
    <div class="bg-animation">
      <div class="floating-element element-1"></div>
      <div class="floating-element element-2"></div>
      <div class="floating-element element-3"></div>
      <div class="floating-element element-4"></div>
    </div>
    
    <div class="error-wrapper">
      <div class="error-content">
        <div class="error-animation">
          <div class="error-number">
            <span class="digit">4</span>
            <div class="zero-container">
              <div class="zero-icon">
                <el-icon><Search /></el-icon>
              </div>
            </div>
            <span class="digit">4</span>
          </div>
        </div>
        
        <div class="error-text">
          <h2>页面未找到</h2>
          <p>抱歉，您访问的页面不存在或已被移除。</p>
          <p class="suggestion">您可以尝试检查URL拼写或联系管理员。</p>
        </div>
        
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          
          <el-button size="large" @click="goBack">
            <el-icon><Back /></el-icon>
            返回上页
          </el-button>
        </div>
        
        <!-- 帮助链接 -->
        <div class="help-links">
          <a href="#" @click.prevent="showHelp">
            <el-icon><QuestionFilled /></el-icon>
            帮助中心
          </a>
          <a href="#" @click.prevent="reportProblem">
            <el-icon><Warning /></el-icon>
            报告问题
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WarningFilled, HomeFilled, Back, Search, QuestionFilled, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}

const showHelp = () => {
  ElMessage.info('帮助中心功能开发中...')
}

const reportProblem = () => {
  ElMessage.info('问题反馈功能开发中...')
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景动画装饰 */
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
}

.element-1 {
  width: 60px;
  height: 60px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 15%;
  animation-delay: 2s;
}

.element-3 {
  width: 40px;
  height: 40px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.element-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 25%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.3;
  }
}

.error-wrapper {
  position: relative;
  z-index: 1;
}

.error-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  padding: 60px 50px;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.error-content:hover {
  transform: translateY(-5px);
}

/* 404数字动画 */
.error-animation {
  margin-bottom: 40px;
}

.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.digit {
  font-size: 120px;
  font-weight: 800;
  color: #667eea;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

.zero-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.zero-icon {
  width: 120px;
  height: 120px;
  border: 8px solid #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #667eea;
  animation: rotate 3s linear infinite;
  background: rgba(102, 126, 234, 0.1);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-text h2 {
  font-size: 36px;
  color: #303133;
  margin: 0 0 16px 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error-text p {
  color: #666;
  font-size: 16px;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.suggestion {
  font-size: 14px !important;
  color: #999 !important;
  font-style: italic;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px 0 30px 0;
}

.error-actions .el-button {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  min-width: 140px;
  transition: all 0.3s ease;
}

.error-actions .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.error-actions .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.help-links {
  display: flex;
  gap: 32px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.help-links a {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 20px;
}

.help-links a:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #764ba2;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    padding: 40px 30px;
    border-radius: 16px;
  }
  
  .digit {
    font-size: 80px;
  }
  
  .zero-container,
  .zero-icon {
    width: 80px;
    height: 80px;
  }
  
  .zero-icon {
    border-width: 6px;
    font-size: 30px;
  }
  
  .error-text h2 {
    font-size: 28px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .not-found {
    padding: 16px;
  }
  
  .error-content {
    padding: 30px 20px;
  }
  
  .digit {
    font-size: 60px;
  }
  
  .zero-container,
  .zero-icon {
    width: 60px;
    height: 60px;
  }
  
  .zero-icon {
    border-width: 4px;
    font-size: 24px;
  }
  
  .error-text h2 {
    font-size: 24px;
  }
  
  .error-text p {
    font-size: 14px;
  }
  
  .help-links {
    flex-direction: column;
    gap: 16px;
  }
  
  .floating-element {
    display: none;
  }
}
</style>