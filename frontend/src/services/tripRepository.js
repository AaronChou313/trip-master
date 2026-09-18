import { normalizeTrip, SCHEMA_VERSION } from '../domain/trip';

const DB_NAME = 'tripmaster-local';
const STORE_NAME = 'trips';
const DB_VERSION = 1;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

class TripRepository {
  constructor() {
    this.dbPromise = null;
    this.memory = new Map();
  }

  async open() {
    if (!('indexedDB' in globalThis)) return null;
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  }

  async run(mode, callback) {
    const db = await this.open();
    if (!db) return callback(null);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      let result;
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      result = callback(store);
      if (result?.onsuccess !== undefined) {
        result.onsuccess = () => { result = result.result; };
      }
    });
  }

  async list() {
    const db = await this.open();
    if (!db) return [...this.memory.values()].map(clone);
    const trips = await this.run('readonly', (store) => store.getAll());
    return (trips || []).map(normalizeTrip).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  async get(id) {
    const db = await this.open();
    const value = db
      ? await this.run('readonly', (store) => store.get(id))
      : this.memory.get(id);
    return value ? normalizeTrip(clone(value)) : null;
  }

  async save(trip) {
    const normalized = normalizeTrip({ ...clone(trip), updatedAt: new Date().toISOString() });
    const db = await this.open();
    if (db) await this.run('readwrite', (store) => store.put(normalized));
    else this.memory.set(normalized.id, clone(normalized));
    return clone(normalized);
  }

  async delete(id) {
    const db = await this.open();
    if (db) await this.run('readwrite', (store) => store.delete(id));
    else this.memory.delete(id);
  }

  exportTrip(trip) {
    return {
      format: 'tripmaster-trip',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      trip: normalizeTrip(clone(trip))
    };
  }

  async importTrip(payload) {
    const raw = payload?.format === 'tripmaster-trip' ? payload.trip : payload?.trip || payload;
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.cityStays)) {
      throw new Error('这不是有效的 TripMaster 旅行文件');
    }
    const trip = normalizeTrip(raw);
    return this.save({ ...trip, updatedAt: new Date().toISOString() });
  }
}

export default new TripRepository();
