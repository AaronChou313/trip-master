<template>
  <main class="trips-page" id="main-content">
    <header class="trips-hero">
      <div>
        <p class="eyebrow">本地旅行工作台</p>
        <h1>我的旅行</h1>
        <p class="hero-copy">从城市开始，在同一张地图上安排每天的地点、交通与预算。</p>
      </div>
      <button class="button button--primary" @click="showCreate = true">＋ 新建旅行</button>
    </header>

    <section v-if="showCreate" class="create-panel" aria-labelledby="create-trip-title">
      <div class="create-panel__intro">
        <span class="step-number">01</span>
        <div>
          <h2 id="create-trip-title">开始一次旅行</h2>
          <p>只填必要信息，日期以后也能补。</p>
        </div>
      </div>
      <form class="create-form" @submit.prevent="submitTrip">
        <label>
          <span>旅行名称</span>
          <input v-model.trim="draft.name" autofocus placeholder="例如：国庆华东旅行" required>
        </label>
        <label class="create-form__cities">
          <span>想去哪些城市</span>
          <input v-model="draft.cities" placeholder="北京 南京 苏州 上海" required>
          <small>空格、逗号或箭头分隔</small>
        </label>
        <label>
          <span>开始日期 <em>可选</em></span>
          <input v-model="draft.startDate" type="date">
        </label>
        <div class="form-actions">
          <button type="button" class="button button--quiet" @click="showCreate = false">取消</button>
          <button class="button button--primary" :disabled="!canCreate">开始规划</button>
        </div>
      </form>
    </section>

    <section class="trip-library" aria-labelledby="recent-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ trips.length }} 份本地数据</p>
          <h2 id="recent-title">最近旅行</h2>
        </div>
        <div class="library-actions">
          <label class="text-action">
            导入旅行
            <input type="file" accept=".json,.tripmaster,application/json" @change="importTrip">
          </label>
          <button class="text-action" @click="openExample">打开示例旅行</button>
        </div>
      </div>

      <div v-if="loading" class="loading-row">正在读取本地旅行…</div>
      <div v-else-if="!trips.length" class="empty-library">
        <div class="empty-library__map" aria-hidden="true"><span></span><span></span><span></span></div>
        <h3>从一条城市路线开始</h3>
        <p>建立旅行后，你会直接进入地图工作台，不需要先创建地点或预算。</p>
        <button class="button button--primary" @click="showCreate = true">规划第一次旅行</button>
      </div>
      <div v-else class="trip-grid">
        <article v-for="trip in trips" :key="trip.id" class="trip-card" @click="openTrip(trip.id)">
          <div class="trip-card__topline">
            <span>{{ formatRange(trip) }}</span>
            <button class="icon-action" title="删除旅行" @click.stop="askDelete(trip)">···</button>
          </div>
          <h3>{{ trip.name }}</h3>
          <p class="city-route">{{ trip.cityStays.map(stay => stay.cityName).join(' → ') || '还没有城市' }}</p>
          <div class="trip-card__footer">
            <span>{{ countDays(trip) }} 天 · {{ countStops(trip) }} 个地点</span>
            <strong>¥{{ budgetTotal(trip).toLocaleString('zh-CN') }}</strong>
          </div>
          <div v-if="pendingDelete === trip.id" class="delete-confirm" @click.stop>
            <span>删除后无法恢复</span>
            <button @click="deleteTrip(trip.id)">确认删除</button>
            <button @click="pendingDelete = ''">取消</button>
          </div>
        </article>
      </div>
      <p v-if="message" class="inline-message" role="status">{{ message }}</p>
    </section>
  </main>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { calculateBudget, createExampleTrip, createTrip, parseCities } from '../domain/trip';
import tripRepository from '../services/tripRepository';

