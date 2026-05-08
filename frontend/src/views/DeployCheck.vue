<template>
  <div class="deploy-check">
    <h1>🚀 部署状态检查</h1>
    
    <div class="status-card">
      <h2>应用基本信息</h2>
      <div class="info-item">
        <label>部署状态:</label>
        <span class="status-success">✅ 成功部署</span>
      </div>
      <div class="info-item">
        <label>当前时间:</label>
        <span>{{ currentTime }}</span>
      </div>
      <div class="info-item">
        <label>运行环境:</label>
        <span>{{ appConfig.NODE_ENV || '未知' }}</span>
      </div>
    </div>

    <div class="status-card">
      <h2>环境变量检查</h2>
      <div class="env-item" :class="{ 'missing': !appConfig.API_BASE_URL }">
        <label>API 基础 URL:</label>
        <span>{{ appConfig.API_BASE_URL || '❌ 未设置' }}</span>
      </div>
      <div class="env-item" :class="{ 'missing': !appConfig.AMAP_KEY }">
        <label>高德地图 Key:</label>
        <span>{{ appConfig.AMAP_KEY ? appConfig.AMAP_KEY.substring(0, 8) + '...' : '❌ 未设置' }}</span>
      </div>
    </div>

    <div class="status-card">
      <h2>功能测试</h2>
      <div class="test-actions">
        <button @click="testApiConnection" :disabled="!appConfig.API_BASE_URL">
          测试 API 连接
        </button>
        <button @click="testNotification">测试通知系统</button>
        <button @click="goToMainApp">返回主应用</button>
      </div>
      
      <div v-if="testResult" class="test-result">
        <h3>测试结果:</h3>
        <pre>{{ testResult }}</pre>
      </div>
    </div>

    <div class="status-card">
      <h2>快速导航</h2>
      <div class="nav-links">
        <router-link to="/pois">📍 景点浏览</router-link>
        <router-link to="/itinerary">📅 行程规划</router-link>
        <router-link to="/budget">💰 预算管理</router-link>
        <router-link to="/memos">📝 备忘录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeployCheck',
  data() {
    return {
      currentTime: new Date().toLocaleString(),
      appConfig: window.APP_CONFIG || {},
      testResult: null,
      interval: null
    };
  },
  mounted() {
    // 每秒更新时间
    this.interval = setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
    
    // 记录部署检查访问
    console.log('🔍 部署检查页面已加载');
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    async testApiConnection() {
      if (!this.appConfig.API_BASE_URL) {
        this.testResult = '❌ 错误: API_BASE_URL 未配置';
        return;
      }

      try {
        this.testResult = '⏳ 正在测试 API 连接...';
        
        // 尝试连接健康检查端点
        const response = await fetch(`${this.appConfig.API_BASE_URL}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.testResult = `✅ API 连接成功\n状态码: ${response.status}\n响应数据: ${JSON.stringify(data, null, 2)}`;
        } else {
          this.testResult = `❌ API 连接失败\n状态码: ${response.status}\n状态文本: ${response.statusText}`;
        }
      } catch (error) {
        this.testResult = `❌ 网络错误: ${error.message}\n请检查 API 地址是否正确`;
      }
    },
    
    testNotification() {
      if (window.notificationService) {
        window.notificationService.showSuccess('通知系统工作正常！');
        window.notificationService.showWarning('这是一个警告消息');
        window.notificationService.showError('这是一个错误消息');
        this.testResult = '✅ 通知系统测试完成';
      } else {
        this.testResult = '❌ 通知系统未初始化';
      }
    },
    
    goToMainApp() {
      this.$router.push('/pois');
    }
  }
};
</script>

<style scoped>
.deploy-check {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.status-card h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.info-item, .env-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child, .env-item:last-child {
  border-bottom: none;
}

.env-item.missing {
  background-color: #fff5f5;
  border-left: 4px solid #e53e3e;
  padding-left: 16px;
  margin-left: -20px;
  margin-right: -20px;
  padding-right: 20px;
}

.status-success {
  color: #38a169;
  font-weight: bold;
}

.test-actions {
  margin: 20px 0;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.test-result {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.test-result pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-size: 13px;
  color: #333;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.nav-links a {
  display: block;
  padding: 12px;
  background: #f8f9fa;
  text-decoration: none;
  color: #007bff;
  border-radius: 4px;
  text-align: center;
  transition: all 0.2s;
}

.nav-links a:hover {
  background: #007bff;
  color: white;
}
</style>