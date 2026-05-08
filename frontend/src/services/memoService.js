import apiClient from '../utils/apiClient';

class MemoService {
  async getAll() {
    return await apiClient.get('/api/memos');
  }

  async create(memoData) {
    return await apiClient.post('/api/memos', memoData);
  }

  async update(id, memoData) {
    return await apiClient.put(`/api/memos/${id}`, memoData);
  }

  async delete(id) {
    return await apiClient.delete(`/api/memos/${id}`);
  }
}

export default new MemoService();