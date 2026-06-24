import { Injectable } from '@nestjs/common';

@Injectable()
export class MapService {
  private readonly EARTH_RADIUS_KM = 6371;

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_KM * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  }
}
