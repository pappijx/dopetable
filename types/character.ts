export interface Character {
  id: string;
  name: string;
  location: Location;
  health: HealthStatus;
  power: number; // 100-10000
}

export type Location = 'Konoha' | 'Suna' | 'Kiri' | 'Iwa' | 'Kumo';

export type HealthStatus = 'Healthy' | 'Injured' | 'Critical';

export const LOCATIONS: Location[] = ['Konoha', 'Suna', 'Kiri', 'Iwa', 'Kumo'];

export const HEALTH_STATUSES: HealthStatus[] = [
  'Healthy',
  'Injured',
  'Critical',
];
