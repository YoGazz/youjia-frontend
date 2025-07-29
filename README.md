# 测试平台前端项目 (YouJia Frontend)

一个基于 Vue 3 + TypeScript + Element Plus 的现代化前端项目，主要用于用户管理和认证系统。

## 📋 项目概述

这是一个完整的前端应用程序，包含用户认证、用户管理等核心功能。项目采用现代化的前端技术栈，提供了良好的开发体验和用户体验。

### 🎯 主要功能

- **用户认证系统**
  - 用户登录/注册
  - JWT Token 认证
  - 路由守卫保护
  - 自动登录状态管理

- **用户管理系统**
  - 用户列表展示
  - 用户信息搜索和筛选
  - 用户状态管理（激活/禁用）
  - 用户角色管理（管理员/普通用户）
  - 用户信息编辑和删除

- **系统功能**
  - 响应式布局设计
  - 统一的错误处理
  - API 请求拦截和响应处理
  - 本地存储管理

## 🎨 设计特色

### 现代化 UI 设计
- **双栏布局**：左侧品牌展示，右侧功能区域
- **简约风格**：参考 GitHub、GitLab 等主流平台设计
- **渐变色彩**：专业的紫色渐变主题
- **毛玻璃效果**：现代化的视觉层次
- **微交互动画**：提升用户体验的细节动效

### 响应式设计
- **移动端优先**：完美适配各种屏幕尺寸
- **断点优化**：1024px、768px、480px 三级断点
- **触摸友好**：移动端操作体验优化
- **性能优化**：减少不必要的动画和效果

### 品牌视觉
- **TestPro 品牌**：专业测试管理平台定位
- **功能展示**：测试用例管理、缺陷跟踪、测试报告
- **信任建立**：免费使用、数据安全、快速上手

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Vite** - 下一代前端构建工具

### UI 组件库
- **Element Plus** - 基于 Vue 3 的组件库
- **Element Plus Icons** - 图标库

### 状态管理
- **Pinia** - Vue 3 官方推荐的状态管理库

### 路由管理
- **Vue Router 4** - Vue.js 官方路由管理器

### HTTP 客户端
- **Axios** - 基于 Promise 的 HTTP 库

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Vue DevTools** - Vue 开发者工具

## 📁 项目结构

```
youjia-frontend/
├── src/
│   ├── api/                 # API 接口定义
│   │   ├── index.ts        # API 接口导出
│   │   └── request.ts      # Axios 配置和拦截器
│   ├── assets/             # 静态资源
│   │   ├── base.css        # 基础样式
│   │   ├── main.css        # 主样式文件
│   │   └── logo.svg        # Logo 图片
│   ├── components/         # 公共组件
│   │   ├── MainLayout.vue  # 主布局组件
│   │   └── icons/          # 图标组件
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义和守卫
│   ├── stores/             # 状态管理
│   │   ├── auth.ts         # 认证状态管理
│   │   ├── counter.ts      # 计数器状态（示例）
│   │   └── user.ts         # 用户状态管理
│   ├── types/              # TypeScript 类型定义
│   │   └── api.ts          # API 相关类型
│   ├── views/              # 页面组件
│   │   ├── DashboardView.vue    # 仪表板页面
│   │   ├── LoginView.vue        # 登录页面
│   │   ├── RegisterView.vue     # 注册页面
│   │   ├── UserManagement.vue   # 用户管理页面
│   │   └── NotFoundView.vue     # 404 页面
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口文件
├── mock/                   # 模拟后端服务器
│   ├── server.js           # Express 服务器
│   ├── package.json        # 后端依赖配置
│   └── node_modules/       # 后端依赖
├── public/                 # 公共静态文件
├── vite.config.ts          # Vite 配置文件
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd youjia-frontend

# 安装前端依赖
npm install

# 安装模拟后端依赖
cd mock
npm install
cd ..
```

### 启动开发服务器

