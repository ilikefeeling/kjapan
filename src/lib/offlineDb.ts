// DisasterGuard JP - IndexedDB Offline Storage Manager
import { JapanShelter } from '../types/disaster';
import { JAPAN_OFFLINE_SHELTERS } from '../data/japanShelters';

const DB_NAME = 'DisasterGuard_OfflineDB';
const DB_VERSION = 1;
const STORE_SHELTERS = 'shelters';
const STORE_METADATA = 'metadata';

class OfflineDbManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_SHELTERS)) {
          const shelterStore = db.createObjectStore(STORE_SHELTERS, { keyPath: 'id' });
          shelterStore.createIndex('prefectureCode', 'prefectureCode', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_METADATA)) {
          db.createObjectStore(STORE_METADATA, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('[IndexedDB] Failed to open database:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async seedDatabaseIfEmpty(): Promise<number> {
    try {
      const shelters = await this.getAllShelters();
      if (shelters.length === 0) {
        console.log('[IndexedDB] Seeding offline shelter GeoJSON dataset...');
        await this.saveShelters(JAPAN_OFFLINE_SHELTERS);
        await this.setMetadata('lastSyncedAt', new Date().toISOString());
        return JAPAN_OFFLINE_SHELTERS.length;
      }
      return shelters.length;
    } catch (err) {
      console.warn('[IndexedDB] Seeding fallback to in-memory dataset:', err);
      return JAPAN_OFFLINE_SHELTERS.length;
    }
  }

  public async getAllShelters(): Promise<JapanShelter[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_SHELTERS, 'readonly');
        const store = tx.objectStore(STORE_SHELTERS);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result as JapanShelter[];
          if (!results || results.length === 0) {
            resolve(JAPAN_OFFLINE_SHELTERS);
          } else {
            resolve(results);
          }
        };

        request.onerror = () => resolve(JAPAN_OFFLINE_SHELTERS);
      });
    } catch {
      return JAPAN_OFFLINE_SHELTERS;
    }
  }

  public async saveShelters(shelters: JapanShelter[]): Promise<void> {
    try {
      const db = await this.getDb();
      const tx = db.transaction(STORE_SHELTERS, 'readwrite');
      const store = tx.objectStore(STORE_SHELTERS);

      for (const shelter of shelters) {
        store.put(shelter);
      }

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.error('[IndexedDB] Error saving shelters:', e);
    }
  }

  public async setMetadata(key: string, value: any): Promise<void> {
    try {
      const db = await this.getDb();
      const tx = db.transaction(STORE_METADATA, 'readwrite');
      const store = tx.objectStore(STORE_METADATA);
      store.put({ key, value });
    } catch (e) {
      console.error('[IndexedDB] Error setting metadata:', e);
    }
  }

  public async getMetadata(key: string): Promise<any> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_METADATA, 'readonly');
        const store = tx.objectStore(STORE_METADATA);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }
}

export const offlineDb = new OfflineDbManager();
