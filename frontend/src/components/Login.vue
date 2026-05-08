<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>TripMaster</h1>
        <p>旅行规划大师</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input
            v-model="credentials.username"
            type="text"
            placeholder="用户名或邮箱"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <input
            v-model="credentials.password"
            type="password"
            placeholder="密码"
            class="form-input"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="login-btn"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="login-footer">
        <p>
          还没有账号？
          <button @click="$emit('switch-to-register')" class="link-btn">
            立即注册
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import authService from '../services/authService';

export default {
  name: 'Login',
  emits: ['login-success', 'switch-to-register'],
  setup(props, { emit }) {
    const credentials = ref({
      username: '',
      password: ''
    });
    const loading = ref(false);
    const error = ref('');

    const handleLogin = async () => {
      loading.value = true;
      error.value = '';

      try {
        const result = await authService.login(credentials.value);
        if (result.success) {
          emit('login-success', result.user);
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
      credentials,
      loading,
      error,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  font-size: 1.1rem;
}

.login-form {
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

.login-btn {
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

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
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