export default {
  name: 'TripsView',
  setup() {
    const router = useRouter();
    const trips = ref([]);
    const loading = ref(true);
    const showCreate = ref(false);
    const message = ref('');
    const pendingDelete = ref('');
    const draft = reactive({ name: '', cities: '', startDate: '' });
    const canCreate = computed(() => draft.name && parseCities(draft.cities).length);

    async function loadTrips() {
      loading.value = true;
      trips.value = await tripRepository.list();
      loading.value = false;
    }

    async function submitTrip() {
      if (!canCreate.value) return;
      const trip = await tripRepository.save(createTrip(draft));
      router.push(`/trips/${trip.id}`);
    }

    async function openExample() {
      const trip = await tripRepository.save(createExampleTrip());
      router.push(`/trips/${trip.id}`);
    }

    async function importTrip(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const trip = await tripRepository.importTrip(JSON.parse(await file.text()));
        router.push(`/trips/${trip.id}`);
      } catch (error) {
        message.value = error.message;
      } finally {
        event.target.value = '';
      }
    }

    function openTrip(id) { router.push(`/trips/${id}`); }
    function askDelete(trip) { pendingDelete.value = trip.id; }
    async function deleteTrip(id) {
      await tripRepository.delete(id);
      pendingDelete.value = '';
      await loadTrips();
    }
    function formatRange(trip) {
      if (!trip.startDate) return '日期待定';
      const format = (date) => date.replace(/^\d{4}-/, '').replace('-', '.');
      return trip.endDate ? `${format(trip.startDate)} — ${format(trip.endDate)}` : format(trip.startDate);
    }
    function countDays(trip) { return trip.cityStays.reduce((sum, stay) => sum + stay.days.length, 0); }
    function countStops(trip) { return trip.cityStays.reduce((sum, stay) => sum + stay.days.reduce((subtotal, day) => subtotal + day.stops.length, 0), 0); }
    function budgetTotal(trip) { return calculateBudget(trip).total.estimated; }

    onMounted(loadTrips);
    return { trips, loading, showCreate, message, pendingDelete, draft, canCreate, submitTrip, openExample, importTrip, openTrip, askDelete, deleteTrip, formatRange, countDays, countStops, budgetTotal };
  }
};
</script>

