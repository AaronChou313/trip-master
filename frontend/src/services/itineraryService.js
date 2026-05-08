import apiClient from '../utils/apiClient';

class ItineraryService {
  async getAll() {
    return await apiClient.get('/api/itineraries');
  }

  async getById(id) {
    const itineraries = await this.getAll();
    return itineraries.find(itin => itin.id === id);
  }

  async create(itineraryData) {
    // 格式化数据以匹配新的API期望的结构
    const formattedData = {
      ...itineraryData,
      pois: itineraryData.pois?.map(poi => ({
        id: poi.id,
        name: poi.name,
        address: poi.address,
        location: poi.location,
        tel: poi.tel,
        type: poi.type,
        typecode: poi.typecode,
        description: poi.description || '',
        budget: poi.budget || 0,
        transport: {
          type: poi.transport?.type || '',
          description: poi.transport?.description || '',
          budget: poi.transport?.budget || 0
        }
      })) || []
    };
    
    return await apiClient.post('/api/itineraries', formattedData);
  }

  async update(id, itineraryData) {
    // 格式化数据同create方法
    const formattedData = {
      ...itineraryData,
      pois: itineraryData.pois?.map(poi => ({
        id: poi.id,
        name: poi.name,
        address: poi.address,
        location: poi.location,
        tel: poi.tel,
        type: poi.type,
        typecode: poi.typecode,
        description: poi.description || '',
        budget: poi.budget || 0,
        transport: {
          type: poi.transport?.type || '',
          description: poi.transport?.description || '',
          budget: poi.transport?.budget || 0
        }
      })) || []
    };
    
    return await apiClient.put(`/api/itineraries/${id}`, formattedData);
  }

  async delete(id) {
    return await apiClient.delete(`/api/itineraries/${id}`);
  }
}

export default new ItineraryService();