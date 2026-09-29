export const GEORGIAN_CITIES = [
  'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'თელავი', 'ფოთი',
  'სოხუმი', 'სამტრედია', 'მარნეული', 'ახალციხე', 'ახალქალაქი', 'სენაკი', 'ბოლნისი',
  'ქარელი', 'ჭიათურა', 'ცაგერი', 'ოზურგეთი', 'ყვარლი',
] as const;

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  თბილისი: { lat: 41.7151, lng: 44.8271 }, ბათუმი: { lat: 41.6168, lng: 41.6367 }, ქუთაისი: { lat: 42.2679, lng: 42.7189 }, რუსთავი: { lat: 41.5495, lng: 44.9932 }, გორი: { lat: 41.9842, lng: 44.1153 }, ზუგდიდი: { lat: 42.5088, lng: 41.8709 }, თელავი: { lat: 41.9026, lng: 45.4731 }, ფოთი: { lat: 42.5154, lng: 41.6903 }, სოხუმი: { lat: 43, lng: 41 }, სამტრედია: { lat: 42.1556, lng: 42.1911 }, მარნეული: { lat: 41.4744, lng: 44.8103 }, ახალციხე: { lat: 41.6418, lng: 42.9983 }, ახალქალაქი: { lat: 41.4078, lng: 43.4819 }, სენაკი: { lat: 42.2672, lng: 42.0733 }, ბოლნისი: { lat: 41.4506, lng: 44.5333 }, ქარელი: { lat: 42.1869, lng: 43.9989 }, ჭიათურა: { lat: 42.2933, lng: 43.4464 }, ცაგერი: { lat: 42.5669, lng: 42.6608 }, ოზურგეთი: { lat: 42.2028, lng: 42.0275 }, ყვარელი: { lat: 41.5222, lng: 45.8306 }, ყვარლი: { lat: 41.5222, lng: 45.8306 },
};

export function getNearestCity(lat: number, lng: number) {
  return GEORGIAN_CITIES.reduce<string | null>((nearest, city) => {
    const point = CITY_COORDINATES[city]; if (!point) return nearest;
    if (!nearest) return city;
    const current = CITY_COORDINATES[nearest];
    return Math.hypot(point.lat - lat, point.lng - lng) < Math.hypot(current.lat - lat, current.lng - lng) ? city : nearest;
  }, null);
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const earth = 6371; const dLat = (b.lat - a.lat) * Math.PI / 180; const dLng = (b.lng - a.lng) * Math.PI / 180;
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}
