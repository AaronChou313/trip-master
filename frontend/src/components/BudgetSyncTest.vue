<template>
  <div class="budget-sync-test">
    <h2>预算同步测试</h2>
    
    <div class="test-section">
      <h3>测试预算同步功能</h3>
      <button @click="testSync" class="btn btn-primary">执行预算同步测试</button>
      <button @click="clearResults" class="btn btn-secondary">清空结果</button>
    </div>
    
    <div v-if="testResults.length > 0" class="results-section">
      <h3>测试结果</h3>
      <div v-for="(result, index) in testResults" :key="index" class="result-item">
        <div class="result-header">
          <span class="timestamp">{{ result.timestamp }}</span>
          <span class="status" :class="result.type">{{ result.type }}</span>
        </div>
        <div class="result-content">
          <pre>{{ result.message }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import apiClient from '../utils/apiClient';

export default {
  name: 'BudgetSyncTest',
  setup() {
    const testResults = ref([]);

    const addResult = (type, message) => {
      testResults.value.push({
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      });
    };

    const clearResults = () => {
      testResults.value = [];
    };

    const testSync = async () => {
      try {
        addResult('info', '开始测试预算同步...');
        
        // 1. 获取行程数据
        addResult('info', '正在获取行程数据...');
        const itineraries = await apiClient.get('/api/itineraries');
        addResult('success', `成功获取 ${itineraries.length} 个行程`);
        
        // 2. 分析每个行程的预算
        itineraries.forEach((itin, index) => {
          let totalBudget = 0;
          let poiBudget = 0;
          let transportBudget = 0;
          
          if (itin.pois && itin.pois.length > 0) {
            // 计算景点预算
            itin.pois.forEach(poi => {
              if (poi.budget && poi.budget > 0) {
                poiBudget += poi.budget;
              }
            });
            
            // 计算交通预算
            itin.pois.forEach(poi => {
              if (poi.transport_budget && poi.transport_budget > 0) {
                transportBudget += poi.transport_budget;
              }
            });
            
            totalBudget = poiBudget + transportBudget;
            
            addResult('info', 
              `行程 ${index + 1} "${itin.name}":\n` +
              `  景点预算: ${poiBudget}\n` +
              `  交通预算: ${transportBudget}\n` +
              `  总预算: ${totalBudget}`
            );
          }
        });
        
        addResult('success', '预算同步测试完成！');
        
      } catch (error) {
        addResult('error', `测试失败: ${error.message}`);
        console.error('测试错误:', error);
      }
    };

    return {
      testResults,
      testSync,
      clearResults
    };
  }
};
</script>

<style scoped>
.budget-sync-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.results-section {
  margin-top: 30px;
}

.result-item {
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f1f1f1;
  font-size: 12px;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.info { background-color: #d1ecf1; color: #0c5460; }
.status.success { background-color: #d4edda; color: #155724; }
.status.error { background-color: #f8d7da; color: #721c24; }

.result-content {
  padding: 15px;
  background-color: white;
}

.result-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
}
</style>