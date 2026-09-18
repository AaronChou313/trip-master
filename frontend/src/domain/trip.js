export const SCHEMA_VERSION = 3;

export const STOP_TYPES = [
  { value: 'attraction', label: '景点', budget: 'attractions' },
  { value: 'hotel', label: '酒店', budget: 'accommodation' },
  { value: 'restaurant', label: '餐饮', budget: 'food' },
  { value: 'station', label: '车站', budget: 'transport' },
  { value: 'shopping', label: '购物', budget: 'other' },
  { value: 'custom', label: '其他', budget: 'other' }
];

export const LOCAL_MODES = [
  { value: 'walking', label: '步行' },
  { value: 'transit', label: '公交' },
  { value: 'driving', label: '驾车' },
  { value: 'cycling', label: '骑行' }
];

export const INTERCITY_MODES = [
  { value: 'high_speed_rail', label: '高铁' },
  { value: 'train', label: '火车' },
  { value: 'flight', label: '飞机' },
  { value: 'driving', label: '自驾' },
  { value: 'other', label: '其他' }
];

const CITY_CENTERS = {
  北京: { lng: 116.397428, lat: 39.90923 },
  上海: { lng: 121.4737, lat: 31.2304 },
  南京: { lng: 118.7969, lat: 32.0603 },
  苏州: { lng: 120.5853, lat: 31.2989 },
  杭州: { lng: 120.1551, lat: 30.2741 },
  成都: { lng: 104.0665, lat: 30.5723 },
  广州: { lng: 113.2644, lat: 23.1291 },
  深圳: { lng: 114.0579, lat: 22.5431 },
  西安: { lng: 108.9398, lat: 34.3416 },
  武汉: { lng: 114.3054, lat: 30.5931 },
  东京: { lng: 139.6917, lat: 35.6895 },
  大阪: { lng: 135.5023, lat: 34.6937 },
  京都: { lng: 135.7681, lat: 35.0116 },
  奈良: { lng: 135.8048, lat: 34.6851 }
};

