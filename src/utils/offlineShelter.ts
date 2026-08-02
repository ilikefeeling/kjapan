import { ShelterGeoJSON } from '../types/jma';
import { JAPAN_SHELTERS_DATA } from '../data/shelters';

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}

export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  brng = (brng + 360) % 360;

  const compasses = ["북 (N)", "북동 (NE)", "동 (E)", "남동 (SE)", "남 (S)", "남서 (SW)", "서 (W)", "북서 (NW)"];
  const index = Math.round(brng / 45) % 8;
  return compasses[index];
}

export function findNearestSheltersOffline(
  userLat: number,
  userLng: number,
  shelters: ShelterGeoJSON[] = JAPAN_SHELTERS_DATA,
  limit = 4
): ShelterGeoJSON[] {
  return shelters
    .map(shelter => {
      const dist = calculateHaversineDistance(userLat, userLng, shelter.lat, shelter.lng);
      const bearing = calculateBearing(userLat, userLng, shelter.lat, shelter.lng);
      return {
        ...shelter,
        distanceKm: Math.round(dist * 100) / 100,
        bearing
      };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    .slice(0, limit);
}

// IndexedDB Helper for offline shelter storage
const DB_NAME = "DisasterGuard_JP_DB";
const STORE_NAME = "shelters_geojson";

export async function initOfflineIndexedDB(): Promise<ShelterGeoJSON[]> {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      console.warn("IndexedDB not supported, falling back to in-memory dataset");
      resolve(JAPAN_SHELTERS_DATA);
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Seed if empty
      const countReq = store.count();
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          JAPAN_SHELTERS_DATA.forEach(s => store.add(s));
        }
      };

      const getAllReq = store.getAll();
      getAllReq.onsuccess = () => {
        const result = getAllReq.result && getAllReq.result.length > 0 ? getAllReq.result : JAPAN_SHELTERS_DATA;
        resolve(result);
      };

      getAllReq.onerror = () => {
        resolve(JAPAN_SHELTERS_DATA);
      };
    };

    request.onerror = () => {
      console.warn("IndexedDB access error, using fallback dataset");
      resolve(JAPAN_SHELTERS_DATA);
    };
  });
}
