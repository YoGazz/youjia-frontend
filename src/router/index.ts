import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/components/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证相关路由
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      // 设置路由元信息
      meta: { requiresGuest: true, title: '登录' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      // 设置路由元信息
      meta: { requiresGuest: true, title: '注册' },
    },

    // 主应用路由
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          // 设置路由元信息
          meta: { title: '仪表板' },
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/UserManagement.vue'),
          meta: { requiresAuth: true, title: '用户管理' },
        },
        {
          path: '/test-tool',
          name: 'test-tool',
          component: () => import('@/views/TestView.vue'),
          meta: { requiresAuth: true, title: '测试工具' },
        },
      ],
    },

    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '页面未找到' },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()

  // 如果路由需要认证但用户未登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // 如果路由只允许游客访问但用户已登录
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }

  next()
})

// 路由后置守卫 - 设置页面标题
router.afterEach((to) => {
  const baseTitle = 'TestPro - 专业测试管理平台'
  const pageTitle = to.meta.title as string

  // 如果存在页面标题，则拼接
  if (pageTitle) {
    document.title = `${pageTitle} - TestPro`
  } else {
    document.title = baseTitle
  }
})

export default router
