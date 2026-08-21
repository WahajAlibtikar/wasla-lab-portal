export type SettingsSection =
  | 'profile'
  | 'hours'
  | 'services'
  | 'team'
  | 'notifications';

export interface LabService {
  id: string;
  name: string;
  price: string;
  turnaround: string;
  active: boolean;
}

export interface LabSettings {
  labName: string;
  licenseNumber: string;
  city: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: Array<{ day: string; enabled: boolean; from: string; to: string }>;
  services: LabService[];
  notifications: {
    newOrders: boolean;
    urgentCases: boolean;
    payments: boolean;
    deliveries: boolean;
  };
}
