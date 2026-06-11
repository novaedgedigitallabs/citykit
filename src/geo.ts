/**
 * Bounding box utilities for geographic queries.
 */

export interface BoundingBox {
  /** Northern latitude boundary */
  north: number;
  /** Southern latitude boundary */
  south: number;
  /** Eastern longitude boundary */
  east: number;
  /** Western longitude boundary */
  west: number;
}

/**
 * Calculate a bounding box around a center point for a given radius.
 * Useful for fast pre-filtering before precise Haversine checks.
 *
 * @param lat - Center latitude in decimal degrees
 * @param lng - Center longitude in decimal degrees
 * @param radiusKm - Radius in kilometers
 * @returns BoundingBox with north/south/east/west boundaries
 */
export function getBoundingBox(lat: number, lng: number, radiusKm: number): BoundingBox {
  const R = 6371; // Earth's radius in km

  // Latitude degrees per km (constant everywhere)
  const latDelta = (radiusKm / R) * (180 / Math.PI);

  // Longitude degrees per km (varies with latitude)
  const lngDelta = (radiusKm / R) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);

  return {
    north: Math.min(90, lat + latDelta),
    south: Math.max(-90, lat - latDelta),
    east: lng + lngDelta,   // Note: may exceed 180 near antimeridian
    west: lng - lngDelta,   // Note: may be below -180 near antimeridian
  };
}
