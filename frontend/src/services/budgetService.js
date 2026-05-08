import apiClient from '../utils/apiClient';

class BudgetService {
  async getAll() {
    return await apiClient.get('/api/budgets');
  }

  async create(budgetData) {
    return await apiClient.post('/api/budgets', budgetData);
  }

  async update(id, budgetData) {
    return await apiClient.put(`/api/budgets/${id}`, budgetData);
  }

  async delete(id) {
    return await apiClient.delete(`/api/budgets/${id}`);
  }
}

export default new BudgetService();