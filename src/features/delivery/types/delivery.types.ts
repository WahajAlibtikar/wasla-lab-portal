export type DeliveryStatus = 'scheduled' | 'en_route' | 'completed' | 'delayed';
export type DeliveryKind = 'pickup' | 'delivery';

export interface DeliveryTask {
  id: string;
  caseId: string;
  kind: DeliveryKind;
  clinic: string;
  doctor: string;
  district: string;
  address: string;
  phone: string;
  work: string;
  window: string;
  courier: string;
  courierPhone: string;
  status: DeliveryStatus;
  instructions: string;
  timeline: Array<{ label: string; time: string; done: boolean }>;
}
