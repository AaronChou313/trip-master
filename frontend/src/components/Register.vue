<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>创建账户</h1>
        <p>加入TripMaster开始您的旅行规划</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <input
            v-model="userData.username"
            type="text"
            placeholder="用户名"
            class="form-input"
            required
            minlength="3"
          />
        </div>
        
        <div class="form-group">
          <input
            v-model="userData.email"
            type="email"
            placeholder="邮箱地址"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <input
            v-model="userData.password"
            type="password"
            placeholder="密码（至少6位）"
            class="form-input"
            required
            minlength="6"
          />
        </div>
        
        <div class="form-group">
          <input
            v-model="userData.confirmPassword"
            type="password"
            placeholder="确认密码"
            class="form-input"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="register-btn"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="register-footer">
        <p>
          已有账户？
          <button @click="$emit('switch-to-login')" class="link-btn">
            立即登录
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import authService from '../services/authService';

export default {
  name: 'Register',
  emits: ['register-success', 'switch-to-login'],
  setup(props, { emit }) {
    const userData = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const loading = ref(false);
    const error = ref('');

    // 监听密码确认字段变化
    watch(() => userData.value.confirmPassword, () => {
      if (userData.value.confirmPassword && userData.value.password !== userData.value.confirmPassword) {
        error.value = '两次输入的密码不一致';
      } else {
        error.value = '';
      }
    });

    const handleRegister = async () => {
      // 前端验证
      if (userData.value.password !== userData.value.confirmPassword) {
        error.value = '两次输入的密码不一致';
        return;
      }

      if (userData.value.password.length < 6) {
        error.value = '密码长度至少6位';
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        const result = await authService.register({
          username: userData.value.username,
          email: userData.value.email,
          password: userData.value.password
        });
        
        if (result.success) {
          emit('register-success', result.user);
        } else {
          error.value = result.error;
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      userData,
      loading,
      error,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.register-card {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
  font-size: 1.1rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.register-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  color: #666;
}

.link-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  margin: 0;
  text-decoration: underline;
}

.link-btn:hover {
  color: #764ba2;
}
</style>