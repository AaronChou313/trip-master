<template>
  <div class="env-checker">
    <h3>环境变量检查器</h3>
    <div class="env-info">
      <p><strong>当前环境:</strong> {{ currentEnv }}</p>
      <p><strong>构建模式:</strong> {{ buildMode }}</p>
    </div>
    
    <div class="env-vars">
      <h4>环境变量状态:</h4>
      <div class="var-item" :class="{ 'missing': !apiBaseUrl }">
        <span class="var-name">VUE_APP_API_BASE_URL:</span>
        <span class="var-value">{{ apiBaseUrl || '❌ 未设置' }}</span>
      </div>
      <div class="var-item" :class="{ 'missing': !amapKey }">
        <span class="var-name">VUE_APP_AMAP_KEY:</span>
        <span class="var-value">{{ amapKey ? amapKey.substring(0, 8) + '...' : '❌ 未设置' }}</span>
      </div>
      <div class="var-item">
        <span class="var-name">NODE_ENV:</span>
        <span class="var-value">{{ nodeEnv }}</span>
      </div>
    </div>

    <div class="actions">
      <button @click="testApiConnection" :disabled="!apiBaseUrl">
        测试 API 连接
      </button>
      <button @click="refresh">刷新检查</button>
    </div>

    <div v-if="apiTestResult" class="api-test-result">
      <h4>API 测试结果:</h4>
      <pre>{{ apiTestResult }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvChecker',
  data() {
    return {
      currentEnv: process.env.NODE_ENV || 'unknown',
      buildMode: process.env.BUILD_MODE || 'unknown',
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
      amapKey: process.env.VUE_APP_AMAP_KEY,
      nodeEnv: process.env.NODE_ENV,
      apiTestResult: null
    };
  },
  mounted() {
    this.logEnvironmentInfo();
  },
  methods: {
    logEnvironmentInfo() {
      console.group('🔧 环境变量检查');
      console.log('VUE_APP_API_BASE_URL:', this.apiBaseUrl);
      console.log('VUE_APP_AMAP_KEY:', this.amapKey ? `${this.amapKey.substring(0, 8)}...` : '未设置');
      console.log('NODE_ENV:', this.nodeEnv);
      console.log('BUILD_MODE:', this.buildMode);
      console.groupEnd();
    },
    async testApiConnection() {
      if (!this.apiBaseUrl) {
        this.apiTestResult = '错误: API 基础 URL 未设置';
        return;
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.apiTestResult = `✅ 连接成功\n状态码: ${response.status}\n响应: ${JSON.stringify(data, null, 2)}`;
        } else {
          this.apiTestResult = `❌ 连接失败\n状态码: ${response.status}\n状态文本: ${response.statusText}`;
        }
      } catch (error) {
        this.apiTestResult = `❌ 网络错误: ${error.message}`;
      }
    },
    refresh() {
      // 重新获取环境变量（虽然在运行时不会改变）
      this.currentEnv = process.env.NODE_ENV || 'unknown';
      this.buildMode = process.env.BUILD_MODE || 'unknown';
      this.apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
      this.amapKey = process.env.VUE_APP_AMAP_KEY;
      this.nodeEnv = process.env.NODE_ENV;
      this.apiTestResult = null;
      this.logEnvironmentInfo();
    }
  }
};
</script>

<style scoped>
.env-checker {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: monospace;
}

.env-info {
  margin-bottom: 20px;
}

.env-vars {
  margin-bottom: 20px;
}

.var-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  margin: 4px 0;
  background-color: white;
  border-radius: 4px;
}

.var-item.missing {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.var-name {
  font-weight: bold;
  color: #666;
}

.var-value {
  color: #333;
}

.actions {
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #1976D2;
}

.api-test-result {
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  color: #333;
}
</style>