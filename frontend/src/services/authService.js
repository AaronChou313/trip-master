class AuthService {
  constructor() {
    this.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated() {
    return !!this.token;
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (response.ok) {
        this.setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || '注册失败' };
      }
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (response.ok) {
        this.setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || '登录失败' };
      }
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  }

  async getCurrentUser() {
    if (!this.token) return null;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  async updateUser(userData) {
    if (!this.token) {
      return { success: false, error: '未登录' };
    }

    try {
      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, user: data };
      } else {
        return { success: false, error: data.error || '更新失败' };
      }
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  }

  logout() {
    this.removeToken();
  }
}

export default new AuthService();