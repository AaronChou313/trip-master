<template>
  <main v-if="trip" class="workspace" id="main-content">
    <header class="workspace-header">
      <router-link to="/" class="back-link">← 我的旅行</router-link>
      <div class="trip-identity">
        <input v-model="trip.name" class="trip-title-input" aria-label="旅行名称" @change="persist">
        <span>{{ tripRange }}</span>
      </div>
      <nav class="workspace-tabs" aria-label="工作台视图">
        <button v-for="item in tabs" :key="item.value" :class="{ active: activeTab === item.value }" @click="activeTab = item.value">{{ item.label }}</button>
      </nav>
      <div class="workspace-summary">
        <span>预计</span><strong>¥{{ budget.total.estimated.toLocaleString('zh-CN') }}</strong>
        <span class="save-state">{{ saveState }}</span>
        <button class="more-action" title="导出旅行" @click="exportTrip">导出</button>
      </div>
    </header>

    <div v-if="activeTab === 'itinerary'" class="planner-layout">
      <aside class="timeline-panel">
        <section class="city-rail" aria-label="城市停留">
          <button v-for="(stay, index) in trip.cityStays" :key="stay.id" :class="{ active: selectedStay?.id === stay.id }" @click="selectStay(stay)">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>{{ stay.cityName }}
          </button>
          <button class="city-add" title="添加城市" @click="showCityForm = !showCityForm">＋</button>
        </section>
        <form v-if="showCityForm" class="quick-form" @submit.prevent="addCity">
          <input v-model.trim="newCityName" placeholder="城市名称" autofocus required>
          <button>添加</button>
        </form>

        <section v-if="selectedStay" class="day-context">
          <div class="context-heading">
            <div>
              <p>{{ selectedStay.cityName }} · {{ selectedStay.days.length }} 天</p>
              <h2>{{ selectedDay?.date ? formatDate(selectedDay.date) : selectedDay?.label }}</h2>
            </div>
            <button class="small-action" @click="addDay">＋ 一天</button>
          </div>
          <div class="day-switcher">
            <button v-for="(day, index) in selectedStay.days" :key="day.id" :class="{ active: selectedDay?.id === day.id }" @click="selectedDayId = day.id">
              <span>Day {{ index + 1 }}</span><strong>{{ day.date ? shortDate(day.date) : '待定' }}</strong>
            </button>
          </div>
        </section>

        <section v-if="selectedDay" class="timeline-content">
          <div class="timeline-toolbar">
            <span>{{ selectedDay.stops.length }} 个地点</span>
            <button :disabled="selectedDay.stops.length < 3 || routeBusy" @click="optimizeDay">{{ routeBusy ? '计算中…' : '优化顺序' }}</button>
          </div>
          <div v-if="!selectedDay.stops.length" class="timeline-empty">
            <span>01</span>
            <h3>从地图加入第一个地点</h3>
            <p>在右侧搜索景点、餐厅、酒店或车站，结果可以直接加入今天。</p>
          </div>
          <div v-else class="stop-list">
            <template v-for="(stop, index) in selectedDay.stops" :key="stop.id">
              <article class="stop-card" :class="{ dragging: dragIndex === index }" draggable="true" @dragstart="startDrag(index, $event)" @dragenter.prevent @dragover.prevent @drop.prevent="dropStop(index)" @dragend="dragIndex = null">
                <button class="drag-handle" aria-label="拖动排序" title="拖动排序">⠿</button>
                <span class="stop-index">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="stop-main" @click="editingStopId = editingStopId === stop.id ? '' : stop.id">
                  <div class="stop-title-row"><h3>{{ stop.name }}</h3><span>{{ stop.arrivalTime || '时间待定' }}</span></div>
                  <p>{{ typeLabel(stop.type) }} · {{ durationLabel(stop.durationMinutes) }}<template v-if="stop.cost.estimated"> · ¥{{ stop.cost.estimated }}</template></p>
                </div>
                <button class="lock-action" :class="{ active: stop.locked }" :title="stop.locked ? '取消锁定' : '锁定时间'" @click="stop.locked = !stop.locked; persist()">{{ stop.locked ? '锁定' : '可移动' }}</button>
                <div v-if="editingStopId === stop.id" class="stop-editor">
                  <label>到达 <input v-model="stop.arrivalTime" type="time" @change="persist"></label>
                  <label>停留 <input v-model.number="stop.durationMinutes" type="number" min="0" step="15" @change="persist"> 分钟</label>
                  <label>类型 <select v-model="stop.type" @change="persist"><option v-for="type in stopTypes" :key="type.value" :value="type.value">{{ type.label }}</option></select></label>
                  <label>预计 ¥ <input v-model.number="stop.cost.estimated" type="number" min="0" @change="persist"></label>
                  <textarea v-model="stop.notes" placeholder="预约码、入口或其他备注" @change="persist"></textarea>
                  <button class="remove-action" @click="removeStop(index)">移出当天</button>
                </div>
              </article>
              <article v-if="selectedDay.segments[index]" class="segment-card">
                <span class="segment-line"></span>
                <select v-model="selectedDay.segments[index].mode" aria-label="交通方式" @change="refreshSegment(index)">
                  <option v-for="mode in localModes" :key="mode.value" :value="mode.value">{{ mode.label }}</option>
                </select>
                <span>{{ selectedDay.segments[index].durationMinutes || '—' }} min</span>
                <label>¥ <input v-model.number="selectedDay.segments[index].cost.estimated" type="number" min="0" aria-label="交通预计费用" @change="persist"></label>
                <small :class="selectedDay.segments[index].route?.status">{{ routeStatus(selectedDay.segments[index]) }}</small>
              </article>
            </template>
          </div>
        </section>

        <section v-if="nextIntercitySegment" class="intercity-card">
          <div><span>下一站</span><strong>{{ nextIntercitySegment.fromName }} → {{ nextIntercitySegment.toName }}</strong></div>
          <select v-model="nextIntercitySegment.mode" @change="persist"><option v-for="mode in intercityModes" :key="mode.value" :value="mode.value">{{ mode.label }}</option></select>
          <label><input v-model.number="nextIntercitySegment.durationMinutes" type="number" min="0" @change="persist"> 分钟</label>
          <label>¥ <input v-model.number="nextIntercitySegment.cost.estimated" type="number" min="0" @change="persist"></label>
        </section>

        <section class="wishlist">
          <button class="wishlist__heading" @click="wishlistOpen = !wishlistOpen"><span>想去地点 <b>{{ trip.wishlist.length }}</b></span><span>{{ wishlistOpen ? '收起' : '展开' }}</span></button>
          <div v-if="wishlistOpen" class="wishlist__items">
            <p v-if="!trip.wishlist.length">搜索地点时点星标，可先放在这里。</p>
            <div v-for="item in trip.wishlist" :key="item.id"><span>{{ item.name }}</span><button @click="addWishlistToDay(item)">加入今天</button></div>
          </div>
        </section>
      </aside>

      <section class="map-workspace">
        <form class="map-search" @submit.prevent="searchPlaces">
          <span aria-hidden="true">⌕</span>
          <input v-model="searchQuery" :placeholder="`搜索${selectedStay?.cityName || ''}的景点、餐厅、酒店、车站`" aria-label="搜索地点">
          <button :disabled="searching">{{ searching ? '搜索中' : '搜索' }}</button>
        </form>
        <div v-if="searchResults.length || selectedMapPoint" class="search-results">
          <div class="results-heading"><strong>{{ selectedMapPoint ? '地图选点' : `搜索结果 · ${searchResults.length}` }}</strong><button @click="clearSearch">关闭</button></div>
          <article v-for="place in visibleSearchResults" :key="place.id">
            <div><h3>{{ place.name }}</h3><p>{{ place.address || '暂无地址' }}</p></div>
            <button class="wish-button" :title="'加入想去'" @click="addToWishlist(place)">☆</button>
            <button class="add-stop-button" @click="addPlaceToDay(place)">加入 {{ selectedDayLabel }}</button>
          </article>
        </div>
        <RouteMap :stops="selectedDay?.stops || []" :segments="selectedDay?.segments || []" :center="selectedStay?.center" :city-name="selectedStay?.cityName" :search-results="searchResults" @map-point="selectMapPoint" @select-result="selectSearchResult" />
        <div v-if="routeBusy" class="route-progress">正在更新 Segment 与地图路线…</div>
      </section>
    </div>

    <section v-else-if="activeTab === 'budget'" class="detail-view budget-view">
      <div class="detail-intro"><p class="eyebrow">由行程自动汇总</p><h1>预算总览</h1><p>修改 Stop、住宿或 Segment 金额后，这里立即更新。无需再同步。</p></div>
      <div class="budget-totals">
        <div><span>预计预算</span><strong>¥{{ budget.total.estimated.toLocaleString('zh-CN') }}</strong></div>
        <div><span>已确认</span><strong>¥{{ budget.total.confirmed.toLocaleString('zh-CN') }}</strong></div>
        <div><span>实际支出</span><strong>¥{{ budget.total.actual.toLocaleString('zh-CN') }}</strong></div>
      </div>
      <div class="budget-breakdown">
        <article v-for="category in budgetCategories" :key="category.value"><span>{{ category.label }}</span><div class="budget-bar"><i :style="{ width: budgetPercent(category.value) + '%' }"></i></div><strong>¥{{ budget[category.value].estimated.toLocaleString('zh-CN') }}</strong></article>
      </div>
      <section class="accommodation-editor">
        <div class="section-title"><h2>住宿</h2><p>住宿属于 CityStay，并参与自动统计。</p></div>
        <div v-for="stay in trip.cityStays" :key="stay.id" class="accommodation-row">
          <strong>{{ stay.cityName }}</strong>
          <input :value="stay.accommodation?.name || ''" placeholder="酒店或住宿区域" @change="updateAccommodation(stay, 'name', $event.target.value)">
          <label>预计 ¥ <input :value="stay.accommodation?.cost?.estimated || 0" type="number" min="0" @change="updateAccommodation(stay, 'estimated', Number($event.target.value))"></label>
        </div>
      </section>
    </section>

    <section v-else class="detail-view notes-view">
      <div class="detail-intro"><p class="eyebrow">旅行内部资料</p><h1>资料与备注</h1><p>订单、预约码和打包清单跟随整份 Trip 保存。</p></div>
      <textarea v-model="trip.notes" placeholder="例如：故宫预约、酒店订单号、证件与装备清单……" @input="scheduleSave"></textarea>
    </section>
  </main>
  <main v-else class="workspace-loading">{{ loadError || '正在打开旅行…' }}</main>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RouteMap from '../components/RouteMap.vue';
