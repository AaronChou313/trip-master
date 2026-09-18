import { normalizeLocation } from '../domain/trip';

const SPEED_METERS_PER_MINUTE = {
  walking: 75,
  cycling: 240,
  driving: 420,
  transit: 300
};

function haversine(from, to) {
  const earthRadius = 6371000;
  const radians = (degree) => degree * Math.PI / 180;
  const deltaLat = radians(to.lat - from.lat);
  const deltaLng = radians(to.lng - from.lng);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(deltaLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

function flattenPath(steps = []) {
  return steps.flatMap((step) => (step.path || []).map((point) => {
    const location = normalizeLocation(point);
    return location ? [location.lng, location.lat] : null;
  }).filter(Boolean));
}

function amapRoute(mode, from, to, cityName) {
  return new Promise((resolve, reject) => {
    if (!globalThis.AMap) return reject(new Error('地图路线服务尚未加载'));
    const pluginMap = {
      walking: ['AMap.Walking', 'Walking'],
      cycling: ['AMap.Riding', 'Riding'],
      driving: ['AMap.Driving', 'Driving'],
      transit: ['AMap.Transfer', 'Transfer']
    };
    const [plugin, constructor] = pluginMap[mode] || pluginMap.walking;
    globalThis.AMap.plugin(plugin, () => {
      const options = { hideMarkers: true, autoFitView: false, map: null, city: cityName };
      const planner = new globalThis.AMap[constructor](options);
      planner.search([from.lng, from.lat], [to.lng, to.lat], (status, result) => {
        if (status !== 'complete') return reject(new Error(result?.info || '路线规划失败'));
        const route = result.routes?.[0] || result.plans?.[0];
        if (!route) return reject(new Error('没有可用路线'));
        resolve({
          provider: 'amap',
          status: 'ready',
          distanceMeters: Number(route.distance || 0),
          durationMinutes: Math.max(1, Math.round(Number(route.time || 0) / 60)),
          path: flattenPath(route.steps || route.segments || [])
        });
      });
    });
  });
}

class RouteService {
  async plan(segment, fromStop, toStop, cityName = '') {
    const from = normalizeLocation(fromStop.location);
    const to = normalizeLocation(toStop.location);
    if (!from || !to) {
      return { ...segment, route: { provider: 'pending', status: 'needs_location', path: [] } };
    }

    try {
      const route = await amapRoute(segment.mode, from, to, cityName);
      return {
        ...segment,
        distanceMeters: route.distanceMeters,
        durationMinutes: route.durationMinutes,
        route
      };
    } catch (error) {
      const directDistance = haversine(from, to);
      const roadFactor = segment.mode === 'walking' ? 1.18 : 1.32;
      const distanceMeters = Math.round(directDistance * roadFactor);
      return {
        ...segment,
        distanceMeters,
        durationMinutes: Math.max(1, Math.round(distanceMeters / (SPEED_METERS_PER_MINUTE[segment.mode] || 250))),
        route: {
          provider: 'estimate',
          status: 'estimated',
          path: [],
          message: '等待地图路线服务；当前只估算距离与时间，地图不绘制直线替代路线。'
        }
      };
    }
  }

  async planDay(day) {
    const byId = new Map(day.stops.map((stop) => [stop.id, stop]));
    day.segments = await Promise.all(day.segments.map((segment) => (
      this.plan(segment, byId.get(segment.fromId), byId.get(segment.toId), day.cityName)
    )));
    return day.segments;
  }
}

export default new RouteService();
