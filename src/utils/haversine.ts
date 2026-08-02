// DisasterGuard JP - Haversine Offline Shortest Distance & Bearing Algorithm
import { JapanShelter } from '../types/disaster';

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates shortest distance between two coordinates in meters using Haversine Formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(rLat1) * Math.cos(rLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Calculates initial compass bearing angle (0 to 360 degrees) from point 1 to point 2.
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);
  const dLng = toRadians(lng2 - lng1);

  const y = Math.sin(dLng) * Math.cos(rLat2);
  const x =
    Math.cos(rLat1) * Math.sin(rLat2) -
    Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLng);

  let bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function getBearingDirectionKo(bearingDegrees: number): string {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  const index = Math.round(bearingDegrees / 45) % 8;
  return directions[index];
}

/**
 * Returns list of shelters enriched with exact distance (meters) and bearing angle/direction,
 * sorted by nearest distance.
 */
export function getSortedSheltersByDistance(
  userLat: number,
  userLng: number,
  shelters: JapanShelter[]
): JapanShelter[] {
  return shelters
    .map((shelter) => {
      const dist = calculateHaversineDistance(userLat, userLng, shelter.lat, shelter.lng);
      const bearing = calculateBearing(userLat, userLng, shelter.lat, shelter.lng);
      const dirKo = getBearingDirectionKo(bearing);

      return {
        ...shelter,
        distanceMeters: dist,
        bearingDegrees: Math.round(bearing),
        bearingDirectionKo: dirKo
      };
    })
    .sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
}

export function formatDistanceString(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
