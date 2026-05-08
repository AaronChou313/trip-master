import apiClient from '../utils/apiClient';

class PoiService {
  async getAll() {
    return await apiClient.get('/api/pois');
  }

  async create(poiData) {
    return await apiClient.post('/api/pois', poiData);
  }

  async delete(id) {
    return await apiClient.delete(`/api/pois/${id}`);
  }

  // 高德地图API代理（无需认证）
  async searchPlaces(keywords, city = '') {
    const params = new URLSearchParams({
      keywords,
      city
    });
    return await apiClient.get(`/api/amap/place/text?${params}`);
  }
}

export default new PoiService();