import { cityCenter, normalizeLocation } from '../domain/trip';

const DEMO_PLACES = [
  ['北京', '故宫博物院', '东城区景山前街4号', 116.397, 39.916, '景点'],
  ['北京', '天坛公园', '东城区天坛东里甲1号', 116.417, 39.883, '景点'],
  ['北京', '颐和园', '海淀区新建宫门路19号', 116.273, 39.999, '景点'],
  ['南京', '中山陵', '玄武区石象路7号', 118.849, 32.058, '景点'],
  ['南京', '南京博物院', '玄武区中山东路321号', 118.822, 32.041, '景点'],
  ['南京', '老门东', '秦淮区箍桶巷', 118.793, 32.013, '餐饮'],
  ['苏州', '拙政园', '姑苏区东北街178号', 120.630, 31.326, '景点'],
  ['苏州', '苏州博物馆', '姑苏区东北街204号', 120.627, 31.324, '景点'],
  ['上海', '上海博物馆东馆', '浦东新区世纪大道1952号', 121.545, 31.228, '景点'],
  ['上海', '外滩', '黄浦区中山东一路', 121.490, 31.241, '景点'],
  ['上海', '上海虹桥站', '闵行区申贵路1500号', 121.327, 31.200, '车站']
].map(([city, name, address, lng, lat, type], index) => ({
  id: `demo_${index}`,
  city,
  name,
  address,
  location: { lng, lat },
  type,
  source: 'offline-catalog'
}));

function amapSearch(keyword, city) {
  return new Promise((resolve, reject) => {
    if (!globalThis.AMap) return reject(new Error('地图搜索服务尚未加载'));
    globalThis.AMap.plugin('AMap.PlaceSearch', () => {
      const searcher = new globalThis.AMap.PlaceSearch({ city, citylimit: Boolean(city), pageSize: 8 });
      searcher.search(keyword, (status, result) => {
        if (status !== 'complete') return reject(new Error(result?.info || '没有找到地点'));
        const pois = result.poiList?.pois || [];
        resolve(pois.map((poi) => ({
          id: poi.id,
          placeId: poi.id,
          name: poi.name,
          address: [poi.pname, poi.cityname, poi.adname, poi.address].filter(Boolean).join(' '),
          location: normalizeLocation(poi.location),
          type: poi.type,
          tel: poi.tel,
          source: 'amap'
        })));
      });
    });
  });
}

class PlaceSearchService {
  async search(keyword, city = '') {
    const query = String(keyword || '').trim();
    if (!query) return [];
    try {
      const results = await amapSearch(query, city);
      if (results.length) return results;
    } catch (error) {
      // Offline catalog keeps the main flow usable without a configured provider.
    }
    const localResults = DEMO_PLACES.filter((place) => (
      (!city || place.city.includes(city) || city.includes(place.city))
      && `${place.name}${place.address}${place.type}`.toLowerCase().includes(query.toLowerCase())
    ));
    if (localResults.length) return localResults;

    const center = cityCenter(city);
    return [{
      id: `manual_${Date.now()}`,
      name: query,
      address: `${city || '当前城市'} · 待确认具体地址`,
      location: center,
      type: '自定义地点',
      source: 'manual-search'
    }];
  }
}

export default new PlaceSearchService();
