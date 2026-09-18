<template>
  <section class="route-map" aria-label="行程地图">
    <div ref="mapElement" class="route-map__canvas" :class="{ 'is-fallback': !mapReady }"></div>
    <div v-if="!mapReady" class="map-fallback">
      <div class="map-grid" aria-hidden="true"></div>
      <svg v-if="fallbackMarkers.length" class="fallback-markers" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <g v-for="marker in fallbackMarkers" :key="marker.id">
          <circle :cx="marker.x" :cy="marker.y" r="2.7" class="fallback-dot" />
          <text :x="marker.x" :y="marker.y + 0.8" class="fallback-number">{{ marker.index + 1 }}</text>
        </g>
      </svg>
      <div class="map-fallback__message">
        <span class="map-status-dot"></span>
        <div>
          <strong>{{ stops.length ? `${stops.length} 个地点已定位` : '地图等待地点' }}</strong>
          <p>配置高德 Key 后显示真实底图与路线；未获取路线时不会用直线代替。</p>
        </div>
      </div>
    </div>
    <div class="map-legend">
      <span><i class="legend-pin"></i>{{ cityName || '当前城市' }}</span>
      <span>{{ readyRouteCount }}/{{ segments.length }} 条真实路线</span>
    </div>
  </section>
</template>

<script>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { normalizeLocation } from '../domain/trip';

export default {
  name: 'RouteMap',
  props: {
    stops: { type: Array, default: () => [] },
    segments: { type: Array, default: () => [] },
    cityName: { type: String, default: '' },
    center: { type: Object, default: null },
    searchResults: { type: Array, default: () => [] }
  },
  emits: ['map-point', 'select-result'],
  setup(props, { emit }) {
    const mapElement = ref(null);
    const mapReady = ref(false);
    let map = null;
    let overlays = [];

    const allLocations = computed(() => props.stops
      .map((stop) => ({ id: stop.id, location: normalizeLocation(stop.location) }))
      .filter((item) => item.location));

    const fallbackMarkers = computed(() => {
      if (!allLocations.value.length) return [];
      const lngs = allLocations.value.map((item) => item.location.lng);
      const lats = allLocations.value.map((item) => item.location.lat);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      return allLocations.value.map((item, index) => ({
        ...item,
        index,
        x: 15 + ((item.location.lng - minLng) / (maxLng - minLng || 1)) * 70,
        y: 85 - ((item.location.lat - minLat) / (maxLat - minLat || 1)) * 70
      }));
    });

    const readyRouteCount = computed(() => props.segments.filter((segment) => (
      segment.route?.status === 'ready' && segment.route?.path?.length > 1
    )).length);

    function clearOverlays() {
      if (map && overlays.length) map.remove(overlays);
      overlays = [];
    }

    function renderMap() {
      if (!map || !globalThis.AMap) return;
      clearOverlays();
      const boundsItems = [];
      props.stops.forEach((stop, index) => {
        const location = normalizeLocation(stop.location);
        if (!location) return;
        const marker = new globalThis.AMap.Marker({
          position: [location.lng, location.lat],
          title: stop.name,
          label: { content: `<span class="map-marker-label">${index + 1}</span>`, offset: new globalThis.AMap.Pixel(-9, -34) }
        });
        overlays.push(marker);
        boundsItems.push(marker);
      });
      props.searchResults.forEach((result) => {
        const location = normalizeLocation(result.location);
        if (!location) return;
        const marker = new globalThis.AMap.Marker({
          position: [location.lng, location.lat],
          title: result.name,
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
        });
        marker.on('click', () => emit('select-result', result));
        overlays.push(marker);
        boundsItems.push(marker);
      });
      props.segments.forEach((segment) => {
        if (segment.route?.status !== 'ready' || segment.route.path.length < 2) return;
        const polyline = new globalThis.AMap.Polyline({
          path: segment.route.path,
          strokeColor: '#1f6b52',
          strokeWeight: 6,
          strokeOpacity: 0.9,
          showDir: true,
          lineJoin: 'round'
        });
        overlays.push(polyline);
        boundsItems.push(polyline);
      });
      if (overlays.length) map.add(overlays);
      if (boundsItems.length) map.setFitView(boundsItems, false, [72, 72, 72, 72]);
      else if (props.center) map.setCenter([props.center.lng, props.center.lat]);
    }

    function initialize() {
      if (!mapElement.value || !globalThis.AMap) return;
      try {
        const center = props.center || { lng: 116.397428, lat: 39.90923 };
        map = new globalThis.AMap.Map(mapElement.value, {
          zoom: 12,
          center: [center.lng, center.lat],
          mapStyle: 'amap://styles/normal',
          resizeEnable: true
        });
        map.on('click', (event) => {
          const location = normalizeLocation(event.lnglat);
          emit('map-point', { name: '地图选点', address: '在地图上选择的位置', location, type: '自定义地点', source: 'map-click' });
        });
        mapReady.value = true;
        renderMap();
      } catch (error) {
        mapReady.value = false;
      }
    }

    onMounted(async () => {
      await nextTick();
      initialize();
      if (!mapReady.value) setTimeout(initialize, 1200);
    });
    onBeforeUnmount(() => map?.destroy());
    watch(() => [props.stops, props.segments, props.searchResults, props.center], () => renderMap(), { deep: true });

    return { mapElement, mapReady, fallbackMarkers, readyRouteCount };
  }
};
</script>

