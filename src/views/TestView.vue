<template>
  <div class="tool-section-title">常用工具</div>
  <el-row :gutter="18" class="tool-row">
    <el-col :span="8" v-for="tool in tools" :key="tool.title">
      <el-card class="tool-card" @click="goTo(tool.url)" shadow="hover">
        <div class="card-content">
          <el-icon class="card-icon"><component :is="tool.icon" /></el-icon>
          <div class="card-text">
            <div class="card-title">{{ tool.title }}</div>
            <div class="card-desc">{{ tool.desc }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col v-if="error" :span="24">
      <el-card class="error-card">
        <div class="error-content">
          <el-icon class="error-icon"><WarningFilled /></el-icon>
          <span class="error-text">{{ error }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {
  Document,
  Search,
  Filter,
  Grid,
  PieChart,
  Key,
  WarningFilled,
} from '@element-plus/icons-vue'
import { ref } from 'vue'

const tools = [
  {
    icon: Document,
    title: 'JSON在线工具',
    desc: 'JSON格式化、校验、解析工具',
    url: 'https://www.json.cn/',
  },
  {
    icon: Search,
    title: '在线接口测试',
    desc: 'Reqbin在线API调试工具',
    url: 'https://reqbin.com/',
  },
  {
    icon: Filter,
    title: '正则表达式测试',
    desc: '正则匹配、调试、生成工具',
    url: 'https://regex101.com/',
  },
  {
    icon: Grid,
    title: '在线测试数据生成',
    desc: 'Mockaroo批量生成测试数据',
    url: 'https://www.mockaroo.com/',
  },
  {
    icon: PieChart,
    title: '网页性能测试',
    desc: 'WebPageTest页面加载性能分析',
    url: 'https://www.webpagetest.org/',
  },
  {
    icon: Key,
    title: '数据加密解密工具',
    desc: 'CyberChef在线编解码/加密工具',
    url: 'https://gchq.github.io/CyberChef/',
  },
]

const error = ref('') // 需要报错时设置 error.value = '错误信息'

function goTo(url) {
  try {
    window.open(url, '_blank')
  } catch (e) {
    error.value = '打开工具失败，请检查浏览器设置或网络连接。'
  }
}
</script>
<style scoped>
.tool-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 14px;
  border-left: 4px solid #409eff;
  padding-left: 10px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #e3f0ff 0%, #fff 100%);
  border-radius: 4px;
  line-height: 1.5;
}
.tool-row {
  margin-top: 16px;
}
.tool-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(64, 158, 255, 0.08);
  transition:
    box-shadow 0.18s,
    transform 0.12s,
    background 0.12s;
  cursor: pointer;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.tool-card:hover {
  box-shadow: 0 6px 16px 0 rgba(64, 158, 255, 0.13);
  transform: translateY(-2px) scale(1.02);
  background: linear-gradient(120deg, #f0f7ff 60%, #e3f0ff 100%);
}
.tool-card:active {
  transform: scale(0.97);
}
.card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 6px;
}
.card-icon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
}
.card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-title {
  font-weight: 700;
  font-size: 15px;
  color: #1d2129;
  margin-bottom: 3px;
}
.card-desc {
  color: #86909c;
  font-size: 12px;
}
.error-card {
  border-radius: 10px;
  background: #fff7f7;
  border: 1px solid #ffd6d6;
  margin-top: 10px;
}
.error-content {
  display: flex;
  align-items: center;
  padding: 10px 6px;
  color: #d93026;
}
.error-icon {
  font-size: 18px;
  margin-right: 8px;
}
.error-text {
  font-size: 13px;
  font-weight: 600;
}
@media (max-width: 900px) {
  .tool-card {
    min-height: 54px;
    border-radius: 6px;
    margin-bottom: 6px;
  }
  .card-icon {
    font-size: 14px;
    margin-right: 4px;
  }
  .card-title {
    font-size: 11px;
    margin-bottom: 1px;
  }
  .card-desc {
    font-size: 9px;
  }
}
</style>