#### 方式一：分别启动前端和后端

```bash
# 启动模拟后端服务器 (端口 8081)
npm run mock

# 新开终端，启动前端开发服务器 (端口 3000)
npm run dev
```

#### 方式二：同时启动前端和后端

```bash
# 同时启动前端和后端服务器
npm run dev:full
```

### 访问应用

- 前端应用：http://localhost:3000
- 模拟后端：http://localhost:8081

### 默认登录账号

- 用户名：`admin`
- 密码：`123456`

## 🔧 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 来保证代码质量和格式统一：

```bash
# 检查代码规范
npm run lint

# 格式化代码
npm run format
```

### 构建项目

```bash
# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### API 接口

项目使用 Axios 进行 HTTP 请求，所有 API 接口定义在 `src/api/` 目录下：

- `request.ts` - Axios 实例配置、请求/响应拦截器
- `index.ts` - 具体的 API 接口定义

### 状态管理

使用 Pinia 进行状态管理，主要的 Store：

- `authStore` - 用户认证状态（登录/登出/用户信息）
- `userStore` - 用户管理相关状态

### 路由配置

路由配置在 `src/router/index.ts` 中，包含：

- 路由定义
- 路由守卫（认证检查）
- 懒加载配置

## 📱 页面功能说明

### 登录页面 (`/login`) - 极简设计 ✨
- **现代化双栏布局**：左侧品牌展示，右侧登录表单
- **极简文案**：欢迎使用 TestPro，简单、高效、专业
- **几何动画**：优雅的几何图形浮动效果
- **纯视觉体验**：移除冗余文字，专注视觉美感
- **用户名/密码登录**：支持记住我功能
- **表单验证**：实时验证用户输入
- **响应式设计**：完美适配桌面端和移动端

### 注册页面 (`/register`) - 极简设计 ✨
- **一致的视觉体验**：与登录页面保持设计统一
- **波浪动画效果**：动态波浪扩散动画
- **简洁文案**：创建您的账户，开启全新体验
- **纯CSS动画**：无图标依赖，性能更优
- **完整注册流程**：用户名、邮箱、密码确认
- **服务条款确认**：用户协议和隐私政策
- **智能表单验证**：密码强度、邮箱格式等

### 仪表板 (`/`)
- 系统概览
- 快速操作入口

### 用户管理 (`/users`)
- 用户列表展示
- 搜索和筛选功能
- 用户状态管理
- 用户信息编辑
- 用户删除功能

## 🔌 API 接口说明

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 用户管理接口
- `GET /api/users` - 获取用户列表
- `POST /api/users/search` - 搜索用户
- `PUT /api/users/:id` - 更新用户信息
- `PATCH /api/users/:id/status` - 更新用户状态
- `DELETE /api/users/:id` - 删除用户

## 🐛 常见问题

### 1. 跨域问题
项目使用 Vite 代理解决跨域问题，配置在 `vite.config.ts` 中。

### 2. 模拟后端无法启动
确保已安装模拟后端依赖：
```bash
cd mock && npm install
```

### 3. 登录后页面空白
检查浏览器控制台错误信息，通常是 API 请求失败导致。

### 4. 端口被占用
如果端口 3000 或 8081 被占用，可以修改配置：
- 前端端口：修改 `vite.config.ts` 中的 `server.port`
- 后端端口：修改 `mock/server.js` 中的 `port` 变量

## 💡 开发建议

### 推荐 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (请禁用 Vetur)

### 推荐 VSCode 插件

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

### TypeScript 支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` 进行类型检查。在编辑器中，需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 来让 TypeScript 语言服务识别 `.vue` 类型。

## 📚 学习资源

### 官方文档
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [Vue Router 官方文档](https://router.vuejs.org/zh/)

### 配置参考
- [Vite 配置参考](https://cn.vitejs.dev/config/)
- [TypeScript 配置](https://www.typescriptlang.org/tsconfig)