<style scoped>
.route-map { position: relative; min-height: 100%; overflow: hidden; background: #e7ece6; }
.route-map__canvas { position: absolute; inset: 0; z-index: 1; }
.route-map__canvas.is-fallback { display: none; }
.map-fallback { position: absolute; inset: 0; overflow: hidden; background: #e8ede7; }
.map-grid { position: absolute; inset: -20%; transform: rotate(-8deg) scale(1.2); opacity: .72; background-image: linear-gradient(rgba(89,111,99,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(89,111,99,.14) 1px, transparent 1px), linear-gradient(32deg, transparent 48%, rgba(255,255,255,.85) 49%, rgba(255,255,255,.85) 51%, transparent 52%); background-size: 52px 52px, 52px 52px, 170px 170px; }
.fallback-markers { position: absolute; inset: 4%; width: 92%; height: 92%; overflow: visible; }
.fallback-dot { fill: #1f6b52; stroke: #fff; stroke-width: .8; vector-effect: non-scaling-stroke; }
.fallback-number { fill: white; font-size: 2.7px; font-weight: 700; text-anchor: middle; }
.map-fallback__message { position: absolute; left: 24px; bottom: 24px; display: flex; gap: 12px; max-width: 360px; padding: 14px 16px; color: #26372e; background: rgba(248,249,246,.92); border: 1px solid rgba(38,55,46,.12); box-shadow: 0 12px 32px rgba(38,55,46,.12); border-radius: 12px; backdrop-filter: blur(10px); }
.map-fallback__message strong { display: block; margin-bottom: 3px; font-size: 14px; }
.map-fallback__message p { margin: 0; color: #66736b; font-size: 12px; line-height: 1.5; }
.map-status-dot { flex: 0 0 auto; width: 8px; height: 8px; margin-top: 5px; background: #d09b48; border-radius: 50%; box-shadow: 0 0 0 4px rgba(208,155,72,.16); }
.map-legend { position: absolute; z-index: 3; top: 18px; right: 18px; display: flex; gap: 18px; padding: 10px 12px; font-size: 12px; color: #44534b; background: rgba(250,250,247,.9); border: 1px solid rgba(38,55,46,.12); border-radius: 10px; backdrop-filter: blur(12px); }
.map-legend span { display: flex; align-items: center; gap: 7px; }
.legend-pin { width: 7px; height: 7px; background: #1f6b52; border-radius: 50%; }
:global(.map-marker-label) { display: grid; width: 25px; height: 25px; place-items: center; color: #fff; font: 700 12px/1 sans-serif; background: #1f6b52; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 3px 8px rgba(20,54,42,.28); }
</style>