<style scoped>
.trips-page { width: min(1180px, calc(100% - 48px)); margin: 0 auto; padding: 88px 0 96px; }
.trips-hero { display: flex; align-items: end; justify-content: space-between; gap: 32px; padding-bottom: 52px; }
.eyebrow { margin: 0 0 10px; color: #798079; font-size: 12px; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 0; color: #1c2822; font-size: clamp(48px, 7vw, 82px); line-height: .98; letter-spacing: -.055em; }
.hero-copy { max-width: 520px; margin: 22px 0 0; color: #657068; font-size: 17px; line-height: 1.65; text-wrap: pretty; }
.button { min-height: 44px; padding: 0 18px; border: 0; border-radius: 8px; font: inherit; font-weight: 650; cursor: pointer; transition: transform .18s ease, background .18s ease; }
.button:hover { transform: translateY(-1px); }
.button:active { transform: translateY(1px); }
.button:focus-visible, input:focus-visible, .text-action:focus-visible { outline: 3px solid rgba(31,107,82,.22); outline-offset: 2px; }
.button--primary { color: #f7faf7; background: #1f6b52; box-shadow: 0 9px 20px rgba(31,107,82,.18); }
.button--primary:hover { background: #185a45; }
.button--quiet { color: #4d5951; background: #e9ece7; }
.button:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.create-panel { display: grid; grid-template-columns: .7fr 1.3fr; gap: 56px; margin: 0 0 72px; padding: 36px; color: #f3f6f1; background: #243d32; border-radius: 16px; box-shadow: 0 22px 55px rgba(27,52,41,.18); }
.create-panel__intro { display: flex; gap: 16px; align-items: start; }
.create-panel h2 { margin: 0; font-size: 28px; letter-spacing: -.03em; }
.create-panel p { margin: 8px 0 0; color: #b8c7be; line-height: 1.55; }
.step-number { display: grid; width: 34px; height: 34px; place-items: center; color: #243d32; background: #d8b66a; border-radius: 50%; font: 700 11px/1 monospace; }
.create-form { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; }
.create-form label { display: flex; flex-direction: column; gap: 8px; font-size: 13px; font-weight: 600; }
.create-form label > span { color: #dce6df; }
.create-form em { color: #91a198; font-style: normal; font-weight: 400; }
.create-form input { height: 43px; padding: 0 12px; color: #f5f7f4; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); border-radius: 7px; font: inherit; }
.create-form input::placeholder { color: #84968c; }
.create-form small { color: #8fa097; font-weight: 400; }
.create-form__cities { grid-column: span 2; }
.form-actions { grid-column: span 2; display: flex; justify-content: flex-end; gap: 10px; }
.section-heading { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 24px; }
.section-heading h2 { margin: 0; color: #243028; font-size: 27px; letter-spacing: -.035em; }
.library-actions { display: flex; gap: 22px; }
.text-action { padding: 0; color: #526159; background: none; border: 0; font: inherit; font-size: 13px; font-weight: 650; cursor: pointer; text-decoration: underline; text-decoration-color: #b7bfb9; text-underline-offset: 5px; }
.text-action input { display: none; }
.trip-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.trip-card { position: relative; min-height: 220px; padding: 24px; overflow: hidden; color: #253129; background: #f5f6f2; border: 1px solid #e1e4de; border-radius: 13px; cursor: pointer; transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease; }
.trip-card:hover { transform: translateY(-3px); border-color: #bec9c0; box-shadow: 0 18px 42px rgba(43,62,52,.10); }
.trip-card__topline, .trip-card__footer { display: flex; align-items: center; justify-content: space-between; color: #758078; font-size: 12px; font-variant-numeric: tabular-nums; }
.icon-action { color: #68736b; background: transparent; border: 0; font-size: 20px; cursor: pointer; }
.trip-card h3 { max-width: 80%; margin: 35px 0 10px; font-size: 28px; letter-spacing: -.04em; }
.city-route { margin: 0; color: #56635b; line-height: 1.6; }
.trip-card__footer { position: absolute; right: 24px; bottom: 22px; left: 24px; }
.trip-card__footer strong { color: #1f6b52; font: 700 18px/1 monospace; }
.delete-confirm { position: absolute; inset: auto 12px 12px 12px; display: flex; align-items: center; gap: 10px; padding: 12px; color: #fff; background: #773e36; border-radius: 8px; font-size: 12px; }
.delete-confirm span { margin-right: auto; }
.delete-confirm button { color: white; background: transparent; border: 0; font: inherit; font-weight: 650; cursor: pointer; }
.empty-library { display: grid; min-height: 360px; place-items: center; align-content: center; padding: 40px; text-align: center; background: #f1f3ee; border: 1px dashed #c9cfc8; border-radius: 14px; }
.empty-library__map { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.empty-library__map span { display: block; width: 15px; height: 15px; background: #1f6b52; border: 4px solid #dfe9e3; border-radius: 50%; }
.empty-library__map span + span::before { content: ''; display: block; width: 22px; height: 1px; margin-left: -33px; background: #8ba296; }
.empty-library h3 { margin: 0 0 8px; font-size: 24px; }
.empty-library p { max-width: 450px; margin: 0 0 24px; color: #69746d; line-height: 1.6; }
.inline-message, .loading-row { padding: 18px 0; color: #6b4b2e; }
@media (max-width: 760px) {
  .trips-page { width: min(100% - 30px, 1180px); padding-top: 52px; }
  .trips-hero, .section-heading { align-items: start; flex-direction: column; }
  .create-panel { grid-template-columns: 1fr; padding: 24px; gap: 30px; }
  .create-form { grid-template-columns: 1fr; }
  .create-form__cities, .form-actions { grid-column: span 1; }
  .trip-grid { grid-template-columns: 1fr; }
}
</style>
