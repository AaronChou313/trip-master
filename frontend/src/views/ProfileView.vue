<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h1>个人设置</h1>
        <p>修改您的账户信息</p>
      </div>

      <form @submit.prevent="handleUpdate" class="profile-form">
        <!-- 用户名 -->
        <div class="form-section">
          <h3>用户名</h3>
          <div class="form-group">
            <input
              v-model="formData.username"
              type="text"
              placeholder="输入新的用户名"
              class="form-input"
              required
            />
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="form-section">
          <h3>邮箱</h3>
          <div class="form-group">
            <input
              v-model="formData.email"
              type="email"
              placeholder="输入新的邮箱"
              class="form-input"
            />
          </div>
        </div>

        <!-- 密码 -->
        <div class="form-section password-section">
          <h3>修改密码</h3>
          <div class="form-group">
            <input
              v-model="formData.currentPassword"
              type="password"
              placeholder="当前密码（修改密码时必填）"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <input
              v-model="formData.newPassword"
              type="password"
              placeholder="新密码（留空则不修改）"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="确认新密码"
              class="form-input"
            />
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- 成功提示 -->
        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <!-- 提交按钮 -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="loading"
        >
          {{ loading ? '保存中...' : '保存修改' }}
        </button>

        <!-- 取消按钮 -->
        <button
          type="button"
          @click="resetForm"
          class="cancel-btn"
          :disabled="loading"
        >
          重置
        </button>
      </form>

      <!-- 删除账户区域 -->
      <div class="danger-zone">
        <h4>危险区域</h4>
        <p>删除账户后，所有数据将无法恢复。</p>
        <button
          @click="handleDeleteAccount"
          class="delete-btn"
        >
          删除账户
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

export default {
  name: 'ProfileView',
  setup() {
    const router = useRouter();
    const formData = ref({
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const loading = ref(false);
    const error = ref('');
    const success = ref('');

    // 加载当前用户信息
    onMounted(async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        formData.value.username = user.username;
        formData.value.email = user.email || '';
      }
    });

    // 重置表单
    const resetForm = async () => {
      error.value = '';
      success.value = '';
      formData.value.currentPassword = '';
      formData.value.newPassword = '';
      formData.value.confirmPassword = '';

      const user = await authService.getCurrentUser();
      if (user) {
        formData.value.username = user.username;
        formData.value.email = user.email || '';
      }
    };

    // 验证密码
    const validatePassword = () => {
      // 如果新密码为空，跳过密码验证
      if (!formData.value.newPassword) {
        return true;
      }

      // 如果要修改密码，必须提供当前密码
      if (!formData.value.currentPassword) {
        error.value = '修改密码时需要输入当前密码';
        return false;
      }

      // 验证新密码和确认密码是否一致
      if (formData.value.newPassword !== formData.value.confirmPassword) {
        error.value = '新密码和确认密码不一致';
        return false;
      }

      // 验证新密码长度
      if (formData.value.newPassword.length < 6) {
        error.value = '新密码长度至少为6位';
        return false;
      }

      return true;
    };

    // 处理更新
    const handleUpdate = async () => {
      error.value = '';
      success.value = '';

      // 验证密码
      if (!validatePassword()) {
        return;
      }

      loading.value = true;

      try {
        const updateData = {
          username: formData.value.username,
          email: formData.value.email
        };

        // 只有在需要修改密码时才发送密码相关字段
        if (formData.value.newPassword) {
          updateData.currentPassword = formData.value.currentPassword;
          updateData.newPassword = formData.value.newPassword;
        }

        const result = await authService.updateUser(updateData);

        if (result.success) {
          success.value = '账户信息更新成功！';
          // 清空密码字段
          formData.value.currentPassword = '';
          formData.value.newPassword = '';
          formData.value.confirmPassword = '';
          window.notificationService?.showSuccess('账户信息更新成功！');
        } else {
          error.value = result.error;
        }
      } catch (err) {
        error.value = err.message || '更新失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };

    // 处理删除账户
    const handleDeleteAccount = async () => {
      if (!confirm('确定要删除您的账户吗？此操作不可恢复，所有数据将被永久删除。')) {
        return;
      }

      // 需要输入密码确认删除
      const password = prompt('请输入当前密码以确认删除账户：');
      if (!password) {
        return;
      }

      loading.value = true;

      try {
        const response = await fetch(`${authService.baseURL}/api/auth/me`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.token}`
          },
          body: JSON.stringify({ password })
        });

        if (response.ok) {
          authService.logout();
          window.notificationService?.showSuccess('账户已删除');
          router.push('/#/');
        } else {
          const data = await response.json();
          error.value = data.error || '删除账户失败';
        }
      } catch (err) {
        error.value = '网络错误，请稍后重试';
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      error,
      success,
      resetForm,
      handleUpdate,
      handleDeleteAccount
    };
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
  background: #f5f5f5;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.profile-header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.profile-header p {
  color: #666;
  font-size: 1.1rem;
}

.profile-form {
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  color: #2d3748;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
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

.success-message {
  color: #2ecc71;
  background: #f0fff4;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.submit-btn,
.cancel-btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 1rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: #5a6268;
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.danger-zone {
  padding: 1.5rem;
  background: #fff5f5;
  border: 2px solid #fed7d7;
  border-radius: 10px;
}

.danger-zone h4 {
  color: #c53030;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.danger-zone p {
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.delete-btn {
  width: 100%;
  padding: 0.75rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: #c53030;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-card {
    padding: 2rem;
  }

  .profile-header h1 {
    font-size: 1.5rem;
  }
}
</style>
