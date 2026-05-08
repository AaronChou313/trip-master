<template>
  <div class="pois-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <input 
          v-model="searchKeyword" 
          @keyup.enter="searchPOIs"
          placeholder="搜索景点..." 
          class="search-input"
        >
        <button @click="searchPOIs" class="search-btn">搜索</button>
      </div>
      
      <!-- 搜索结果列表 -->
      <div class="results-list" ref="resultsList">
        <div 
          v-for="place in searchResults" 
          :key="place.id"
          class="result-item"
          @click="selectSearchResult(place)"
        >
          <div class="result-info">
            <h3>{{ place.name }}</h3>
            <p>{{ place.address || '地址未知' }}</p>
          </div>
          <button 
            @click.stop="addPoi(place)"
            class="add-btn"
            :disabled="isPoiExists(place.id)"
          >
            {{ isPoiExists(place.id) ? '✓' : '+' }}
          </button>
        </div>
        <div v-if="searchResults.length === 0 && searchKeyword" class="no-results">
          未找到相关景点
        </div>
      </div>
    </div>
    
    <!-- 地图区域 -->
    <div class="map-section">
      <div id="map-container" ref="mapContainer"></div>
    </div>
    
    <!-- 兴趣点列表 -->
    <div class="pois-section">
      <h2>我的兴趣点 ({{ pois.length }})</h2>
      <div class="pois-list" ref="poisList">
        <div 
          v-for="poi in pois" 
          :key="poi.id"
          class="poi-item"
          @click="selectPoi(poi)"
        >
          <div class="poi-info">
            <h3>{{ poi.name }}</h3>
            <p>{{ poi.address || '地址未知' }}</p>
          </div>
          <button @click.stop="removePoi(poi.id)" class="remove-btn">-</button>
        </div>
        <div v-if="pois.length === 0" class="no-pois">
          暂无兴趣点
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue';
import poiService from '../services/poiService';

