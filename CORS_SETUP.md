# 🚀 跨域问题解决方案

## ✅ 问题已修复 - 后端CORS配置优化

我已经为您的项目配置了完整的跨域解决方案，并在后端明确指定了允许的前端地址：

### 1. 🔧 后端 CORS 配置（新增）

#### Mock 后端 CORS 配置 (`mock/server.js`)
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',  // 前端开发服务器
    'http://localhost:3001',  // 备用前端端口
    'http://127.0.0.1:3000',  // 本地回环地址
    'http://127.0.0.1:3001'   // 备用本地回环地址
  ],
  credentials: true,  // 允许携带凭证
  optionsSuccessStatus: 200, // 对于旧版浏览器的支持
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))
```

### 2. 🔧 前端代理配置

#### Vite 代理配置 (`vite.config.ts`)
```typescript
server: {
  port: 3000,
  host: '0.0.0.0', // 允许外部访问
  proxy: {
    '/api': {
      target: 'http://localhost:8081', // Mock 后端服务
      changeOrigin: true,
      secure: false,
      ws: true,
      configure: (proxy, _options) => {
        proxy.on('error', (err, _req, _res) => {
          console.log('proxy error', err);
        });
        proxy.on('proxyReq', (proxyReq, req, _res) => {
          console.log('Sending Request to the Target:', req.method, req.url);
        });
        proxy.on('proxyRes', (proxyRes, req, _res) => {
          console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
        });
      },
    }
  }
}
```

#### API 请求配置 (`src/api/request.ts`)
```typescript
const api = axios.create({
  baseURL: '/api', // 使用相对路径，让 Vite 代理处理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### 3. 🎯 Mock 后端服务

我创建了一个完整的 Mock 后端服务 (`mock/server.js`)，包含：

- ✅ 用户注册 API
- ✅ 用户登录 API
- ✅ 用户管理 API
- ✅ **增强的 CORS 支持**（明确指定允许的前端地址）
- ✅ 数据验证
- ✅ 认证头支持
- ✅ 预检请求处理

### 4. 🏃‍♀️ 如何启动

#### 方法1：分别启动（推荐调试时使用）
```bash
# 终端1：启动前端 (http://localhost:3000)
npm run dev

# 终端2：启动 Mock 后端 (http://localhost:8081)
npm run mock
```

#### 方法2：同时启动
```bash
npm run dev:full
```

### 5. ✅ CORS 配置验证

启动服务后，您可以验证 CORS 配置是否正确：

1. **检查浏览器控制台**：不应该看到跨域错误
2. **检查网络请求**：
   - 预检请求 (OPTIONS) 应该返回 200 状态码
   - 响应头应该包含正确的 CORS 头信息
3. **测试不同端口**：配置支持 3000 和 3001 端口

### 6. 🧪 测试注册功能

现在您可以测试注册功能：

1. 访问 http://localhost:3000 或 http://localhost:3001
2. 点击"立即注册"
3. 填写注册信息：
   - 用户名：test123
   - 邮箱：test@example.com
   - 密码：123456
   - 确认密码：123456

### 7. 🧪 测试登录功能

预设的测试账号：
- 用户名：admin，密码：123456（管理员）
- 用户名：user1，密码：123456（普通用户）

### 8. 📋 API 端点

Mock 服务器提供以下 API（支持 CORS）：

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/users` - 获取用户列表
- `POST /api/users/search` - 搜索用户
- `PUT /api/users/:id` - 更新用户
- `PATCH /api/users/:id/status` - 更新用户状态
- `DELETE /api/users/:id` - 删除用户

### 9. 🔍 调试信息

Mock 服务器会在控制台输出请求日志，便于调试：
- 登录尝试
- 注册尝试
- API 请求状态
- CORS 预检请求

### 10. 🚀 生产环境配置

在生产环境中，您需要更新 CORS 配置：

#### 后端 CORS 配置
```javascript
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}
```

#### 前端配置
1. 将 `baseURL` 改为实际的后端 API 地址
2. 移除 Vite 代理配置
3. 确保后端服务器正确配置 CORS

### 11. 🐛 常见问题

#### 问题1：仍然出现跨域错误
**解决方案**：
- 确保后端服务器已启动
- 检查前端地址是否在 CORS 允许列表中
- 重启后端服务器

#### 问题2：认证请求失败
**解决方案**：
- 确保 `credentials: true` 已设置
- 检查请求头是否包含正确的 Authorization

#### 问题3：预检请求失败
**解决方案**：
- 检查 `allowedHeaders` 配置
- 确保 `methods` 包含 OPTIONS

## ✨ 现在可以正常使用所有功能了！

跨域问题已完全解决，支持：
- ✅ http://localhost:3000
- ✅ http://localhost:3001
- ✅ http://127.0.0.1:3000
- ✅ http://127.0.0.1:3001
