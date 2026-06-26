export type DatabaseStatus = 'ok' | 'error';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  service: string;
  database: DatabaseStatus;
  timestamp: string;
}
