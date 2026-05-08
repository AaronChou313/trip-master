<template>
  <div id="app">
    <!-- 未认证状态：显示登录/注册界面 -->
    <div v-if="!isAuthenticated" class="auth-wrapper">
      <Login 
        v-if="showLogin" 
        @login-success="handleLoginSuccess" 
        @switch-to-register="showLogin = false"
      />
      <Register 
        v-else 
        @register-success="handleLoginSuccess" 
        @switch-to-login="showLogin = true"
      />
    </div>
    
    <!-- 已认证状态：显示主应用 -->
    <div v-else class="app-wrapper">
      <header class="app-header">
        <div class="header-content">
          <h1>TripMaster 旅行规划助手</h1>
          <div class="user-info">
            <span class="username">欢迎, {{ currentUser?.username }}</span>
            <div class="data-actions">
              <router-link to="/profile" class="btn btn-secondary profile-btn">
                ⚙️ 个人设置
              </router-link>
              <button @click="exportData" class="btn btn-secondary">导出数据</button>
              <label class="btn btn-secondary">
                导入数据
                <input type="file" @change="importData" accept=".json" style="display: none;">
              </label>
            </div>
            <button @click="handleLogout" class="logout-btn">退出</button>
          </div>
        </div>
        <nav class="nav-menu">
          <router-link to="/guide" class="nav-link">使用指南</router-link>
          <router-link to="/pois" class="nav-link">地点管理</router-link>
          <router-link to="/itinerary" class="nav-link">行程规划</router-link>
          <router-link to="/budget" class="nav-link">预算管理</router-link>
          <router-link to="/memos" class="nav-link">备忘事项</router-link>
        </nav>
      </header>
      
      <main class="app-main">
        <router-view />
      </main>
      
      <Notification />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Notification from './components/Notification.vue';
import authService from './services/authService';
import apiClient from './utils/apiClient';

export default {
  name: 'App',
  components: {
    Login,
    Register,
    Notification
  },
  setup() {
    const isAuthenticated = ref(false);
    const currentUser = ref(null);
    const showLogin = ref(true);

    // 检查认证状态
    const checkAuthStatus = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            currentUser.value = user;
            isAuthenticated.value = true;
          } else {
            // token无效，清除认证信息
            authService.logout();
            isAuthenticated.value = false;
          }
        } catch (error) {
          console.error('检查认证状态失败:', error);
          authService.logout();
          isAuthenticated.value = false;
        }
      }
    };

    // 处理登录成功
    const handleLoginSuccess = (user) => {
      currentUser.value = user;
      isAuthenticated.value = true;
      window.notificationService?.showSuccess(`欢迎回来, ${user.username}!`);
    };

    // 处理登出
    const handleLogout = () => {
      authService.logout();
      isAuthenticated.value = false;
      currentUser.value = null;
      window.notificationService?.showSuccess('已成功退出登录');
    };

    // 数据导出功能
    const exportData = async () => {
      try {
        const [pois, itineraries, budgets, memos] = await Promise.all([
          apiClient.get('/api/pois'),
          apiClient.get('/api/itineraries'),
          apiClient.get('/api/budgets'),
          apiClient.get('/api/memos')
        ]);

        const exportData = {
          pois,
          itineraries,
          budgets,
          memos,
          exportTime: new Date().toISOString(),
          version: '2.0',
          userId: currentUser.value?.id
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tripmaster-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.notificationService?.showSuccess('数据导出成功！');
      } catch (error) {
        console.error('Export failed:', error);
        window.notificationService?.showError('导出失败，请重试');
      }
    };

    // 数据导入功能
    const importData = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importData = JSON.parse(text);

        // 验证数据结构
        if (!importData.pois || !importData.itineraries || !importData.budgets || !importData.memos) {
          window.notificationService?.showError('数据格式不正确');
          return;
        }

        // 逐个导入数据
        const importPromises = [];

        // 导入POIs
        importData.pois.forEach(poi => {
          importPromises.push(apiClient.post('/api/pois', poi));
        });

        // 导入Itineraries
        importData.itineraries.forEach(itin => {
          importPromises.push(apiClient.post('/api/itineraries', itin));
        });

        // 导入Budgets
        importData.budgets.forEach(budget => {
          importPromises.push(apiClient.post('/api/budgets', budget));
        });

        // 导入Memos
        importData.memos.forEach(memo => {
          importPromises.push(apiClient.post('/api/memos', memo));
        });

        await Promise.all(importPromises);
        
        window.notificationService?.showSuccess('数据导入成功！页面将刷新以应用更改。');
        setTimeout(() => {
          location.reload();
        }, 1500);
      } catch (error) {
        console.error('Import failed:', error);
        window.notificationService?.showError('导入失败，请检查文件格式');
      }

      // 重置文件输入
      event.target.value = '';
    };

    // 组件挂载时检查认证状态
    onMounted(() => {
      checkAuthStatus();
    });

    return {
      isAuthenticated,
      currentUser,
      showLogin,
      handleLoginSuccess,
      handleLogout,
      exportData,
      importData
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

/* 认证界面样式 */
.auth-wrapper {
  min-height: 100vh;
}

/* 主应用样式 */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.header-content h1 {
  font-size: 1.8rem;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
}

.data-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.profile-btn {
  text-decoration: none;
  display: inline-block;
}

.profile-btn.router-link-active {
  background: rgba(255,255,255,0.3);
}

.logout-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 0.5rem 2rem;
  background: rgba(255,255,255,0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.app-main {
  flex: 1;
  padding: 0.5rem 2rem;
  overflow: auto;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 添加Notification组件的全局样式 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .user-info {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .app-main {
    padding: 0.5rem 1rem;
  }
  
  .data-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>