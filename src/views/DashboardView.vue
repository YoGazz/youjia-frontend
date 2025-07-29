<template>
  <div class="dashboard">
    <div class="welcome-section">
      <h2>欢迎回来，{{ authStore.user?.username }}！</h2>
      <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon user-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ userCount }}</h3>
            <p>用户总数</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon project-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="stat-info">
            <h3>0</h3>
            <p>项目总数</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon test-icon">
            <el-icon><DocumentChecked /></el-icon>
          </div>
          <div class="stat-info">
            <h3>0</h3>
            <p>测试用例</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon report-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <h3>0</h3>
            <p>测试报告</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>快速操作</h3>
          </div>
        </template>

        <div class="action-grid">
          <div class="action-item" @click="navigateTo('/users')">
            <el-icon class="action-icon"><User /></el-icon>
            <span>用户管理</span>
          </div>

          <div class="action-item" @click="showComingSoon">
            <el-icon class="action-icon"><Folder /></el-icon>
            <span>创建项目</span>
          </div>

          <div class="action-item" @click="showComingSoon">
            <el-icon class="action-icon"><DocumentAdd /></el-icon>
            <span>新建测试</span>
          </div>

          <div class="action-item" @click="showComingSoon">
            <el-icon class="action-icon"><View /></el-icon>
            <span>查看报告</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>最近活动</h3>
          </div>
        </template>

        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="activity-content">
              <p>
                <strong>{{ authStore.user?.username }}</strong> 登录了系统
              </p>
              <span class="activity-time">刚刚</span>
            </div>
          </div>

          <div class="empty-state">
            <el-icon class="empty-icon"><DocumentRemove /></el-icon>
            <p>暂无更多活动记录</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Folder,
  DocumentChecked,
  TrendCharts,
  DocumentAdd,
  View,
  DocumentRemove,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

// 用户总数
const userCount = computed(() => userStore.users.length)

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path)
}

// 显示即将推出提示
const showComingSoon = () => {
  ElMessage.info('功能开发中，敬请期待...')
}

// 页面加载时获取数据
onMounted(async () => {
  await userStore.getAllUsers()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.welcome-section p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.user-icon {
  background: linear-gradient(45deg, #409eff, #66b3ff);
}

.project-icon {
  background: linear-gradient(45deg, #67c23a, #85ce61);
}

.test-icon {
  background: linear-gradient(45deg, #e6a23c, #f0c78a);
}

.report-icon {
  background: linear-gradient(45deg, #f56c6c, #f78989);
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 32px;
  font-weight: 700;
  color: #303133;
}

.stat-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.quick-actions {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-item:hover {
  background: #409eff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 10px;
  color: #409eff;
  transition: color 0.3s ease;
}

.action-item:hover .action-icon {
  color: white;
}

.action-item span {
  font-size: 14px;
  font-weight: 500;
}

.recent-activity {
  margin-bottom: 30px;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 14px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0;
  }

  .welcome-section {
    padding: 32px 24px;
    margin-bottom: 24px;
  }

  .welcome-section h2 {
    font-size: 24px;
  }

  .welcome-section p {
    font-size: 15px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-content {
    padding: 8px 0;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    margin-right: 16px;
    font-size: 20px;
  }

  .stat-info h3 {
    font-size: 28px;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .action-item {
    padding: 24px 16px;
  }

  .action-icon {
    font-size: 28px;
  }

  .quick-actions {
    margin-bottom: 24px;
  }

  .recent-activity {
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .welcome-section {
    padding: 24px 20px;
  }

  .welcome-section h2 {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    margin: 0;
  }

  .stat-content {
    padding: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    margin-right: 12px;
    font-size: 18px;
  }

  .stat-info h3 {
    font-size: 24px;
  }

  .action-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .action-item {
    padding: 20px 16px;
  }

  .action-icon {
    font-size: 24px;
  }

  .activity-item {
    padding: 12px 0;
  }

  .activity-icon {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
}

@media (max-width: 360px) {
  .welcome-section {
    padding: 20px 16px;
  }

  .welcome-section h2 {
    font-size: 20px;
  }

  .stats-grid {
    gap: 10px;
  }

  .action-grid {
    gap: 10px;
  }
}
</style>