export default {
  name: 'PoisView',
  setup() {
    // 响应式数据
    const searchKeyword = ref('');
    const searchResults = ref([]);
    const pois = ref([]);
    const mapContainer = ref(null);
    const resultsList = ref(null);
    const poisList = ref(null);
    let map = null;
    let searchMarkers = []; // 搜索结果标记
    let poiMarkers = []; // 兴趣点标记
    const isSearching = ref(false);

    // 检查POI是否已存在
    const isPoiExists = (id) => {
      return pois.value.some(poi => poi.id === id);
    };

    // 搜索POI
    const searchPOIs = async () => {
      console.log('搜索按钮被点击');
      console.log('搜索关键词:', searchKeyword.value);
      
      const apiKey = window.APP_CONFIG?.AMAP_KEY;
      console.log('使用环境变量中的API密钥:', apiKey ? `${apiKey.substring(0, 8)}...` : '未配置');
      
      if (!searchKeyword.value.trim()) {
        console.log('搜索关键词为空');
        window.notificationService?.showWarning('请输入搜索关键词');
        return;
      }

      if (!apiKey) {
        window.notificationService?.showError('未配置高德地图 API Key');
        return;
      }

      isSearching.value = true;
      searchResults.value = [];
      console.log('开始搜索...');

      try {
        // 使用高德地图API搜索
        const apiUrl = `https://restapi.amap.com/v3/place/text?key=${apiKey}&keywords=${encodeURIComponent(searchKeyword.value)}&city=北京&offset=20&page=1&extensions=all`;
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('响应状态:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API响应数据:', data);
          
          if (data.status === '1' && data.pois) {
            searchResults.value = data.pois.map(poi => ({
              id: poi.id,
              name: poi.name,
              address: poi.address,
              location: poi.location,
              tel: poi.tel,
              type: poi.type,
              typecode: poi.typecode
            }));
            console.log('搜索结果数量:', searchResults.value.length);
            
            // 标记搜索结果并自动缩放到第一个结果
            await nextTick();
            markSearchResults();
            
            if (searchResults.value.length === 0) {
              window.notificationService?.showInfo('未找到相关地点');
            } else {
              window.notificationService?.showSuccess(`找到 ${searchResults.value.length} 个结果`);
            }
          } else {
            console.error('API返回错误:', data);
            window.notificationService?.showError(`搜索失败: ${data.info || '未知错误'}`);
          }
        } else {
          const errorText = await response.text();
          console.error('HTTP错误:', response.status, errorText);
          window.notificationService?.showError(`搜索失败: ${response.status}`);
        }
      } catch (error) {
        console.error('Search failed:', error);
        window.notificationService?.showError(`搜索失败: ${error.message}`);
      } finally {
        isSearching.value = false;
        console.log('搜索完成');
      }
    };

    // 标记搜索结果
    const markSearchResults = () => {
      // 清除之前的搜索标记
      searchMarkers.forEach(marker => marker.setMap(null));
      searchMarkers = [];

      if (searchResults.value.length === 0) return;

      searchResults.value.forEach((place, index) => {
        const [lng, lat] = place.location.split(',').map(Number);
        const marker = new AMap.Marker({
          position: [lng, lat],
          title: place.name,
          label: {
            content: `${index + 1}`,
            offset: new AMap.Pixel(-5, -5)
          },
          icon: new AMap.Icon({
            size: new AMap.Size(24, 24),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
            imageSize: new AMap.Size(24, 24)
          })
        });
        
        // 添加点击事件
        marker.on('click', () => {
          selectSearchResult(place);
        });
        
        marker.setMap(map);
        searchMarkers.push(marker);
      });

      // 自动缩放到第一个搜索结果
      if (searchResults.value.length > 0) {
        const firstPlace = searchResults.value[0];
        const [lng, lat] = firstPlace.location.split(',').map(Number);
        map.setCenter([lng, lat]);
        map.setZoom(14);
      }
    };

    // 选择搜索结果
    const selectSearchResult = (place) => {
      console.log('选择搜索结果:', place.name);
      const [lng, lat] = place.location.split(',').map(Number);
      map.setCenter([lng, lat]);
      map.setZoom(16);
      
      // 平滑移动到目标位置
      map.panTo([lng, lat]);
    };

    // 选择兴趣点
    const selectPoi = (poi) => {
      console.log('选择兴趣点:', poi.name);
      const [lng, lat] = poi.location.split(',').map(Number);
      map.setCenter([lng, lat]);
      map.setZoom(16);
      
      // 平滑移动到目标位置
      map.panTo([lng, lat]);
    };

    // 居中地图到指定位置（保持原有功能）
    const centerMap = (location) => {
      const [lng, lat] = location.split(',').map(Number);
      map.setCenter([lng, lat]);
      map.setZoom(16);
    };

    // 添加兴趣点
    const addPoi = async (place) => {
      if (isPoiExists(place.id)) {
        window.notificationService?.showInfo('该景点已在兴趣点列表中');
        return;
      }

      try {
        const newPoi = await poiService.create(place);
        pois.value.push(newPoi);
        window.notificationService?.showSuccess(`${place.name} 已添加到兴趣点`);
        
        // 重新标记所有兴趣点
        await nextTick();
        markPoiMarkers();
      } catch (error) {
        console.error('添加兴趣点失败:', error);
        window.notificationService?.showError(`添加失败: ${error.message}`);
      }
    };

    // 移除兴趣点
    const removePoi = async (id) => {
      const poiToRemove = pois.value.find(poi => poi.id === id);
      if (!poiToRemove) return;

      if (!window.confirm(`确定要移除 "${poiToRemove.name}" 吗？`)) {
        return;
      }

      try {
        await poiService.delete(id);
        pois.value = pois.value.filter(poi => poi.id !== id);
        window.notificationService?.showSuccess(`${poiToRemove.name} 已移除`);
        
        // 重新标记所有兴趣点
        await nextTick();
        markPoiMarkers();
      } catch (error) {
        console.error('移除兴趣点失败:', error);
        window.notificationService?.showError(`移除失败: ${error.message}`);
      }
    };

    // 标记兴趣点
    const markPoiMarkers = () => {
      // 清除之前的兴趣点标记
      poiMarkers.forEach(marker => marker.setMap(null));
      poiMarkers = [];

      pois.value.forEach((poi, index) => {
        const [lng, lat] = poi.location.split(',').map(Number);
        const marker = new AMap.Marker({
          position: [lng, lat],
          title: poi.name,
          label: {
            content: `★${index + 1}`,
            offset: new AMap.Pixel(-8, -8)
          },
          icon: new AMap.Icon({
            size: new AMap.Size(28, 28),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
            imageSize: new AMap.Size(28, 28)
          })
        });
        
        // 添加点击事件
        marker.on('click', () => {
          selectPoi(poi);
        });
        
        marker.setMap(map);
        poiMarkers.push(marker);
      });
    };

    // 加载兴趣点
    const loadPois = async () => {
      try {
        pois.value = await poiService.getAll();
        console.log('加载兴趣点数量:', pois.value.length);
        window.notificationService?.showSuccess(`成功加载${pois.value.length}条兴趣点`);
        
        // 标记兴趣点
        await nextTick();
        markPoiMarkers();
      } catch (error) {
        console.error('加载兴趣点失败:', error);
        window.notificationService?.showError(`加载失败: ${error.message}`);
      }
    };

    // 初始化地图
    const initMap = () => {
      nextTick(() => {
        try {
          map = new AMap.Map(mapContainer.value, {
            zoom: 10,
            center: [116.397428, 39.90923], // 默认北京
            mapStyle: 'amap://styles/normal' // 设置地图样式
          });
          
          console.log('地图初始化完成');
          window.notificationService?.showSuccess('地图加载成功！');
        } catch (error) {
          console.error('地图初始化失败:', error);
          window.notificationService?.showError('地图加载失败，请刷新页面重试');
        }
      });
    };

    // 组件挂载时初始化
    onMounted(() => {
      console.log('PoisView组件挂载');
      initMap();
      loadPois();
    });

    // 监听搜索结果变化，自动标记
    watch(searchResults, () => {
      nextTick(() => {
        markSearchResults();
      });
    });

    // 监听兴趣点变化，自动标记
    watch(pois, () => {
      nextTick(() => {
        markPoiMarkers();
      });
    }, { deep: true });

    return {
      searchKeyword,
      searchResults,
      pois,
      mapContainer,
      resultsList,
      poisList,
      isPoiExists,
      searchPOIs,
      centerMap,
      addPoi,
      removePoi,
      selectSearchResult,
      selectPoi
    };
  }
};
</script>

