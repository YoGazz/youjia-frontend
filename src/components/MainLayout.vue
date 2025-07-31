<template>
  <div class="main-layout">
    <!-- 移动端遮罩层 -->
    <div v-if="isMobile && !isCollapse" class="mobile-overlay" @click="closeMobileSidebar"></div>

    <!-- 顶部导航栏 -->
    <el-header class="header">
      <!-- 移动端菜单按钮 -->
      <div v-if="isMobile" class="mobile-menu-btn" @click="toggleSidebar">
        <el-icon><Menu /></el-icon>
      </div>
      <div class="header-left">
        <h3 class="logo">佑珈测试管理系统</h3>
      </div>

      <div class="header-right">
        <!-- 用户信息下拉菜单 -->
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32" :src="authStore.user?.avatar">
              {{ authStore.user?.username?.charAt(0).toUpperCase() }}
            </el-avatar>
            <span class="username">{{ authStore.user?.username }}</span>
            <el-icon class="arrow-down"><ArrowDown /></el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                系统设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="sidebar">
        <el-menu :default-active="activeMenu" class="sidebar-menu" router :collapse="isCollapse">
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <template #title>仪表板</template>
          </el-menu-item>

          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>

          <el-sub-menu index="projects">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>项目管理</span>
            </template>
            <el-menu-item index="/projects">项目列表</el-menu-item>
            <el-menu-item index="/projects/create">创建项目</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="testing">
            <template #title>
              <el-icon><DocumentChecked /></el-icon>
              <span>测试管理</span>
            </template>
            <el-menu-item index="/test-cases">测试用例</el-menu-item>
            <el-menu-item index="/test-modules">测试模块</el-menu-item>
            <el-menu-item index="/test-reports">测试报告</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/test-tool">
            <el-icon><Setting /></el-icon>
            <template #title>测试工具</template>
          </el-menu-item>

          <!-- 关于我们 -->
          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <template #title>关于我们</template>
          </el-menu-item>
        </el-menu>

        <!-- 侧边栏收缩按钮 -->
        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon>
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="main-content">
        <div class="content-wrapper">
          <!-- 面包屑导航 -->
          <el-breadcrumb class="breadcrumb" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRouteName">
              {{ getRouteTitle(currentRouteName) }}
            </el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 页面内容 -->
          <div class="page-content">
            <router-view />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  HomeFilled,
  Folder,
  DocumentChecked,
  Fold,
  Expand,
  Menu, InfoFilled
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式状态
const isMobile = ref(false)
const isCollapse = ref(false)

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return isCollapse.value ? '0px' : '250px'
  }
  return isCollapse.value ? '64px' : '200px'
})

// 检查是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    isCollapse.value = true
  }
}

// 关闭移动端侧边栏
const closeMobileSidebar = () => {
  if (isMobile.value) {
    isCollapse.value = true
  }
}

// 当前激活的菜单
const activeMenu = computed(() => route.path)
const currentRouteName = computed(() => route.name as string)

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 生命周期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 获取路由标题 - 优先从路由 meta 中获取
const getRouteTitle = (routeName: string) => {
  // 首先尝试从当前路由的 meta 信息中获取标题
  if (route.meta?.title) {
    return route.meta.title as string
  }

  // 如果 meta 中没有标题，则使用备用映射
  const titleMap: Record<string, string> = {
    dashboard: '仪表板',
    users: '用户管理',
    projects: '项目管理',
    'test-cases': '测试用例',
    'test-modules': '测试模块',
    'test-reports': '测试报告',
    'test-tool': '测试工具',
    about: '关于我们',
  }
  return titleMap[routeName] || '未知页面'
}

// 处理用户菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break

    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break

    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

        authStore.logout()
        router.push('/login')
      } catch {
        // 用户取消退出
      }
      break
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 16px;
}

.mobile-menu-btn:hover {
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.header-left .logo {
  margin: 0;
  color: #409eff;
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #303133;
}

.arrow-down {
  font-size: 12px;
  color: #909399;
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 120px);
}

.sidebar-toggle {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 18px;
}

.sidebar-toggle:hover {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.main-content {
  background: #f5f7fa;
  padding: 0;
  overflow-y: auto;
}

.content-wrapper {
  padding: 20px;
  min-height: 100%;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-content {
  min-height: calc(100vh - 160px);
}

@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
  }
  .sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1001;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transform: translateX(-100%);
  }
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  .header {
    padding: 0 16px;
  }
  .header-left {
    display: flex;
    align-items: center;
  }
  .header-left .logo {
    font-size: 16px;
  }
  .username {
    display: none;
  }
  .main-content {
    margin-left: 0 !important;
  }
  .content-wrapper {
    padding: 16px;
  }
  .sidebar-menu {
    height: calc(100vh - 140px);
  }
}
</style>
