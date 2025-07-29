const express = require('express')
const cors = require('cors')
const app = express()
const port = 8081

// CORS 配置 - 明确指定允许的前端地址
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

// 中间件
app.use(cors(corsOptions))
app.use(express.json())

// 模拟用户数据
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    realName: '管理员',
    phone: '13800138000',
    status: 'ACTIVE',
    role: 'ADMIN',
    createTime: '2024-01-01T00:00:00.000Z',
    updateTime: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    realName: '测试用户1',
    phone: '13800138001',
    status: 'ACTIVE',
    role: 'USER',
    createTime: '2024-01-02T00:00:00.000Z',
    updateTime: '2024-01-02T00:00:00.000Z'
  }
]

let nextUserId = 3

// 认证相关API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  console.log('Login attempt:', { username, password })

  // 简单验证
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      msg: '用户名和密码不能为空'
    })
  }

  const user = users.find(u => u.username === username)
  if (!user) {
    return res.status(401).json({
      success: false,
      msg: '用户名或密码错误'
    })
  }

  // 模拟密码验证（实际应用中需要加密验证）
  if (password !== '123456') {
    return res.status(401).json({
      success: false,
      msg: '用户名或密码错误'
    })
  }

  // 返回登录成功响应
  res.json({
    success: true,
    msg: '登录成功',
    data: {
      user: user,
      token: {
        authorization: 'Bearer mock-jwt-token',
        jti: 'mock-jti',
        access_token: 'mock-access-token',
        expires_in: 3600
      }
    }
  })
})

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  console.log('Register attempt:', { username, email })

  // 验证输入
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      msg: '所有字段都是必填的'
    })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      msg: '两次输入的密码不一致'
    })
  }

  // 检查用户名是否已存在
  if (users.find(u => u.username === username)) {
    return res.status(400).json({
      success: false,
      msg: '用户名已存在'
    })
  }

  // 检查邮箱是否已存在
  if (users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      msg: '邮箱已被使用'
    })
  }

  // 创建新用户
  const newUser = {
    id: nextUserId++,
    username,
    email,
    realName: req.body.realName || '',
    phone: req.body.phone || '',
    status: 'ACTIVE',
    role: 'USER',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  users.push(newUser)

  res.json({
    success: true,
    msg: '注册成功',
    data: newUser
  })
})

// 用户管理相关API
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    msg: '获取用户列表成功',
    data: users
  })
})

app.post('/api/users/search', (req, res) => {
  const { page = 0, size = 20, realName, status, role } = req.body

  let filteredUsers = [...users]

  // 按条件过滤
  if (realName) {
    filteredUsers = filteredUsers.filter(u =>
      u.realName && u.realName.includes(realName)
    )
  }

  if (status) {
    filteredUsers = filteredUsers.filter(u => u.status === status)
  }

  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role)
  }

  // 分页
  const start = page * size
  const end = start + size
  const content = filteredUsers.slice(start, end)

  res.json({
    success: true,
    msg: '搜索用户成功',
    data: {
      content,
      page,
      size,
      totalElements: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / size),
      first: page === 0,
      last: end >= filteredUsers.length
    }
  })
})

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id)
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      msg: '用户不存在'
    })
  }

  // 更新用户信息
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    updateTime: new Date().toISOString()
  }

  res.json({
    success: true,
    msg: '更新用户信息成功',
    data: users[userIndex]
  })
})

app.patch('/api/users/:id/status', (req, res) => {
  const userId = parseInt(req.params.id)
  const { status } = req.query
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      msg: '用户不存在'
    })
  }

  users[userIndex].status = status
  users[userIndex].updateTime = new Date().toISOString()

  res.json({
    success: true,
    msg: '更新用户状态成功',
    data: users[userIndex]
  })
})

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id)
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      msg: '用户不存在'
    })
  }

  users.splice(userIndex, 1)

  res.json({
    success: true,
    msg: '删除用户成功'
  })
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    msg: 'Mock server is running',
    timestamp: new Date().toISOString()
  })
})

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`)
  console.log('Available endpoints:')
  console.log('- POST /api/auth/login')
  console.log('- POST /api/auth/register')
  console.log('- GET /api/users')
  console.log('- POST /api/users/search')
  console.log('- PUT /api/users/:id')
  console.log('- PATCH /api/users/:id/status')
  console.log('- DELETE /api/users/:id')
  console.log('- GET /api/health')
})