export function uid(prefix = 'id') {
  if (globalThis.crypto?.randomUUID) return `${prefix}_${globalThis.crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function cityCenter(cityName) {
  return CITY_CENTERS[cityName] || { lng: 116.397428, lat: 39.90923 };
}

export function parseCities(input) {
  return [...new Set(String(input || '')
    .split(/[\s,，、→>]+/)
    .map((city) => city.trim())
    .filter(Boolean))];
}

function addDays(date, offset) {
  if (!date) return '';
  const result = new Date(`${date}T12:00:00`);
  result.setDate(result.getDate() + offset);
  return result.toISOString().slice(0, 10);
}

export function createDay(cityName, date = '', dayNumber = 1) {
  return {
    id: uid('day'),
    cityName,
    date,
    label: `Day ${dayNumber}`,
    stops: [],
    segments: [],
    notes: ''
  };
}

export function createCityStay(cityName, index, startDate = '') {
  const date = addDays(startDate, index);
  return {
    id: uid('city'),
    cityName,
    order: index,
    startDate: date,
    endDate: date,
    center: cityCenter(cityName),
    accommodation: null,
    days: [createDay(cityName, date, index + 1)],
    notes: ''
  };
}

export function createTrip({ name, cities, startDate = '', endDate = '' }) {
  const cityNames = Array.isArray(cities) ? cities : parseCities(cities);
  const now = new Date().toISOString();
  const cityStays = cityNames.map((city, index) => createCityStay(city, index, startDate));
  return normalizeTrip({
    id: uid('trip'),
    schemaVersion: SCHEMA_VERSION,
    name: name?.trim() || `${cityNames[0] || '新的'}旅行`,
    startDate,
    endDate: endDate || addDays(startDate, Math.max(cityNames.length - 1, 0)),
    createdAt: now,
    updatedAt: now,
    cityStays,
    intercitySegments: [],
    wishlist: [],
    expenses: [],
    notes: ''
  });
}

export function createStop(place, defaults = {}) {
  const location = normalizeLocation(place.location || place.position);
  return {
    id: uid('stop'),
    placeId: place.placeId || place.id || '',
    name: place.name || '未命名地点',
    address: place.address || '',
    location,
    type: defaults.type || inferStopType(place.type),
    arrivalTime: defaults.arrivalTime || '',
    durationMinutes: Number(defaults.durationMinutes ?? 90),
    locked: Boolean(defaults.locked),
    cost: normalizeCost(defaults.cost || place.cost),
    notes: defaults.notes || '',
    source: place.source || 'manual'
  };
}

export function normalizeLocation(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const [lng, lat] = value.split(',').map(Number);
    return Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null;
  }
  if (Array.isArray(value)) {
    const [lng, lat] = value.map(Number);
    return Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null;
  }
  const lng = Number(value.lng ?? value.longitude ?? value.getLng?.());
  const lat = Number(value.lat ?? value.latitude ?? value.getLat?.());
  return Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null;
}

export function normalizeCost(cost) {
  return {
    estimated: Number(cost?.estimated || 0),
    confirmed: Number(cost?.confirmed || 0),
    actual: Number(cost?.actual || 0),
    currency: cost?.currency || 'CNY'
  };
}

function inferStopType(type = '') {
  const text = String(type).toLowerCase();
  if (/餐|food|restaurant|咖啡/.test(text)) return 'restaurant';
  if (/酒店|住宿|hotel/.test(text)) return 'hotel';
  if (/站|机场|railway|airport/.test(text)) return 'station';
  if (/商场|购物|shop/.test(text)) return 'shopping';
  return 'attraction';
}

export function createSegment(from, to, options = {}) {
  const scope = options.scope || 'local';
  return {
    id: options.id || uid('segment'),
    scope,
    fromId: from.id,
    toId: to.id,
    fromName: from.name || from.cityName,
    toName: to.name || to.cityName,
    mode: options.mode || (scope === 'local' ? 'walking' : 'high_speed_rail'),
    durationMinutes: Number(options.durationMinutes || 0),
    distanceMeters: Number(options.distanceMeters || 0),
    cost: normalizeCost(options.cost),
    departureTime: options.departureTime || '',
    arrivalTime: options.arrivalTime || '',
    fromStation: options.fromStation || '',
    toStation: options.toStation || '',
    notes: options.notes || '',
    route: options.route || { provider: 'pending', status: 'pending', path: [] }
  };
}

export function rebuildDaySegments(day) {
  const previous = new Map((day.segments || []).map((segment) => [
    `${segment.fromId}:${segment.toId}`,
    segment
  ]));
  day.segments = day.stops.slice(0, -1).map((stop, index) => {
    const next = day.stops[index + 1];
    const existing = previous.get(`${stop.id}:${next.id}`);
    return createSegment(stop, next, existing || {});
  });
  return day.segments;
}

export function rebuildIntercitySegments(trip) {
  const previous = new Map((trip.intercitySegments || []).map((segment) => [
    `${segment.fromId}:${segment.toId}`,
    segment
  ]));
  trip.intercitySegments = trip.cityStays.slice(0, -1).map((stay, index) => {
    const next = trip.cityStays[index + 1];
    const existing = previous.get(`${stay.id}:${next.id}`);
    return createSegment(
      { id: stay.id, cityName: stay.cityName },
      { id: next.id, cityName: next.cityName },
      { ...existing, scope: 'intercity' }
    );
  });
  return trip.intercitySegments;
}

export function normalizeTrip(raw) {
  const trip = {
    ...raw,
    id: raw.id || uid('trip'),
    schemaVersion: SCHEMA_VERSION,
    name: raw.name || '未命名旅行',
    startDate: raw.startDate || '',
    endDate: raw.endDate || '',
    wishlist: (raw.wishlist || []).map((item) => ({ ...createStop(item), ...item })),
    expenses: raw.expenses || [],
    notes: raw.notes || '',
    cityStays: (raw.cityStays || []).map((stay, stayIndex) => ({
      ...stay,
      id: stay.id || uid('city'),
      order: stayIndex,
      center: normalizeLocation(stay.center) || cityCenter(stay.cityName),
      accommodation: stay.accommodation ? {
        ...stay.accommodation,
        cost: normalizeCost(stay.accommodation.cost)
      } : null,
      days: (stay.days || []).map((day, dayIndex) => {
        const normalizedDay = {
          ...day,
          id: day.id || uid('day'),
          label: day.label || `Day ${dayIndex + 1}`,
          stops: (day.stops || []).map((stop) => ({
            ...createStop(stop),
            ...stop,
            location: normalizeLocation(stop.location),
            cost: normalizeCost(stop.cost)
          })),
          segments: (day.segments || []).map((segment) => ({
            ...segment,
            cost: normalizeCost(segment.cost),
            route: segment.route || { provider: 'pending', status: 'pending', path: [] }
          }))
        };
        rebuildDaySegments(normalizedDay);
        return normalizedDay;
      })
    }))
  };
  rebuildIntercitySegments(trip);
  return trip;
}

function addCost(target, category, cost) {
  ['estimated', 'confirmed', 'actual'].forEach((state) => {
    target[category][state] += Number(cost?.[state] || 0);
    target.total[state] += Number(cost?.[state] || 0);
  });
}

export function calculateBudget(trip) {
  const empty = () => ({ estimated: 0, confirmed: 0, actual: 0 });
  const result = {
    transport: empty(),
    accommodation: empty(),
    attractions: empty(),
    food: empty(),
    other: empty(),
    total: empty()
  };

  (trip.intercitySegments || []).forEach((segment) => addCost(result, 'transport', segment.cost));
  (trip.cityStays || []).forEach((stay) => {
    if (stay.accommodation?.cost) addCost(result, 'accommodation', stay.accommodation.cost);
    (stay.days || []).forEach((day) => {
      (day.segments || []).forEach((segment) => addCost(result, 'transport', segment.cost));
      (day.stops || []).forEach((stop) => {
        const category = STOP_TYPES.find((item) => item.value === stop.type)?.budget || 'other';
        addCost(result, category, stop.cost);
      });
    });
  });
  (trip.expenses || []).forEach((expense) => addCost(result, expense.category || 'other', normalizeCost(expense.cost)));
  return result;
}

export function createExampleTrip() {
  const trip = createTrip({
    name: '国庆华东旅行',
    cities: ['南京', '苏州', '上海'],
    startDate: '2026-10-01',
    endDate: '2026-10-05'
  });
  const day = trip.cityStays[0].days[0];
  day.stops = [
    createStop({ name: '中山陵', address: '玄武区石象路7号', location: '118.8486,32.0575', type: '景点', source: 'example' }, { arrivalTime: '09:00', durationMinutes: 150, cost: { estimated: 0 } }),
    createStop({ name: '南京博物院', address: '玄武区中山东路321号', location: '118.8221,32.0409', type: '景点', source: 'example' }, { arrivalTime: '13:30', durationMinutes: 150, cost: { estimated: 0 } }),
    createStop({ name: '老门东', address: '秦淮区箍桶巷', location: '118.7925,32.0127', type: '餐饮', source: 'example' }, { arrivalTime: '18:00', durationMinutes: 120, cost: { estimated: 120 } })
  ];
  rebuildDaySegments(day);
  day.segments[0].mode = 'transit';
  day.segments[0].durationMinutes = 28;
  day.segments[0].cost.estimated = 3;
  day.segments[1].mode = 'transit';
  day.segments[1].durationMinutes = 31;
  day.segments[1].cost.estimated = 3;
  trip.intercitySegments[0].durationMinutes = 65;
  trip.intercitySegments[0].cost.estimated = 105;
  trip.intercitySegments[1].durationMinutes = 30;
  trip.intercitySegments[1].cost.estimated = 45;
  return trip;
}