<style scoped>
.pois-container {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  height: calc(100vh - 120px);
  gap: 1rem;
  padding: 1rem;
  overflow: hidden; /* 防止整个容器滚动 */
}

.search-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
  overflow: hidden; /* 防止溢出 */
}

.search-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-shrink: 0; /* 防止搜索框被压缩 */
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 25px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #667eea;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.search-btn:hover {
  transform: translateY(-2px);
}

.results-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

.results-list::-webkit-scrollbar {
  width: 6px;
}

.results-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-item:last-child {
  border-bottom: none;
}

.result-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.result-info p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.add-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.add-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.add-btn:disabled {
  background: #667eea;
  color: white;
  cursor: default;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.map-section {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
}

#map-container {
  width: 100%;
  height: 100%;
}

.pois-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
  overflow: hidden; /* 防止溢出 */
}

.pois-section h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.25rem;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.pois-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

.pois-list::-webkit-scrollbar {
  width: 6px;
}

.pois-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.pois-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.pois-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.poi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.poi-item:hover {
  background-color: #f8f9fa;
}

.poi-item:last-child {
  border-bottom: none;
}

.poi-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.poi-info p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #ff6b6b;
  background: white;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.remove-btn:hover {
  background: #ff6b6b;
  color: white;
  transform: scale(1.1);
}

.no-pois {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}
</style>