import { INTERCITY_MODES, LOCAL_MODES, STOP_TYPES, calculateBudget, createCityStay, createDay, createStop, normalizeCost, rebuildDaySegments, rebuildIntercitySegments, uid } from '../domain/trip';
import placeSearchService from '../services/placeSearchService';
import routeService from '../services/routeService';
import tripRepository from '../services/tripRepository';

export default {
  name: 'WorkspaceView',
  components: { RouteMap },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const trip = ref(null);
    const loadError = ref('');
    const activeTab = ref('itinerary');
    const selectedStayId = ref('');
    const selectedDayId = ref('');
    const showCityForm = ref(false);
    const newCityName = ref('');
    const searchQuery = ref('');
    const searchResults = ref([]);
    const selectedMapPoint = ref(null);
    const searching = ref(false);
    const routeBusy = ref(false);
    const dragIndex = ref(null);
    const editingStopId = ref('');
    const wishlistOpen = ref(false);
    const saveState = ref('已保存到本地');
    let saveTimer;

    const tabs = [{ value: 'itinerary', label: '行程' }, { value: 'budget', label: '预算' }, { value: 'notes', label: '资料' }];
    const budgetCategories = [
      { value: 'transport', label: '交通' }, { value: 'accommodation', label: '住宿' },
      { value: 'attractions', label: '景点' }, { value: 'food', label: '餐饮' }, { value: 'other', label: '其他' }
    ];
    const selectedStay = computed(() => trip.value?.cityStays.find((stay) => stay.id === selectedStayId.value) || trip.value?.cityStays[0]);
    const selectedDay = computed(() => selectedStay.value?.days.find((day) => day.id === selectedDayId.value) || selectedStay.value?.days[0]);
    const selectedDayLabel = computed(() => selectedDay.value?.date ? formatDate(selectedDay.value.date) : selectedDay.value?.label || '今天');
    const budget = computed(() => trip.value ? calculateBudget(trip.value) : calculateBudget({ cityStays: [] }));
    const tripRange = computed(() => {
      if (!trip.value?.startDate) return '日期待定';
      return trip.value.endDate ? `${trip.value.startDate} — ${trip.value.endDate}` : trip.value.startDate;
    });
    const visibleSearchResults = computed(() => selectedMapPoint.value ? [selectedMapPoint.value] : searchResults.value);
    const nextIntercitySegment = computed(() => {
      const index = trip.value?.cityStays.findIndex((stay) => stay.id === selectedStay.value?.id) ?? -1;
      return index >= 0 ? trip.value.intercitySegments[index] : null;
    });

    async function loadTrip() {
      trip.value = await tripRepository.get(route.params.id);
      if (!trip.value) {
        loadError.value = '没有找到这份旅行';
        setTimeout(() => router.replace('/'), 1200);
        return;
      }
      selectedStayId.value = trip.value.cityStays[0]?.id || '';
      selectedDayId.value = trip.value.cityStays[0]?.days[0]?.id || '';
    }

    async function persist() {
      if (!trip.value) return;
      saveState.value = '保存中…';
      trip.value = await tripRepository.save(trip.value);
      saveState.value = '已保存到本地';
    }
    function scheduleSave() {
      saveState.value = '有未保存修改';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(persist, 450);
    }
    function selectStay(stay) {
      selectedStayId.value = stay.id;
      selectedDayId.value = stay.days[0]?.id || '';
      clearSearch();
    }
    async function addCity() {
      if (!newCityName.value) return;
      const stay = createCityStay(newCityName.value, trip.value.cityStays.length, '');
      trip.value.cityStays.push(stay);
      rebuildIntercitySegments(trip.value);
      showCityForm.value = false;
      newCityName.value = '';
      selectStay(stay);
      await persist();
    }
    async function addDay() {
      const stay = selectedStay.value;
      const day = createDay(stay.cityName, '', stay.days.length + 1);
      stay.days.push(day);
      selectedDayId.value = day.id;
      await persist();
    }
    async function searchPlaces() {
      if (!searchQuery.value.trim()) return;
      searching.value = true;
      selectedMapPoint.value = null;
      searchResults.value = await placeSearchService.search(searchQuery.value, selectedStay.value?.cityName || '');
      searching.value = false;
    }
    function clearSearch() { searchResults.value = []; selectedMapPoint.value = null; }
    function selectMapPoint(place) { selectedMapPoint.value = { ...place, id: uid('map') }; searchResults.value = []; }
    function selectSearchResult(place) { selectedMapPoint.value = place; }
    async function addPlaceToDay(place) {
      if (!selectedDay.value) return;
      selectedDay.value.stops.push(createStop(place));
      rebuildDaySegments(selectedDay.value);
      clearSearch();
      searchQuery.value = '';
      await refreshRoutes();
    }
    async function addToWishlist(place) {
      if (!trip.value.wishlist.some((item) => item.placeId && item.placeId === (place.placeId || place.id))) {
        trip.value.wishlist.push(createStop(place));
        await persist();
      }
    }
    async function addWishlistToDay(item) {
      await addPlaceToDay(item);
      trip.value.wishlist = trip.value.wishlist.filter((place) => place.id !== item.id);
      await persist();
    }
    function startDrag(index, event) {
      dragIndex.value = index;
      if (event?.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(index));
      }
    }
    async function dropStop(index) {
      if (dragIndex.value === null || dragIndex.value === index) return;
      const [moved] = selectedDay.value.stops.splice(dragIndex.value, 1);
      selectedDay.value.stops.splice(index, 0, moved);
      dragIndex.value = null;
      rebuildDaySegments(selectedDay.value);
      await refreshRoutes();
    }
    async function removeStop(index) {
      selectedDay.value.stops.splice(index, 1);
      editingStopId.value = '';
      rebuildDaySegments(selectedDay.value);
      await refreshRoutes();
    }
    async function refreshRoutes() {
      if (!selectedDay.value) return;
      routeBusy.value = true;
      await routeService.planDay(selectedDay.value);
      routeBusy.value = false;
      await persist();
    }
    async function refreshSegment(index) {
      const segment = selectedDay.value.segments[index];
      const byId = new Map(selectedDay.value.stops.map((stop) => [stop.id, stop]));
      routeBusy.value = true;
      selectedDay.value.segments[index] = await routeService.plan(segment, byId.get(segment.fromId), byId.get(segment.toId), selectedDay.value.cityName);
      routeBusy.value = false;
      await persist();
    }
    function distance(a, b) {
      if (!a?.location || !b?.location) return Infinity;
      return Math.hypot(a.location.lng - b.location.lng, a.location.lat - b.location.lat);
    }
    async function optimizeDay() {
      const stops = selectedDay.value.stops;
      const locked = new Map(stops.map((stop, index) => [index, stop]).filter(([, stop]) => stop.locked));
      const remaining = stops.filter((stop) => !stop.locked);
      const arranged = [];
      for (let index = 0; index < stops.length; index += 1) {
        if (locked.has(index)) { arranged[index] = locked.get(index); continue; }
        const previous = arranged[index - 1];
        remaining.sort((a, b) => distance(previous, a) - distance(previous, b));
        arranged[index] = remaining.shift();
      }
      selectedDay.value.stops = arranged;
      rebuildDaySegments(selectedDay.value);
      await refreshRoutes();
    }
    function updateAccommodation(stay, field, value) {
      if (!stay.accommodation) stay.accommodation = { id: uid('hotel'), name: '', cost: normalizeCost() };
      if (field === 'name') stay.accommodation.name = value;
      else stay.accommodation.cost[field] = value;
      persist();
    }
    function exportTrip() {
      const payload = tripRepository.exportTrip(trip.value);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${trip.value.name.replace(/[^\w\u4e00-\u9fa5-]+/g, '-')}.tripmaster.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    function budgetPercent(category) {
      return budget.value.total.estimated ? Math.round((budget.value[category].estimated / budget.value.total.estimated) * 100) : 0;
    }
    function formatDate(date) { return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${date}T12:00:00`)); }
    function shortDate(date) { return date.slice(5).replace('-', '/'); }
    function typeLabel(value) { return STOP_TYPES.find((item) => item.value === value)?.label || '地点'; }
    function durationLabel(minutes) { return minutes >= 60 ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}min` : ''}` : `${minutes || 0}min`; }
    function routeStatus(segment) {
      if (segment.route?.status === 'ready') return '真实路线';
      if (segment.route?.status === 'estimated') return '等待路线 API';
      return '待规划';
    }

    onMounted(loadTrip);
    return {
      trip, loadError, activeTab, tabs, selectedStay, selectedDay, selectedDayId, selectedDayLabel, nextIntercitySegment,
      tripRange, budget, budgetCategories, stopTypes: STOP_TYPES, localModes: LOCAL_MODES, intercityModes: INTERCITY_MODES,
      showCityForm, newCityName, searchQuery, searchResults, selectedMapPoint, visibleSearchResults, searching, routeBusy,
      dragIndex, editingStopId, wishlistOpen, saveState, selectStay, addCity, addDay, searchPlaces, clearSearch, selectMapPoint,
      selectSearchResult, addPlaceToDay, addToWishlist, addWishlistToDay, startDrag, dropStop, removeStop, refreshSegment,
      optimizeDay, updateAccommodation, exportTrip, persist, scheduleSave, budgetPercent, formatDate, shortDate, typeLabel,
      durationLabel, routeStatus
    };
  }
};
</script>

<style scoped>
.workspace { min-height: 100dvh; color: #243028; background: #f6f7f3; }
.workspace-header { position: relative; z-index: 10; display: grid; grid-template-columns: 140px minmax(190px, 1fr) auto minmax(230px, 1fr); align-items: center; min-height: 68px; padding: 0 24px; background: #fbfcf9; border-bottom: 1px solid #dde2dc; }
.back-link { color: #56635a; font-size: 13px; font-weight: 650; text-decoration: none; }
.trip-identity { display: flex; align-items: baseline; gap: 12px; min-width: 0; }
.trip-title-input { min-width: 0; width: min(270px, 24vw); padding: 0; color: #1f2b24; background: transparent; border: 0; font: 700 18px/1.2 inherit; letter-spacing: -.02em; }
.trip-identity span { color: #8a938c; font-size: 11px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.workspace-tabs { display: flex; align-self: stretch; }
.workspace-tabs button { position: relative; min-width: 66px; color: #7b847e; background: none; border: 0; font: inherit; font-size: 13px; font-weight: 650; cursor: pointer; }
.workspace-tabs button.active { color: #1f6b52; }
.workspace-tabs button.active::after { content: ''; position: absolute; right: 16px; bottom: 0; left: 16px; height: 2px; background: #1f6b52; }
.workspace-summary { display: flex; justify-content: flex-end; align-items: baseline; gap: 8px; font-size: 12px; color: #79827c; }
.workspace-summary strong { margin-right: 10px; color: #1f6b52; font: 700 18px/1 monospace; }
.save-state { color: #909891; }
.more-action { margin-left: 8px; padding: 7px 10px; color: #405047; background: #edf0eb; border: 0; border-radius: 6px; font: inherit; cursor: pointer; }
.planner-layout { display: grid; grid-template-columns: minmax(390px, 34%) 1fr; height: calc(100dvh - 68px); min-height: 620px; }
.timeline-panel { overflow: auto; background: #fbfcf9; border-right: 1px solid #dce1dc; }
.city-rail { position: sticky; z-index: 5; top: 0; display: flex; gap: 4px; padding: 14px 18px 10px; overflow-x: auto; background: rgba(251,252,249,.96); border-bottom: 1px solid #e4e7e2; backdrop-filter: blur(10px); }
.city-rail button { display: flex; align-items: center; gap: 6px; padding: 8px 11px; color: #677169; white-space: nowrap; background: transparent; border: 0; border-radius: 6px; font: inherit; font-size: 12px; font-weight: 650; cursor: pointer; }
.city-rail button span { color: #a0a7a1; font: 600 9px/1 monospace; }
.city-rail button.active { color: #f4f7f3; background: #29483a; }
.city-rail button.active span { color: #b9c9c0; }
.city-rail .city-add { padding-inline: 12px; color: #446052; background: #edf0eb; }
.quick-form { display: flex; gap: 8px; padding: 10px 18px; background: #eef1ec; }
.quick-form input { flex: 1; min-width: 0; }
.quick-form button { color: white; background: #1f6b52; }
.quick-form input, .quick-form button { min-height: 34px; padding: 0 10px; border: 1px solid #d2d9d3; border-radius: 6px; font: inherit; }
.day-context { padding: 22px 20px 14px; }
.context-heading { display: flex; align-items: end; justify-content: space-between; gap: 16px; }
.context-heading p { margin: 0 0 5px; color: #78827b; font-size: 11px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; }
.context-heading h2 { margin: 0; font-size: 24px; letter-spacing: -.035em; }
.small-action, .timeline-toolbar button { padding: 6px 9px; color: #536057; background: transparent; border: 1px solid #d5dbd5; border-radius: 6px; font: inherit; font-size: 11px; cursor: pointer; }
.day-switcher { display: flex; gap: 8px; margin-top: 18px; overflow-x: auto; }
.day-switcher button { display: grid; min-width: 70px; gap: 4px; padding: 9px 10px; text-align: left; color: #7a837d; background: #f0f2ed; border: 1px solid transparent; border-radius: 7px; cursor: pointer; }
.day-switcher button span { font-size: 9px; text-transform: uppercase; }
.day-switcher button strong { font: 650 12px/1 inherit; }
.day-switcher button.active { color: #1f6b52; background: #fff; border-color: #a9bdb1; }
.timeline-content { padding: 0 20px 24px; }
.timeline-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; color: #89918c; font-size: 11px; border-top: 1px solid #eceeea; }
.timeline-toolbar button:disabled { opacity: .45; }
.timeline-empty { padding: 54px 28px; text-align: center; background: #f1f3ee; border: 1px dashed #cbd2cc; border-radius: 10px; }
.timeline-empty > span { display: grid; width: 34px; height: 34px; margin: 0 auto 18px; place-items: center; color: white; background: #1f6b52; border-radius: 50%; font: 700 10px/1 monospace; }
.timeline-empty h3 { margin: 0 0 8px; font-size: 17px; }
.timeline-empty p { margin: 0; color: #768078; font-size: 12px; line-height: 1.6; }
.stop-card { position: relative; display: grid; grid-template-columns: 20px 32px 1fr auto; align-items: center; gap: 7px; min-height: 72px; padding: 10px 10px 10px 6px; background: #fff; border: 1px solid #dfe4de; border-radius: 9px; box-shadow: 0 5px 13px rgba(50,68,58,.04); transition: opacity .15s ease, transform .15s ease; }
.stop-card.dragging { opacity: .45; transform: scale(.99); }
.drag-handle { align-self: stretch; color: #a7aea8; background: transparent; border: 0; cursor: grab; font-size: 18px; }
.stop-index { display: grid; width: 28px; height: 28px; place-items: center; color: #fff; background: #1f6b52; border-radius: 50%; font: 700 10px/1 monospace; }
.stop-main { min-width: 0; cursor: pointer; }
.stop-title-row { display: flex; justify-content: space-between; gap: 12px; }
.stop-title-row h3 { overflow: hidden; margin: 0; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
.stop-title-row span { color: #1f6b52; font: 650 11px/1 monospace; }
.stop-main p { margin: 5px 0 0; color: #89918b; font-size: 10px; }
.lock-action { padding: 5px 7px; color: #8a928c; background: #f2f3f0; border: 0; border-radius: 5px; font: inherit; font-size: 9px; cursor: pointer; }
.lock-action.active { color: #815d24; background: #f5ead2; }
.stop-editor { grid-column: 2 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px 0 4px; border-top: 1px solid #eceeea; }
.stop-editor label { display: flex; align-items: center; gap: 5px; color: #747e77; font-size: 10px; }
.stop-editor input, .stop-editor select { min-width: 0; width: 100%; height: 29px; padding: 0 6px; background: #f7f8f5; border: 1px solid #d8ded8; border-radius: 4px; font: inherit; }
.stop-editor textarea { grid-column: span 2; min-height: 54px; padding: 8px; resize: vertical; border: 1px solid #d8ded8; border-radius: 5px; font: inherit; font-size: 11px; }
.remove-action { justify-self: start; padding: 0; color: #9d5549; background: transparent; border: 0; font: inherit; font-size: 10px; cursor: pointer; }
.segment-card { display: grid; grid-template-columns: 22px auto auto auto 1fr; align-items: center; gap: 7px; min-height: 44px; padding-left: 22px; color: #738078; font-size: 10px; }
.segment-line { width: 1px; height: 28px; margin-left: 8px; border-left: 2px dotted #9eb2a6; }
.segment-card select, .segment-card input { height: 25px; color: #536159; background: transparent; border: 1px solid #dbe0db; border-radius: 4px; font: inherit; }
.segment-card input { width: 40px; border-width: 0 0 1px; }
.segment-card small { justify-self: end; }
.segment-card small.ready { color: #1f6b52; }
.segment-card small.estimated { color: #a0702d; }
.intercity-card { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin: 4px 20px 18px; padding: 16px; color: #eef5f0; background: #29483a; border-radius: 9px; }
.intercity-card div { display: grid; gap: 4px; }
.intercity-card div span { color: #9fb6aa; font-size: 9px; text-transform: uppercase; }
.intercity-card div strong { font-size: 13px; }
.intercity-card select, .intercity-card label { color: #dce8e1; background: transparent; border: 0; font: inherit; font-size: 10px; }
.intercity-card label { display: flex; align-items: center; gap: 4px; }
.intercity-card input { width: 55px; color: white; background: rgba(255,255,255,.08); border: 0; border-radius: 3px; }
.wishlist { margin: 0 20px 24px; border-top: 1px solid #e1e5e0; }
.wishlist__heading { display: flex; width: 100%; justify-content: space-between; padding: 15px 0; color: #546158; background: none; border: 0; font: inherit; font-size: 11px; font-weight: 650; cursor: pointer; }
.wishlist__heading b { margin-left: 4px; color: #1f6b52; }
.wishlist__items p { margin: 0; color: #8a938d; font-size: 11px; }
.wishlist__items div { display: flex; justify-content: space-between; padding: 8px 0; font-size: 11px; border-top: 1px solid #eff1ed; }
.wishlist__items button { color: #1f6b52; background: none; border: 0; font: inherit; cursor: pointer; }
.map-workspace { position: relative; min-width: 0; overflow: hidden; }
.map-workspace > .route-map { height: 100%; }
.map-search { position: absolute; z-index: 7; top: 18px; left: 22px; display: grid; grid-template-columns: 30px minmax(180px, 440px) auto; align-items: center; width: min(620px, calc(100% - 180px)); height: 48px; padding: 0 7px 0 11px; background: rgba(253,253,250,.96); border: 1px solid rgba(38,55,46,.15); border-radius: 10px; box-shadow: 0 14px 35px rgba(38,55,46,.15); backdrop-filter: blur(12px); }
.map-search > span { color: #617067; font-size: 24px; transform: rotate(-15deg); }
.map-search input { min-width: 0; background: transparent; border: 0; outline: 0; font: inherit; font-size: 13px; }
.map-search button { height: 34px; padding: 0 14px; color: white; background: #1f6b52; border: 0; border-radius: 6px; font: inherit; font-size: 11px; font-weight: 650; cursor: pointer; }
.search-results { position: absolute; z-index: 8; top: 76px; left: 22px; width: min(620px, calc(100% - 180px)); max-height: min(470px, calc(100% - 110px)); overflow: auto; padding: 8px; background: rgba(253,253,250,.98); border: 1px solid rgba(38,55,46,.12); border-radius: 10px; box-shadow: 0 18px 45px rgba(38,55,46,.16); }
.results-heading { display: flex; justify-content: space-between; padding: 8px 10px 10px; color: #747f77; font-size: 10px; text-transform: uppercase; }
.results-heading button { color: #68736b; background: none; border: 0; cursor: pointer; }
.search-results article { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 9px; padding: 12px 10px; border-top: 1px solid #ecefea; }
.search-results h3 { margin: 0; font-size: 13px; }
.search-results p { margin: 5px 0 0; color: #8a938d; font-size: 10px; }
.wish-button { width: 31px; height: 31px; color: #7a6a3a; background: #f1eee3; border: 0; border-radius: 6px; font-size: 18px; cursor: pointer; }
.add-stop-button { height: 31px; padding: 0 11px; color: #fff; white-space: nowrap; background: #1f6b52; border: 0; border-radius: 6px; font: inherit; font-size: 10px; font-weight: 650; cursor: pointer; }
.route-progress { position: absolute; z-index: 6; right: 22px; bottom: 20px; padding: 10px 13px; color: #fff; background: #29483a; border-radius: 7px; font-size: 11px; box-shadow: 0 10px 25px rgba(38,55,46,.2); }
.detail-view { width: min(1080px, calc(100% - 48px)); margin: 0 auto; padding: 72px 0 100px; }
.detail-intro .eyebrow { margin: 0 0 9px; color: #7c867f; font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.detail-intro h1 { margin: 0; font-size: 52px; letter-spacing: -.05em; }
.detail-intro > p:last-child { max-width: 540px; color: #69746d; line-height: 1.6; }
.budget-totals { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 12px; margin: 42px 0; }
.budget-totals div { display: grid; min-height: 130px; align-content: space-between; padding: 22px; background: #edf1eb; border-radius: 10px; }
.budget-totals div:first-child { color: #fff; background: #29483a; }
.budget-totals span { color: inherit; opacity: .7; font-size: 11px; }
.budget-totals strong { font: 700 31px/1 monospace; letter-spacing: -.04em; }
.budget-breakdown { padding: 5px 0 28px; }
.budget-breakdown article { display: grid; grid-template-columns: 95px 1fr 100px; align-items: center; gap: 18px; padding: 14px 0; border-bottom: 1px solid #e0e4df; font-size: 13px; }
.budget-breakdown strong { text-align: right; font: 650 14px/1 monospace; }
.budget-bar { height: 5px; overflow: hidden; background: #e2e6e1; border-radius: 5px; }
.budget-bar i { display: block; height: 100%; background: #6b927f; border-radius: inherit; }
.accommodation-editor { margin-top: 44px; }
.section-title h2 { margin: 0; font-size: 26px; }
.section-title p { color: #778179; font-size: 12px; }
.accommodation-row { display: grid; grid-template-columns: 100px 1fr 180px; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #e0e4df; }
.accommodation-row input { width: 100%; height: 38px; padding: 0 10px; background: #fff; border: 1px solid #d9dfd9; border-radius: 5px; font: inherit; }
.accommodation-row label { display: flex; align-items: center; gap: 7px; color: #6f7972; font-size: 11px; }
.notes-view textarea { width: 100%; min-height: 430px; margin-top: 36px; padding: 28px; resize: vertical; color: #2d3932; background: #fff; border: 1px solid #dce1dc; border-radius: 10px; font: 15px/1.8 inherit; box-shadow: 0 15px 40px rgba(38,55,46,.06); }
.workspace-loading { display: grid; min-height: 100dvh; place-items: center; color: #68746c; background: #f5f6f2; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible { outline: 3px solid rgba(31,107,82,.22); outline-offset: 2px; }
@media (max-width: 900px) {
  .workspace-header { grid-template-columns: auto 1fr auto; gap: 10px; padding: 0 14px; }
  .trip-identity span, .save-state { display: none; }
  .workspace-tabs { grid-row: 2; grid-column: 1 / -1; height: 42px; justify-content: center; order: 3; }
  .workspace-header { min-height: 104px; }
  .workspace-summary { min-width: 0; }
  .planner-layout { grid-template-columns: 1fr; height: auto; }
  .timeline-panel { height: auto; max-height: none; border-right: 0; }
  .map-workspace { min-height: 58dvh; }
  .map-search, .search-results { width: calc(100% - 44px); }
  .planner-layout { min-height: calc(100dvh - 104px); }
}
@media (max-width: 560px) {
  .workspace-summary > span:first-child, .more-action { display: none; }
  .trip-title-input { width: 38vw; }
  .map-search { right: 12px; left: 12px; width: calc(100% - 24px); }
  .search-results { right: 12px; left: 12px; width: calc(100% - 24px); }
  .budget-totals { grid-template-columns: 1fr; }
  .accommodation-row { grid-template-columns: 1fr; }
  .detail-view { width: calc(100% - 30px); }
}
</style>
